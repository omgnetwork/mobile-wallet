const warn = {
  address: (type, address) =>
    console.warn(
      `Error: Given ${type} contract address does not match Watcher ${type} contract address (${address}).`
    ),
  parse: (stringName, requiredMainnet, requiredOther) =>
    console.warn(
      `Error: Could not parse network from given ${stringName}. Required format is ${requiredMainnet}/ (mainnet) or ${requiredOther}/`
    )
}

const parse = {
  etherscanNetwork: url => {
    if (url === 'https://etherscan.io/') {
      return 'mainnet'
    }
    const networkMatch = url.match(/https:\/\/(.*)\.etherscan.io/)
    if (!networkMatch) {
      warn.parse(
        'Etherscan URL',
        'https://etherscan.io',
        'https://<network>.etherscan.io/'
      )
      return null
    }
    return networkMatch[1]
  },
  etherscanApiNetwork: url => {
    if (url === 'https://api.etherscan.io/api/') {
      return 'mainnet'
    }
    const networkMatch = url.match(/https:\/\/api-(.*)\.etherscan.io/)
    if (!networkMatch) {
      warn.parse(
        'Etherscan API URL',
        'https://api.etherscan.io/api',
        'https://api-<network>.etherscan.io/api'
      )
      return null
    }
    return networkMatch[1]
  }
}

module.exports = { parse, warn }
