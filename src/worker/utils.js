export const update = function(chunks, data, entries, meta) {
  const viewport = viewportDatum(chunks, data.chunk);
  return {
      entries, 
      meta, 
      viewport
  };
};
export const destroy = function(worker) {
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
        e => console.log(e.message),
        false
    );
};

export const makeChunks = (entries, number) => {
  const result = Array.from(
    {
      length: Math.ceil(entries.length / number)
    },
    (v, i) => entries.slice(i * number, i * number + number)
  );
  return result;
};


export const metaDatum = function(datum) {
 const values = datum.map(c => c.value);
 const min = values.reduce((previous, current) => {
     return previous < current ? previous : current;
 });
 const max = values.reduce((previous, current) => {
     return previous > current ? previous : current;
 });
 const total = values
     .map(c => c)
     .reduce((acc, val) => {
         return acc + val;
     }, 0);

 const mean = values.reduce((a, b) => a + b) / values.length;
        return {
            min,
            max,
            total,
            mean: Math.floor(mean)
        };
};

export const viewportDatum = function(chunks,id = 0) {
    const viewport = chunks[id];
    const values = viewport.map(c => c.value);
    const min = values.reduce((previous, current) => {
        return previous < current ? previous : current;
    });
    const max = values.reduce((previous, current) => {
        return previous > current ? previous : current;
    });
    const total = values
        .map(c => c)
        .reduce((acc, val) => {
            return acc + val;
        }, 0);
    const mean =
        values.reduce((a, b) => a + b) / values.length;
    
        const active = viewport.sort((a, b) => b.value - a.value);

        return {
            min,
            max,
            total,
            mean: Math.floor(mean),
            active
        };
};