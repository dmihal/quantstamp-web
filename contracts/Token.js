import EventEmitter from 'wolfy87-eventemitter';
import Web3 from 'web3';
import getABI from './abi';

const TOKEN_ADDRESS = '0x99ea4dB9EE77ACD40B119BD1dC4E33e1C070b80d';
const QUANTSTAMP_ADDRESS = '0x74814602062af64fd7a83155645ddb265598220e';

const DECIMALS = (new Web3()).utils.toBN('1000000000000000000');

let eventEmitter = new EventEmitter();
let contract = null;

async function getContract(web3, userAddress) {
  const abi = await getABI(TOKEN_ADDRESS);
  contract = new web3.eth.Contract(abi, TOKEN_ADDRESS);
  const onEvent = event => {
    console.log('Event', event);
    eventEmitter.emit('event', event);
  };
  contract.events.Transfer({ from: userAddress }).on('data', onEvent);
  contract.events.Approval({ owner: userAddress }).on('data', onEvent);
  return contract;
}

export default async function getToken(web3, userAddress) {
  contract = contract || await getContract(web3, userAddress);
  const token = new Token(contract, userAddress);
  await token.updateBalances();
  return token;
}

class Token {
  constructor(contract, userAddress) {
    this.contract = contract;
    this.userAddress = userAddress;
    this.events = eventEmitter;

    this.balance = null;
    this.allowance = null;
  }

  async updateBalances() {
    [this.balance, this.allowance] = await Promise.all([
      this.contract.methods.balanceOf(this.userAddress).call(),
      this.contract.methods.allowance(this.userAddress, QUANTSTAMP_ADDRESS).call(),
    ]);
  }

  getBalance() {
    return this.balance !== null
      ? (new Web3()).utils.toBN(this.balance).div(DECIMALS).toString()
      : null;
  }

  getAllowance() {
    return this.allowance !== null
      ? (new Web3()).utils.toBN(this.allowance).div(DECIMALS).toString()
      : null;
  }

  async setAllowance(newAllowance) {
    const fullAllowance = (new Web3()).utils.toBN(newAllowance).mul(DECIMALS).toString();
    const receipt = await this.contract.methods.approve(QUANTSTAMP_ADDRESS, fullAllowance)
      .send({ from: this.userAddress });
    return receipt;
  }
}
