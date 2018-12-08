import React, { Component } from 'react';
import Web3 from 'web3';
import Link from 'next/link';
import { Button, Notification } from 'qs-ui-lib';
import Layout from '../layout';
import { withToken } from '../context/tokenContext';

const Exchange = ({ name, img, url }) => (
  <li className="list">
    <a href={url} target="exchange" style={{backgroundImage: `url(${img})`}} className="logo">
      {name}
    </a>
    <style jsx>{`
      .list {
        list-style: none;
        height: 40px;
        flex: 1;
        margin: 5px;
      }
      .logo {
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        display: block;
        font-size: 0;
        height: 100%;
      }
      .logo:hover {
        background-color: #e0f0ff;
      }
    `}</style>
  </li>
);

@withToken
export default class QSP extends Component {
  render() {
    return (
      <Layout>
        <h1>Quantstamp is powered by the QSP token</h1>
        {this.props.token ? this.tokenDetails() : <p>Loading...</p>}
        <h3>Buy QSP</h3>
        <p>Need to buy some QSP tokens? You can purchase them on the following exchanges:</p>
        <ul className="exchanges">
          <Exchange name="Binance" img="https://www.binance.com/resources/img/activity/LOGO2.png" url="https://www.binance.com/" />
          <Exchange name="Huobi" img="https://file.hbfile.net/global/en-us/img/2694b22.svg" url="https://www.huobi.pro/" />
          <Exchange name="Gate.io" img="https://gateio.io/images/gateio_h.svg" url="https://gate.io/" />
          <Exchange name="EtherDelta" img="https://pbs.twimg.com/media/DkplIrOU8AIj3ek.png" url="https://etherdelta.com/" />
          <Exchange name="KuCoin" img="https://news.kucoin.com/en/wp-content/uploads/2018/08/KuCoin-logo.png" url="https://www.kucoin.com/" />
        </ul>
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

  tokenDetails() {
    const { token } = this.props;
    const balance = token.getBalance();
    return (
      <div>Balance: {balance !== null ? balance + ' QSP' : 'Loading...'}</div>
    );
  }
}
