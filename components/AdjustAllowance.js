import React, { Component } from 'react';
import { Button } from 'qs-ui-lib';
import { withToken } from '../context/tokenContext';

@withToken
export default class AdjustAllowance extends Component {
  state = {
    allowance: null,
    status: 'ready',
  }

  componentDidMount() {
    this.setState({
      allowance: this.props.token && this.props.token.getAllowance(),
    });
  }

  componentDidUpdate(oldProps) {
    if (this.props.token !== oldProps.token) {
      this.setState({
        allowance: this.props.token.getAllowance(),
      });
    }
  }

  async setAllowance() {
    this.props.token.setAllowance(this.state.allowance);
  }

  render() {
    const { token } = this.props;

    return (
      <div>
        <p>You must give Quantstamp an allowance to access at least 1000 of your QSP tokens to execute an audit.</p>
        {this.state.allowance ? this.form() : (<p>Loading...</p>)}
      </div>
    );
  }

  form() {
    return (
      <div>
        <div>
          <input
            type="number"
            value={this.state.allowance}
            min="0"
            max={this.props.token.getBalance()}
            onChange={e => this.setState({ allowance: e.target.value })}
            disabled={this.state.status === 'pending'}
          />
          QSP
        </div>
        <Button onClick={() => this.setAllowance()} disabled={this.state.status === 'pending'}>
          Set Allowance
        </Button>
      </div>
    );
  }
}
