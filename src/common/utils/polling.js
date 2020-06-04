const DEFAULT_INTERVAL = 3000

function delayRequest(sendRequest, interval, resolve) {
  setTimeout(async () => {
    const result = await sendRequest()
    if (result.success) {
      resolve(result.data)
    } else {
      delayRequest(sendRequest, interval, resolve)
    }
  }, interval || DEFAULT_INTERVAL)
}

export const pollUntilSuccess = (sendRequest, interval) => {
  return new Promise((resolve, _reject) => {
    delayRequest(sendRequest, interval, resolve)
  })
}
