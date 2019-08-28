import { Plasma, Ethers } from '../utils'

export const fetchAssets = (rootchainAssets, address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const balances = await Plasma.getEthBalance(address)

      const plasmaAssets = balances.map(balance => {
        const token = rootchainAssets.find(
          asset => balance.currency === asset.contractAddress
        )
        if (token) {
          return {
            ...token,
            balance: Ethers.formatUnits(
              balance.amount.toString(),
              token.tokenDecimal
            )
          }
        } else {
          return {
            tokenName: 'UNK',
            tokenSymbol: 'Unknown',
            tokenDecimal: 18,
            contractAddress: '0x123456',
            balance: Ethers.formatUnits(
              balance.amount.toString(),
              token.tokenDecimal
            ),
            price: 1
          }
        }
      })

      console.log(plasmaAssets)
      resolve(plasmaAssets)
    } catch (err) {
      reject(err)
    }
  })
}

export const depositEth = (address, privateKey, amount, fee) => {
  return new Promise(async (resolve, reject) => {
    try {
      const weiAmount = Ethers.parseUnits(amount, 'ether')
      const transactionReceipt = await Plasma.depositEth(
        address,
        privateKey,
        weiAmount,
        {
          gasPrice: Ethers.parseUnits(fee.amount, fee.symbol)
        }
      )
      console.log(transactionReceipt)
      resolve(transactionReceipt)
    } catch (err) {
      reject(err)
    }
  })
}
