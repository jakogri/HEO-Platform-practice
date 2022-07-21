// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SimpleToken is ERC20{

    address private owner;
	string private _name;
    string private _symbol;
    uint256 private _maxTokens;//Maximum number of tokens possible

    constructor(uint256 tok_val, string memory name_, string memory symbol_)  public ERC20("", ""){
		_maxTokens = tok_val;
		_mint(msg.sender, _maxTokens);
		_name = name_;
		_symbol = symbol_;
	}

    function getmaxTokens() public view returns (uint256) {
		return _maxTokens;
	}

	function name() public view virtual override returns (string memory) {
        return _name;
    }

	function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

}