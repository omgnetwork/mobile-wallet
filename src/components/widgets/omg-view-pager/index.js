import React, { useRef, useEffect, useCallback } from 'react'
import { StyleSheet, ScrollView, Platform } from 'react-native'

const OMGViewPager = ({ children, pageWidth, currentPage }) => {
  const scrollView = useRef(null)
  const middlePageOffset = pageWidth - 16
  const scroll = useRef(null)

  const scrollTo = useCallback(
    page => {
      const targetPosition = (page - 1) * pageWidth - 16
      scroll.current.scrollTo({ x: targetPosition, y: 0 })
    },
    [pageWidth]
  )

  useEffect(() => {
    if (scrollView.current && Platform.OS === 'android') {
      setTimeout(() => {
        scrollView.current.scrollTo({
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
      snapToOffsets={[0, middlePageOffset, pageWidth * 2]}
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
