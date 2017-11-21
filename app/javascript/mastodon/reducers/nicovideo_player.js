import Immutable from 'immutable';
import { PLAY_NICONICO_VIDEO, UPDATE_NICONICO_VIDEO_INPUT } from '../actions/nicovideo_player';

const initialState = Immutable.Map({
  videoId: null,
  input: '',
});

export default function nicovideo_player(state = initialState, action) {
  switch(action.type) {
  case UPDATE_NICONICO_VIDEO_INPUT:
    return state.set('input', action.videoId);
  case PLAY_NICONICO_VIDEO:
    return state.set('videoId', action.videoId).set('input', action.videoId);
  default:
    return state;
  }

}
