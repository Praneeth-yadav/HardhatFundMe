const { network } = require("hardhat");
const {
  networkConfig,
  developerChains,
  DECIMAL,
  INITIALANSWER,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  if (developerChains.includes(network.name)) {
    log("local network deploying.....");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      args: [DECIMAL, INITIALANSWER],
      log:true,
    });
    log("Mocks deploeyed");
    log("-------------------------------");
  }
};
module.exports.tags=["all","mocks"]

