const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");
const { developerChains } = require("../../helper-hardhat-config");

!developerChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async function () {
      let fundme;
      let deployer;
      let MockV3Aggregator;
      let sendValue = ethers.utils.parseEther("1");
      beforeEach(async function () {
        //deploy fundme using hardhat deploy

        //deploynments has a functions called ad fixtures which can be used to deploy all our tags
        // here we give "all" tags specified in deploynment to fixture so that it will deploy our scripts
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fundme = await ethers.getContract("FundMe", deployer);
        MockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });

      describe("Constructor", async function () {
        it("sets the aggregator address correctly", async function () {
          const response = await fundme.getPricefeed();
          assert.equal(response, MockV3Aggregator.address);
        });
      });
      describe("Fund", async function () {
        it("Fail if not enough ETH", async function () {
          await expect(fundme.Fund()).to.be.revertedWith("Not enough funds");
        });
        it("update the amount funded", async function () {
          await fundme.Fund({ value: sendValue });
          const response = await fundme.getAddresstoAmountFunded(deployer);
          assert(response.toString(), sendValue.toString());
        });
        it("add getFunders to array of getFunders", async function () {
          await fundme.Fund({ value: sendValue });
          const getFunders = await fundme.getFunders(0);
          assert.equal(getFunders, deployer);
        });
      });
      describe("Withdraw", async function () {
        beforeEach(async function () {
          await fundme.Fund({ value: sendValue });
        });
        it("Withdraw eth from single funder", async function () {
          //arrange
          const startingFundMeBalance = await fundme.provider.getBalance(
            fundme.address
          );
          const StartingDeployerBalance = await fundme.provider.getBalance(
            deployer
          );
          //act
          const transactionResponse = await fundme.withdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const endingFundMeBalance = await fundme.provider.getBalance(
            fundme.address
          );
          const endingDeployerBalance = await fundme.provider.getBalance(
            deployer
          );

          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gascost = gasUsed.mul(effectiveGasPrice);
          //assert
          assert.equal(endingFundMeBalance, 0);
          assert.equal(
            startingFundMeBalance.add(StartingDeployerBalance).toString(),
            endingDeployerBalance.add(gascost).toString()
          );
        });
        it("Withdraw with multiple accounts", async function () {
          const accounts = await ethers.getSigners();
          for (let i = 1; i < 6; i++) {
            const fundMeConnectedContract = await fundme.connect(accounts[i]);
            await fundMeConnectedContract.Fund({ value: sendValue });
          }
          const startingFundMeBalance = await fundme.provider.getBalance(
            fundme.address
          );
          const StartingDeployerBalance = await fundme.provider.getBalance(
            deployer
          );
          //act
          const transactionResponse = await fundme.withdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const endingFundMeBalance = await fundme.provider.getBalance(
            fundme.address
          );
          const endingDeployerBalance = await fundme.provider.getBalance(
            deployer
          );

          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gascost = gasUsed.mul(effectiveGasPrice);
          //assert
          assert.equal(endingFundMeBalance, 0);
          assert.equal(
            startingFundMeBalance.add(StartingDeployerBalance).toString(),
            endingDeployerBalance.add(gascost).toString()
          );
          //reset getFunders
          await expect(fundme.getFunders(0)).to.be.reverted;

          for (i = 1; i < 6; i++) {
            assert.equal(
              await fundme.getAddresstoAmountFunded(accounts[i].address),
              0
            );
          }
        });
        it("only allows owner to withdraw", async function () {
          const accounts = await ethers.getSigners();
          const attacker = accounts[1];
          const attackerConnect = await fundme.connect(attacker);
          await expect(attackerConnect.withdraw()).to.be.reverted;
        });
      });
    });
