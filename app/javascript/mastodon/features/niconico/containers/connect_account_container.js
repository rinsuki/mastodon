import { connect }   from 'react-redux';
import ConnectAccount from '../components/connect_account';

const mapStateToProps = (state) => {
  return {
    account: state.getIn(['accounts', state.getIn(['meta', 'me'])]),
  };
};

export default connect(mapStateToProps)(ConnectAccount);
