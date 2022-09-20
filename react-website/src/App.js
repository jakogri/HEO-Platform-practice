import React from 'react';
import { useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ProposalsVoting from './pages/proposals_voting';
import Registration from './pages/registration';
import VoteResults from './pages/vote_results';
import Vote from './pages/vote';
import contract from './contracts/Ballot.json';
import Web3Modal from 'web3modal';
const Web3 = require('web3');
var log = require('console-log-level')({
  prefix: function (level) {
    return new Date().toISOString()
  },
  level: 'info'
})

var curContract;
var Account1 = contract.Accounts[0];
var Account2 = contract.Accounts[1];
var Account3 = contract.Accounts[2];

var initWeb3Modal = async() => {
  let rpc = [];
   window.web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions: {
          walletconnect: {
              options: {
                  rpc: rpc,
                  chainId: 5777,
                  qrcodeModalOptions:{
                      mobileLinks:[
                        "metamask",
                        "trust",
                        "safepalwallet",
                        "valora",
                        "mathwallet"
                      ]
                  }
              }
          }
      }
  });
}

class BallotContract{

    constructor(){
    this.myAccaonts = []; 
    this.contractInstans = new Map();
    for (let i = 0; i < contract.Accounts.length; i++){
      this.myAccaonts[i] = contract.Accounts[i];    
    }
   this.voteList = new Array({name: '', yes: 0, no: 0})  
  }

  init = async() => {
    await initWeb3Modal();
    this.provider = await window.web3Modal.connect();
    this.web3 = new Web3(this.provider);
    this.instans = new this.web3.eth.Contract(contract.abi, contract.ContractAddress);
    await this.setvoteList();
  }

  registration = async(account) => {
   log.info(this.instans); 
   await this.instans.methods.Registration().send({
      from: account, 
      value: this.web3.utils.toWei("0.01", "ether"),
      gas: "2441177",
      gasPrice: this.web3.utils.toWei("20", "gwei") 
    });
   }

   getAccountBalans = async(account) => {
     const variable = await this.instans.methods.balanceOf(account).call();
    return(variable);
   }

   newproposal = async (name_proposal, account) => {
     await this.instans.methods.NewProposal(name_proposal).send({from:account});
   }

   getproposallist = async() => {
    let result = await this.instans.methods.GetBallotsResults().call();    
    return(result);
   }

   getproposallength = async() => {
    let result = await this.instans.methods.GetProposallength().call();
    return(result);
   }

   setvoteList = async() => {
    this.voteList.length = 0;
    let result = await this.getproposallist();
    let in_name = await result[0];
    let in_yes = result[1];
    let in_no = result[2]
    let count = await this.getproposallength();
    if (count == 0) return;
    for (let i = 0; i < count; i++ ){
      this.voteList.push({name: in_name[i], yes: in_yes[i], no: in_no[i]});
     }
   }

   votefor = async(name_proposal, account) =>{
    await this.instans.methods.BallotFor(name_proposal).send({from:account});
  }

  voteagainst = async(name_proposal, account) =>{
    await this.instans.methods.BallotAgainst(name_proposal).send({from:account});
  }
}



function App (){
  useEffect(() => {
  curContract = new BallotContract();
  curContract.init(); 
  }, []);

return (
    <Router>
    <Navbar />
    <Routes>
        <Route path='/registration' element={<Registration/>} />
        <Route path='/proposals_voting' element={<ProposalsVoting/>} />
        <Route path='/vote' element={<Vote/>} />
        <Route path='/vote_results' element={<VoteResults/>} />
    </Routes>
    </Router>
);    
}
export {curContract, Account1, Account2, Account3};
export default App;
