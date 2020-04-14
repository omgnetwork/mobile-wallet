import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import * as Utxos from './utxos'

export const getMockStore = () => {
  const middlewares = [thunk]
  return configureMockStore(middlewares)
}

export { Utxos }
