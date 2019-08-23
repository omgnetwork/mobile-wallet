import { useState, useEffect, useCallback } from 'react'

function getAlertMsg(loading, msgSuccess, msgFailed) {
  if (loading.success) {
    return msgSuccess
  } else if (loading.failed) {
    return msgFailed
  } else {
    return null
  }
}

function getVisible(loading, actions) {
  return !loading.show && actions.indexOf(loading.action) > -1
}

const useAlert = ({ loading, actions, msgSuccess, msgFailed }) => {
  const [visible, setVisible] = useState(getVisible(loading, actions))
  const [msg, setMsg] = useState(getAlertMsg(loading))

  const visibleCallback = useCallback(() => {
    const latestVisible = getVisible(loading, actions)
    latestVisible && setVisible(latestVisible)
  }, [actions, loading])

  const msgCallback = useCallback(() => {
    const latestMsg = getAlertMsg(loading, msgSuccess, msgFailed)
    latestMsg && setMsg(latestMsg)
  }, [loading, msgSuccess, msgFailed])

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

export default useAlert
