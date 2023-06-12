const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  let deployer = (await getNamedAccounts()).deployer;
  let fundme = await ethers.getContract("FundMe", deployer);
  console.log("Withdrawing from contract.....");
  const transactionResponse = await fundme.withdraw();
  await transactionResponse.wait(1);
  console.log("Withdrawn");
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
