function delayRequest(sendRequest, interval, resolve) {
  setTimeout(async () => {
    const result = await sendRequest()

    console.log(result)
    if (result.success) {
      resolve(result.data)
    } else {
      delayRequest(sendRequest, interval, resolve)
    }
  }, interval || 5000)
}

export const poll = (sendRequest, interval) => {
  return new Promise((resolve, reject) => {
    delayRequest(sendRequest, interval, resolve)
  })
}
