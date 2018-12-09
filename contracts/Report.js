import report from '../report.json';
import getABI from './abi';

const QUANTSTAMP_ADDRESS = '0x74814602062af64fd7a83155645ddb265598220e';
const REQUEST_AUDIT_FN_HASH = '0x25200718';

export default class Report {
  report = null;
  async getReport() {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/https://s3.amazonaws.com/qsp-protocol-reports-dev/d614a6ae-aac6-480e-af3c-eb59dae1f046.json`);
    return await response.json();
  }

  async getCode() {
    const report = await this.getReport();
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${report.contract_uri}`);
    return await response.text();
  }
}

Report.requestAudit = async function requestAudit(web3, url, from) {
  const abi = await getABI(QUANTSTAMP_ADDRESS);
  const contract = new web3.eth.Contract(abi, QUANTSTAMP_ADDRESS);
  const receipt = await contract.methods.requestAudit(url, '1000000000000000000000').send({ from: from });
  const auditId = parseInt(receipt.logs[1].data.substr(2, 64), 16);
  return auditId;
}

Report.getReportsFromUser = async function getReportsFromUser(web3, address) {
  const response = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc`);
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
