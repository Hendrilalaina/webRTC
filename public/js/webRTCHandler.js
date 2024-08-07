import * as wss from './wss.js'
import * as constants from './constants.js'
import * as ui from './ui.js'

let connectedUserDetails

export const sendPreOffer = (callType, calleePersonalCode) => {
  const data = {
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
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED)
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

  switch (preOfferAnswer) {
    case (constants.preOfferAnswer.CALLEE_NOT_FOUND): {
      // show dialog that calle has been not found
      break
    }
    case (constants.preOfferAnswer.CALL_UNAVAILABLE): {
      // show dialog that callee is not able to connect
      break
    }
    case (constants.preOfferAnswer.CALL_REJECTED): {
      // show dialog that call is rejected by callee
      break
    }
    default: {
      // send webRTC offer
      break
    }

  }
}