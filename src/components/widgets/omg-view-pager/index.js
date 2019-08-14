import React, { useRef, useEffect } from 'react'
import { StyleSheet, ScrollView } from 'react-native'

const OMGViewPager = ({ children, pageWidth }) => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      contentOffset={{ x: pageWidth - 16 }}
      snapToAlignment='center'
      snapToOffsets={[0, pageWidth - 16, pageWidth * 2]}
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
