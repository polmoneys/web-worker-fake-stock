import TYPES from './types';

export function askWorker() {
  return { type: TYPES.ASK_FINISHED, payload: true };
}
export function receiveWorker({meta,viewport,entries}) {
  return { type: TYPES.RESULT_FINISHED, payload: {meta,viewport,entries} };
}
export function notifyError(msg) {
  return { type: TYPES.ERROR_FINISHED, payload: msg };
}
