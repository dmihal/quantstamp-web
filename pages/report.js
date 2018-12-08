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
    return (
      <Layout>
        <h1>View Report</h1>
        {code && (
          <CodeReport code={code} report={report} />
        )}
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
