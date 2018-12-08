import { GlobalTypography } from 'qs-ui-lib';
import { EthereumProvider } from '../context/ethereumContext';
import { TokenProvider } from '../context/tokenContext';

export default ({ children }) => (
  <EthereumProvider>
    <TokenProvider>
      {children}
    </TokenProvider>
  </EthereumProvider>
);
