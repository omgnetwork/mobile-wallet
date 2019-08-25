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

const useAlert = ({ loading, actions, msgSuccess, error }) => {
  const [visible, setVisible] = useState(getVisible(loading, actions))
  const [msg, setMsg] = useState(getAlertMsg(loading))

  const visibleCallback = useCallback(() => {
    const latestVisible = getVisible(loading, actions)
    latestVisible && setVisible(latestVisible)
  }, [actions, loading])

  const getMsgFailed = useCallback(() => {
    return error && error.message
  }, [error])

  const msgCallback = useCallback(() => {
    const latestMsg = getAlertMsg(loading, msgSuccess, getMsgFailed())
    latestMsg && setMsg(latestMsg)
  }, [loading, getMsgFailed, msgSuccess])

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
