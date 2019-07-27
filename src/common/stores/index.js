import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import { composeWithDevTools } from 'redux-devtools-extension'

const store = initialStore =>
  createStore(
    rootReducer,
    initialStore,
    composeWithDevTools(applyMiddleware(thunk))
  )

export default store
