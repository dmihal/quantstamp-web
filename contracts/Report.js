import report from '../report.json';

const QUANTSTAMP_ADDRESS = '0x74814602062af64fd7a83155645ddb265598220e';
const REQUEST_AUDIT_FN_HASH = '0x25200718';

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

Report.getReportsFromUser = async function getReportsFromUser(web3, address) {
  const response = await fetch(`http://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc`);
  const json = await response.json();
  const txIsAuditRequest = tx => tx.to === QUANTSTAMP_ADDRESS && tx.input.indexOf(REQUEST_AUDIT_FN_HASH) === 0;
  const addData = async tx => {
    const receipt = await web3.eth.getTransactionReceipt(tx.hash);
    tx.auditId = parseInt(receipt.logs[1].data.substr(2, 64), 16);
    return tx;
  };
  const auditRequestTx = await Promise.all(json.result.filter(txIsAuditRequest).map(addData));
  return auditRequestTx;
}
