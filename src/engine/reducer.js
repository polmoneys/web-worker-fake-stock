const UI = {
  FETCH: "FETCH",
  RESULT: "RESULT",
  ERROR: "ERROR"
};

export function push_worker() {
  return { type: UI.FETCH, payload: true };
}
export function pull_worker({meta,viewport,entries}) {
  return { type: UI.RESULT, payload: {meta,viewport,entries} };
}
export function notify_error(msg) {
  return { type: UI.ERROR, payload: msg };
}


const initial_state = {
    error: false,
    error_msg: '',
    mounted: false,
    entities: [],
    entries: [],
    meta: {},
    viewport: {}
};

export default function(state = initial_state, action = {}) {
  switch (action.type) {
      case UI.FETCH:
          return {
              ...state,
              mounted: false
          };

      case UI.ERROR:
          return {
              ...state,
              error: true,
              error_msg: action.payload
          };
  
      case UI.RESULT:
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
