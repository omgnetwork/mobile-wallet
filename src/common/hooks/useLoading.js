import { useState, useEffect } from 'react'

function getLoading(loadingStatus) {
  switch (loadingStatus) {
    case 'INITIATED':
      return true
    case 'DEFAULT':
      return false
    default:
      return null
  }
}

const useLoading = loadingStatus => {
  const [loading, setLoading] = useState(getLoading(loadingStatus))

  useEffect(() => {
    const latestLoading = getLoading(loadingStatus)
    setLoading(latestLoading === null ? loading : latestLoading)
  }, [loading, loadingStatus])

  return [loading, setLoading]
}

export default useLoading
