import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'

const OMGViewPager = ({ children, pageWidth }) => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      snapToAlignment='center'
      snapToInterval={pageWidth}
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
