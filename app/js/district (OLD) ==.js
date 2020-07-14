//FIRESTORE MIGRATED
function validateAccountState(page) {
    var email = localStorage.getItem('email');

    //OLD CODE
    // var _ref = firebase.database().ref().child("UserData").child(email).child('Account Status');

    // _ref.once('value').then(function (snapshot) {
    //     if (snapshot.val() == "Deactivated") {
    //         document.getElementById('deactivatedAccountSection').style.display = "initial";
    //         document.getElementById('createDistrictOptions').style.display = "none";

    //         return "Deactivated";

    //     } else if (snapshot.val() == "Activated") {

    //         if (page == 'dashboard') {
    //             getDistrictID();

    //             getDistrictStatus();
    //         }

    //         if (page == 'createPage') {
    //             getDistrictStatusCreatePage();

    //              getDistrictID();
    //         }

    //         if(page == "schoolsPage"){
    //             getDistrictID();

    //             getSchoolStatusManageSchoolsScreen();
    //         }

    //         return "Activated";
    //     }
    // });

    //NEW CODE
    var accountStatus = firebase.firestore().collection("UserData").doc(email).get().then((docSnap) => {
        docSnap.data()['Account Status'];
    });

    if (accountStatus == "Deactivated") {
        document.getElementById('deactivatedAccountSection').style.display = "initial";
        document.getElementById('createDistrictOptions').style.display = "none";

        return "Deactivated";

    } else if (accountStatus == "Activated") {

        if (page == 'dashboard') {
            getDistrictID();

            getDistrictStatus();
        }

        if (page == 'createPage') {
            getDistrictStatusCreatePage();

            getDistrictID();
        }

        if (page == "schoolsPage") {
            getDistrictID();

            getSchoolStatusManageSchoolsScreen();
        }

        return "Activated";
    }

}

//FIResTORE mIGRATED
//                                                 CHECK THIS CODE FOR ERRORS !!
function getDistrictStatus() {
    var email = localStorage.getItem('email');

    // var _ref = firebase.database().ref().child("UserData").child(email).child('Districts');

    // _ref.once('value').then(function (snapshot) {

    //     if (snapshot.val() == null) {
    //         document.getElementById('createDistrictOptions').style.display = "initial";
    //         document.getElementById('districtInfo-stats').style.display = "none";
    //     } else {
    //         document.getElementById('districtInfo-stats').style.display = "initial";
    //         document.getElementById('createDistrictOptions').style.display = "none";

    //         var key = 0;

    //         snapshot.forEach((child) => {
    //             key = child.child('Code').val();
    //         });

    //         getDistrictData(key);
    //     }
    // });

    //NEW CODE
    var districts = firebase.firestore().collection("UserData").document(email).collection("Districts").get().then((querySnap) => {
        querySnap.data()['Account Status'];


        if (districts == null) {
            document.getElementById('createDistrictOptions').style.display = "initial";
            document.getElementById('districtInfo-stats').style.display = "none";
        } else {
            document.getElementById('districtInfo-stats').style.display = "initial";
            document.getElementById('createDistrictOptions').style.display = "none";

            var key = 0;

            // snapshot.forEach((child) => {
            //     key = child.child('Code').val();
            // });

            querySnap.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                key = doc.data()['Code'];
            });

            getDistrictData(key);

        }
    });
}


//FIRESTORE NOT FINISHED
//                                             CHECK THIS CODE FOR ERRORS !!
function getSchoolStatusManageSchoolsScreen() {
    //OLD CODE
    // var districtID = localStorage.getItem('district id');

    // console.log("TESTING...");

    // var _ref = firebase.database().ref().child("Districts").child(districtID).child('Schools');

    // _ref.once('value').then(function (snapshot) {
    //     if (snapshot.exists()) {
    //         document.getElementById('createSchoolMessage').style.display = "none";
    //         document.getElementById('schoolsInfoSection').style.display = "initial";

    //         getSchoolsData();
    //     } else {
    //         document.getElementById('createSchoolMessage').style.display = "initial";
    //         document.getElementById('schoolsInfoSection').style.display = "none";
    //     }
    // });

    //NEW CODE
    var districtID = localStorage.getItem('district id');

    console.log('TESTING...');

    var schools = firebase.firestore().collection("Districts").doc(districtID).collection('Schools')
        .get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());

                if (doc.exists()) {
                    document.getElementById('createSchoolMessage').style.display = "none";
                    document.getElementById('schoolsInfoSection').style.display = "initial";
        
                    getSchoolsData();
                } else {
                    document.getElementById('createSchoolMessage').style.display = "initial";
                    document.getElementById('schoolsInfoSection').style.display = "none";
                }
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });

      
       


}

