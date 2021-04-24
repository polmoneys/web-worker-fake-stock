import {
    makeChunks,
    metaDatum,
    viewportDatum,
    update
} from './utils';

let chunks = [], entries = [], meta = {};

const start = function(data) {
    const chunkBy = 10;
    chunks = makeChunks(data.datum, chunkBy); 
    const boundary = metaDatum(data.datum);
    meta = boundary; 
    const viewport = viewportDatum(chunks);
    const sorted = data.datum.sort((a, b) => b.value - a.value);
    entries = sorted;
    return {
        entries: sorted, 
        meta: boundary, 
        viewport 
    };
};

self.addEventListener(
  "message",
  function(e) {
    var data = e.data;
    switch (data.cmd) {
      case "start":
        const initial = start(data);
        self.postMessage(initial);
        break;
      case "update":
        const updated = update(chunks, data, entries, meta);
        self.postMessage(updated);
        break;
      default:
        self.postMessage("Unknown command");
    }
  },
  false
);
