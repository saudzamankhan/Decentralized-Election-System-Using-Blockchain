// Get the modal
var editmodal = null;
var addmodal = null;

function TableDataFetcher()
{
  $.get("http://localhost:3000/fetchadmins").done(function(jdata) {
    var jsdata = JSON.parse(JSON.stringify(jdata));
    $('#example').DataTable({
      processing: true,
      data: jsdata,
      columns: [
      { data: "adminCNIC"},
      { data: "name"},
      { data: "city"},
      { data: "contactno"},
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
    $.get("http://localhost:3000/fetchadmins").done(function(jdata) {
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
        $('#editadmincnic').val(rowData.adminCNIC);
        $('#editadminname').val(rowData.name);
        $('#editadmincity').val(rowData.city);
        $('#editadmincontactno').val(rowData.contactno);
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
          url:'http://localhost:3000/deleteadmin',
          data:'deleteadmincnic='+ rowData.adminCNIC,
          success: function(msg) {
           alert("Business card has been revoked!");
           RefreshTable();  
          }
        });
      });

      $(document).on('click', '#addformpress', function() {
        $.ajax({
          type: 'POST',    
          url:'http://localhost:3000/appendadmin',
          data:'addadmincnic='+ $('#addadmincnic').val() + '&addadminname=' + $('#addadminname').val() + '&addadmincity='+ $('#addadmincity').val() +'&addadmincontactno='+ $('#addadmincontactno').val(),
          success: function(msg) {
          addmodal.style.display = "none";
          alert("Business card created in the directory!");
          RefreshTable();
          }
        });
      });

      $(document).on('click', '#updateformpress', function() {
        $.ajax({
          type: 'POST',    
          url:'http://localhost:3000/updateadmin',
          data:'editadmincnic='+ $('#editadmincnic').val() + '&editadminname=' + $('#editadminname').val() + '&editadmincity='+ $('#editadmincity').val() +'&editadmincontactno='+ $('#editadmincontactno').val(),
          success: function(msg) {
          editmodal.style.display = "none";
          RefreshTable();
          }
        });
      });

        // close the modal
        $(document).on('click', '.closed', function() {
          editmodal.style.display = "none";
          addmodal.style.display = "none";
        });