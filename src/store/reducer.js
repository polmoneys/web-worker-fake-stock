import { createStore } from 'redux';
import TYPES from './types';

const initialState = {
    error: false,
    errorMessage: '',
    mounted: false,
    entries: [],
    meta: {},
    viewport: {}
};

function reducer(state = initialState, action = {}) {
  switch (action.type) {
      case TYPES.ASK_FINISHED:
          return {
              ...state,
              mounted: false
          };

      case TYPES.ERROR_FINISHED:
          return {
              ...state,
              error: true,
              errorMessage: action.payload
          };
  
      case TYPES.RESULT_FINISHED:
          return {
              ...state,
              meta: action.payload.meta,
              viewport: action.payload.viewport,
              entries: action.payload.entries,
              mounted: true
          };

      default:
          return state;
  }
}

var store = createStore(reducer);

export default store;