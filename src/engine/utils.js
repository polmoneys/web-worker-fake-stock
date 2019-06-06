export const picking = ctx => shapes => mouse => {
    const hitted = [];
    shapes.map(s => {
        if (ctx.isPointInPath(s.path, mouse.x, mouse.y)) {
            hitted.push(s);
        }
    });
    return hitted;
};

export const make_chunks = (entries, number) => {
  const result = Array.from(
    {
      length: Math.ceil(entries.length / number)
    },
    (v, i) => entries.slice(i * number, i * number + number)
  );
  return result;
};

export function memoizer(fun) {
    // const fibonacciMemoFunction = memoizer(fibonacciRecursive);
    let cache = {};
    return function(n) {
        if (cache[n] != undefined) {
            return cache[n];
        } else {
            let result = fun(n);
            cache[n] = result;
            return result;
        }
    };
}

export const after = function(fn, after) {
    return function() {
        var result = fn.apply(this, arguments);
        after.call(this, result);
        return result;
    };
};

export const defined = x => typeof x !== 'undefined';
export const arr_first_from_left = ([x]) => x;
export const arr_n_from_left = ([x, ...xs], n = 1) =>
    defined(x) && n ? [x, ...arr_n_from_left(xs, n - 1)] : [];