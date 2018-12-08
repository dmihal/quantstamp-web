import React, { Component } from 'react';
import Link from 'next/link';
import withContext from './withContext';

const defaultValue = {
  // allowed values: pending, available, unavailable, locked, wrongNet
  providerStatus: 'pending',
  web3: null,
  address: null,
  enable: null,
};
const { Provider, Consumer } = React.createContext();

export class WalletProvider extends Component {
  state = {
    value: defaultValue,
  };

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    const update = {};

    if (!window.ethereum) {
      update.providerStatus = 'unavailable';
    } else if (window.ethereum.networkVersion != '1') {
      update.providerStatus = 'wrongNet';
    } else if (!window.ethereum.selectedAddress) {
      update.providerStatus = 'locked';
      update.enable = () => window.ethereum.enable()
        .then(() => this.refresh());
    } else {
      update.providerStatus = 'available';
      update.web3 = new Web3(window.ethereum);
      update.address = window.ethereum.selectedAddress;
    }
    this.setState({
      value: Object.assign({}, this.state.value, update),
    });
  }

  render() {
    return (
      <Provider value={this.state.value}>
        {this.props.children}
      </Provider>
    );
  }
}

export const withWallet = withContext('wallet', Consumer);

