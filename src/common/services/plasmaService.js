import { Plasma, Ethers } from '../utils'

export const getEthBalance = address => {
  return new Promise(async (resolve, reject) => {
    try {
      const eth = await Plasma.getEthBalance(address)
      console.log(eth)
      resolve(eth)
    } catch (err) {
      reject(err)
    }
  })
}

export const depositEth = async (address, privateKey, amount, fee) => {
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
