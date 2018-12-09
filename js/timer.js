/*

  Usage
  ---

  let watch = new GameTimer();

  // starts the watch timer
  watch.startTimer(function(){
    // you can even run a callback for each interval, like updating the DOM!
  });

  watch.stopTimer();              // stops the watch timer
  watch.resetTimer();             // resets the watch timer
  watch.getTimeString();          // returns the time as a string like so ---> "00:01:17"
  watch.getTimeObj();             // returns an object like this ---> { hours: 0, minutes: 4, seconds: 27 }
  watch.getTimeObjFormatted();    // returns an object like this ---> { hours: '00', minutes: '04', seconds: '27' }

*/

const GameTimer = function GameTimer() {
  const obj = this;

  let hrs = 0;
  let mins = 0;
  let secs = 0;

  let timer;
  let stateOn = false;

  obj.getHours = function() {
    return hrs;
  }

  obj.getMinutes = function() {
    return mins;
  }

  obj.getSeconds = function() {
    return secs;
  }
  
  obj.getTimeStr = function() {
    let hr = hrs > 9 ? String(hrs) : '0' + String(hrs);
    let min = mins > 9 ? String(mins) : '0' + String(mins);
    let sec = secs > 9 ? String(secs) : '0' + String(secs);
    let timeString = hr + ':' + min + ':' + sec;
    return timeString;
  }

  obj.getTime = function() {
    return {
      hrs: hrs,
      mins: mins,
      secs: secs
    };
  }
  
  obj.getTimeFormatted = function() {
    return {
      hrs: hrs > 9 ? String(hrs) : '0' + String(hrs),
      mins: mins > 9 ? String(mins) : '0' + String(mins),
      secs: secs > 9 ? String(secs) : '0' + String(secs)
    };
  }
  obj.startTimer = function(cb) {
    if(stateOn === true) { console.log('Timer is running!'); return; }
    stateOn = true;
    timer = setInterval(function(){
      secs++;
      if(secs === 60) {
        secs = 0;
        mins++;
        if(mins === 60) {
          mins = 0;
          hrs++;
        }
      }
      if(cb && cb.constructor === Function) {
        cb();
      }
    }, 1000);
    console.log('Timer Started!');
  }

  obj.stopTimer = function() {
    clearInterval(timer);
    stateOn = false;
    console.log('Timer Stopped: ', obj.getTimeStr());
  }

  obj.resetTimer = function() {
    obj.stopTimer();
    hrs = 0;
    mins = 0;
    secs = 0;
  }
}
