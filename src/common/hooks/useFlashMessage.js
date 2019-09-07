import { useState, useEffect } from 'react'

function getAlertMsg(loading, notifiers, error) {
  const notifier = notifiers.find(n => n.actions.indexOf(loading.action) > -1)

  if (loading.success && notifier) {
    return {
      type: 'success',
      message: notifier.msgSuccess
    }
  } else if (loading.failed) {
    return {
      type: 'danger',
      message: error && error.message
    }
  } else {
    return null
  }
}

function getVisible(loading, actions) {
  return !loading.show && actions.indexOf(loading.action) > -1
}

const flatMap = (arr, f) => arr.reduce((x, y) => [...x, ...f(y)], [])

const useFlashMessage = ({ loading, error, notifiers }) => {
  const actions = flatMap(notifiers, notifier => notifier.actions)
  const [visible, setVisible] = useState(getVisible(loading, actions))
  const [msg, setMsg] = useState(getAlertMsg(loading, notifiers, error))

  useEffect(() => {
    const latestVisible = getVisible(loading, actions)
    if (visible !== latestVisible) {
      setVisible(latestVisible)
    }
  }, [actions, loading, visible])

  useEffect(() => {
    const latestMsg = getAlertMsg(loading, notifiers, error)
    if (!latestMsg) return
    if (!msg || latestMsg.message !== msg.message) setMsg(latestMsg)
  }, [loading, notifiers, error, msg])

  if (visible && msg) {
    return msg
  }
}

export default useFlashMessage
