import {React, Component} from "react";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {curContract} from '../App';

class ProposalsVoting  extends Component{

  constructor(props){
    super(props);
    this.state = {
      account: '',
      tokens: '',
      proposal: '' 
   };   
  }

  setCurAccount = async(value) => {
    console.log(value);   
    this.setState({account: value});
    const balans = await curContract.getAccountBalans(value.toLowerCase());
    this.setState({tokens: balans});
  
  }

  setNewVote = (value) => {
    console.log(value); 
    this.setState({proposal: value});
       
  }

  newVoteClick = async() => {
    if(curContract.instans._provider.selectedAddress.toLowerCase() != this.state.account.toLowerCase()){
      window.alert('Смените текущий счёт в MetaMask!');
      return;
    }
    if (this.state.tokens < 2){
      window.alert('Вы не можете ввести предложение в виду недостатка средств!');
      return;
    }
    await curContract.newproposal(this.state.proposal, this.state.account.toLowerCase());
    const balans = await curContract.getAccountBalans(this.state.account.toLowerCase());
    this.setState({tokens: balans});
    await curContract.setvoteList();
  }

  render() {
  return (
    <div>
    <label>Select an account to sign up for</label>
      <Autocomplete
	  	options={curContract.myAccaonts}
      style={{ width: 500 }}
      onChange={(event, newValue) => {this.setCurAccount(newValue);}} 
      renderInput={(params) =>
		  <TextField {...params} 
      label="" 
      variant="outlined" 
      name = "thisText"
      />}
	    />  
    <label>Number of tokens per client</label>
    <input type="text" readonly="true" value = {this.state.tokens} /> 
    <br/> 
    <label>Quotation Description:</label>
    <br/>
    <textarea type="text" cols="45" rows="5" defaultValue='' onChange={(event) => {this.setNewVote(event.target.value);}} />
    <br/>
    <input type="number" defaultValue='0' />
    <br/>
    <button id = 'propose_button' onClick={() => this.newVoteClick()}>Propose Vote</button>
    </div>
  );
};
}

export default ProposalsVoting;
