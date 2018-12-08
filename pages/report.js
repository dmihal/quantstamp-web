import React, { Component } from 'react';
import Layout from '../layout';
import Report from '../contracts/Report';
import CodeReport from '../components/CodeReport';

export default class ReportPage extends Component {

  state = {
    code: '',
    report: null,
  }

  async componentDidMount() {
    const reportObj = new Report();
    const [report, code] = await Promise.all([
      reportObj.getReport(),
      reportObj.getCode(),
    ]);
    this.setState({
      code,
      report,
    })
  }

  render() {
    const { code, report } = this.state;
    const vulnerabilities_checked = new Set();
    report && report.analyzers_reports.forEach(report => report.analyzer.vulnerabilities_checked.forEach(vun => vulnerabilities_checked.add(vun)));
    const timestamp = report && new Date(report.timestamp * 1000);
    return (
      <Layout>
        <h1>View Report</h1>
        {timestamp && <div>Audit completed at {timestamp.toString()}</div>}
        {code && (
          <CodeReport code={code} report={report} />
        )}
        <div>Vunerabilites checked: {Array.from(vulnerabilities_checked.values()).join(', ')}</div>
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
