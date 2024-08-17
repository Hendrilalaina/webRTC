import * as wss from './wss.js'
import * as constants from './constants.js'
import * as ui from './ui.js'
import * as store from './store.js'

let connectedUserDetails
let peerConnection

const defaultConstraints = {
  audio: true,
  video: true
}

const configuration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:13902',
    }
  ]
}

export const getLocalPreview = () => {
  navigator.mediaDevices
    .getUserMedia(defaultConstraints)
    .then((stream) => {
      ui.updateLocalVideo(stream)
      store.setLocalStream(stream)
    })
    .catch((err) => {
      console.log('error occured when trying to access camera')
      console.log(err)
    })
}

const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection(configuration)

  peerConnection.onicecandidate = (event) => {
    console.log('getting ice candicates from stun server')
    if (event.candidate) {
      // send our ice candidate
      wss.sendDataUsingWebRTCSignaling({
        connectedUserSocketId: connectedUserDetails.socketId,
        type: constants.webRTCSignaling.ICE_CANDIDATE,
        candidate: event.candidate
      })
    }

    peerConnection.onconnectionstatechange = (event) => {
      if (peerConnection.connectionState === 'connected') {
        console.log('successfull connected with other peer')
      }
    }

    // receiving tracks
    const remoteStream = new MediaStream()
    store.setRemoteStream(remoteStream)
    ui.updateRemoteVideo(remoteStream)

    peerConnection.ontrack = (event) => {
      remoteStream.addTrack(event.track)
    }

    // add out stream to peer connection
    if (connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE) {
      const localStream = store.getState().localStream

      for (const track of localStream) {
        peerConnection.addTrack(track, localStream)
      }
    }
  }
}

export const sendPreOffer = (callType, calleePersonalCode) => {
  connectedUserDetails = {
    callType,
    socketId: calleePersonalCode
  }
  
  if(callType === constants.callType.CHAT_PERSONAL_CODE || 
    callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    const data = {
      callType,
      calleePersonalCode
    }
    ui.showCallingDialog(callingDialogRejectCallHandler)
    wss.sendPreOffer(data)
  }

}

export const handlePreOffer = (data) => {
  const { callType, callerSocketId } = data

  connectedUserDetails = {
    socketId: callerSocketId,
    callType
  }

  if (
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler)
  }
}

const acceptCallHandler = () => {
  console.log("Call accepted")
  createPeerConnection()
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED)
  ui.showCallElements(connectedUserDetails.callType)
}

const rejectCallHandler = () => {
  console.log("Call rejected")
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED)
}

const callingDialogRejectCallHandler = () => {
  console.log('Rejecting call')
}

const sendPreOfferAnswer = (preOfferAnswer) => {
  const data = {
    callerSocketId: connectedUserDetails.socketId,
    preOfferAnswer
  }

  ui.removeAllDialogs()
  wss.sendPreOfferAnswer(data)
}

export const handlePreOfferAnswer = (data) => {
  const { preOfferAnswer } = data
  ui.removeAllDialogs()

  if (preOfferAnswer === constants.preOfferAnswer.CALL_ACCEPTED) {
    ui.showCallElements(connectedUserDetails.callType)
    createPeerConnection()
    sendWebRTCOffer()
  } else {
    ui.showInfoDialog(preOfferAnswer)
  }
}

const sendWebRTCOffer = async () => {
  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
  wss.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constants.webRTCSignaling.OFFER,
    offer: offer
  })
}

export const handleWebRTCOffer = async (data) => {
  await peerConnection.setRemoteDescription(data.offer)
  const answer = await peerConnection.createAnswer()
  await peerConnection.setLocalDescription(answer)
  wss.sendDataUsingWebRTCSignaling({
    connectedUserDetails: connectedUserDetails.socketId,
    type: constants.webRTCSignaling.ANSWER,
    answer: answer
  })
}

export const handleWebRTCAnswer = async (data) => {
  console.log('handling webRTC answer')
  await peerConnection.setRemoteDescription(data.answer)
}

export const handleWebRTCCandidate = async (data) => {
  console.log('handling incoming webRTC candidates')
  try {
    await peerConnection.addIceCandidate(data.candidate)
  } catch (error) {
    console.error('error occured when trying ice candidate', error)
  }
}

let screenSharingStream

export const switchScreenSharing = async (setScreenSharingActive) => {
  if (setScreenSharingActive) {

  } else {
    console.log('switching for screen sharing')
    try {
      screenSharingStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      })
      store.setSharingStream(screenSharingStream)

      // replace track which sender is sending
      const senders = peerConnection.getSenders()

      const sender = senders.find((sender) => {
        sender.track.kind === screenSharingStream.getVideoTracks()[0].kind
      })

      if (sender) {
        sender.replaceTrack(screenSharingStream.getVideoTracks()[0])
      }

      store.setScreenSharingActive(!setScreenSharingActive)
      ui.updateLocalVideo(screenSharingStream)
    } catch (err) {
      console.error('error when trying to share screen stream', err)
    }
  }
}