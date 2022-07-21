const Ballot = artifacts.require("./Ballot.sol");

module.exports = function(deployer, network, accounts) {
    let minter = "ACCOUNT_ADDRESS_BY_DEFAULT";

    if (network == "rinkeby") {
        minter = "ACCOUNT_ADDRESS_FOR_RINKEBY";
    } else if (network == "development") {
        minter = accounts[0];
    }

    deployer.deploy(Ballot);
};