function getDistrictID() {
    var email = localStorage.getItem('email');

    var _ref = firebase.database().ref().child("UserData").child(email).child('Districts');

    _ref.once('value').then(function (snapshot) {

        if (snapshot.val() == null) {
            return null;
        } else {
            var key = 0;

            snapshot.forEach((child) => {
                key = child.child('Code').val();
            });

            console.log("district id:" + key);

            localStorage.setItem("district id", key);

            return key;


        }
    });
}

function getDistrictStatusCreatePage() {
    var email = localStorage.getItem('email');

    var _ref = firebase.database().ref().child("UserData").child(email).child('Districts');

    _ref.once('value').then(function (snapshot) {
        //console.log(snapshot.val());

        if (snapshot.val() == null) {
            document.getElementById('createDistrict-page').style.display = "initial";
            document.getElementById('quotaReached').style.display = "none";
        } else {
            document.getElementById('createDistrict-page').style.display = "none";
            document.getElementById('quotaReached').style.display = "initial";
        }
    });
}

function createDistrict() {

    var userEmail = localStorage.getItem('email');
    var name = document.getElementById('districtName').value;
    var email = document.getElementById('districtEmail').value;
    var website = document.getElementById('districtWebsite').value;
    var headOffice = document.getElementById('districtAddress').value;
    var headEmail = document.getElementById('districtEmailHead').value;
    var phone = document.getElementById('districtPhone').value;
    var socialMedia = document.getElementById('districtSocialMedia').value;

    var errorMessage = document.getElementById('districtCreateError');

    if (name, email, website, headOffice, headEmail, phone, socialMedia == "") {

        var errorHTML = `
        <div class="alert alert-danger" role="alert"
        style="margin-top: 20px; width: 100%;">
        <strong>Error! </strong> You can't leave any fields blank
    </div>
        `;

        errorMessage.innerHTML = errorHTML;

    } else {
        errorMessage.innerHTML = "";

        var code = Math.floor(100000 + Math.random() * 900000);

        console.log(code);

        var _ref = firebase.database().ref().child('Districts').child(code).child('Name');

        _ref.once('value').then(function (snapshot) {
            var exists = snapshot.val();

            while (exists != null) {

                function generateNew() {
                    _newRef.once('value').then(function (snapshot) {
                        if (snapshot.val() == null) {
                            code = newCode;
                            return true;
                        } else {
                            return false;
                        }
                    });
                }
                console.log("exists");
                var newCode = Math.floor(100000 + Math.random() * 900000);

                console.log(newCode);

                var _newRef = firebase.database().ref().child('Districts').child(newCode).child('Name');

                var newCode = generateNew();

                if (newCode == true) {
                    break
                }


            }
        }).then(() => {
            var _ref = firebase.database().ref().child('Districts').child(code);

            _ref.child("Name").set(name);
            _ref.child("Email").set(email);
            _ref.child("Website").set(website);
            _ref.child("Address").set(headOffice);
            _ref.child("Head Email").set(headEmail);
            _ref.child("Phone").set(phone);
            _ref.child("Social Media Links").set(socialMedia);
            _ref.child("Code").set(code);

            var _ref = firebase.database().ref().child('UserData').child(userEmail).child("Districts").child(code);

            _ref.child("Name").set(name);
            _ref.child("Code").set(code);
        });
    }
}

