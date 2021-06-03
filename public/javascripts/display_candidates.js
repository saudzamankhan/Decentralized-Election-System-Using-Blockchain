// Get the modal
var editmodal = null;
var addmodal = null;

function TableDataFetcher()
{
  $.get("http://localhost:3000/fetchcandidates").done(function(jdata) {
    var jsdata = JSON.parse(JSON.stringify(jdata));
    //alert(jsdata[0].constituencyid);
    $('#example').DataTable({
      processing: true,
      data: jsdata,
      columns: [
      { data: "candidatecnic"},
      { data: "candidatename"},
      { data: "candidateconstID", "width": "10%"},
      { data: "partyname", "width": "15%"},
      { data: "cityname"},
      {
      "data": null,
      render:function(data, type, row)
      {
        return '<button class="editButton">Edit</button> <button class="deleteButton">Delete</button>'
      },
      // render:function(data, type, row)
      // {
      //   return '<button id="actionButton" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Aktion</button><div class="dropdown-menu" aria-labelledby="actionButton"><a class="dropdown-item" data-toggle="modal" data-target="#ticketModal'+data[0]+'" href="#">Ticket öffnen</a><a class="dropdown-item" href="#" onclick="reopenTicket('+data[0]+')">Ticket neu öffnen.</a><a class="dropdown-item" href="#" onclick="closeTicket('+data[0]+')">Ticket schließen</a><a class="dropdown-item" href="#">Ticket löschen</a></div>';
      // }
      "targets": -1
      }
      ]
     });
  });
}

function RefreshTable()
{
    $.get("http://localhost:3000/fetchcandidates").done(function(jdata) {
    var jsdata = JSON.parse(JSON.stringify(jdata));

    var datatable = $('#example').DataTable();
    datatable.clear();
    datatable.rows.add(jdata);
    datatable.draw();
   });
}

       $(document).ready(function() {
        editmodal = document.getElementById("editModal");
        addmodal = document.getElementById("addModal");
        TableDataFetcher();
        });

        $(document).on('click', '.editButton', function() {
        var $btn=$(this);
        var $tr=$btn.closest('tr');
        var dataTableRow= $('#example').DataTable().row($tr[0]);
        var rowData=dataTableRow.data();
        $('#editcandcnic').val(rowData.candidatecnic);
        $('#editcandname').val(rowData.candidatename);
        $('#editcandconstID').val(rowData.candidateconstID);
        $('#editcandparty').val(rowData.partyname);
        editmodal.style.display = "block";

        // $.get("http://localhost:3000/fetchconstituencies").done(function(jdata) {
        // var jsdata = JSON.parse(JSON.stringify(jdata));
        // var option;
        // for (var i = 0; i < jsdata.length; i++)
        // {
        //  option = document.createElement('option');
        //  option.text = jsdata[i].constituencyid;
        //  document.querySelector('#editcandconstID').add(option, null);
        // }
        //});
        });

        $(document).on('click', '#addButton', function() {
            addmodal.style.display = "block";
        });

        $(document).on('click', '.deleteButton', function() {
        var $btn=$(this);
        var $tr=$btn.closest('tr');
        var dataTableRow= $('#example').DataTable().row($tr[0]);
        var rowData=dataTableRow.data();

        $.ajax({
          type: 'POST',    
          url:'http://localhost:3000/deletecandidate',
          data:'deletecandcnic='+ rowData.candidatecnic,
          success: function(msg) {
           RefreshTable();
          }
        });
      });

      $(document).on('click', '#addformpress', function() {
         $.get("http://localhost:3000/fetchconstituencies").done(function(jdata) {
         var jsdata = JSON.parse(JSON.stringify(jdata));
         var option;
         var found = false;

         for (var i = 0; i < jsdata.length; i++)
         {
           if ($('#addcandconstID').val() == jsdata[i].constituencyid)
           {
              found = true;
           }
         }

         if(!found)
         {
          alert("Constituency ID is not defined");
         }
         else
         {
          $.get("http://localhost:3000/fetchparties").done(function(pdata) {
            psdata = JSON.parse(JSON.stringify(pdata));
            var option;
            var pfound = false;

          for (var i = 0; i < psdata.length; i++)
          {
            if ($('#addcandparty').val() == psdata[i].partyname)
            {
              pfound = true;
            }
          }
          
          if(!pfound)
          {
            alert("Party name is not defined");
          }
          else
          {
            $.ajax({
              type: 'POST',    
              url:'http://localhost:3000/appendcandidate',
              data:'addcandcnic='+ $('#addcandcnic').val() + '&addcandname=' + $('#addcandname').val()+ '&addcandparty=' + $('#addcandparty').val()+ '&addcandconstID=' + $('#addcandconstID').val(),
              success: function(msg) {
              addmodal.style.display = "none";
              RefreshTable();
              }
            });
          }
          });
         }
        }); 
      });

      $(document).on('click', '#updateformpress', function() {
        $.get("http://localhost:3000/fetchconstituencies").done(function(jdata) {
          var jsdata = JSON.parse(JSON.stringify(jdata));
          var option;
          var found = false;
 
          for (var i = 0; i < jsdata.length; i++)
          {
            if ($('#editcandconstID').val() == jsdata[i].constituencyid)
            {
               found = true;
            }
          }
 
          if(!found)
          {
           alert("Constituency ID is not defined");
          }
          else
          {
           $.get("http://localhost:3000/fetchparties").done(function(pdata) {
             psdata = JSON.parse(JSON.stringify(pdata));
             var option;
             var pfound = false;
 
           for (var i = 0; i < psdata.length; i++)
           {
             if ($('#editcandparty').val() == psdata[i].partyname)
             {
               pfound = true;
             }
           }
           
           if(!pfound)
           {
             alert("Party name is not defined");
           }
           else
           {
            $.ajax({
              type: 'POST',    
              url:'http://localhost:3000/updatecandidate',
              data:'editcandcnic='+ $('#editcandcnic').val() + '&editcandname=' + $('#editcandname').val()+ '&editcandparty=' + $('#editcandparty').val()+ '&editcandconstID=' + $('#editcandconstID').val(),
              success: function(msg) {
              editmodal.style.display = "none";
              RefreshTable();
              }
            });
           }
           });
          }
         }); 
      });

        // close the modal
        $(document).on('click', '.closed', function() {
          editmodal.style.display = "none";
          addmodal.style.display = "none";
        });