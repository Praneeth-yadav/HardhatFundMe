//const { version } = require("hardhat");

require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-solhint");
require("@chainlink/hardhat-chainlink");
require("hardhat-deploy");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("solidity-coverage");

/** @type import('hardhat/config').HardhatUserConfig */
const sepolia_rpc_url = process.env.Sepolia_RPC_URL;
const sepolica_private_key = process.env.Sepolia_Private_Key;
const etherscan_api_key = process.env.EtherScan_API_Key;
const coinMarketCap_API_KEY = process.env.Coin_Market_Cap_API_KEY;
module.exports = {
  // exist by default
  // else we have to run using test net
  //command: "npx hardhat run scripts/deploy.js --network sepolia"

  networks: {
    sepolia: {
      url: sepolia_rpc_url,
      accounts: [sepolica_private_key],
      chainId: 11155111,
      blockConfirmations: 6,
    },
  },
  // solidity: "0.8.18",
  solidity: {
    compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
  },
  etherscan: {
    apiKey: etherscan_api_key,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  gasReporter: {
    enabled: false,
    outputFile: "gas-reporter.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: coinMarketCap_API_KEY,
  },
};
