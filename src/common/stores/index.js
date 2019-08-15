import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import { composeWithDevTools } from 'redux-devtools-extension'

export default initialStore =>
  createStore(
    rootReducer,
    initialStore,
    composeWithDevTools(applyMiddleware(thunk))
  )