function getDistrictData(code) {
    var students = 0;
    var teachers = 0;
    var schools = 0;
    var pendingTeacherRequests = 0;

    var districtName = "";

    //District NAME GET

    var _districtNameRef = firebase.database().ref().child('Districts').child(code).child("Name");

    _districtNameRef.once('value').then(function (snapshot) {
        var value = snapshot.val();

        if (value == null || value == undefined) {
            $('#districtName').text("Loading...");
        } else {
            districtName = snapshot.val();
            $('#districtName').text(districtName);
        }
    });

    //STUDENTS GET

    var _studentRef = firebase.database().ref().child('Districts').child(code).child("Student Count");

    _studentRef.once('value').then(function (snapshot) {
        var value = snapshot.val();

        if (value == null || value == undefined) {
            students = 0;
            _studentRef.set(students);
        } else {
            students = snapshot.val();

            $('#studentsCount').text(students);
        }
    });

    //TEACHERS GET

    var _teacherRef = firebase.database().ref().child('Districts').child(code).child("Teacher Count");

    _teacherRef.once('value').then(function (snapshot) {
        var value = snapshot.val();

        if (value == null || value == undefined) {
            teachers = 0;
            _teacherRef.set(teachers);
        } else {
            teachers = snapshot.val();

            $('#teachersCount').text(teachers);
        }
    });

    //SCHOOLS GET

    var _schoolsRef = firebase.database().ref().child('Districts').child(code).child("Schools Count");

    _schoolsRef.once('value').then(function (snapshot) {
        var value = snapshot.val();

        if (value == null || value == undefined) {
            schools = 0;
            _schoolsRef.set(schools);
        } else {
            schools = snapshot.val();

            $('#schoolsCount').text(schools);
        }
    });

    //PENDING REQUESTS GET

    var _pendingRequestsRef = firebase.database().ref().child('Districts').child(code).child("Pending Requests");

    _pendingRequestsRef.once('value').then(function (snapshot) {
        var value = snapshot.val();

        if (value == null || value == undefined || value == 0) {
            pendingTeacherRequests = 0;
            _pendingRequestsRef.set(pendingTeacherRequests);
        } else {
            pendingTeacherRequests = snapshot.val();

            $('#pendingRequests').html(`${pendingTeacherRequests} <span class="badge badge-warning" style="padding-top: -6px;">New</span>`);
        }
    });

    //PLAN DETAILS GET

    var _planDetailsRef = firebase.database().ref().child('Districts').child(code).child("Plan Details");

    _planDetailsRef.once('value').then(function (snapshot) {

        var value = snapshot.val();

        var planActivated = snapshot.child("Plan Activated").val();
        var planExpires = snapshot.child("Plan Expires").val();
        var planName = snapshot.child("Plan Name").val();
        var planStatus = snapshot.child("Plan Status").val();

        if (planStatus == null || planStatus == undefined || planStatus == "Deactivated") {
            $('#planStatus').html(`<span class="badge badge-danger" >Inactive</span>`);

        } else {

            $('#planStatus').html(`<span class="badge badge-success" >${planStatus}</span>`);
            $('#activatedDate').text(planActivated);
            $('#expireDate').text(planExpires);
            $('#planName').html(`<span class="badge badge-warning" >${planName}</span>`);

            function dateDiffInDays(date1, date2) {
                // round to the nearest whole number
                return Math.round((date2 - date1) / (1000 * 60 * 60 * 24));
            }
            var totalDays = dateDiffInDays(new Date(planActivated), new Date(planExpires));

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();

            today = mm + '/' + dd + '/' + yyyy;


            var untilExpireDays = dateDiffInDays(new Date(today), new Date(planExpires));

            if (totalDays == 0) {
                console.log("PLAN EXPIRED");
            }

            console.log(totalDays);


            console.log("DAYS LEFT: " + untilExpireDays);

            var percentage = Math.round((untilExpireDays / totalDays) * 100);

            console.log(percentage + "%");

            document.getElementById('percentageBar').style.width = percentage + "%";
        }
    });


}

