import { useState, useEffect, useCallback } from 'react'

function getAlertMsg(loading, notifiers, error) {
  const notifier = notifiers.find(n => n.actions.indexOf(loading.action) > -1)

  if (loading.success && notifier) {
    return notifier.msgSuccess
  } else if (loading.failed) {
    return error && error.message
  } else {
    return null
  }
}

function getVisible(loading, actions) {
  return !loading.show && actions.indexOf(loading.action) > -1
}

const flatMap = (arr, f) => arr.reduce((x, y) => [...x, ...f(y)], [])

const useSnackbarProps = ({ loading, error, notifiers }) => {
  const actions = flatMap(notifiers, notifier => notifier.actions)
  const [visible, setVisible] = useState(getVisible(loading, actions))
  const [msg, setMsg] = useState(getAlertMsg(loading, notifiers, error))

  const visibleCallback = useCallback(() => {
    const latestVisible = getVisible(loading, actions)
    latestVisible && setVisible(latestVisible)
  }, [actions, loading])

  const msgCallback = useCallback(() => {
    const latestMsg = getAlertMsg(loading, notifiers, error)
    latestMsg && setMsg(latestMsg)
  }, [loading, notifiers, error])

  useEffect(() => {
    visibleCallback()
  }, [visibleCallback])

  useEffect(() => {
    msgCallback()
  }, [msgCallback])

  return {
    visible: visible,
    children: msg,
    onDismiss: () => {
      setVisible(false)
    }
  }
}

export default useSnackbarProps
