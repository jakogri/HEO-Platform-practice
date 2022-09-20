import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {curContract} from '../App';

class Vote extends Component{

  constructor(props) {
    super(props);
    this.state = {
          account: '',
          tokens: '',
          yes: [],
          no: []
    };
    for (let i = 0; i < curContract.voteList.length; i++ ){
      this.state.yes.push(parseInt(curContract.voteList[i].yes));
      this.state.no.push(parseInt(curContract.voteList[i].no));
    }
  }

  setCurAccount = async(value) => {
    console.log(value);   
    this.setState({account: value});
    const balans = await curContract.getAccountBalans(value.toLowerCase());
    this.setState({tokens: balans});
  
  }

  yesClick = async(i) => {
    if(curContract.instans._provider.selectedAddress.toLowerCase() != this.state.account.toLowerCase()){
      window.alert('Смените текущий счёт в MetaMask!');
      return;
    }
    if (this.state.tokens < 1){
      window.alert('Вы не можете голосовать в виду недостатка средств!');
      return;
    }
    const curYes = this.state.yes[i] + 1;
    const newYes = [...this.state.yes];
    newYes[i] = curYes;
    this.setState({ yes:newYes });
   await curContract.votefor(curContract.voteList[i].name, this.state.account.toLowerCase());
   await curContract.setvoteList();
  };

  noClick = async(i) =>{
    if(curContract.instans._provider.selectedAddress.toLowerCase() != this.state.account.toLowerCase()){
      window.alert('Смените текущий счёт в MetaMask!');
      return;
    }
    const curNo = this.state.no[i] + 1;
    const newNo = [...this.state.no];
    newNo[i] = curNo;
    this.setState({ no:newNo });
    await curContract.voteagainst(curContract.voteList[i].name, this.state.account.toLowerCase());
    await curContract.setvoteList();
  };

  render() {

    let content = [];
   
    content.push(
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
      </div>
    );
    
    for (let i = 0; i < curContract.voteList.length; i++ )
    {
      var n_bt_yes = "bt_yes"+curContract.voteList[i].name;
      var n_inp_yes = "inp_yes"+curContract.voteList[i].name;
      var n_bt_no = "bt_no"+curContract.voteList[i].name;
      var n_inp_no = "inp_no"+curContract.voteList[i].name;
      content.push(
        <div>
          <label>{curContract.voteList[i].name}</label>
          <button id = {n_bt_yes} onClick={() => this.yesClick(i)}>Vote Yes</button>
          <input id = {n_inp_yes} type="number" readonly="true" value = {this.state.yes[i]} />
          <button id = {n_bt_no} onClick={() => this.noClick(i)}>Vote No</button>
          <input id = {n_inp_no} type="number" readonly="true" value = {this.state.no[i]}/>
          <br/>
        </div>
        );

    }
    return(content);
  }





}

export default Vote;
