import getABI from './abi';

const QUANTSTAMP_ADDRESS = '0x74814602062af64fd7a83155645ddb265598220e';
const REQUEST_AUDIT_FN_HASH = '0x25200718';

export default class Report {
  
  constructor(id, contract) {
    this.id = id;
    this.contract = contract;
    this.auditor = '0xe685187635499B823d97FFBf16CB0EE34a172c33';
    this.reportHash = 'ffa98c1186299791f2875442e986cc925c278575423ed9a9e306d8074133dcb7';
  }

  async isReady() {
    return await this.contract.methods.isAuditFinished(this.id).call();
  }

  async getReport() {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/https://s3.amazonaws.com/qsp-protocol-reports-prod/${this.auditor}/${this.reportHash}.json`);
    return await response.json();
  }

  async getCode() {
    const report = await this.getReport();
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${report.contract_uri}`);
    return await response.text();
  }
}

let contract = null;
async function getContract(web3) {
  if (contract) {
    return contract;
  }
  const abi = await getABI(QUANTSTAMP_ADDRESS);
  contract = new web3.eth.Contract(abi, QUANTSTAMP_ADDRESS);
  return contract;
}

Report.getFromId = async function(web3, id) {
  const contract = await getContract(web3);
  return new Report(id, contract);
}

Report.requestAudit = async function requestAudit(web3, url, from) {
  const contract = await getContract(web3);
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
