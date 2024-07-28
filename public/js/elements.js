export const getIncomingCallDialog = (
  callTypeInfo,
  acceptCallHandler,
  rejectCallHandler
) => {
  console.log("getting incoming call dialog")
  const dialog = document.createElement('div')
  dialog.classList.add('dialog_wrapper')
  const dialogContent = document.createElement('div')
  dialogContent.classList.add('dialog_content')
  dialog.appendChild(dialogContent)

  const title = document.createElement('p')
  title.classList.add('dialog_title')
  title.innerHTML = `Incoming ${callTypeInfo} call`

  const imageContainer = document.createElement('div')
  imageContainer.classList.add('dialog_image_container')
  const image = document.createElement('img')
  const avatar = './utils/images/dialogAvatar.png'
  image.src = avatar
  imageContainer.appendChild(image)

  const buttonContainer = document.createElement('div')
  buttonContainer.classList.add('dialog_button_container')

  const acceptCallButton = document.createElement('button')
  acceptCallButton.classList.add('dialog_accept_call_button')
  const acceptCallImg = document.createElement('img')
  acceptCallImg.classList.add('dialog_button_container')
  const acceptCallImgPath = './utils/images/acceptCall.png'
  acceptCallImg.src = acceptCallImgPath
  acceptCallButton.appendChild(acceptCallImg)
  buttonContainer.appendChild(acceptCallButton)

  const rejectCallButton = document.createElement('button')
  rejectCallButton.classList.add('dialog_reject_call_button')
  const rejectCallImg = document.createElement('img')
  rejectCallImg.classList.add('dialog_button_container')
  const rejectCallImgPath = './utils/images/rejectCall.png'
  rejectCallImg.src = rejectCallImgPath
  rejectCallButton.appendChild(rejectCallImg)
  buttonContainer.appendChild(rejectCallButton)

  dialogContent.appendChild(title)
  dialogContent.appendChild(imageContainer)
  dialogContent.appendChild(buttonContainer)

  return dialog
}

export const getCallingDialog = () => {
  const dialog = document.createElement('div')
  dialog.classList.add('dialog_wrapper')
  const dialogContent = document.createElement('div')
  dialogContent.classList.add('dialog_content')
  dialog.appendChild(dialogContent)

  const title = document.createElement('p')
  title.classList.add('dialog_title')
  title.innerHTML = `Calling`

  const imageContainer = document.createElement('div')
  imageContainer.classList.add('dialog_image_container')
  const image = document.createElement('img')
  const avatar = './utils/images/dialogAvatar.png'
  image.src = avatar
  imageContainer.appendChild(image)

  const buttonContainer = document.createElement('div')
  buttonContainer.classList.add('dialog_button_container')

  const hangUpCallButton = document.createElement('button')
  hangUpCallButton.classList.add('dialog_reject_call_button')
  const hangUpCallImg = document.createElement('img')
  hangUpCallImg.classList.add('dialog_button_container')
  const hangUpCallImgPath = './utils/images/rejectCall.png'
  hangUpCallImg.src = hangUpCallImgPath
  hangUpCallButton.appendChild(hangUpCallImg)
  buttonContainer.appendChild(hangUpCallButton)

  dialogContent.appendChild(title)
  dialogContent.appendChild(imageContainer)
  dialogContent.appendChild(buttonContainer)

  return dialog
}