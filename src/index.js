if (module.hot) {
  module.hot.accept();
}
import * as D from './seed';
import Canvas from './components/canvas';
import {
  renderChart,
  renderError,
  renderTimer
} from './components/';
import store from './store/reducer';
import {askWorker, receiveWorker, notifyError} from './store/actions';
import tinytime from 'tinytime';
import MathUtil from './engine/math';

const templateYear = tinytime('{DD} {MMMM} {YYYY}');
const NOW = new Date();

function init() {
  if(!window.Worker){
  store.dispatch(
        notifyError(
          'This experiment relies on web worker technology that seems to be missing from your browser.'
        )
      );
      return;
  }
  
    const worker = new Worker('./worker/',{type:'module'}),
      workerTimer = new Worker('./engine/worker-timer',{type:'module'});

    // CHART LOGIC
    worker.addEventListener(
      'error',
      e => store.dispatch(notifyError(e.message)),
      false
    );
    worker.addEventListener(
      'message',
      e => {
        store.dispatch(receiveWorker(e.data));
      },
      false
    );

    worker.postMessage({
      cmd: 'start',
      datum: D.seed,
      chunk: 0
    });

    // TIMER LOGIC
    workerTimer.addEventListener(
      'error',
      e => store.dispatch(notifyError(e.message)),
      false
    );
    workerTimer.addEventListener(
      'message',
      e => {
        renderTimer(e.data);
      },
      false
    );
    workerTimer.postMessage({
      cmd: 'start'
    });

    store.dispatch(askWorker());

    document.querySelector('.button').addEventListener('click', (e)=>{
          worker.postMessage({
              cmd: 'update',
              chunk: MathUtil.roll(10,100)
          });
          return;
    });

    document.querySelector('.clock').innerHTML = templateYear.render(NOW);

  store.subscribe(() => app(store));
  app(store);
}

function app(store) {
  const mounted = store.getState().mounted;

  if (mounted) {
    const sortedEntries = store.getState().entries;
    const active = store.getState().viewport.active;

    const meta = {
      min: store.getState().meta.min,
      max: store.getState().meta.max,
      mean: store.getState().meta.mean,
      total: store.getState().meta.total
    };
    const viewport = {
      min: store.getState().viewport.min,
      max: store.getState().viewport.max,
      mean: store.getState().viewport.mean,
      total: store.getState().viewport.total
    };

    renderChart(sortedEntries, meta, active);

    const options = {
      name: 'test',
      input: active,
      viewport,
      meta
    };
    new Canvas(options);
  } 

    // IF ERRORS 
    const error = store.getState().error;
    const notification = document.querySelector('.notification-container');
    if (error) {
        notification.style['display'] = 'block';
        renderError(store.getState().error_msg);
    } else {
        notification.style['display'] = 'none';
    }
}

window.addEventListener('load', function(e) {
  init();
});

