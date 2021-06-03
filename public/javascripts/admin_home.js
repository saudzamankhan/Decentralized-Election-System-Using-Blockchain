$(document).on('click', '#startButton', function() {
  $.get("http://localhost:3000/start").done(function(jdata) {
    alert("Election Started");
});
});

$(document).on('click', '#stopButton', function() {
  $.get("http://localhost:3000/stop").done(function(jdata) {
    alert("Election Stopped");
});
});