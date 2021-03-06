# Shifter Smart Contracts

[![Build Status](https://travis-ci.org/republicprotocol/shifter-sol.svg?branch=master)](https://travis-ci.org/republicprotocol/shifter-sol)
[![Coverage Status](https://coveralls.io/repos/github/republicprotocol/shifter-sol/badge.svg?branch=master)](https://coveralls.io/github/republicprotocol/shifter-sol?branch=master)

## Tests

Install the dependencies.

```
yarn install
```

Run the `ganache-cli` or an alternate Ethereum test RPC server on port 8545. The `-d` flag will use a deterministic mnemonic for reproducibility.

```sh
yarn exec ganache-cli -d
```

Run the Truffle test suite.

```sh
yarn test
```

## Coverage

Install the dependencies.

```
yarn install
```

Run the Truffle test suite with coverage.

```sh
yarn coverage
```

## Deploying to Kovan

Add a `.env`, filling in the mnemonic and Kovan ethereum node (e.g. Infura):

```sh
MNEMONIC="..."
KOVAN_ETHEREUM_NODE="..."
ETHERSCAN_KEY="..."
```

Deploy to Kovan:

```sh
NETWORK=testnet yarn run deploy
```

## Verifying Contract Code

```sh
NETWORK=testnet yarn run verify DEX DEXAdapter BTC_DAI_Reserve ZEC_DAI_Reserve
```
