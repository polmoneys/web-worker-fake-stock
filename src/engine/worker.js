import {
    make_chunks,
    memoizer // TODO: 
} from './utils';

var chunks = [], // 🙏🏽
    entries = [], // 🙏🏽
    meta = {}; // 🙏🏽

const start = function(data) {
    let chunk_by = 10;

    chunks = make_chunks(data.datum, chunk_by); // 🙏🏽
    meta = meta_response(data.datum); // 🙏🏽
    entries = data.datum.sort((a, b) => b.value - a.value); // 🙏🏽
    
    let viewport = viewport_response(chunks);
  return {
      entries, // 🙏🏽
      meta, // 🙏🏽
      viewport // 🙏🏽
  };
};

const update = function(data) {
  let viewport = viewport_response(chunks, data.chunk);
  return {
      entries, // 🙏🏽
      meta, // 🙏🏽
      viewport
  };
};

const destroy = function(worker) {
    worker.terminate();
    worker.removeEventListener(
        'message',
        e => {
            console.log(e.data);
        },
        false
    );
    worker.removeEventListener(
        'error',
        e => store.dispatch(notify_error(e.message)),
        false
    );
};

const meta_response = function(datum) {
 let meta_values = datum.map(c => c.value);
 let meta_min = meta_values.reduce((previous, current) => {
     return previous < current ? previous : current;
 });
 let meta_max = meta_values.reduce((previous, current) => {
     return previous > current ? previous : current;
 });
 let meta_total = meta_values
     .map(c => c)
     .reduce((acc, val) => {
         return acc + val;
     }, 0);

 let meta_mean = meta_values.reduce((a, b) => a + b) / meta_values.length;
        return {
            min: meta_min,
            max: meta_max,
            total: meta_total,
            mean: Math.floor(meta_mean)
        };
};

const viewport_response = function(chunks,chunk_id = 0) {
    let viewport = chunks[chunk_id];
    let viewport_values = viewport.map(c => c.value);
    let viewport_min = viewport_values.reduce((previous, current) => {
        return previous < current ? previous : current;
    });
    let viewport_max = viewport_values.reduce((previous, current) => {
        return previous > current ? previous : current;
    });
    let viewport_total = viewport_values
        .map(c => c)
        .reduce((acc, val) => {
            return acc + val;
        }, 0);
    let viewport_mean =
        viewport_values.reduce((a, b) => a + b) / viewport_values.length;
    
        let sorted_active = viewport.sort((a, b) => b.value - a.value);

        return {
            min: viewport_min,
            max: viewport_max,
            total: viewport_total,
            mean: Math.floor(viewport_mean),
            active: sorted_active
        };
};


self.addEventListener(
  "message",
  function(e) {
    var data = e.data;
    switch (data.cmd) {
      case "update":
        let updated = update(data);
        self.postMessage(updated);
        break;
      case "start":
        let response = start(data);
        self.postMessage(response);
        break;
      default:
        self.postMessage("Unknown command");
    }
  },
  false
);
