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
    ui.showCallingDialog(callingRejectCallHandler)
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
}

const rejectCallHandler = () => {
  console.log("Call rejected")
}

const callingRejectCallHandler = () => {
  console.log('Rejecting call')
}