import { withRouter } from 'next/router'

const Redirects = ({ router, children, ethereum }) => {

  if (!ethereum.address) {
    router.push('/');
  }

  return children;
};

export default withRouter(withEthereum(Redirects));
