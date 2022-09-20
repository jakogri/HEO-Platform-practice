import {React, Component}  from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {curContract} from '../App';


class Registration  extends Component{

  constructor(props){
    super(props);
    this.state = {
      account: '',
      value: ''  
   };   
  }

  setCurAccount = async(value) => {

    this.setState({account: value});
    const balans = await curContract.getAccountBalans(value.toLowerCase());
    this.setState({value: balans});
  
  }



  registrationClick = async() => {
   if(curContract.instans._provider.selectedAddress.toLowerCase() != this.state.account.toLowerCase()){
      window.alert('Смените текущий счёт в MetaMask!');
      return;
    }
    await curContract.registration(this.state.account.toLowerCase());
    const balans = await curContract.getAccountBalans(this.state.account.toLowerCase());
    this.setState({value: balans});
   
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
      <input type="text" readonly="true" value = {this.state.value}/>
      <button id = 'reg_button' onClick={() => this.registrationClick()}>Register</button>
      </div>
    );
  };

};

   export default Registration;
