const SimpleToken = artifacts.require("SimpleToken.sol");
const Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

contract("SimpleToken", async accounts => {

    it("Token initialization", async () => {

        let account = await web3.eth.getAccounts();
        let instance = await SimpleToken.new(200,"SoloToken", "SOLO",{from:account[0]}); 
        let token_count = await instance.getmaxTokens.call();  
        let token_name = await instance.name();
        let token_symbol = await instance.symbol();
        assert.equal("200", token_count.toString(), "Invalid number of new contract tokens"); 
        assert.equal("SoloToken", token_name.toString(), "Invalid new token name"); 
        assert.equal("SOLO", token_symbol.toString(), "Invalid new token character"); 

    });

});