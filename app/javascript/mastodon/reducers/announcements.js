import { STORE_HYDRATE } from '../actions/store';
import Immutable from 'immutable';
import {
  NICORU_ANNOUNCEMENT,
  TOGGLE_ANNOUNCEMENTS,
  UPDATE_ANNOUNCEMENTS,
} from '../actions/announcements';

const initialState = Immutable.Map({
  visible: true,
  nicotta: Immutable.List(),
  list: Immutable.List(),
});

export default function announcements(state = initialState, action) {
  switch(action.type) {
  case STORE_HYDRATE:
    return state.set('list', action.state.get('announcements'));
  case UPDATE_ANNOUNCEMENTS:
    return state.set('list', Immutable.fromJS(action.data));
  case TOGGLE_ANNOUNCEMENTS:
    return state.set('visible', !state.get('visible'));
  case NICORU_ANNOUNCEMENT:
    return state.set('nicotta', state.get('nicotta').push(action.id));
  default:
    return state;
  }
};
