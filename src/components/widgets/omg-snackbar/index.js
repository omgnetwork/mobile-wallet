import React from 'react'
import { connect } from 'react-redux'
import { useSnackbarProps } from 'common/hooks'
import { Snackbar } from 'react-native-paper'
import * as Notifiers from 'common/notify'

const OMGSnackbar = ({ loading, error, style }) => {
  const snackbarProps = useSnackbarProps({
    loading,
    error,
    notifiers: Object.values(Notifiers)
  })

  return (
    <Snackbar
      style={{ ...style }}
      duration={Snackbar.DURATION_SHORT}
      {...snackbarProps}
    />
  )
}

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  error: state.error
})

export default connect(
  mapStateToProps,
  null
)(OMGSnackbar)
