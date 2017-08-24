import { connect } from 'react-redux';
import EnqueteContent from '../components/enquete_content';
import { vote, voteLoad, setEnqueteTimeout } from '../../../actions/enquetes';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

const mapStateToProps = (state, { status }) => ({
  status: status,
});

const mapDispatchToProps = (dispatch, { intl }) => ({
  onVote (status_id, item_index) {
    dispatch(vote(status_id, item_index));
  },

  onVoteLoad (status_id, item_index){
    dispatch(voteLoad(status_id, item_index));
  },

  onEnqueteTimeout(status_id){
    dispatch(setEnqueteTimeout(status_id));
  },
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(EnqueteContent));
