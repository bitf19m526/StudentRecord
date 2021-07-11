var db = openDatabase("recordDB", "1.0", "recordDB", 65535); // recordDB is the database name

$(function () {

    //loadData(); //loading our records



    //CREATING TABLE STARTS HERE

    $("#create").click(function () {
        db.transaction(function (transaction) {
            var sql = "CREATE TABLE record " +
                "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
                "Stu_ID VARCHAR(100) NOT NULL," +
                "Stu_Name VARCHAR(100) NOT NULL," +
                "Stu_Degree VARCHAR(50) NOT NULL," +
                "Stu_semester INT(1) NOT NULL," +
                "Stu_Email VARCHAR(50) NOT NULL)";

            transaction.executeSql(sql, undefined, function () {
                alert("Table is created successfully");
            }, function () {
                alert("Table is already being created");
            })
        });
    });
    // CREATING TABLE ENDS HERE



    //DELETING TABLE STARTS HERE
    $("#remove").click(function () {

        if (!confirm("Are you sure to delete this table?", "")) return;;
        db.transaction(function (transaction) {
            var sql = "DROP TABLE record";
            transaction.executeSql(sql, undefined, function () {
                alert("Table is deleted successfully")
            }, function (transaction, err) {
                alert(err.message);
            })
        });
    });
    //DELETING TABLE ENDS HERE


    //INSERTING DATA INTO TABLE

    $("#insert").click(function () {
        if($("#id").val() !== null && $("#name").val() !==null && $("#sem").val() !== null &&  $("#deg").val() !== null && $("#email").val() !== null){
            if($('#email').val().indexOf('@') == -1){
                $('#email').val($('#email').val().toUpperCase() + '@pucit.edu.pk');
            }
            
            var id = $("#id").val().toUpperCase();
            var name = $("#name").val().toUpperCase();
            var sem = $("#sem").val();
            var deg = $("#deg").val().toUpperCase();
            var email = $("#email").val();

            db.transaction(function (transaction) {
                var sql = "INSERT INTO record(Stu_ID,Stu_Name,Stu_Degree,Stu_semester,Stu_Email) VALUES(?,?,?,?,?)";
                transaction.executeSql(sql, [id, name, deg, sem, email], function () {
                    alert("New record is added successfully");
                }, function (transaction, err) {
                    alert(err.message);
                })
            })
            $("#list").click();
        }
        else{
            alert("Fileds Are Empty");
        }
    })
    //INSERTING DATA ENDS HERE


    //FETCHING OUR RECORD
    $("#list").click(function () {
        loadData();
    })



    //FUNCTION TO LOAD OUR RECORDS
    function loadData() {
        $("#recordlist").children().remove();
        db.transaction(function (transaction) {
            var sql = "SELECT * FROM record ORDER BY Stu_ID";
            transaction.executeSql(sql, undefined, function (transaction, result) {
                if (result.rows.length) {
                    var k = 0;
                    for (var i = 0; i < result.rows.length; i++) {
                        k++;
                        var row = result.rows.item(i);
                        var id = row.id;
                        var stuid = row.Stu_ID;
                        var name = row.Stu_Name;
                        var deg = row.Stu_Degree;
                        var email = row.Stu_Email;
                        var semester = row.Stu_semester;
                        $("#recordlist").append('<tr id="del' + id + '"> <td>' + k + '</td><td>' + stuid + '</td> <td id="newname' + id + '">' + name + '</td>  <td id="newsem' + id + '">' + semester + '</td> <td>' + deg + '</td> <td><a href = "mailto:' + email + '">' + email + '</a></td> <td><a href="#" class="btn btn-danger deleteitem" data-id="' + id + '">Delete</a> <a href="#" class="btn btn-primary updateitem" data-id="' + id + '">Update</a></td></tr>');
                    }
                } else {
                    $("#recordlist").append('<tr><td colspan="3" align="center">No Item Found</td></tr>');
                }
            }, function (transaction, err) {
                alert('No table found. Click on "Create Table" to create table now');
            })
        })


        //setTimeout was used to execute codes inside it to be loaded after records are loaded/fetched.

        setTimeout(function () {
            $(".deleteitem").click(function () {
                var sure = confirm("Are you sure to delete this item?");
                if (sure === true) {
                    var id = $(this).data("id");
                    db.transaction(function (transaction) {
                        var sql = "DELETE FROM record where id=?";
                        transaction.executeSql(sql, [id], function () {
                            $("#del" + id).fadeOut();
                            alert("Item is deleted successfully");
                        }, function (transaction, err) {
                            alert(err.message);
                        })
                    });
                }
            })

            $(".updateitem").click(function () {
                
                var id = $(this).data("id");
                var old_name = $("#newname"+id).text();
                var old_sem = $("#newsem"+id).text();

                var name = prompt("Kindly enter Updated Name", old_name);
                var sem = prompt("Kindly enter Updated Semester", old_sem);
                
                if ((name !== null && name !== old_name) || (sem !== null && sem !== old_sem)) {
                    name = name.toUpperCase();
                    db.transaction(function (transaction) {
                        var sql = "UPDATE record SET Stu_Name=?, Stu_semester = ? where id=?";
                        transaction.executeSql(sql, [name,sem, id], function () {
                            $("#newname" + id).html(name);
                            alert("Item is updated successfully");
                        }, function (transaction, err) {
                            alert(err.message);
                        })
                    });
                    $("#list").click();
                }
                
            })

        }, 1000);


    }
    //END OF loadData() function
});
