
var canddata= null;
var partysel = null;
var consticandidates = [];
var urlParams = new URLSearchParams(window.location.search);
var voter_cnic = urlParams.get('votercnic');

$(document).ready(function() {
    var constituency = null;
    partysel = document.getElementById('partyselect');

    $.get("http://localhost:3000/fetchvoters").done(function(jdata) {
        var jsdata = JSON.parse(JSON.stringify(jdata)); 
        for (var i = 0; i < jsdata.length; i++)
        {
           if (voter_cnic === jsdata[i].votercnic)
           {
              constituency = jsdata[i].voterconstid;
              i = jsdata.length;
           }
        }
    });

    $.get("http://localhost:3000/fetchcandidates").done(function(jdata) {
        canddata = JSON.parse(JSON.stringify(jdata));

        for (var i = 0; i < canddata.length; i++)
        {
           if (constituency == canddata[i].candidateconstID)
           {
            consticandidates.push(canddata[i]);  //candidates of the voter's constituency are accumulated here to be used later
           }
        }

        $('#example').DataTable({
          processing: true,
          lengthChange: false,
          data: consticandidates,
          columns: [
          { data: "candidatename"},
          { data: "partyname"},
          {
          "data": null,
          render:function(data, type, row)
          {
            return '<button class="votebutton">Vote</button>'
          },
          "targets": -1
          }
          ]
         });
    });  
});

$(document).on('click', '.votebutton', function() 
{
    var $btn=$(this);
    var $tr=$btn.closest('tr');
    var dataTableRow= $('#example').DataTable().row($tr[0]);
    var rowData=dataTableRow.data();

    for (var i = 0; i < consticandidates.length; i++)
    {
     if (consticandidates[i].partyname == rowData.partyname)
     {       
        console.log("voting now3");  
        $.ajax({
        type: 'POST',    
        url:'http://localhost:3000/castvote',    
        data:'votercnic='+ voter_cnic + '&candidatecnic=' + consticandidates[i].candidatecnic,
        success: function(msg) {
          alert("VOTED");
        }
      });
     }
    }
});  



