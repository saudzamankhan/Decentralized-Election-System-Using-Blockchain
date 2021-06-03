// $(document).ready(function() {
//     //alert("Hello, world!");  
//     //var data;
//     $('#example').DataTable( {
//       ajax:           "/fetchconstituencies",
//       deferRender:    true,
//       type: JSON,
//       scrollY:        200,
//       scrollCollapse: true,
//       scroller:       true
//   } );

//     $.get("http://localhost:3000/fetchconstituencies")
//       .done(function(jdata) {
//        var data = JSON.parse(JSON.stringify(jdata));
//        alert(data[0].constituencyid);
//     });
//   });


  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");
  
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  
  // When the user clicks the button, open the modal 
  btn.onclick = function() {
    modal.style.display = "block";
  }
  
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }