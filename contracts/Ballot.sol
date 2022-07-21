// SPDX-License-Identifier: MITD2KG7CNX
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Ballot is ERC20{

    address private owner;
    uint256 public tokensSold;
    
    event Create(address login);

    string private _name;
    string private _symbol;

    struct Proposal {
        string name_prop; // short name 
        uint256 voteCountFor; //number of accumulated votes for the proposal
        uint256 voteCountAgainst; //number of accumulated votes for the proposal
        address owner_prop; // Proposal owner
    }
  
    Proposal[] proposal_array; 
    mapping(string => uint256) private proposal_map;
     
    uint256 private INITIAL_SUPPLY = 666666;
    event Sold(address buyer, uint256 amount);
    event Approve(address owner, address spender, uint256 value);

    constructor() public ERC20("Ballot", "BAL"){
      owner = msg.sender;
      _mint(msg.sender, 100);
    }

   // function decimals() public view virtual override returns (uint8) {
   //     return 6;
   // }

    function GetProposalByNumber (uint number) public view  returns(string memory, uint256, uint256) {
      string memory name_cur =  proposal_array[number].name_prop;
      uint256 voteCounFor_cur =proposal_array[number].voteCountFor;
      uint256 voteCountAgainst_cur = proposal_array[number].voteCountAgainst;
      return (name_cur, voteCounFor_cur, voteCountAgainst_cur);
    }

    function GetProposalByName (string memory name_) public view  returns(string memory, uint256, uint256) {
      if (proposal_map[name_] > 0){
         uint256 voteCounFor_cur = proposal_array[proposal_map[name_] - 1].voteCountFor;
         uint256 voteCountAgainst_cur = proposal_array[proposal_map[name_] - 1].voteCountAgainst;
         return (name_, voteCounFor_cur, voteCountAgainst_cur);
       }
      return ("" , 0, 0);
    }

    function GetProposallength () public view returns(uint) {
      return proposal_array.length;
    }

    //Receiving tokens by the user in exchange for ETH
    function Registration() public payable {
       
      uint256 scalePrice = safeMultiply(10, 10e14);
      uint256 tokenCount = msg.value/10e14;
      require(msg.value >= scalePrice);
      require(balanceOf(owner) >= tokenCount);
      _approve(owner, msg.sender, 10);
      transferFrom(owner, msg.sender, 10);
      
    }

    // Guards against integer overflows
    function safeMultiply(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        } else {
            uint256 c = a * b;
            assert(c / a == b);
            return c;
        }
    }



     //Putting a new offer up for a vote in exchange for 2 tokens
    function NewProposal(string memory name_) public payable returns(uint) {

      if (proposal_map[name_] > 0) return(0);
      require(balanceOf(msg.sender) >= 2);
      approve(msg.sender, 2);
      transferFrom(msg.sender, owner, 2);
      proposal_array.push();
      uint j = GetProposallength();
      proposal_array[j-1].name_prop = name_;
      proposal_array[j-1].voteCountAgainst = 0;
      proposal_array[j-1].voteCountFor = 0;
      proposal_array[j-1].owner_prop = msg.sender;
      proposal_map[name_] = j;
      return (j);
           
    }  
    
    //Voting for a proposal with the removal of one token from the voter and 
    //sending 2 tokens to the owner of the proposal
    function BallotFor(string memory name_) public payable returns(uint256) {
     
      if (proposal_map[name_] > 0)
       { 
        uint256 j = proposal_map[name_]; 
        approve(msg.sender, 1);
        transferFrom(msg.sender, owner, 1);  
        proposal_array[j-1].voteCountFor = proposal_array[j-1].voteCountFor + 1;
        approve(proposal_array[j-1].owner_prop, 2);
        transfer(proposal_array[j-1].owner_prop, 2); 
        return (proposal_array[j-1].voteCountFor);
       } 
     else return 0;
     
    }

   //Voting against a motion removing one token from a voter
    function BallotAgainst(string memory name_) public payable returns(uint256) {

      if (proposal_map[name_] > 0)
       { 
        uint256 j = proposal_map[name_]; 
         approve(msg.sender, 1);
        transferFrom(msg.sender, owner, 1);  
        proposal_array[j-1].voteCountAgainst = proposal_array[j-1].voteCountAgainst + 1;
        return (proposal_array[j-1].voteCountAgainst);
       } 
     else return 0;

    }

    //View voting results
    function GetBallotsResults() public view returns(string[] memory, uint256[] memory, uint256[] memory) {
         string[] memory name_cur= new string[](proposal_array.length);
         uint256[] memory voteCounFor_cur = new uint256[](proposal_array.length);
         uint256[] memory voteCountAgainst_cur = new uint256[](proposal_array.length);
         for(uint i = 0; i < proposal_array.length; i++){
           name_cur[i] = proposal_array[i].name_prop;
           voteCounFor_cur[i] = proposal_array[i].voteCountFor;
           voteCountAgainst_cur[i] = proposal_array[i].voteCountAgainst;
         }
        return(name_cur, voteCounFor_cur, voteCountAgainst_cur);
    } 

    //View Quotation List
    function GetBallotsList() public view returns(string[] memory) {
         string[] memory name = new string[](proposal_array.length);
         for(uint i = 0; i < proposal_array.length; i++)
            name[i] = string(string(proposal_array[i].name_prop));
         return(name);
    } 
}

