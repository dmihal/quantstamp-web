import React, { Component } from 'react';
import { Button, CodeInputArea, Notification } from 'qs-ui-lib';
import Link from 'next/link';
import Layout from '../layout';
import { withEthereum } from '../context/ethereumContext';
import Report from '../contracts/Report';

@withEthereum
export default class Reports extends Component {
  state = {
    audits: [],
  }

  async componentDidUpdate(oldProps) {
    const { ethereum } = this.props;
    if (ethereum.address !== oldProps.ethereum.address) {
      const audits = await Report.getReportsFromUser(ethereum.web3, ethereum.address);
      this.setState({ audits });
    }
  }

  render() {
    return (
      <Layout>
        <h1>View Reports</h1>
        <ul>
          {this.state.audits.map(audit => (
            <li>
              <Link href={`/report?id=${audit.auditId}`}>
                <a>Audit #{audit.auditId} ({audit.hash})</a>
              </Link>
            </li>
          ))}
        </ul>
        {this.state.audits.length === 0 && (<p>No audits found</p>)}
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
