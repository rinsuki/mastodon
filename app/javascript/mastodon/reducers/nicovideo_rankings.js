import Immutable from 'immutable';
import lodash from 'lodash';
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
      lodash.each(action.data, (v, k) => {
        if (v) {
          map.setIn(['rankings', k], v);
        }
      });
      map.set('error', null);
    });
  case NICOVIDEO_RANKING_FETCH_FAIL:
    return state.set('error', action.error);
  default:
    return state;
  }
}
