export const erc20Abi = () => {
  return [
    {
      name: 'transfer',
      type: 'function',
      inputs: [
        {
          name: '_to',
          type: 'address'
        },
        {
          type: 'uint256',
          name: '_tokens'
        }
      ],
      constant: false,
      outputs: [],
      payable: false
    },
    {
      constant: true,
      inputs: [
        {
          name: '_owner',
          type: 'address'
        }
      ],
      name: 'balanceOf',
      outputs: [
        {
          name: 'balance',
          type: 'uint256'
        }
      ],
      payable: false,
      type: 'function'
    },
    {
      name: 'approve',
      type: 'function',
      constant: false,
      inputs: [
        {
          name: '_spender',
          type: 'address'
        },
        {
          name: '_value',
          type: 'uint256'
        }
      ],
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'nonpayable'
    },
    {
      constant: true,
      inputs: [],
      name: 'name',
      outputs: [
        {
          name: '',
          type: 'string'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'symbol',
      outputs: [
        {
          name: '',
          type: 'string'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [
        {
          name: '',
          type: 'uint8'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    }
  ]
}

export const bytes32Erc20Abi = () => {
  return [
    {
      name: 'transfer',
      type: 'function',
      inputs: [
        {
          name: '_to',
          type: 'address'
        },
        {
          type: 'uint256',
          name: '_tokens'
        }
      ],
      constant: false,
      outputs: [],
      payable: false
    },
    {
      constant: true,
      inputs: [
        {
          name: '_owner',
          type: 'address'
        }
      ],
      name: 'balanceOf',
      outputs: [
        {
          name: 'balance',
          type: 'uint256'
        }
      ],
      payable: false,
      type: 'function'
    },
    {
      name: 'approve',
      type: 'function',
      constant: false,
      inputs: [
        {
          name: '_spender',
          type: 'address'
        },
        {
          name: '_value',
          type: 'uint256'
        }
      ],
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'nonpayable'
    },
    {
      constant: true,
      inputs: [],
      name: 'name',
      outputs: [
        {
          name: '',
          type: 'bytes32'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'symbol',
      outputs: [
        {
          name: '',
          type: 'bytes32'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [
        {
          name: '',
          type: 'uint8'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    }
  ]
}

export const plasmaAbi = () => {
  return [
    {
      constant: true,
      inputs: [],
      name: 'nextFeeExit',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_token',
          type: 'address'
        },
        {
          name: '_topExitId',
          type: 'uint192'
        },
        {
          name: '_exitsToProcess',
          type: 'uint256'
        }
      ],
      name: 'processExits',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'MAX_INPUTS',
      outputs: [
        {
          name: '',
          type: 'uint8'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: 'priority',
          type: 'uint256'
        }
      ],
      name: 'unpackExitId',
      outputs: [
        {
          name: '',
          type: 'uint64'
        },
        {
          name: '',
          type: 'uint192'
        },
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'pure',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'uint192'
        }
      ],
      name: 'exits',
      outputs: [
        {
          name: 'owner',
          type: 'address'
        },
        {
          name: 'token',
          type: 'address'
        },
        {
          name: 'amount',
          type: 'uint256'
        },
        {
          name: 'position',
          type: 'uint192'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'uint192'
        }
      ],
      name: 'inFlightExits',
      outputs: [
        {
          name: 'exitStartTimestamp',
          type: 'uint256'
        },
        {
          name: 'exitPriority',
          type: 'uint256'
        },
        {
          name: 'exitMap',
          type: 'uint256'
        },
        {
          name: 'bondOwner',
          type: 'address'
        },
        {
          name: 'oldestCompetitor',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_feeExitId',
          type: 'uint192'
        }
      ],
      name: 'getFeeExitPriority',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [],
      name: '_initOperator',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_tx',
          type: 'bytes'
        },
        {
          name: '_outputIndex',
          type: 'uint256'
        }
      ],
      name: 'getInFlightExitOutput',
      outputs: [
        {
          name: '',
          type: 'address'
        },
        {
          name: '',
          type: 'address'
        },
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_inFlightTx',
          type: 'bytes'
        },
        {
          name: '_inFlightTxPos',
          type: 'uint256'
        },
        {
          name: '_inFlightTxInclusionProof',
          type: 'bytes'
        }
      ],
      name: 'respondToNonCanonicalChallenge',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_utxoPos',
          type: 'uint256'
        }
      ],
      name: 'getExitableTimestamp',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_inFlightTx',
          type: 'bytes'
        },
        {
          name: '_inFlightTxInputIndex',
          type: 'uint8'
        },
        {
          name: '_spendingTx',
          type: 'bytes'
        },
        {
          name: '_spendingTxInputIndex',
          type: 'uint8'
        },
        {
          name: '_spendingTxSig',
          type: 'bytes'
        }
      ],
      name: 'challengeInFlightExitInputSpent',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_token',
          type: 'address'
        },
        {
          name: '_amount',
          type: 'uint256'
        }
      ],
      name: 'startFeeExit',
      outputs: [],
      payable: true,
      stateMutability: 'payable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'piggybackBond',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'nextChildBlock',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_exitId',
          type: 'uint192'
        },
        {
          name: '_utxoPos',
          type: 'uint256'
        }
      ],
      name: 'getStandardExitPriority',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_inFlightTx',
          type: 'bytes'
        },
        {
          name: '_inFlightTxInputIndex',
          type: 'uint8'
        },
        {
          name: '_competingTx',
          type: 'bytes'
        },
        {
          name: '_competingTxInputIndex',
          type: 'uint8'
        },
        {
          name: '_competingTxPos',
          type: 'uint256'
        },
        {
          name: '_competingTxInclusionProof',
          type: 'bytes'
        },
        {
          name: '_competingTxSig',
          type: 'bytes'
        }
      ],
      name: 'challengeInFlightExitNotCanonical',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'operator',
      outputs: [
        {
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_inFlightTx',
          type: 'bytes'
        },
        {
          name: '_outputIndex',
          type: 'uint8'
        }
      ],
      name: 'piggybackInFlightExit',
      outputs: [],
      payable: true,
      stateMutability: 'payable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_inFlightTx',
          type: 'bytes'
        },
        {
          name: '_inFlightTxOutputPos',
          type: 'uint256'
        },
        {
          name: '_inFlightTxInclusionProof',
          type: 'bytes'
        },
        {
          name: '_spendingTx',
          type: 'bytes'
        },
        {
          name: '_spendingTxInputIndex',
          type: 'uint8'
        },
        {
          name: '_spendingTxSig',
          type: 'bytes'
        }
      ],
      name: 'challengeInFlightExitOutputSpent',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_tx',
          type: 'bytes'
        }
      ],
      name: 'getInFlightExitId',
      outputs: [
        {
          name: '',
          type: 'uint192'
        }
      ],
      payable: false,
      stateMutability: 'pure',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_inFlightTx',
          type: 'bytes'
        },
        {
          name: '_inputTxs',
          type: 'bytes'
        },
        {
          name: '_inputTxsInclusionProofs',
          type: 'bytes'
        },
        {
          name: '_inFlightTxSigs',
          type: 'bytes'
        }
      ],
      name: 'startInFlightExit',
      outputs: [],
      payable: true,
      stateMutability: 'payable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'nextDepositBlock',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_token',
          type: 'address'
        }
      ],
      name: 'getNextExit',
      outputs: [
        {
          name: '',
          type: 'uint64'
        },
        {
          name: '',
          type: 'uint192'
        },
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'standardExitBond',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_depositTx',
          type: 'bytes'
        }
      ],
      name: 'deposit',
      outputs: [],
      payable: true,
      stateMutability: 'payable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_token',
          type: 'address'
        }
      ],
      name: 'hasToken',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_value',
          type: 'uint256'
        }
      ],
      name: 'flagged',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'pure',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'CHILD_BLOCK_INTERVAL',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_utxoPos',
          type: 'uint192'
        },
        {
          name: '_outputTx',
          type: 'bytes'
        },
        {
          name: '_outputTxInclusionProof',
          type: 'bytes'
        }
      ],
      name: 'startStandardExit',
      outputs: [],
      payable: true,
      stateMutability: 'payable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'inFlightExitBond',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_minExitPeriod',
          type: 'uint256'
        }
      ],
      name: 'init',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_blockRoot',
          type: 'bytes32'
        }
      ],
      name: 'submitBlock',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_txbytes',
          type: 'bytes'
        },
        {
          name: '_utxoPos',
          type: 'uint256'
        }
      ],
      name: 'getStandardExitId',
      outputs: [
        {
          name: '',
          type: 'uint192'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'address'
        }
      ],
      name: 'exitsQueues',
      outputs: [
        {
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_token',
          type: 'address'
        }
      ],
      name: 'addToken',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'minExitPeriod',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'getDepositBlockNumber',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_standardExitId',
          type: 'uint192'
        },
        {
          name: '_challengeTx',
          type: 'bytes'
        },
        {
          name: '_inputIndex',
          type: 'uint8'
        },
        {
          name: '_challengeTxSig',
          type: 'bytes'
        }
      ],
      name: 'challengeStandardExit',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_tx',
          type: 'bytes'
        },
        {
          name: '_txoPos',
          type: 'uint256'
        }
      ],
      name: 'getInFlightExitPriority',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      name: 'blocks',
      outputs: [
        {
          name: 'root',
          type: 'bytes32'
        },
        {
          name: 'timestamp',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_depositTx',
          type: 'bytes'
        }
      ],
      name: 'depositFrom',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: 'feeExitNum',
          type: 'uint256'
        }
      ],
      name: 'getFeeExitId',
      outputs: [
        {
          name: '',
          type: 'uint192'
        }
      ],
      payable: false,
      stateMutability: 'pure',
      type: 'function'
    },
    {
      inputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'blockNumber',
          type: 'uint256'
        }
      ],
      name: 'BlockSubmitted',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'token',
          type: 'address'
        }
      ],
      name: 'TokenAdded',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'depositor',
          type: 'address'
        },
        {
          indexed: true,
          name: 'blknum',
          type: 'uint256'
        },
        {
          indexed: true,
          name: 'token',
          type: 'address'
        },
        {
          indexed: false,
          name: 'amount',
          type: 'uint256'
        }
      ],
      name: 'DepositCreated',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'owner',
          type: 'address'
        },
        {
          indexed: false,
          name: 'exitId',
          type: 'uint192'
        }
      ],
      name: 'ExitStarted',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'exitId',
          type: 'uint192'
        }
      ],
      name: 'ExitFinalized',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'utxoPos',
          type: 'uint256'
        }
      ],
      name: 'ExitChallenged',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'initiator',
          type: 'address'
        },
        {
          indexed: false,
          name: 'txHash',
          type: 'bytes32'
        }
      ],
      name: 'InFlightExitStarted',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'owner',
          type: 'address'
        },
        {
          indexed: false,
          name: 'txHash',
          type: 'bytes32'
        },
        {
          indexed: false,
          name: 'outputIndex',
          type: 'uint8'
        }
      ],
      name: 'InFlightExitPiggybacked',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'challenger',
          type: 'address'
        },
        {
          indexed: false,
          name: 'txHash',
          type: 'bytes32'
        },
        {
          indexed: false,
          name: 'challengeTxPosition',
          type: 'uint256'
        }
      ],
      name: 'InFlightExitChallenged',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'challenger',
          type: 'address'
        },
        {
          indexed: false,
          name: 'txHash',
          type: 'bytes32'
        },
        {
          indexed: false,
          name: 'challengeTxPosition',
          type: 'uint256'
        }
      ],
      name: 'InFlightExitChallengeResponded',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'challenger',
          type: 'address'
        },
        {
          indexed: false,
          name: 'txHash',
          type: 'bytes32'
        },
        {
          indexed: false,
          name: 'outputIndex',
          type: 'uint8'
        }
      ],
      name: 'InFlightExitOutputBlocked',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'inFlightExitId',
          type: 'uint192'
        },
        {
          indexed: false,
          name: 'outputIndex',
          type: 'uint8'
        }
      ],
      name: 'InFlightExitFinalized',
      type: 'event'
    },
    {
      // Extra method from erc20 abi
      name: 'approve',
      type: 'function',
      constant: false,
      inputs: [
        {
          name: '_spender',
          type: 'address'
        },
        {
          name: '_value',
          type: 'uint256'
        }
      ],
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'nonpayable'
    }
  ]
}
