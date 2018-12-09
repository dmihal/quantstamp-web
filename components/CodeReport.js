import React, { Component, Fragment } from 'react';

export default ({ code, report }) => {
  const warningsByLine = {};
  report.analyzers_reports.forEach(report => report.potential_vulnerabilities.forEach(vunerability => {
    vunerability.instances.forEach(instance => {
      const line = instance.start_line;
      warningsByLine[line] = warningsByLine[line] || {};
      warningsByLine[line][vunerability.name] = vunerability.description;
    });
  }));

  return (
    <div className="block">
      {code.split('\n').map((line, index) => {
        const lineNum = index + 1;
        const lineEl = (
          <pre className="code" key={`line${lineNum}`}>
            {lineNum.toString().padStart(4, ' ')} {line}
          </pre>
        );
        if (!warningsByLine[lineNum]) {
          return lineEl;
        }

        return (
          <Fragment key={`frag${lineNum}`}>
            {lineEl}
            {Object.entries(warningsByLine[lineNum]).map(([name, description]) => <Warning name={name} description={description} />)}
          </Fragment>
        )
      })}
      <style jsx>{`
        .code {
          font-family: monospace !important;
          margin: 0;
        }
        .block {
          border: solid 1px #777;
          margin: 5px;
        }
      `}</style>
    </div>
  );
}

class Warning extends Component {
  state = {
    collapsed: false,
  }

  render() {
    return (
      <div className="warning">
        <div className="header" onClick={() => this.setState({ collapsed: !this.state.collapsed })}>
          {this.props.name}
        </div>
        {this.state.collapsed || (
          <div>{this.props.description}</div>
        )}

        <style jsx>{`
          .warning {
            background: yellow;
            padding: 5px;
            margin: 5px 5px 5px 25px;
            border-radius: 3px;
          }
          .header {
            font-weight: bold;
          }
          .header:hover {
            background: gray;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }
}
