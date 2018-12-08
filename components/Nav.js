import { Logo } from 'qs-ui-lib';
import Link from 'next/link';

const NavLink = ({ title, path }) => (
  <li>
    <Link href={path}>
      <a className="navLink">{title}</a>
    </Link>
    <style jsx>{`
      li {
        list-style: none;
      }
      .navLink {
        display: block;
        text-decoration: none;
      }
      .navLink:hover {
        background: #d1e8ff;
      }
    `}</style>
  </li>
);

export default () => (
  <nav>
    <Logo type="product" theme="onLight" />
    <ul>
      <NavLink title="Start" path="/" />
      <NavLink title="QSP Wallet" path="/qsp" />
      <NavLink title="New Audit" path="/audit" />
      <NavLink title="View Reports" path="/reports" />
    </ul>
    <style jsx>{`
      nav {
        padding: 15px;
      }
      ul {
        padding: 0;
      }
    `}</style>
  </nav>
)
