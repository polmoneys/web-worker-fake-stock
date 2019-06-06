import { html, svg } from "lit-html";

// god bless http://jxnblk.com/react-icons/
let rad = function(a) {
  return (Math.PI * a) / 180;
};

let rx = function(r, a, c) {
  return c + r * Math.cos(rad(a));
};

let ry = function(r, a, c) {
  return c + r * Math.sin(rad(a));
};

let num = function(n) {
  return n < 0.0000001 ? 0 : n;
};

const create_geometry = props => {
  if (props.vertices < 3)
    throw new Error("We need at least 3 vertices to create a shape");
  let size = props.size || 96;
  let c = size / 2;

  // Radii
  let r1 = (1 * size) / 2;
  let r2 = (0.6875 * size) / 2;
  let r3 = (0.375 * size) / 2;

  // Angle
  let angle = 360 / props.vertices;
  let offset = 90;

  let fill = props.fill || "red";
  let viewBox = [0, 0, size, size].join(" ");

  //  , hole()
  //   let hole = function() {
  //     return [
  //       "M",
  //       c,
  //       c - r3,
  //       "A",
  //       r3,
  //       r3,
  //       "0 0 0",
  //       c,
  //       c + r3,
  //       "A",
  //       r3,
  //       r3,
  //       "0 0 0",
  //       c,
  //       c - r3
  //     ].join(" ");
  //   };

  let draw = function(n) {
    var d = [];
    for (var i = 0; i < n; i++) {
      var a = angle * i - offset;
      var line = [
        i === 0 ? "M" : "L",
        num(rx(r1, a, c)),
        num(ry(r1, a, c))
      ].join(" ");
      d.push(line);
    }
    return d.join(" ");
  };

  const datum = [draw(props.vertices)].join(" ");
  return {
    viewBox,
    size,
    fill,
    datum
  };
};

const Geometry = props => {
  return svg`<svg
    xmlns="http://www.w3.org/svg/2000"
    viewBox=${props.viewBox}
    width=${props.size}
    height=${props.size}
    fill=${props.fill}
  >
    <path d=${props.datum} />
  </svg>`;
};

export default Geometry;
export { create_geometry };