function showSchoolsOptionClick() {
    document.getElementById('createSchoolMessage').style.display = "none";
    document.getElementById('createSchool-page').style.display = "initial";
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function createSchool() {

    var userEmail = localStorage.getItem('email');

    var schoolName = document.getElementById('schoolName').value;
    var schoolWebsite = document.getElementById('schoolWebsite').value;
    var schoolAddress = document.getElementById('schoolAddress').value;
    var principalEmail = document.getElementById('principalEmail').value;
    var schoolPhone = document.getElementById('schoolPhone').value;
    var schoolLogo = document.getElementById('schoolLogoLink').value;

    var errorMessage = document.getElementById('schoolCreateError');

    var districtID = localStorage.getItem('district id');

    afterDistrictID(districtID);


    function afterDistrictID(districtID) {
        console.log(districtID);

        if (schoolName, schoolWebsite, schoolAddress, principalEmail, schoolPhone, schoolLogo == "") {

            var errorHTML = `
            <div class="alert alert-danger" role="alert"
            style="margin-top: 20px; width: 100%;">
            <strong>Error! </strong> You can't leave any fields blank
        </div>
            `;

            errorMessage.innerHTML = errorHTML;

        } else {
            errorMessage.innerHTML = "";

            var schoolCode = makeid(6);

            console.log(schoolCode);

            var _ref = firebase.database().ref().child('Districts').child(districtID).child('Schools').child(schoolCode);

            _ref.once('value').then(function (snapshot) {
                var exists = snapshot.val();

                while (exists != null) {

                    function generateNew() {
                        _newRef.once('value').then(function (snapshot) {
                            if (snapshot.val() == null) {
                                schoolCode = snapshot.val();
                                return true;
                            } else {
                                return false;
                            }
                        });
                    }
                    console.log("exists");
                    var schoolCode = makeid(6);

                    console.log(schoolCode);

                    var _newRef = firebase.database().ref().child('Districts').child(districtID).child('Schools').child(schoolCode);

                    var newCodeGenerated = generateNew();

                    if (newCodeGenerated == true) {
                        break
                    }


                }
            }).then(() => {

                var _ref1 = firebase.database().ref().child('Districts').child(districtID).child("Schools Count");

                _ref1.once('value').then(function (snapshot) {
                    if (snapshot.val() == null || snapshot.val() == undefined) {
                        _ref1.set("1");
                    } else {
                        var value = snapshot.val();

                        _ref1.set((Number(value) + 1));


                    }
                });



                var _ref = firebase.database().ref().child('Districts').child(districtID).child("Schools").child(schoolCode);

                _ref.child("School Name").set(schoolName);
                _ref.child("School Website").set(schoolWebsite);
                _ref.child("School Address").set(schoolAddress);
                _ref.child("Principal Email").set(principalEmail);
                _ref.child("School Phone").set(schoolPhone);
                _ref.child("School Logo Links").set(schoolLogo);
                _ref.child("School Code").set(schoolCode);
            });

            document.getElementById("createSchool-page").style.display = "none";

            document.getElementById("schoolCreateSuccess").style.display = "initial";

            document.getElementById("schoolCodeCopy").value = schoolCode;
        }
    }


}

function copyToClipboard(schoolCode = "") {


    var clipboard = new ClipboardJS('.btn btn-primary');

    document.getElementById('copyButtonText' + schoolCode).innerText = "Copied!";

    console.log("copied!");

    clipboard.on('success', function (e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);

        document.getElementById('copyButtonText' + schoolCode).innerText = "Copied!";

        e.clearSelection();
    });

    clipboard.on('error', function (e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });


}

