import Immutable from 'immutable';
import { PLAY_NICONICO_VIDEO } from '../actions/nicovideo_player';

const initialState = Immutable.Map({
  videoId: null,
});

export default function nicovideo_player(state = initialState, action) {
  switch(action.type) {
  case PLAY_NICONICO_VIDEO:
    return state.set('videoId', action.videoId);
  default:
    return state;
  }

}
