import { useEffect, useState } from 'react'

export default (loading, action, initialState = false) => {
  const [showLoading, setShowLoading] = useState(initialState)
  useEffect(() => {
    if (loading.action === action) {
      setShowLoading(loading.show)
    }
  }, [action, loading.action, loading.show])

  return [showLoading, setShowLoading]
}
