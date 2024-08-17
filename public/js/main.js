import * as store from './store.js'
import * as wss from './wss.js'
import * as webRTCHandler from './webRTCHandler.js'
import * as constants from './constants.js'
import * as ui from './ui.js'

const socket = io("/")
wss.registerSocketEvents(socket)

webRTCHandler.getLocalPreview()

const personalCodeCopyButton = document.getElementById("personal_code_copy_button")
personalCodeCopyButton.addEventListener("click", () => {
  const personalCode = store.getState().socketId
  navigator.clipboard && navigator.clipboard.writeText(personalCode)
})

const personalCodeChatButton = document.getElementById('personal_code_chat_button')

const personalCodeVideoButton = document.getElementById('personal_code_video_button')

personalCodeChatButton.addEventListener('click', () => {
  console.log('Chat button clicked')

  const calleePersonalCode = document.getElementById('personal_code_input').value
  const callType = constants.callType.CHAT_PERSONAL_CODE
  
  webRTCHandler.sendPreOffer(callType, calleePersonalCode)
})

personalCodeVideoButton.addEventListener('click', () => {
  console.log('Video button clicked')

  const calleePersonalCode = document.getElementById('personal_code_input').value
  const callType = constants.callType.VIDEO_PERSONAL_CODE

  webRTCHandler.sendPreOffer(callType, calleePersonalCode)
})

const micButton = document.getElementById('mic_button')
micButton.addEventListener('click', () => {
  const localStream = store.getState().localStream
  const micEnabled = localStream.getAudioTracks()[0].enabled
  localStream.getAudioTracks()[0].enabled = !micEnabled
  ui.updateMicButton(micEnabled)
})

const cameraButton = document.getElementById('camera_button')
cameraButton.addEventListener('click', () => {
  const localStream = store.getState().localStream
  const cameraEnabled = localStream.getVideoTracks()[0].enabled
  localStream.getVideoTracks()[0].enabled = !cameraEnabled
  ui.updateCameraButton(cameraEnabled)
})

const screenSharing = document.getElementById('screen_sharing_button')
screenSharing.addEventListener('click', () => {
  const screenSharingActive = store.getState().screenSharingActive
  webRTCHandler.switchScreenSharing(screenSharingActive)
})

const newMessageInput = document.getElementById('new_message_input')
newMessageInput.addEventListener('keydown', (event) => {
  console.log('change occured')
  const key = event.key

  if (key === 'Enter') {
    webRTCHandler.sendMessage(event.target.value)
    ui.appendMessage(event.target.value, true)
    newMessageInput.value = ""
  }
})

const sendMessageButton = document.getElementById('new_message_button')
sendMessageButton.addEventListener('click', () => {
  const message = newMessageInput.value
  webRTCHandler.sendMessage(message)
  ui.appendMessage(message, true)
  newMessageInput.value = ""
})

// hang up

const hangUpButton = document.getElementById('hang_up_button')
hangUpButton.addEventListener('click', () => {
  console.log('hangUp button clicked')
  webRTCHandler.handleHangUp()
})

const hangUpChatButton = document.getElementById('finish_chat_call_button')
hangUpButton.addEventListener('click', () => {
  console.log('hangUp button clicked')
  webRTCHandler.handleHangUp()
})