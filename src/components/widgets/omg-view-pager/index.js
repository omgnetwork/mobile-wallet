import React, { useRef, useEffect, useCallback } from 'react'
import { StyleSheet, ScrollView, Platform } from 'react-native'

const OMGViewPager = ({ children, pageWidth, currentPage, onPageChanged }) => {
  const middlePageOffset = pageWidth - 16
  const snapOffsets = [0, middlePageOffset, pageWidth * 2 - 32]
  const scroll = useRef(null)

  const scrollTo = useCallback(
    page => {
      const targetPosition = (page - 1) * pageWidth - 16
      scroll.current.scrollTo({ x: targetPosition, y: 0 })
    },
    [pageWidth]
  )

  const handleOnScroll = useCallback(
    event => {
      const currentOffset = event.nativeEvent.contentOffset.x
      const page = snapOffsets.indexOf(currentOffset)

      if (page > -1) {
        onPageChanged(page)
      }
    },
    [onPageChanged, snapOffsets]
  )

  useEffect(() => {
    if (scroll.current && Platform.OS === 'android') {
      setTimeout(() => {
        scroll.current.scrollTo({
          x: middlePageOffset,
          y: 0,
          animated: false
        })
      }, 300)
    }

    setTimeout(() => {
      scrollTo(currentPage)
    }, 1)
  }, [middlePageOffset, scrollTo, currentPage])
  return (
    <ScrollView
      ref={scroll}
      contentContainerStyle={styles.container}
      contentOffset={{ x: middlePageOffset }}
      snapToAlignment='center'
      onScroll={handleOnScroll}
      snapToOffsets={snapOffsets}
      decelerationRate='fast'
      showsHorizontalScrollIndicator={false}
      horizontal={true}>
      {children}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {}
})

export default OMGViewPager
