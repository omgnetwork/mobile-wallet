import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useFlashMessage } from 'common/hooks'
import FlashMessage, { showMessage } from 'react-native-flash-message'
import * as Notifiers from 'common/notify'

const OMGAlert = ({ loading, error, style }) => {
  const message = useFlashMessage({
    loading,
    error,
    notifiers: Object.values(Notifiers)
  })

  useEffect(() => {
    if (message) {
      showMessage(message)
    }
  }, [message])

  return <FlashMessage style={style} />
}

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  error: state.error
})

export default connect(
  mapStateToProps,
  null
)(OMGAlert)
