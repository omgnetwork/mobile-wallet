import React, { useRef, useEffect } from 'react'
import { StyleSheet, ScrollView, Platform } from 'react-native'

const OMGViewPager = ({ children, pageWidth }) => {
  const scrollView = useRef(null)
  const middlePageOffset = pageWidth - 16

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
  }, [middlePageOffset])
  return (
    <ScrollView
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
