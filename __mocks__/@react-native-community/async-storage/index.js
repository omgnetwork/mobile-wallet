let cache = {}
export default {
  setItem: (key, value) => {
    return new Promise((resolve, reject) => {
      return typeof key !== 'string' || typeof value !== 'string'
        ? reject(new Error('key and value must be string'))
        : resolve((cache[key] = value))
    })
  },
  getItem: key => {
    return new Promise(resolve => {
      return key in cache? resolve(cache[key]) : resolve(null)
    })
  },
  removeItem: key => {
    return new Promise((resolve, reject) => {
      return  key in cache
        ? resolve(delete cache[key])
        : reject('No such key!')
    })
  },
  clear: () => {
    return new Promise((resolve, _reject) => resolve((cache = {})))
  },

  getAllKeys: () => {
    return new Promise((resolve, _reject) => resolve(Object.keys(cache)))
  }
}
