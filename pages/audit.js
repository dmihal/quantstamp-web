import React, { Component } from 'react';
import Web3 from 'web3';
import Link from 'next/link';
import { Button, CodeInputArea, Notification } from 'qs-ui-lib';
import Layout from '../layout';
import AdjustAllowance from '../components/AdjustAllowance';
import Report from '../contracts/Report';
import { withToken } from '../context/tokenContext';
import { withEthereum } from '../context/ethereumContext';
import { withRouter } from 'next/router'

@withRouter
@withToken
@withEthereum
export default class QSP extends Component {
  state = {
    code: '',
    etherscanErr: null,
    id: null,
    err: null,
    url: null,
  }

  async validateCode(code) {
    this.setState({ id: null, err: null, url: null });
    const response = await fetch(`https://betanet-www.herokuapp.com/contracts`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        sourceCode: code,
      }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    const json = await response.json();
    return this.handleStatus(json.contract);
  }

  handleStatus(status) {
    if (status.status === 'PENDING') {
      setTimeout(() => this.checkStatus(status.id), 500);
      return;
    }

    if (status.status === 'FAILED') {
      this.setState({ err: status.error });
      return;
    }

    if (status.status === 'SUCCESS') {
      this.setState({ url: status.url });
      return;
    }
  }

  async checkStatus(id) {
    const response = await fetch(`https://betanet-www.herokuapp.com/contracts/${id}`);
    const json = await response.json();
    this.handleStatus(json.contract);
  }

  async processEtherScan(address) {
    if (!(new Web3()).utils.isAddress(address)) {
      this.setState({ etherscanErr: 'Enter a valid Ethereum address' });
      return;
    }
    this.setState({ etherscanErr: null });
    const response = await fetch(`https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}`);
    const json = await response.json();
    const result = json.result[0];
    if (!result.SourceCode) {
      this.setState({ etherscanErr: result.ABI });
      return;
    }

    return this.validateCode(result.SourceCode);
  }

  async submit() {
    const { ethereum } = this.props;
    const auditId = await Report.requestAudit(ethereum.web3, this.state.url, ethereum.address);
    this.props.router.push(`/report?id=${auditId}`);
  }

  render() {
    const { code, etherscanErr, id, err, url } = this.state;
    return (
      <Layout>
        <h1>New Audit</h1>
        <div>
          {id && !(err || url) && (<div>Compiling code...</div>)}
          {err && (
            <Notification
              type="error"
              headline="Compilation failed"
              subheader={err}
            />
          )}
          {url && (
            <Notification
              type="success"
              headline="Compiled successfully"
              subheader={
                <Button onClick={() => this.submit()}>Submit for Audit</Button>
              }
            />
          )}
        </div>
        <h2>Option A: Upload Solidity Code</h2>
        <CodeInputArea
          code={this.state.code}
          handleChange={value => this.setState({ code: value })}
        />
        <Button onClick={() => this.validateCode(code)}>Upload</Button>
        <h2>Option B: Deployed Code</h2>
        <p>You may submit an existing, deployed contract for an audit if the verified code has been uploaded to EtherScan</p>
        <input onChange={e => this.processEtherScan(e.target.value)} placeholder="Contract address" />
        <div>{etherscanErr}</div>

        <style jsx>{`
          .exchanges {
            display: flex;
            justify-content: space-between;
            padding: 0;
          }
        `}</style>
      </Layout>
    );
  }

}
