import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

export const getMockStore = () => {
  const middlewares = [thunk]
  return configureMockStore(middlewares)
}
