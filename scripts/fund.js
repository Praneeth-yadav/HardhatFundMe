const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  let deployer = (await getNamedAccounts()).deployer;
  let fundme = await ethers.getContract("FundMe", deployer);
  console.log("Funding contract.....");
  const transactionResponse = await fundme.Fund({
    value: ethers.utils.parseEther("0.1"),
  });
  await transactionResponse.wait(1);
  console.log("Funded");
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
