import { useRef, useCallback } from 'react'

const usePositionMeasurement = (
  anchoredComponentName,
  dispatchAddAnchoredComponent
) => {
  const anchoredComponentRef = useRef(null)

  const measure = useCallback(
    (options = {}) => {
      const {
        arrowDirection,
        offset,
        topOffset,
        widthOffset,
        forceLeft,
        forceWidth
      } = options
      if (anchoredComponentRef.current) {
        setTimeout(() => {
          anchoredComponentRef.current.measure(
            (fx, fy, width, height, px, py) => {
              dispatchAddAnchoredComponent(anchoredComponentName, {
                top: Math.round(py) + (topOffset || 0),
                bottom: Math.round(py + height),
                left: forceLeft || Math.round(px) + (offset || 0),
                width: forceWidth || Math.round(width) + (widthOffset || 0),
                arrowOffset: getArrowOffset(arrowDirection, Math.round(width))
              })
            }
          )
        }, 300)
      }
    },
    [anchoredComponentName, dispatchAddAnchoredComponent]
  )

  return [anchoredComponentRef, measure]
}

const getArrowOffset = (arrowDirection, width) => {
  switch (arrowDirection) {
    case 'left':
      return (width / 4) * -1
    case 'right':
      return width / 4
    default:
      return 0
  }
}

export default usePositionMeasurement
