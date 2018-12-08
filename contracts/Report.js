import report from '../report.json';

const code = `pragma solidity ^0.4.17;

contract SendBalance {
  mapping (address => uint) userBalances;
  bool withdrawn = false;
  function getBalance(address u) constant returns (uint) {
    return userBalances[u];
  }

  function addToBalance() {
    userBalances[msg.sender] += msg.value;
  }

  function withdrawBalance() {
    if (!(msg.sender.call.value(userBalances[msg.sender])())) {
      throw;
    }

    userBalances[msg.sender] = 0;
  }
}`;

export default class Report {
  report = null;
  async getReport() {
    return report;
  }

  async getCode() {
    return code;
  }
}

let contract = null;

Report.getReport = async function getReport(web3, tx) {
  contract = contract || getContract();
}
