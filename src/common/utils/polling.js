function delayRequest(sendRequest, interval, resolve) {
  setTimeout(async () => {
    const result = await sendRequest()
    if (result.success) {
      resolve(result.data)
    } else {
      delayRequest(sendRequest, interval, resolve)
    }
  }, interval || 5000)
}

export const pollUntilSuccess = (sendRequest, interval) => {
  return new Promise((resolve, reject) => {
    delayRequest(sendRequest, interval, resolve)
  })
}
