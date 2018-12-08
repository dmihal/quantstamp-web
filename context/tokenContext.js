import React, { Component } from 'react';
import getToken from '../contracts/Token';
import withContext from './withContext';
import { withEthereum } from './ethereumContext';

const { Provider, Consumer } = React.createContext();

@withEthereum
export class TokenProvider extends Component {

  state = {
    token: null,
  }

  componentDidMount() {
    this.loadToken();
  }

  componentDidUpdate(oldProps) {
    if (this.props.ethereum !== oldProps.ethereum) {
      this.loadToken();
    }
  }

  async loadToken() {
    const { ethereum } = this.props;
    if (ethereum.address) {
      const token = await getToken(ethereum.web3, ethereum.address);
      this.setState({ token });
    }
  }

  render() {
    const { token } = this.state;

    return (
      <Provider value={this.state.token}>
        {this.props.children}
      </Provider>
    );
  }
}

export const withToken = withContext('token', Consumer);

