const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const { assert, expect } = require("chai");
const { developerChains } = require("../../helper-hardhat-config");

developerChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async function () {
      let fundme;
      let deployer;
      let sendValue = ethers.utils.parseEther("1");
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        fundme = await ethers.getContract("FundMe", deployer);
      });
      it("will fund and withdraw", async function () {
        await fundme.Fund({ value: sendValue });
        await fundme.withdraw();
        const endingBalance = await fundme.provider.getBalance(fundme.address);
        assert.equal(endingBalance.toSting(), 0);
      });
    });
