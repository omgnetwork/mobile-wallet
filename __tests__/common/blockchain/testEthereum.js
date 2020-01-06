import { Ethereum } from 'common/blockchain'
import Config from 'react-native-config'
import { ethers } from 'ethers'
import { Gas } from 'common/constants'
import { ContractABI } from 'common/utils'

const {
	TEST_MNEMONIC,
	TEST_PRIVATE_KEY,
	TEST_ADDRESS,
	ETHERSCAN_NETWORK,
	TEST_ERC20_TOKEN_CONTRACT_ADDRESS
} = Config

const testProvider = Ethereum.createProvider(ETHERSCAN_NETWORK)
const mockWalletTransfer = wallet => {
	wallet.sendTransaction = jest.fn()
}
const mockContractTransfer = () => {
	ethers.Contract = jest.fn()
	//	jest.spyOn(contract, 'transfer', 'get').mockReturnValue(jest.fn())
//	Object.defineProperty(contract, 'transfer', { value: jest.fn(), configurable: true })
}

describe('Test Ethereum Boundary', () => {
	it('importWalletMnemonic should return a wallet when given 12-words mnemonic', () => {
		const { signingKey, address } = Ethereum.importWalletMnemonic(TEST_MNEMONIC)
		const { mnemonic, privateKey } = signingKey
		expect(mnemonic).toBe(TEST_MNEMONIC)
		expect(privateKey).toBe(TEST_PRIVATE_KEY)
		expect(address).toBe(TEST_ADDRESS)
	})

	it('getTokenDetail should return {symbol, decimal, name, contractAddress}', () => {
		const pendingDetails = Ethereum.getTokenDetail(
			testProvider,
			TEST_ERC20_TOKEN_CONTRACT_ADDRESS
		)

		return Promise.all(pendingDetails).then(
			([name, symbol, decimals, contractAddress]) => {
				expect(name).toBeDefined()
				expect(symbol).toBeDefined()
				expect(decimals).toBeDefined()
				expect(contractAddress).toBeDefined()
			}
		)
	})

	it('sendEthToken should send expected parameters', () => {
		const wallet = new ethers.Wallet(TEST_PRIVATE_KEY, testProvider)
		mockWalletTransfer(wallet)
		const fee = { amount: '0.1', symbol: 'gwei' }
		const token = { balance: '1', numberOfDecimals: 18 }
		const toAddress = TEST_ADDRESS
		const expectedValue = ethers.utils.parseUnits(
			token.balance,
			token.numberOfDecimals
		)
		const expectedFee = ethers.utils.parseUnits(fee.amount, fee.symbol)
		const receipt = Ethereum.sendEthToken(wallet, { fee, token, toAddress })
		expect(wallet.sendTransaction).toBeCalledWith({
			to: toAddress,
			value: expectedValue,
			gasPrice: expectedFee,
			gasLimit: Gas.LOW_LIMIT
		})
	})

	it('sendERC20Token should send expected parameters', () => {
		const wallet = new ethers.Wallet(TEST_PRIVATE_KEY, testProvider)
		const abi = ContractABI.erc20Abi()
		mockContractTransfer()
		const contract = new ethers.Contract(
			TEST_ERC20_TOKEN_CONTRACT_ADDRESS,
			abi,
			wallet
		)
		const fee = { amount: '0.1', symbol: 'gwei' }
		const token = { balance: '1', numberOfDecimals: 5 }
		const toAddress = TEST_ADDRESS
		const expectedValue = ethers.utils.parseUnits(
			token.balance,
			token.numberOfDecimals
		)
		const expectedFee = ethers.utils.parseUnits(fee.amount, fee.symbol)
		const receipt = Ethereum.sendErc20Token(contract, { fee, token, toAddress })
		expect(contract.transfer).toBeCalledWith(toAddress, expectedValue, {
			gasPrice: expectedFee,
			gasLimit: Gas.LOW_LIMIT
		})
	})
})
