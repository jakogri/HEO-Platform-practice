import React, { Component }  from 'react';
import {curContract} from '../App';

class VoteResults extends Component{

render() {
let content = [];
for (let i = 0; i < curContract.voteList.length; i++ ){
  content.push(
    <div>
    <label>{curContract.voteList[i].name}  Vote Yes - {curContract.voteList[i].yes} Vote No - {curContract.voteList[i].no} </label>
    <br/>
    </div>
  );
}
  return (content);
};
}

export default VoteResults;
