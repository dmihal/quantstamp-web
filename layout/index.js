import Nav from '../components/Nav';
import { GlobalTypography } from 'qs-ui-lib';

export default ({ children }) => (
  <div id="container">
    <div className="navColumn">
      <Nav />
    </div>
    <div className="mainColumn">
      {children}
    </div>
    <GlobalTypography />
    <style jsx>{`
      #container {
        min-height: 100%;
        display: flex;
        flex-direction: row;
      }
      .navColumn {
        flex: 0 0 200px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background: #ffffff;
      }
      .mainColumn {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background: #f7fbff;
      }
    `}</style>
    <style global jsx>{`
      body, html, #__next {
        height: 100%;
        margin: 0;
        padding: 0;
      }
    `}</style>
  </div>
);
