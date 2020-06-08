import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useFlashMessage } from 'common/hooks'
import FlashMessage from 'react-native-flash-message'
import { ActionAlert } from 'common/constants'
import { Alerter } from 'common/utils'

const OMGAlert = ({ loading, error, style }) => {
  const message = useFlashMessage({
    loading,
    error,
    notifiers: Object.values(ActionAlert)
  })

  useEffect(() => {
    if (message) {
      Alerter.show(message)
    }
  }, [message])

  return <FlashMessage style={style} />
}

const mapStateToProps = (state, _ownProps) => ({
  loading: state.loading,
  error: state.error
})

export default connect(mapStateToProps, null)(OMGAlert)
