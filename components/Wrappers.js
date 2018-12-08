import { GlobalTypography } from 'qs-ui-lib';
import { EthereumProvider } from '../context/ethereumContext';

export default ({ children }) => (
  <EthereumProvider>
    {children}
  </EthereumProvider>
);
