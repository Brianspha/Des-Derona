require("dotenv").config({
  path: "config/testnet/vars.env",
  encoding: "utf8"
})
const bigNumber = require('bignumber.js')
console.log('new bigNumber(20000000000000000000000000000).toFixed()', new bigNumber(20000000000000000000000000000).toFixed())

console.log('process.env.MNEUMONIC: ', process.env.MNEUMONIC)
// This file contains only the basic configuration you need to run Embark's node
// For additional configurations, see: https://embark.status.im/docs/blockchain_configuration.html
module.exports = {
  // default applies to all environments
  // default applies to all environments
  /*default: {
    enabled: true,
    client: "geth" // Can be ganache-cli, geth or parity (default: geth)
  },*/

  development: {
    client: 'ganache-cli',
    clientConfig: {
      miningMode: 'dev' // Mode in which the node mines. Options: dev, auto, always, off
    }
  },

  privatenet: {
    // Accounts to use as node accounts
    // The order here corresponds to the order of `web3.eth.getAccounts`, so the first one is the `defaultAccount`
    // For more account configurations, see: https://embark.status.im/docs/blockchain_accounts_configuration.html
    accounts: [{
      nodeAccounts: true, // Accounts use for the node
      numAddresses: "1", // Number of addresses/accounts (defaults to 1)
      password: "config/development/password" // Password file for the accounts
    }],
    clientConfig: {
      datadir: ".embark/privatenet/datadir", // Data directory for the databases and keystore
      miningMode: 'auto',
      genesisBlock: "config/privatenet/genesis.json" // Genesis block to initiate on first creation of a development node
    }
  },

  privateparitynet: {
    client: "parity",
    genesisBlock: "config/privatenet/genesis-parity.json",
    datadir: ".embark/privatenet/datadir",
    miningMode: 'off'
  },

  infura: { networkType: "testnet(ropsten)", // Can be: testnet(ropsten), rinkeby, livenet or custom, in which case, it will use the specified networkId
  syncMode: "light",
  networkId: 3,
   accounts: [{
      mnemonic: process.env.MNEUMONIC,
      nodeAccounts: true,

    }]
  },

  testnet: {
    port: false,
    protocol: 'https',
    type: "rpc",
    enabled: true,
    endpoint: process.env.ROPSTEN, // Endpoint of an node to connect to. Can be on localhost or on the internet
    accounts: [{
      mnemonic: process.env.MNEUMONIC,
    }]
  },

  livenet: {
    networkType: "livenet",
    syncMode: "light",
    accounts: [{
      nodeAccounts: true,
      password: "config/livenet/password"
    }]
  }

  // you can name an environment with specific settings and then specify with
  // "embark run custom_name" or "embark blockchain custom_name"
  //custom_name: {
  //}
};