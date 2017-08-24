import { connect } from 'react-redux';
import EnqueteInputs from '../components/enquete_inputs';
import { changeComposeEnqueteText } from '../../../actions/enquetes';
import { submitCompose } from '../../../actions/compose';

const mapStateToProps = state => ({
  enquete_items: state.getIn(['enquetes', 'enquete_items']),
  enquete: state.getIn(['enquetes', 'enquete']),
});

const mapDispatchToProps = dispatch => ({
  onChangeEnqueteText(text, index){
    dispatch(changeComposeEnqueteText(text, index));
  },

  onSubmit() {
    dispatch(submitCompose());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EnqueteInputs);
