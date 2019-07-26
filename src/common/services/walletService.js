export const create = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        address: 'addr1234'
      })
    }, 3000)
  })
}
