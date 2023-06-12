// async function deployFundMe(){
//     console.log("hi");

const { network } = require("hardhat");
const { networkConfig, developerChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

// }
// module.exports.default=deployFundMe

// module.exports=async(hre)=>{

//     const{getNamedAccounts,deployments}=hre;

// }

//can also be written as

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // const priceFeedAddress = networkConfig[chainId]["ethUsdPriceFeedAddress"];
  //for local testing we will create a mock because it will not have any aggregatorinterface price feed address
  //

  let priceFeedAddress;
  if (developerChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    priceFeedAddress = ethUsdAggregator.address;
  } else {
    priceFeedAddress = networkConfig[chainId]["ethUsdPriceFeedAddress"];
  }
  const args = [priceFeedAddress];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args, //we are sending aggregator address in consutructor so we have to send it in args
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developerChains.includes(network.name) &&
    process.env.EtherScan_API_Key
  ) {
    await verify(fundMe.address, args);
  }
};
module.exports.tags = ["all", "fundme"];
