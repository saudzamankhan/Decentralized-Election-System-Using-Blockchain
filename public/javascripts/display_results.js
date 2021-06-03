// Get the modal
function TableDataFetcher()
{
  $.get("http://localhost:3000/fetchelectionresults").done(function(jdata) {
    var jsdata = JSON.parse(JSON.stringify(jdata));
    //alert(jsdata[0].constituencyid);
    $('#example').DataTable({
      processing: true,
      data: jsdata,
      columns: [
      { data: "candidatename"},
      { data: "constituencyid"},
      { data: "constituencycity"},
      { data: "partyname"},
      { data: "totalvotes"}
      ]
     });
  });
}

function RefreshTable()
{
    $.get("http://localhost:3000/fetchelectionresults").done(function(jdata) {
    var jsdata = JSON.parse(JSON.stringify(jdata));

    var datatable = $('#example').DataTable();
    datatable.clear();
    datatable.rows.add(jdata);
    datatable.draw();
   });
}

$(document).ready(function() {
 TableDataFetcher();
});