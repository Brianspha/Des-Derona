require("dotenv").config({
    path: "config/testnet/vars.env",
    encoding: "utf8"
})
const bigNumber = require('bignumber.js')
console.log('new bigNumber(20000000000000000000000000000).toFixed()', new bigNumber(20000000000000000000000000000).toFixed())
module.exports = {
    // default applies to all environments
    default: {
        // order of connections the dapp should connect to
        dappConnection: [
            "$EMBARK",
            "$WEB3", // uses pre existing web3 object if available (e.g in Mist)
            "ws://localhost:8546",
            "http://localhost:8546"
        ],

        // Automatically call `ethereum.enable` if true.
        // If false, the following code must run before sending any transaction: `await EmbarkJS.enableEthereum();`
        // Default value is true.
        // dappAutoEnable: true,

        gas: "auto",

        // Strategy for the deployment of the contracts:
        // - implicit will try to deploy all the contracts located inside the contracts directory
        //            or the directory configured for the location of the contracts. This is default one
        //            when not specified
        // - explicit will only attempt to deploy the contracts that are explicitly specified inside the
        //            contracts section.
        // strategy: 'implicit',

        // minimalContractSize, when set to true, tells Embark to generate contract files without the heavy bytecodes
        // Using filteredFields lets you customize which field you want to filter out of the contract file (requires minimalContractSize: true)
        // minimalContractSize: false,
        // filteredFields: [],
        strategy: 'implicit',
        deploy: {
            ERC20: {
                args: [
                    "RonaToken",
                    "RT",
                    18,
                    new bigNumber(20000000000000000000000000000).toFixed()
                ]
            },
            "DesDarona": {
                args: []
            },
            CTokenManager: {
                args: []
            },
            "Sablier": {
                deps: ['ERC20'],
                args: ['$CTokenManager'],
                onDeploy: async ({
                    contracts,
                    web3,
                    logger
                }) => {
                    await contracts.ERC20.methods.approve(contracts.Sablier.options.address, new bigNumber(20000000000000000000000000000).toFixed()).send({
                        gas: 800000
                    })
                    console.log('approved token...')

                }
            }
        }
    },
    development: {
        deploy: {

        }
    },
    testnet: {
        gas: "6500000",
        deploy: {
            "ERC20": {
                address: '0xb5581d6da59d34f9f4b31df8f397b80cceec9c1c',
                abiDefinition:[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x06fdde03"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x095ea7b3"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x18160ddd"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x23b872dd"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x313ce567"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x39509351"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x70a08231"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x95d89b41"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xa457c2d7"},{"constant":false,"inputs":[{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xa9059cbb"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xdd62ed3e"},{"inputs":[{"name":"name","type":"string"},{"name":"symbol","type":"string"},{"name":"decimals","type":"uint8"},{"name":"initialsupply","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor","name":"constructor","signature":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event","signature":"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event","signature":"0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"}]
            },
            "DesDarona": {
                args: []
            },
            CTokenManager: {
                args: []
            },
            "Sablier": {
                deps: ['ERC20'],
                address: '0xc04Ad234E01327b24a831e3718DBFcbE245904CC',
                abiDefinition: [{
                    "constant": true,
                    "inputs": [{
                        "internalType": "address",
                        "name": "tokenAddress",
                        "type": "address"
                    }],
                    "name": "getEarnings",
                    "outputs": [{
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0x131b9c04"
                }, {
                    "constant": true,
                    "inputs": [],
                    "name": "nextStreamId",
                    "outputs": [{
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0x1e99d569"
                }, {
                    "constant": true,
                    "inputs": [{
                        "internalType": "uint256",
                        "name": "streamId",
                        "type": "uint256"
                    }],
                    "name": "getCompoundingStream",
                    "outputs": [{
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    }, {
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    }, {
                        "internalType": "uint256",
                        "name": "deposit",
                        "type": "uint256"
                    }, {
                        "internalType": "address",
                        "name": "tokenAddress",
                        "type": "address"
                    }, {
                        "internalType": "uint256",
                        "name": "startTime",
                        "type": "uint256"
                    }, {
                        "internalType": "uint256",
                        "name": "stopTime",
                        "type": "uint256"
                    }, {
                        "internalType": "uint256",
                        "name": "remainingBalance",
                        "type": "uint256"
                    }, {
                        "internalType": "uint256",
                        "name": "ratePerSecond",
                        "type": "uint256"
                    }, {
                        "internalType": "uint256",
                        "name": "exchangeRateInitial",
                        "type": "uint256"
                    }, {
                        "internalType": "uint256",
                        "name": "senderSharePercentage",
                        "type": "uint256"
                    }, {
                        "internalType": "uint256",
                        "name": "recipientSharePercentage",
                        "type": "uint256"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0x2b8a119d"
                }, {
                    "constant": true,
                    "inputs": [{
                        "internalType": "uint256",
                        "name": "streamId",
                        "type": "uint256"
                    }, {
                        "internalType": "address",
                        "name": "who",
                        "type": "address"
                    }],
                    "name": "balanceOf",
                    "outputs": [{
                        "internalType": "uint256",
                        "name": "balance",
                        "type": "uint256"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0x3656eec2"
                }, {
                    "constant": false,
                    "inputs": [],
                    "name": "unpause",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x3f4ba83a"
                }, {
                    "constant": true,
                    "inputs": [{
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }],
                    "name": "isPauser",
                    "outputs": [{
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0x46fbf68e"
                }, {
                    "constant": true,
                    "inputs": [],
                    "name": "paused",
                    "outputs": [{
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0x5c975abb"
                }, {
                    "constant": false,
                    "inputs": [{
                        "internalType": "uint256",
                        "name": "streamId",
                        "type": "uint256"
                    }],
                    "name": "cancelStream",
                    "outputs": [{
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x6db9241b"
                }, {
                    "constant": false,
                    "inputs": [{
                        "internalType": "uint256",
                        "name": "streamId",
                        "type": "uint256"
                    }, {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }],
                    "name": "withdrawFromStream",
                    "outputs": [{
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x7a9b2c6c"
                }, {
                    "constant": false,
                    "inputs": [],
                    "name": "initialize",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x8129fc1c"
                }, {
                    "constant": false,
                    "inputs": [{
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    }, {
                        "internalType": "uint256",
                        "name": "deposit",
                        "type": "uint256"
                    }, {
                        "internalType": "address",
                        "name": "tokenAddress",
                        "type": "address"
                    }, {
                        "internalType": "uint256",
                        "name": "startTime",
                        "type": "uint256"
                    }, {
                        "internalType": "uint256",
                        "name": "stopTime",
                        "type": "uint256"
                    }, {
                        "internalType": "uint256",
                        "name": "senderSharePercentage",
                        "type": "uint256"
                    }, {
                        "internalType": "uint256",
                        "name": "recipientSharePercentage",
                        "type": "uint256"
                    }],
                    "name": "createCompoundingStream",
                    "outputs": [{
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x8195aeaa"
                }, {
                    "constant": false,
                    "inputs": [{
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }],
                    "name": "addPauser",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x82dc1ec4"
                }, {
                    "constant": false,
                    "inputs": [],
                    "name": "pause",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x8456cb59"
                }, {
                    "constant": true,
                    "inputs": [{
                        "internalType": "uint256",
                        "name": "streamId",
                        "type": "uint256"
                    }],
                    "name": "getStream",
                    "outputs": [{
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    }, {
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    }, {
                        "internalType": "uint256",
                        "name": "deposit",
                        "type": "uint256"
                    }, {
                        "internalType": "address",
                        "name": "tokenAddress",
                        "type": "address"
                    }, {
                        "internalType": "uint256",
                        "name": "startTime",
                        "type": "uint256"
                    }, {
                        "internalType": "uint256",
                        "name": "stopTime",
                        "type": "uint256"
                    }, {
                        "internalType": "uint256",
                        "name": "remainingBalance",
                        "type": "uint256"
                    }, {
                        "internalType": "uint256",
                        "name": "ratePerSecond",
                        "type": "uint256"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0x894e9a0d"
                }, {
                    "constant": false,
                    "inputs": [{
                        "internalType": "uint256",
                        "name": "streamId",
                        "type": "uint256"
                    }, {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }],
                    "name": "interestOf",
                    "outputs": [{
                        "internalType": "uint256",
                        "name": "senderInterest",
                        "type": "uint256"
                    }, {
                        "internalType": "uint256",
                        "name": "recipientInterest",
                        "type": "uint256"
                    }, {
                        "internalType": "uint256",
                        "name": "sablierInterest",
                        "type": "uint256"
                    }],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x8c9a3252"
                }, {
                    "constant": true,
                    "inputs": [],
                    "name": "owner",
                    "outputs": [{
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0x8da5cb5b"
                }, {
                    "constant": true,
                    "inputs": [],
                    "name": "isOwner",
                    "outputs": [{
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0x8f32d59b"
                }, {
                    "constant": false,
                    "inputs": [{
                        "internalType": "uint256",
                        "name": "feePercentage",
                        "type": "uint256"
                    }],
                    "name": "updateFee",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0x9012c4a8"
                }, {
                    "constant": true,
                    "inputs": [{
                        "internalType": "uint256",
                        "name": "streamId",
                        "type": "uint256"
                    }],
                    "name": "isCompoundingStream",
                    "outputs": [{
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0xa734d51b"
                }, {
                    "constant": true,
                    "inputs": [{
                        "internalType": "uint256",
                        "name": "streamId",
                        "type": "uint256"
                    }],
                    "name": "deltaOf",
                    "outputs": [{
                        "internalType": "uint256",
                        "name": "delta",
                        "type": "uint256"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0xa82ccd4d"
                }, {
                    "constant": false,
                    "inputs": [{
                        "internalType": "address",
                        "name": "tokenAddress",
                        "type": "address"
                    }, {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }],
                    "name": "takeEarnings",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0xc1eb9ee0"
                }, {
                    "constant": false,
                    "inputs": [{
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    }],
                    "name": "initialize",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0xc4d66de8"
                }, {
                    "constant": false,
                    "inputs": [{
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    }, {
                        "internalType": "uint256",
                        "name": "deposit",
                        "type": "uint256"
                    }, {
                        "internalType": "address",
                        "name": "tokenAddress",
                        "type": "address"
                    }, {
                        "internalType": "uint256",
                        "name": "startTime",
                        "type": "uint256"
                    }, {
                        "internalType": "uint256",
                        "name": "stopTime",
                        "type": "uint256"
                    }],
                    "name": "createStream",
                    "outputs": [{
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0xcc1b4bf6"
                }, {
                    "constant": true,
                    "inputs": [],
                    "name": "cTokenManager",
                    "outputs": [{
                        "internalType": "contract ICTokenManager",
                        "name": "",
                        "type": "address"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0xd2cba55c"
                }, {
                    "constant": true,
                    "inputs": [],
                    "name": "fee",
                    "outputs": [{
                        "internalType": "uint256",
                        "name": "mantissa",
                        "type": "uint256"
                    }],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function",
                    "signature": "0xddca3f43"
                }, {
                    "constant": false,
                    "inputs": [{
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }],
                    "name": "transferOwnership",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function",
                    "signature": "0xf2fde38b"
                }, {
                    "inputs": [{
                        "internalType": "address",
                        "name": "cTokenManagerAddress",
                        "type": "address"
                    }],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "constructor",
                    "signature": "constructor"
                }, {
                    "anonymous": false,
                    "inputs": [{
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "streamId",
                        "type": "uint256"
                    }, {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "exchangeRate",
                        "type": "uint256"
                    }, {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "senderSharePercentage",
                        "type": "uint256"
                    }, {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "recipientSharePercentage",
                        "type": "uint256"
                    }],
                    "name": "CreateCompoundingStream",
                    "type": "event",
                    "signature": "0xa9bbfc8562a8e1e6b889a428f128c90ed60c6204c37e4fb4354a202b4db59204"
                }, {
                    "anonymous": false,
                    "inputs": [{
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "streamId",
                        "type": "uint256"
                    }, {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "senderInterest",
                        "type": "uint256"
                    }, {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "recipientInterest",
                        "type": "uint256"
                    }, {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "sablierInterest",
                        "type": "uint256"
                    }],
                    "name": "PayInterest",
                    "type": "event",
                    "signature": "0x5a8a03e48302e0bd2e011a3a2b54d1f849c55497f462f404bf52dce4290456b5"
                }, {
                    "anonymous": false,
                    "inputs": [{
                        "indexed": true,
                        "internalType": "address",
                        "name": "tokenAddress",
                        "type": "address"
                    }, {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }],
                    "name": "TakeEarnings",
                    "type": "event",
                    "signature": "0x13e8af02ad3e36f8d82fc8b86dcd67b7ed11f718f0e52fb245d2038eb71856ba"
                }, {
                    "anonymous": false,
                    "inputs": [{
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "fee",
                        "type": "uint256"
                    }],
                    "name": "UpdateFee",
                    "type": "event",
                    "signature": "0x38e229a7f3f9c329892d08eb37c4e91ccac6d12c798d394990ca4f56028ec266"
                }, {
                    "anonymous": false,
                    "inputs": [{
                        "indexed": false,
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }],
                    "name": "Paused",
                    "type": "event",
                    "signature": "0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258"
                }, {
                    "anonymous": false,
                    "inputs": [{
                        "indexed": false,
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }],
                    "name": "Unpaused",
                    "type": "event",
                    "signature": "0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa"
                }, {
                    "anonymous": false,
                    "inputs": [{
                        "indexed": true,
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }],
                    "name": "PauserAdded",
                    "type": "event",
                    "signature": "0x6719d08c1888103bea251a4ed56406bd0c3e69723c8a1686e017e7bbe159b6f8"
                }, {
                    "anonymous": false,
                    "inputs": [{
                        "indexed": true,
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }],
                    "name": "PauserRemoved",
                    "type": "event",
                    "signature": "0xcd265ebaf09df2871cc7bd4133404a235ba12eff2041bb89d9c714a2621c7c7e"
                }, {
                    "anonymous": false,
                    "inputs": [{
                        "indexed": true,
                        "internalType": "address",
                        "name": "previousOwner",
                        "type": "address"
                    }, {
                        "indexed": true,
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }],
                    "name": "OwnershipTransferred",
                    "type": "event",
                    "signature": "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"
                }, {
                    "anonymous": false,
                    "inputs": [{
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "streamId",
                        "type": "uint256"
                    }, {
                        "indexed": true,
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    }, {
                        "indexed": true,
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    }, {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "deposit",
                        "type": "uint256"
                    }, {
                        "indexed": false,
                        "internalType": "address",
                        "name": "tokenAddress",
                        "type": "address"
                    }, {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "startTime",
                        "type": "uint256"
                    }, {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "stopTime",
                        "type": "uint256"
                    }],
                    "name": "CreateStream",
                    "type": "event",
                    "signature": "0x7b01d409597969366dc268d7f957a990d1ca3d3449baf8fb45db67351aecfe78"
                }, {
                    "anonymous": false,
                    "inputs": [{
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "streamId",
                        "type": "uint256"
                    }, {
                        "indexed": true,
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    }, {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }],
                    "name": "WithdrawFromStream",
                    "type": "event",
                    "signature": "0x36c3ab437e6a424ed25dc4bfdeb62706aa06558660fab2dab229d2555adaf89c"
                }, {
                    "anonymous": false,
                    "inputs": [{
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "streamId",
                        "type": "uint256"
                    }, {
                        "indexed": true,
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    }, {
                        "indexed": true,
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    }, {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "senderBalance",
                        "type": "uint256"
                    }, {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "recipientBalance",
                        "type": "uint256"
                    }],
                    "name": "CancelStream",
                    "type": "event",
                    "signature": "0xca3e6079b726e7728802a0537949e2d1c7762304fa641fb06eb56daf2ba8c6b9"
                }],
                onDeploy: async ({
                    contracts,
                    web3,
                    logger
                }) => {
                    var startDate = new bigNumber(new Date().getTime())
                    var endDate = new bigNumber(startDate() * 100)
                    var timedelta = endDate.minus(startDate)
                    var deposit = new bigNumber(20000000000000000000000000000)
                    var diff = deposit.minus(deposit.minus(deposit.mod(delta)))
                    deposit = new bigNumber(deposit).minus(diff)
                    deposit =deposit.toFixed()
                    console.log('deposit: ',deposit)
                    await contracts.ERC20.methods.approve(contracts.Sablier.options.address, deposit).send({
                        gas: 8000000
                    })
                    console.log('approved token...')

                }
            }
        }
    },
    // merges with the settings in default
    // used with "embark run privatenet"
    privatenet: {},

    // you can name an environment with specific settings and then specify with
    // "embark run custom_name" or "embark blockchain custom_name"
    // custom_name: {}
}