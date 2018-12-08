import React, { Component } from 'react';
import Web3 from 'web3';
import Link from 'next/link';
import { Button, Notification } from 'qs-ui-lib';
import Layout from '../layout';
import { withWallet } from '../context/walletContext';

@withWallet
export default class Home extends Component {

  walletStatusRenderers = {
    pending: () => (
      <Notification type='wait' headline='Loading...' />
    ),
    available: () => (
      <Notification
        type='success'
        headline='Your browser is configured correctly!'
        subheader= {
          <Link href="/qsp">
            <Button type="primary">Continue</Button>
          </Link>
        }
      />
    ),
    unavailable: () => (
      <Notification
        type='warning'
        headline="Metamask not found"
        subheader={
          <a href="https://metamask.io/" target="metamask">
            Please install Metamask to continue
          </a>
        }
      />
    ),
    locked: ({ enable }) => (
      <Notification
        type='success'
        headline="Metamask installed correctly!"
        subheader={
          <Button onClick={enable} type="primary">
            Allow Quantstamp to view your wallet
          </Button>
        }
      />
    ),
    wrongNet: () => (
      <Notification
        type='warning'
        headline="Incorrect chain"
        subheader="You have Ethereum connected, but it's connected to the wrong chain. Please change to Main Ethereum Network."
      />
    ),
  }

  render () {
    const { wallet } = this.props;
    return (
      <Layout>
        <h1>Audit your contract using the QSP Betanet</h1>
        <p>Use QSP tokens to validate your Solidity code, with off-chain computation from auditor nodes.</p>
        <p>Get a permanent, publicly verifiable record that lives forever on Ethereum.</p>
        {this.walletStatusRenderers[wallet.providerStatus](wallet)}
      </Layout>
    );
  }
}
