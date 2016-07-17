/*
  Throttle function calls within a certain amount of milliseconds.
  e.g.:
    function myHeavyFunction() {...}
    var throttler = throttle(function() {
      myHeavyFunction();
    })
    throttler.wait(150)
    x.on("event", function() {
      throttler();
    })
  thanks to dat stack overflow
  http://stackoverflow.com/questions/8366043/how-to-throttle-callback-of-jquery-event/12185544#12185544
*/
function throttle(func) {
  var wait = 0;
  var throttler = function() {
    var that = this;
    var args = [].slice(arguments);
    clearTimeout(func._throttleTimeout);
    func._throttleTimeout = setTimeout(function() {
      func.apply(that, args);
    }, wait);
  };
  throttler.wait = function(_) {
    if (!arguments.length) return wait;
    wait = _;
    return throttler;
  };
  return throttler;
}
export default throttle;
