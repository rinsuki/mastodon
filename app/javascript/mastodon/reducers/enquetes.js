import {
  COMPOSE_ENQUETE_CHANGE,
  COMPOSE_ENQUETE_TEXT_CHANGE,
} from '../actions/enquetes';
import {
  COMPOSE_SUBMIT_SUCCESS,
} from '../actions/compose';
import Immutable from 'immutable';
import uuid from '../uuid';

const initialState = Immutable.Map({
  enquete: false,
  enquete_items: Immutable.List(['', '', '', '']),
});

function closeEnquete(state) {
  return state.withMutations(map => {
    map.set('enquete_items', Immutable.List(['', '', '', '']));
    map.set('enquete', false);
  });
}

export default function enquetes(state = initialState, action) {
  switch(action.type) {
  case COMPOSE_ENQUETE_CHANGE:
    return state
      .set('enquete', !state.get('enquete'))
      .set('enquete_items',  Immutable.List(['', '', '', '']))
      .set('idempotencyKey', uuid());
  case COMPOSE_ENQUETE_TEXT_CHANGE:
    return state
      .setIn(['enquete_items', action.item_index], action.text);
  case COMPOSE_SUBMIT_SUCCESS:
    return closeEnquete(state);
  default:
    return state;
  }
}
