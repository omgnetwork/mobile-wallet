import React, { useCallback, useState } from 'react'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import {
  OMGDotViewPager,
  OMGStatusBar,
  OMGText,
  OMGButton
} from 'components/widgets'
import { ArrowRight } from './assets'
import Page from './Page'

const PageItems = [
  {
    title: 'the OMG Network is a Hi-way for your transactions',
    content: 'The network help you avoid congestion on Ethereum network',
    image: 'Welcome1'
  },
  {
    title: 'Shift route to the OMG Network, enjoy more perks on Fee.',
    content: 'Transfer cheaper with more token options to pay fee.',
    image: 'Welcome2'
  },
  {
    title: 'Experience the OMG Network',
    content:
      'Specially developed for the OMG Network, our open-source Plasma Wallet is an educational tool that lets you make real Plasma transactions.',
    image: 'Welcome3'
  }
].map((item, index) => {
  return (
    <Page
      textTitle={item.title}
      textContent={item.content}
      image={item.image}
      key={index}
    />
  )
})

const Welcome = ({ navigation, theme }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [showButtons, setShowButtons] = useState(false)

  const navigateCreateWallet = () => {
    navigation.navigate('Disclaimer', {
      destination: 'WelcomeCreateWallet'
    })
  }
  const navigateImportWallet = () => {
    navigation.navigate('Disclaimer', {
      destination: 'WelcomeImportWallet'
    })
  }
  const onLastPage = useCallback(isLastPage => {
    setShowButtons(isLastPage)
  }, [])

  const handleOnNextPressed = useCallback(() => {
    setCurrentPage(currentPage + 1)
  }, [currentPage])

  const handleOnPressSkip = useCallback(() => {
    setCurrentPage(2)
  }, [currentPage])

  return (
    <SafeAreaView style={styles.container(theme)}>
      <OMGStatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.black}
      />
      <OMGDotViewPager
        page={currentPage}
        onLastPage={onLastPage}
        onPageChanged={setCurrentPage}
        style={styles.scroll}>
        {PageItems}
      </OMGDotViewPager>
      {!showButtons ? (
        <View style={styles.pageNavigationContainer}>
          <TouchableOpacity style={styles.btnSkip} onPress={handleOnPressSkip}>
            <OMGText weight='regular' style={styles.text(theme)}>
              SKIP
            </OMGText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnNext(theme)}
            onPress={handleOnNextPressed}>
            <ArrowRight />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <OMGButton
            onPress={navigateImportWallet}
            style={styles.btnImport(theme)}
            textStyle={styles.btnImportText(theme)}>
            Use Existing Wallet
          </OMGButton>
          <OMGButton style={styles.btnCreate} onPress={navigateCreateWallet}>
            Create New Wallet
          </OMGButton>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.black,
    paddingBottom: 18
  }),
  scroll: {
    flex: 3
  },
  pageNavigationContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 30
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 30
  },
  text: theme => ({
    color: theme.colors.white,
    fontSize: 18,
    lineHeight: 22
  }),
  btnSkip: {
    marginBottom: 18
  },
  btnNext: theme => ({
    width: 60,
    height: 60,
    alightItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    padding: 8
  }),
  btnImport: theme => ({
    backgroundColor: theme.colors.primary
  }),
  btnImportText: theme => ({
    color: theme.colors.white
  }),
  btnCreate: {
    marginTop: 24
  }
})

export default withNavigation(withTheme(Welcome))
