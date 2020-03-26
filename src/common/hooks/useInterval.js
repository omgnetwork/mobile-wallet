import { useRef, useEffect } from 'react'

function useInterval(callback, interval) {
  const savedCallback = useRef()

  useEffect(() => {
    savedCallback.current = callback
  })

  // Run only once, when mounted.
  useEffect(() => {
    savedCallback.current()
  }, [])

  // Run periodically every `interval` ms.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }

    let id = setInterval(tick, interval)
    return () => clearInterval(id)
  }, [interval])
}

export default useInterval