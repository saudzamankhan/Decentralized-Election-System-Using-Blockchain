// Get the modal
var editmodal = null;
var addmodal = null;

function TableDataFetcher()
{
  $.get("http://localhost:3000/fetchvoters").done(function(jdata) {
    var jsdata = JSON.parse(JSON.stringify(jdata));
    //alert(jsdata[0].constituencyid);
    $('#example').DataTable({
      processing: true,
      data: jsdata,
      columns: [
      { data: "votercnic"},
      { data: "votername"},
      { data: "voterpassword"},
      { data: "votercontactno", "width": "15%"},
      { data: "voterconstid", "width": "10%"},
      {
      "data": null,
      render:function(data, type, row)
      {
        return '<button class="editButton">Edit</button> <button class="deleteButton">Delete</button>'
      },
      "targets": -1
      }
      ]
     });
  });
}

function RefreshTable()
{
    $.get("http://localhost:3000/fetchvoters").done(function(jdata) {
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
        $('#editvotercnic').val(rowData.votercnic);
        $('#editvotername').val(rowData.votername);
        $('#editvoterpassword').val(rowData.voterpassword);
        $('#editvotercontactno').val(rowData.votercontactno);
        $('#editvoterconstid').val(rowData.voterconstid);
        editmodal.style.display = "block";
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
          url:'http://localhost:3000/deletevoter',
          data:'deletevotercnic='+ rowData.votercnic,
          success: function(msg) {
           RefreshTable();
          }
        });
      });

      $(document).on('click', '#addformpress', function() {
         $.get("http://localhost:3000/fetchconstituencies").done(function(jdata) {
         var jsdata = JSON.parse(JSON.stringify(jdata));
         var found = false;

         for (var i = 0; i < jsdata.length; i++)
         {
           if ($('#addvoterconstid').val() == jsdata[i].constituencyid)
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
          $.ajax({
            type: 'POST',    
            url:'http://localhost:3000/appendvoter',
            data:'addvotercnic='+ $('#addvotercnic').val() + '&addvotername=' + $('#addvotername').val() + '&addvoterpassword=' + $('#addvoterpassword').val() + '&addvotercontactno=' + $('#addvotercontactno').val()+ '&addvoterconstid=' + $('#addvoterconstid').val(),
            success: function(msg) {
            addmodal.style.display = "none";
            RefreshTable();
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
            if ($('#editvoterconstid').val() == jsdata[i].constituencyid)
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
            $.ajax({
              type: 'POST',    
              url:'http://localhost:3000/updatevoter',
              data:'editvotercnic='+ $('#editvotercnic').val() + '&editvotername=' + $('#editvotername').val() + '&editvoterpassword=' + $('#editvoterpassword').val() + '&editvotercontactno=' + $('#editvotercontactno').val()+ '&editvoterconstid=' + $('#editvoterconstid').val(),
              success: function(msg) {
              editmodal.style.display = "none";
              RefreshTable();
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