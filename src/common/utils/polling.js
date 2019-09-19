import BackgroundTimer from 'react-native-background-timer'

async function execute(request, resolve) {
  const result = await request()
  if (result.success) {
    resolve(result.data)
    BackgroundTimer.stopBackgroundTimer()
  }
}

export const poll = (request, interval) => {
  return new Promise((resolve, reject) => {
    BackgroundTimer.runBackgroundTimer(() => {
      execute(request, resolve)
    }, interval || 5000)
  })
}
