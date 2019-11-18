import { useRef, useCallback } from 'react'

const usePositionMeasurement = (
  anchoredComponentName,
  dispatchAddAnchoredComponent,
  offset
) => {
  const anchoredComponentRef = useRef(null)

  const measure = useCallback(() => {
    if (anchoredComponentRef.current) {
      setTimeout(() => {
        anchoredComponentRef.current.measure(
          (fx, fy, width, height, px, py) => {
            dispatchAddAnchoredComponent(anchoredComponentName, {
              top: Math.round(py),
              bottom: Math.round(py + height),
              left: Math.round(px) - (offset || 0),
              width: Math.round(width)
            })
          }
        )
      }, 300)
    }
  }, [anchoredComponentName, dispatchAddAnchoredComponent, offset])

  return [anchoredComponentRef, measure]
}

export default usePositionMeasurement
