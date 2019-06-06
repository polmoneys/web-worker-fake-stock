if (module.hot) {
  module.hot.accept();
}
import * as D from './src/seed';
import Canvas from './src/canvas';
import {
  render_infographic,
  render_error,
  render_timer
} from './src/components/infographic';
import { createStore } from 'redux';
import {
  default as reducer,
  push_worker,
  pull_worker,
  notify_error
} from './src/engine/reducer';

var store = createStore(reducer);

function once() {
  if (window.Worker) {
    var worker = new Worker('./src/engine/worker.js'),
      worker_timer = new Worker('./src/engine/worker-timer.js');

    // CHART LOGIC
    worker.addEventListener(
      'error',
      e => store.dispatch(notify_error(e.message)),
      false
    );
    worker.addEventListener(
      'message',
      e => {
        store.dispatch(pull_worker(e.data));
      },
      false
    );

    worker.postMessage({
      cmd: 'start',
      datum: D.seed,
      chunk: 0
    });

    // TIMER LOGIC
    worker_timer.addEventListener(
      'error',
      e => store.dispatch(notify_error(e.message)),
      false
    );
    worker_timer.addEventListener(
      'message',
      e => {
        render_timer(e.data);
      },
      false
    );
    worker_timer.postMessage({
      cmd: 'start'
    });

    store.dispatch(push_worker());

    document.querySelector('.button').addEventListener('click', (e)=>{
          worker.postMessage({
              cmd: 'update',
              chunk: 10
          });
          return;
    });


  } else {
    store.dispatch(
      notify_error(
        'This experiment relies on web worker technology that seems to be missing from your browser.'
      )
    );
  }

  store.subscribe(() => loop(store));
  loop(store);
}

function loop(store) {
  let mounted = store.getState().mounted;

  if (mounted) {
    let sorted_entries = store.getState().entries;
    let active = store.getState().viewport.active;

    let meta = {
      min: store.getState().meta.min,
      max: store.getState().meta.max,
      mean: store.getState().meta.mean,
      total: store.getState().meta.total
    };
    let viewport = {
      min: store.getState().viewport.min,
      max: store.getState().viewport.max,
      mean: store.getState().viewport.mean,
      total: store.getState().viewport.total
    };

    render_infographic(sorted_entries, meta, active);

    let options = {
      name: 'test',
      input: active,
      viewport,
      meta
    };
    new Canvas(options);
  } 

    let error = store.getState().error;
    let notification = document.querySelector('.notification-container');

    if (error) {
        notification.style['display'] = 'block';
        render_error(store.getState().error_msg);
    } else {
        notification.style['display'] = 'none';
    }
}

window.addEventListener('load', function(e) {
  once();
});

