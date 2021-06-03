

$(document).on('click', '#loginbutton', function() {
  $.get('http://localhost:3000/verifyvoter', {votercnic: $('#votercnic').val(), password: $('#password').val()}, function(data) {
  if (data == 2)
  {
    alert("Credentials not correct!");
  }
  else if (data == 3)
  {
    alert("You've already cast your vote!");
  }
  else
  {
    var queryString = "?votercnic=" + $('#votercnic').val();
    window.open("http://localhost:3000/displayvotecast" + queryString, "_self");
  }
 });
});