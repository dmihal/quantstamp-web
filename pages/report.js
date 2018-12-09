import React, { Component } from 'react';
import Layout from '../layout';
import Report from '../contracts/Report';
import CodeReport from '../components/CodeReport';
import { withEthereum } from '../context/ethereumContext';

@withEthereum
export default class ReportPage extends Component {

  state = {
    code: '',
    report: null,
    isReady: false,
  }

  componentDidMount() {
    if (this.props.ethereum.address) {
      this.loadData();
    }
  }

  componentDidUpdate(oldProps) {
    if (this.props.ethereum !== oldProps.ethereum && this.props.ethereum.address) {
      this.loadData();
    }
  }

  async loadData() {
    const reportObj = await Report.getFromId(this.props.ethereum.web3, this.props.id);
    const [report, code, isReady] = await Promise.all([
      reportObj.getReport(),
      reportObj.getCode(),
      reportObj.isReady(),
    ]);
    this.setState({
      code,
      report,
      isReady,
    })
  }

  render() {
    const { code, report, isReady } = this.state;
    const vulnerabilities_checked = new Set();
    report && report.analyzers_reports.forEach(report => report.analyzer.vulnerabilities_checked.forEach(vun => vulnerabilities_checked.add(vun)));
    const timestamp = report && new Date(report.timestamp * 1000);
    return (
      <Layout>
        <h1>View Report</h1>
        {isReady ? (
          <div>
            {timestamp && <div>Audit completed at {timestamp.toString()}</div>}
            {code && (
              <CodeReport code={code} report={report} />
            )}
            <div>Vunerabilites checked: {Array.from(vulnerabilities_checked.values()).join(', ')}</div>
          </div>
        ) : (<div>Report is pending</div>)}
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

ReportPage.getInitialProps = function getInitialProps({ query }) {
  return { id: query.id, }
}
