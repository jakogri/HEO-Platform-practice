const Ballot = artifacts.require("Ballot.sol");
const Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

contract("Ballot", async accounts => {
  
    it("should call the user registration function", async () => {
      
      let account = await web3.eth.getAccounts();
      let instance = await Ballot.deployed({from:account[0]});
      let balance1 = await instance.balanceOf.call(instance.address);
      let account_one_starting_balance  = await instance.balanceOf.call(account[1]);
      await instance.approve(account[1],10);
      await instance.Registration({from: account[1], value:web3.utils.toWei("0.01", "ether")});
      let balance2 = await web3.eth.getBalance(instance.address);
      let  account_one_ending_balance = await instance.balanceOf.call(account[1]);
      assert.equal(Number(balance2), Number(balance1) + web3.utils.toWei("0.01", "ether"), "Incorrect ETH transmission");
      assert.equal(Number(account_one_ending_balance), Number(account_one_starting_balance) + 10,  "Incorrect Tokens transmission");
     
    });
   
    it("should call the user NewProposal function", async () => {

      let account = await web3.eth.getAccounts();
      let instance = await Ballot.deployed({from:account[0]});
      let account_one_starting_balance = await instance.balanceOf.call(account[0]);
      let propCountStart = await instance.GetProposallength.call();
      await instance.approve(account[1],10);
      await instance.Registration({from: account[1], value:web3.utils.toWei("0.01", "ether")});
      await instance.approve(account[0], 2);
      await instance.NewProposal("New Proposal",{from: account[1], value:web3.utils.toWei("0.01", "ether")});
      let account_one_ending_balance  = await instance.balanceOf.call(account[0]);
      let propCountFinish = await instance.GetProposallength.call({from: instance.address});
      var ar  = await instance.GetProposalByNumber.call(propCountFinish.toNumber() - 1); 
      assert.equal('New Proposal', ar[0].toString(), "New Sentence Name Not Inserted Correctly");
      assert.equal('0', ar[1].toString(), "The number of votes for the new proposal was inserted incorrectly");
      assert.equal('0', ar[2].toString(), "Incorrectly inserted the number of votes against the new proposal");
      assert.equal(propCountStart.toNumber(), propCountFinish.toNumber() - 1, "Incorrect number of offers added");
      assert.equal(account_one_ending_balance.toNumber(), account_one_starting_balance.toNumber() + 2 - 10, "Invalid number of tokens removed from client");

    });
   
    it("should call the user BallotFor function", async () => {
     
      let account = await web3.eth.getAccounts();
      let name = "New Proposal for";
      let instance = await Ballot.deployed({from:account[0]});
      await instance.approve(account[1],10);
      await instance.Registration({from: account[1], value:web3.utils.toWei("0.01", "ether")});
      await instance.approve(account[2],10);
      await instance.Registration({from: account[2], value:web3.utils.toWei("0.01", "ether")});
      await instance.approve(account[0], 2);
      await instance.NewProposal(name, {from: account[1], value:web3.utils.toWei("0.01", "ether")});
      let account_one_starting_balance = await instance.balanceOf.call(account[1]);
      await instance.approve(account[0], 1);
      await instance.approve(account[2], 2);
      await instance.BallotFor(name, {from: account[2], gas: 5000000, gasPrice: 500000000, value:web3.utils.toWei("0.02", "ether")}); 
      let account_one_ending_balance  = await instance.balanceOf.call(account[1]);
      var ar = await instance.GetProposalByName.call(name);
      assert.equal('1', ar[1].toString(), "The number of votes for is incorrectly");
      assert.equal(account_one_ending_balance.toNumber() , account_one_starting_balance.toNumber() + 2, "The balance of the owner of the proposal has not increased correctly");

    });
   
    it("should call the user BallotAgainst function", async () => {
     
      let account = await web3.eth.getAccounts();
      let name = "New Proposal against";
      let instance = await Ballot.deployed({from:account[0]});
      await instance.approve(account[1],10);
      await instance.Registration({from: account[1], value:web3.utils.toWei("0.01", "ether")});
      await instance.approve(account[2],10);
      await instance.Registration({from: account[2], value:web3.utils.toWei("0.01", "ether")});
      await instance.approve(account[0], 2);
      await instance.NewProposal(name, {from: account[1], value:web3.utils.toWei("0.01", "ether")});
      await instance.approve(account[0], 1);
      await instance.BallotAgainst(name, {from: account[2], gas: 5000000, gasPrice: 500000000, value:web3.utils.toWei("0.02", "ether")});
      var ar = await instance.GetProposalByName.call(name);
      assert.equal('1', ar[2].toString(), "The number of votes against is incorrectly");

    });
  
});    