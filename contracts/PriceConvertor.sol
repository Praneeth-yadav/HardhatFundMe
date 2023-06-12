//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConvertor {
    function getConversionRates(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethAmountInUSD = (ethAmount * ethPrice) / 1e18;
        //divide by 1e18 as ethAmount and price have 18 deciaml places
        //and so ti will go to 36 0's places if we dont divide
        return ethAmountInUSD;
    }

    // function getVersion(AggregatorV3Interface priceFeed) internal view returns (uint256) {
    //    // https://docs.chain.link/data-feeds/price-feeds/addresses

    //     return priceFeed.version();
    // }

    function getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        //abi
        //address 0x694AA1769357215DE4FAC081bf1f309aDC325306

        (
            ,
            /* uint80 roundID */ int price /*uint startedAt*/ /*uint timeStamp*/ /*uint80 answeredInRound*/,
            ,
            ,

        ) = priceFeed.latestRoundData();
        return uint256(price * 1e10);
    }
}
