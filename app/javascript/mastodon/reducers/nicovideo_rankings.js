import Immutable from 'immutable';
import {
  NICOVIDEO_RANKING_FETCH_SUCCESS,
  NICOVIDEO_RANKING_FETCH_FAIL,
} from '../actions/nicovideo_rankings';

const initialState = Immutable.Map({
  categoryId: 'all',
  rankings: Immutable.Map({}),
  error: null,
});

export default function nicovideo_rankings(state = initialState, action) {
  switch(action.type) {
  case NICOVIDEO_RANKING_FETCH_SUCCESS:
    return state.withMutations(map => {
      map.setIn(['rankings', action.categoryId], action.data);
      map.set('error', null);
    });
  case NICOVIDEO_RANKING_FETCH_FAIL:
    return state.set('error', action.error);
  default:
    return state;
  }
}
