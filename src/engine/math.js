var MathUtil = {};

//used for radiansToDegrees and degreesToRadians
MathUtil.PI_180 = Math.PI / 180;
MathUtil.ONE80_PI = 180 / Math.PI;

//precalculations for values of 90, 270 and 360 in radians
MathUtil.PI2 = Math.PI * 2;
MathUtil.HALF_PI = Math.PI / 2;
MathUtil.PI_AND_HALF = Math.PI + Math.PI / 2;
MathUtil.NEGATIVE_HALF_PI = -Math.PI / 2;

MathUtil.toIso = function (x, y, z) {
  return { x: 2 * x + 2 * y, y: 1 * x - 1 * y + z };
}

MathUtil.normie =  value => (max,height) => {
    let percent = (value * 100)/max;
    let y = Math.floor((height/100)*percent);
    return y;
    // vs. MathUtil.map(s.value, min, max, 0, this.height);
  }
  
MathUtil.roll = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};
MathUtil.roll_decimals = function(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
};
//keep degrees between 0 and 360
MathUtil.constrainDegreeTo360 = function(degree) {
  return (360 + (degree % 360)) % 360; //hmmm... looks a bit weird?!
};

MathUtil.constrainRadianTo2PI = function(rad) {
  return (MathUtil.PI2 + (rad % MathUtil.PI2)) % MathUtil.PI2; //equally so...
};

MathUtil.radiansToDegrees = function(rad) {
  return rad * MathUtil.ONE80_PI;
};

MathUtil.degreesToRadians = function(degree) {
  return degree * MathUtil.PI_180;
};

//return number between 1 and 0
MathUtil.normalize = function(value, minimum, maximum) {
  return (value - minimum) / (maximum - minimum);
};

//map normalized number to values
MathUtil.interpolate = function(normValue, minimum, maximum) {
  return minimum + (maximum - minimum) * normValue;
};

//map a value from one set to another
MathUtil.map = function(value, min1, max1, min2, max2) {
  return MathUtil.interpolate(
    MathUtil.normalize(value, min1, max1),
    min2,
    max2
  );
};

MathUtil.clamp = function(min, max, value) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
};

export default MathUtil;
