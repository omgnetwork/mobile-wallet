import { useState, useEffect } from 'react'

function getLoading(loadingStatus) {
  switch (loadingStatus) {
    case 'INITIATED':
      return true
    default:
      return false
  }
}

const useLoading = loadingStatus => {
  const [loading, setLoading] = useState(getLoading(loadingStatus))

  useEffect(() => {
    setLoading(getLoading(loadingStatus))
  }, [loadingStatus])

  return [loading, setLoading]
}

export default useLoading
