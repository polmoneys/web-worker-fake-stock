var running = true; // 🙏🏽
    var loop = null;

const timer = start => {
    var curr = new Date().valueOf();
    var diff = curr - start;
    var minutes = Math.floor(diff / 1000 / 60);
    var seconds = Math.floor(diff / 1000) - minutes * 60;
    // if number of minutes less than 10, add a leading "0"
    minutes = minutes.toString();
    if (minutes.length == 1) {
        minutes = '0' + minutes;
    }
    // if number of seconds less than 10, add a leading "0"
    seconds = seconds.toString();
    if (seconds.length == 1) {
        seconds = '0' + seconds;
    }
    return `${minutes} : ${seconds}`;
};

self.addEventListener(
  'message',
  function(e) {
    var data = e.data;
    switch (data.cmd) {
      case 'start':
        if (running) { 
          // get current time
          var now = new Date().valueOf();
          // repeat timer(d0) every 100 ms
          loop = setInterval(function() {
           const result = timer(now);
             self.postMessage(result);

          }, 100);
          // timer should not start anymore since it has been started
          running = false;
        }
        break;
      default:
        self.postMessage('Unknown command');
    }
  },
  false
);



