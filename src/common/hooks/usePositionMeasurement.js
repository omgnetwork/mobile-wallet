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
        offset = 0,
        topOffset = 0,
        extraWidth = 0,
        arrowOffset = 0,
        forceLeft,
        forceWidth
      } = options
      if (anchoredComponentRef.current) {
        setTimeout(() => {
          anchoredComponentRef.current &&
            anchoredComponentRef.current.measure(
              (fx, fy, width, height, px, py) => {
                dispatchAddAnchoredComponent(anchoredComponentName, {
                  top: Math.round(py) + topOffset,
                  bottom: Math.round(py + height),
                  left: (forceLeft || Math.round(px) + offset) - extraWidth / 2,
                  width: forceWidth || Math.round(width) + extraWidth,
                  arrowOffset:
                    getArrowOffset(arrowDirection, Math.round(width)) +
                    arrowOffset
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