function getSchoolsData() {
    var districtID = localStorage.getItem('district id');

    var _ref = firebase.database().ref().child("Districts").child(districtID).child("Schools");

    _ref.once('value').then(function (snapshot) {

        console.log(snapshot.val());

        snapshot.forEach((child) => {
            elementHTML = `
            <div class="col-xl-12 col-md-6 mb-4">
                  <div class="card border-left-primary shadow h-100 py-2">
                    <div class="card-body">
                      <div class="row no-gutters align-items-center">
                        <div class="col mr-2">

                          <div class="row" style="margin-left: 4px;">
                            <i class="fas fa-users"></i>

                            <h5 style="margin-left: 5px; margin-top: -4px;">901 Students</h5>
                          </div>

                          <div class="h5 mb-0 font-weight-bold text-gray-800">${child.child("School Name").val()}</div>
                        </div>

                        

                        <div class="col-auto" style="margin-right: 10px;">
                          <a href="#" class="btn btn-primary btn-circle btn-lg">
                            <i class="fas fa-eye"></i>
                          </a>
                        </div>

                        <div class="col-auto" style="margin-right: 10px;">
                          <a data-toggle="collapse" href="#inviteInfoCollapse${child.child("School Code").val()}" role="button" aria-expanded="false" aria-controls="inviteInfoCollapse${child.child("School Code").val()}" class="btn btn-primary btn-circle btn-lg">
                            <i class="fas fa-user-plus"></i>
                          </a>
                        </div>

                        <div class="col-auto">
                          <a data-toggle="collapse" href="#multiCollapse${child.child("School Code").val()}" role="button" aria-expanded="false" aria-controls="multiCollapse${child.child("School Code").val()}" class="btn btn-primary btn-circle btn-lg">
                            <i class="far fa-edit"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="collapse multi-collapse" id="multiCollapse${child.child("School Code").val()}">
                    <div class="card card-body">
                     
                      <h2>Edit School</h2>
  
                      <div class="row" style="margin-left: 3px;">
  
                        <div class="col">
                          <h5>School Name</h5>
                          <input type="text" class="form-control bg-light border-3 large" placeholder="" aria-label="Search" aria-describedby="basic-addon2" id = "schoolName${child.child("School Code").val()}" style="margin-bottom: 1%;" value = '${child.child("School Name").val()}'>  
                        </div>
  
                        <div class="col">
                          <h5>School Website</h5>
                          <input type="text" class="form-control bg-light border-3 large" placeholder="" aria-label="Search" aria-describedby="basic-addon2" id = "schoolWebsite${child.child("School Code").val()}" style="margin-bottom: 1%;" value = '${child.child("School Website").val()}'>  
                        </div>
  
                        <div class="col">
                          <h5>School Phone</h5>
                          <input type="tel" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" class="form-control bg-light border-3 large" placeholder="" aria-label="Search" aria-describedby="basic-addon2" id = "schoolPhone${child.child("School Code").val()}" style="margin-bottom: 1%;" value = '${child.child("School Phone").val()}'>
                        </div>
  
                      </div>
  
                      <div class="row" style="margin-left: 3px;">
  
                        <div class="col">
                          <h5>School Address</h5>
                          <input type="text" class="form-control bg-light border-3 large" placeholder="" aria-label="Search" aria-describedby="basic-addon2" id = "schoolAddress${child.child("School Code").val()}" style="margin-bottom: 1%;" value = '${child.child("School Address").val()}'>  
                        </div>
  
                        <div class="col">
                          <h5>Principal Email</h5>
                          <input type="text" class="form-control bg-light border-3 large" placeholder="" aria-label="Search" aria-describedby="basic-addon2" id = "principalEmail${child.child("School Code").val()}" style="margin-bottom: 1%;" value = '${child.child("Principal Email").val()}'>  
                        </div>
  
                      </div>

                      <div id = "updateErrorList${child.child('School Code').val()}">

                      </div>
  
                      <div class="float-right" style="margin-left: 11px; margin-top: 10px;">
                        <a href="#" class="btn btn-primary btn-icon-split btn-m" style="width: 150px;" align = "right" onclick="updateSchoolInfo('${child.child('School Code').val()}')">
                          <span class="text" >Save Changes</span>
                        </a>
                      </div>
                    </div>
  
                  </div>


               
                  <div class="collapse multi-collapse" id="inviteInfoCollapse${child.child("School Code").val()}">
                    <div class="card card-body">

                      <h5 style="margin-left: 20px;">School ID</h5>

                      <form class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                        <div class="input-group">
                          <input type="text" class="form-control bg-light border-4 small" value = "${child.child("School Code").val()}" placeholder="loading..." aria-label="Search" aria-describedby="basic-addon2" id = "schoolCodeCopy${child.child("School Code").val()}" readonly>
                          <div class="input-group-append">
                            <button class="btn btn-primary" type="button" data-clipboard-action="copy" data-clipboard-target = "#schoolCodeCopy${child.child("School Code").val()}" id = "copyButtonText${child.child("School Code").val()}" onclick="copyToClipboard('${child.child("School Code").val()}')">
                              Copy
                            </button>
                          </div>
                        </div>
                      </form>


                    </div>
                  </div>
                </div>
            `;

            $(elementHTML).appendTo('#schoolsList');

        });

    });

}

function updateSchoolInfo(schoolCode) {
    var districtID = localStorage.getItem('district id');

    var schoolName = document.getElementById('schoolName' + schoolCode).value;
    var schoolWebsite = document.getElementById('schoolWebsite' + schoolCode).value;
    var schoolPhone = document.getElementById('schoolPhone' + schoolCode).value;
    var schoolAddress = document.getElementById('schoolAddress' + schoolCode).value;
    var principalEmail = document.getElementById('principalEmail' + schoolCode).value;

    if (schoolName === "" || schoolWebsite === "" || schoolPhone === "" || schoolAddress === "" || principalEmail === "") {

        errorHTML = `
        <div class="alert alert-danger" role="alert" style = "margin-left: 6px; margin-top: 10px;">
        You cannot leave any fields blank
      </div>
        `;

        document.getElementById('updateErrorList' + schoolCode).innerHTML = errorHTML;


    } else {
        var _ref = firebase.database().ref().child("Districts").child(districtID).child('Schools').child(schoolCode);

        _ref.child("School Name").set(schoolName);
        _ref.child("School Website").set(schoolWebsite);
        _ref.child("School Phone").set(schoolPhone);
        _ref.child("School Address").set(schoolAddress);
        _ref.child("Principal Email").set(principalEmail);

        $('#multiCollapse' + schoolCode).collapse('toggle');

        location.reload();
    }



}

function toggleCreateSchoolView() {

    document.getElementById("schoolsInfoSection").style.display = "none";
    document.getElementById("createSchool-page").style.display = "initial";

}
