import * as wss from './wss.js'

export const sendPreOffer = (callType, calleePersonalCode) => {
  const data = {
    callType,
    calleePersonalCode
  }

  wss.sendPreOffer(data)
}

export const handlePreOffer = (data) => {
  console.log("Pre offer came webRTC handler")
  console.log(data)
}