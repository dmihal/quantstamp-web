import { GlobalTypography } from 'qs-ui-lib';
import { WalletProvider } from '../context/walletContext';

export default ({ children }) => (
  <WalletProvider>
    {children}
  </WalletProvider>
);
