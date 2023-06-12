const networkConfig = {
  4: {
    name: "rinkeby",
    ethUsdPriceFeedAddress: "xyz",
  },
  11155111: {
    name: "sepolia",
    ethUsdPriceFeedAddress: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
};
const developerChains = ["hardhat", "localhost"];
const DECIMAL=8;
const INITIALANSWER=200000000000;
module.exports = { networkConfig, developerChains ,DECIMAL,INITIALANSWER};
