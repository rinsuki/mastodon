import { HIGHLIGHT_KEYWORDS_SUCCESS, UPDATE_LAST_NOTIFICATION } from '../actions/highlight_keywords';
import Immutable from 'immutable';

const initialState = Immutable.Map({
  keywords: Immutable.List(),
  last_notification_id: 0,
});

export default function highlight_keywords(state = initialState, action) {
  switch(action.type) {
  case HIGHLIGHT_KEYWORDS_SUCCESS:
    return state.set('keywords', Immutable.fromJS(action.keywords));
  case UPDATE_LAST_NOTIFICATION:
    return state.set('last_notification_id', action.last_notification_id);
  default:
    return state;
  }
};
