import React, { useRef, useCallback, useState } from 'react'
import { StyleSheet, ScrollView } from 'react-native'

const OMGViewPager = ({ children, pageWidth, currentPage, onPageChanged }) => {
  const middlePageOffset = pageWidth - 16
  const snapOffsets = [
    0,
    Math.round(middlePageOffset),
    Math.round(pageWidth * 2 - 32)
  ]
  const scroll = useRef(null)
  const [lastPage, setLastPage] = useState(-1)

  const scrollTo = useCallback(
    page => {
      const targetPosition = (page - 1) * pageWidth - 16
      scroll.current.scrollTo({ x: targetPosition, y: 0 })
    },
    [pageWidth]
  )

  const handleOnScroll = useCallback(
    event => {
      const currentOffset = Math.round(event.nativeEvent.contentOffset.x)

      console.log(currentOffset, snapOffsets)
      const page = snapOffsets.indexOf(currentOffset) + 1

      if (page > 0 && page !== lastPage) {
        onPageChanged(page)
        setLastPage(page)
      }
    },
    [lastPage, onPageChanged, snapOffsets]
  )

  return (
    <ScrollView
      ref={scroll}
      contentContainerStyle={styles.container}
      contentOffset={{ x: 0 }}
      snapToAlignment='center'
      scrollEventThrottle={0}
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
  container: {
    paddingHorizontal: 12
  }
})

export default OMGViewPager
