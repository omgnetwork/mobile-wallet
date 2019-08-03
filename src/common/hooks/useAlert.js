import { useState, useEffect, useCallback } from 'react'

function getAlertMsg(loadingStatus, msgSuccess, msgFailed) {
  switch (loadingStatus) {
    case 'SUCCESS':
      return msgSuccess
    case 'FAILED':
      return msgFailed
    default:
      return null
  }
}

function getVisible(loadingStatus) {
  switch (loadingStatus) {
    case 'SUCCESS':
    case 'FAILED':
      return true
    case 'INITIATED':
      return false
    default:
      return null
  }
}

const useAlert = ({ loadingStatus, msgSuccess, msgFailed }) => {
  const [visible, setVisible] = useState(getVisible(loadingStatus))
  const [msg, setMsg] = useState(getAlertMsg(loadingStatus))

  const visibleCallback = useCallback(() => {
    const latestVisible = getVisible(loadingStatus)
    latestVisible && setVisible(latestVisible)
  }, [loadingStatus])

  const msgCallback = useCallback(() => {
    const latestMsg = getAlertMsg(loadingStatus, msgSuccess, msgFailed)
    latestMsg && setMsg(latestMsg)
  }, [loadingStatus, msgSuccess, msgFailed])

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
