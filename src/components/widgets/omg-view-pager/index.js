import React, { useRef, useCallback, useState, useEffect } from 'react'
import { StyleSheet, ScrollView } from 'react-native'

const OMGViewPager = ({
  children,
  snapOffsets,
  pageWidth,
  onPageChanged,
  scrollRef
}) => {
  const scroll = useRef(null)
  const [lastPage, setLastPage] = useState(-1)

  const scrollTo = useCallback(
    page => {
      const targetPosition = (page - 1) * pageWidth - 16
      scroll.current.scrollTo({ x: targetPosition, y: 0 })
    },
    [pageWidth]
  )

  useEffect(() => {
    if (scrollRef) {
      scrollRef.current = {
        scrollTo
      }
    }
  }, [scrollRef, scrollTo])

  const handleOnScroll = useCallback(
    event => {
      const currentOffset = Math.round(event.nativeEvent.contentOffset.x)
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
