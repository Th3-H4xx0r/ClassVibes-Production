function initializeFirebase(){
    var firebaseConfig = {
        apiKey: "AIzaSyA2ESJBkNRjibHsQr2UTHtyYPslzNleyXw",
        authDomain: "cyberdojo-a2a3e.firebaseapp.com",
        databaseURL: "https://cyberdojo-a2a3e.firebaseio.com",
        projectId: "cyberdojo-a2a3e",
        storageBucket: "cyberdojo-a2a3e.appspot.com",
        messagingSenderId: "938057332518",
        appId: "1:938057332518:web:99c34da5abf1b1548533e7",
        measurementId: "G-0EWJ1V40VX"
    };
    firebase.initializeApp(firebaseConfig);
}

//FIRESTORE MIGRATED
function validateDistrictStatus(page) {
    var email = localStorage.getItem('email');
    var districtID = localStorage.getItem('district id');

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
    firebase.firestore().collection("Districts").doc(districtID).get().then((docSnap) => {
        var districtStatus = docSnap.data()['Status'];
        
        console.log("Working");

        
    if (districtStatus == "Deactivated") {
        document.getElementById('deactivatedDistrictSection').style.display = "initial";

        if(page != "createPage"){
            document.getElementById('createDistrictOptions').style.display = "none";
        } 


        
    console.log("Deactivated");

        return "Deactivated";

    } else if (accountStatus == "Activated") {

        if (page == 'dashboard') {
            getDistrictID();

            getDistrictStatus();
        }

        if (page == 'createPage') {
            getDistrictStatusCreatePage();

            getDistrictID();

            
            console.log("Create page");
        }

        if (page == "schoolsPage") {
            getDistrictID();

            getSchoolStatusManageSchoolsScreen();
        }

        return "Activated";
    }
    });


}

//FIResTORE mIGRATED
             

function getDistrictStatus(page) {
    var email = localStorage.getItem('email');

    var districtID = localStorage.getItem('district id');

    firebase.firestore().collection("Districts").doc(districtID).get().then((querySnap) => {

        var data = querySnap.data();

        if(data['Status'] != "Activated"){
            if(page == 'schoolpage'){
                document.getElementById('createSchool-page').style.display = "none";
                //document.getElementById('deactivatedDistrictSection').style.display = "initial";
                document.getElementById('main-body-content').innerHTML = `
                <section id="deactivatedDistrictSection">
                <center style="margin-top: 22%;">
                    <i class="fas fa-exclamation-triangle fa-4x"></i>
                    <p style="margin-top: 10px;"> District Activation Required. Please <br> contact <a
                            href="mailto:sales@classvibes.net" target="blank">sales@classvibes.net</a> for
                        activating your account. <br> <h4> Your district id is: </h4><h3>${districtID}</h3></p>
                </center>
            </section>
                `;
            } 
            else if(page == 'dashboard'){
                //document.getElementById('deactivatedDistrictSection').style.display = "initial";

                document.getElementById('districtInfo-stats').style.display = "none";

                document.getElementById('main-body-content').innerHTML = `
                <section id="deactivatedDistrictSection">
                <center style="margin-top: 22%;">
                    <i class="fas fa-exclamation-triangle fa-4x"></i>
                    <p style="margin-top: 10px;"> District Activation Required. Please <br> contact <a
                            href="mailto:sales@classvibes.net" target="blank">sales@classvibes.net</a> for
                        activating your account. <br> <h4>Your district id is:</h4> <h3>${districtID}</h3></p>
                </center>
            </section>
                `;



                
            }

            else if(page == 'schoolpage'){

                console.log('school page is locked');
     
                document.getElementById('main-body-content').innerHTML = `
                <section id="deactivatedDistrictSection">
                <center style="margin-top: 22%;">
                    <i class="fas fa-exclamation-triangle fa-4x"></i>
                    <p style="margin-top: 10px;"> District Activation Required. Please <br> contact <a
                            href="mailto:sales@classvibes.net" target="blank">sales@classvibes.net</a> for
                        activating your account. <br> <h4>Your district id is:</h4> <h3>${districtID}</h3></p>
                </center>
            </section>
                `;



                
            }
            
        } else {

            if(page == 'schoolpage'){
                console.log('school page is NOT locked');
                getSchoolStatusManageSchoolsScreen();
                //document.getElementById('deactivatedDistrictSection').style.display = "none";
            } 
            else if(page == 'dashboard'){
                document.getElementById('districtInfo-stats').style.display = "initial";
                getDistrictData(districtID);
                //document.getElementById('deactivatedDistrictSection').style.display = "none";
            }


        }

        /*

        var index = 0;

        querySnap.forEach(function (doc) {
            index += 1;

            var districts = doc.data()['Account Status'];

            document.getElementById('districtInfo-stats').style.display = "initial";
            document.getElementById('createDistrictOptions').style.display = "none";

            var key = 0;

            key = doc.data()['Code'];


            getDistrictData(key);

        });

        if(index == 0){
            document.getElementById('createDistrictOptions').style.display = "initial";
            document.getElementById('districtInfo-stats').style.display = "none";
        }
        */

    });
}


//FIRESTORE MIGRATED FULLY
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

    firebase.firestore().collection("Districts").doc(districtID).collection('Schools').get().then(function(querySnapshot) {

        var index = 0;

            querySnapshot.forEach(function(doc) {
                index += 1
                // doc.data() is never undefined for query doc snapshots

                var data = doc.data();
                console.log(doc.id, " => ", doc.data());

                if (data != null && data != undefined) {
                    document.getElementById('main-body-content').innerHTML = `
                    <section id = "schoolsInfoSection">

                    <div class="row" style="justify-content: space-between; margin-left: 10px;">
                      <h1>My Schools</h1>
    
                      <button class="btn btn-primary btn-icon-split btn-lg" onclick="toggleCreateSchoolView()" style="margin-bottom: 20px;">
                        <span class="text" style="margin-top: 5px;">Create School</span>
                      </button>
                    </div>
    
                  <div id = "schoolsList">
    
                  </div>
                </section>
                    `;
        
                    getSchoolsData();
                } else {
                    document.getElementById('main-body-content').innerHTML = `
                    <section id = "createSchoolMessage">
    
                    <center style="margin-top: 14%;">
    
                        <img src="img/undraw_quite_town_mg2q.svg" width="20%" style="margin-bottom: 2%;">
    
                        <h2>No Schools</h2>
    
                        <p>Create a school to get started</p>
    
                        <a href="#" class="btn btn-primary btn-icon-split btn-m"
                                    onclick="showSchoolsOptionClick()">
                                    <span class="icon text-white-50">
                                        <i class="fas fa-arrow-right"></i>
                                    </span>
                                    <span class="text">Create School</span>
                                </a>
    
                 </center>
    
                </section>
                    `;

                }
            });

            if(index == 0){

                console.log('NO Schools')

                document.getElementById('main-body-content').innerHTML = `
                <section id = "createSchoolMessage">

                <center style="margin-top: 14%;">

                    <img src="img/undraw_quite_town_mg2q.svg" width="20%" style="margin-bottom: 2%;">

                    <h2>No Schools</h2>

                    <p>Create a school to get started</p>

                    <a href="#" class="btn btn-primary btn-icon-split btn-m"
                                onclick="showSchoolsOptionClick()">
                                <span class="icon text-white-50">
                                    <i class="fas fa-arrow-right"></i>
                                </span>
                                <span class="text">Create School</span>
                            </a>

             </center>

            </section>
                `;
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });

      
       


}

//FIRESTORE MIGRATED FULLY
function getDistrictID(page) {
    var email = localStorage.getItem('email');

    firebase.firestore().collection('UserData').doc(email).collection('Districts').get().then(snapshot => {

        var index = 0;

        snapshot.forEach(doc => {
            index += 1

            var data = doc.data();
            if (data == null) {
                return null;
            } else {
                var key = 0;

                key = data['Code'];
    
                console.log("district id:" + key);
    
                localStorage.setItem("district id", key);
    
                return key;
    
            }
        })

        if(index == 0){
            localStorage.setItem("district id", null);
        }


    }).then(() => {
        if(page == 'dashboard'){
            var districtID = localStorage.getItem('district id')

            console.log(districtID);

            if(districtID == null || districtID == undefined || districtID == "null"){
                document.getElementById('createDistrictOptions').style.display = "initial";
            } else {
                getDistrictStatus('dashboard');
            }
        }

        else if(page == 'createpage'){
            var districtID = localStorage.getItem('district id')

            console.log(districtID);

            if(districtID == null || districtID == undefined || districtID == "null"){
                document.getElementById('createDistrict-page').style.display = "initial";
            } else {
                document.getElementById('quotaReached').style.display = "initial";
            }
        }

        else if(page == 'schoolpage'){
            var districtID = localStorage.getItem('district id')

            console.log(districtID);

            if(districtID == null || districtID == undefined || districtID == "null"){

                document.getElementById('createDistrictOptions').style.display = "initial";

            } else {

                getDistrictStatus('schoolpage');
            }
        }


    })

    /*

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
    */
}

//Firestore Migrated FUlly
function getDistrictStatusCreatePage() {
    var email = localStorage.getItem('email');

    firebase.firestore().collection('UserData').doc(email).collection('Districts').get().then(snap => {

        var index = 0;
        snap.forEach(doc => {
            index += 1
            var data = doc.data()
            if ( data == null) {
                document.getElementById('createDistrict-page').style.display = "initial";
                document.getElementById('quotaReached').style.display = "none";
            } else {
                document.getElementById('createDistrict-page').style.display = "none";
                document.getElementById('quotaReached').style.display = "initial";
            }
        })
            if(index == 0){

                document.getElementById('createDistrict-page').style.display = "initial";
                document.getElementById('quotaReached').style.display = "none";
            }


    });

    /*

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
    */
}

//Firestore migrated fully
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

        firebase.firestore().collection('Districts').doc(code.toString()).get().then(snapshot => {
            var exists = snapshot.data();

            while (exists != null) {

                function generateNew() {
                    _newRef.get().then(snapshot => {
                        var data = snapshot.data();
                        if (data == null) {
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

                var _newRef = firebase.firestore().collection('Districts').doc(newCode.toString());

                var newCode = generateNew();

                if (newCode == true) {
                    break
                }


            }
        }).then(() => {
            firebase.firestore().collection('Districts').doc(code.toString()).set({
                "Name": name,
                "Email": email,
                "Website": website,
                "Address": headOffice,
                "Head Email": headEmail,
                "Phone": phone,
                "Social Media Links": socialMedia,
                "Code": code,
                "Status": "Deactivated"
            });

            firebase.firestore().collection('UserData').doc(userEmail).collection("Districts").doc(code.toString()).set({
                "Name": name,
                "Code": code
            }).then(() => {
                document.getElementById('districtCreateSuccess').style.display = 'initial';
                document.getElementById('createDistrict-page').style.display = 'none';


            });

        });

        /*

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
    */
    }
}

//Firestore Migrated Fully
function getDistrictData(districtCode) {
    var students = 0;
    var teachers = 0;
    var schools = 0;
    var pendingTeacherRequests = 0;

    var districtName = "";

    console.log(districtCode);

    var code = districtCode.toString()



    var _districtRef = firebase.firestore().collection('Districts').doc(code);

    _districtRef.get().then(function (snapshot) {

        var data = snapshot.data();

        //District NAME GET
        var nameValue = data['Name'];

        if (nameValue == null || nameValue == undefined) {
            $('#districtName').text("Loading...");
        } else {
            $('#districtName').text(nameValue);
        }

        //STUDENTS GET

        var studentCountValue = data["Student Count"];

        if (studentCountValue == null || studentCountValue == undefined) {
            students = 0;
        } else {

        $('#studentsCount').text(studentCountValue);
        }

        //TEACHERS GET
        var teacherValue = data['Teacher Count'];

        if (teacherValue == null || teacherValue == undefined) {
            teachers = 0;
        } else {
            $('#teachersCount').text(teacherValue);
        }

        //SCHOOLS GET
        var schoolsValue = data["Schools Count"];

        if (schoolsValue == null || schoolsValue == undefined) {
            schools = 0;
        } else {
            $('#schoolsCount').text(schoolsValue);
        }

        //PENDING REQUESTS GET
        var pendingRequestValue = data['Pending Requests'];

        if (pendingRequestValue == null || pendingRequestValue == undefined || pendingRequestValue == 0) {
            pendingTeacherRequests = 0;
        } else {

            $('#pendingRequests').html(`${pendingRequestValue} <span class="badge badge-warning" style="padding-top: -6px;">New</span>`);
        }


        //GET PLAN DETAILS
        var planDetailsValue = data["planDetails"];

        var planActivated = planDetailsValue["planActivated"];
        var planExpires = planDetailsValue["planExpire"];
        var planName = planDetailsValue["planName"];
        var planStatus = planDetailsValue["planStatus"];

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

        //Get teacher to student ratio
        // Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

var studentCount = data['Student Count'] == undefined? 0 : data['Student Count']; 
var teacherCount = data['Teacher Count'] == undefined? 0: data['Teacher Count'];

console.log(studentCount);

// Pie Chart Example
var ctx = document.getElementById("teacher-student-ration-chart");

if(studentCount == 0 && teacherCount == 0){
    document.getElementById("no-data").innerHTML = `
        <center style = 'margin-top: 20%'><h2>No Data</h2></center>
    `;
} else {
    new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ["Student", "Teacher"],
          datasets: [{
            data: [studentCount, teacherCount],
            backgroundColor: ['#4e73df', '#1cc88a'],
            hoverBackgroundColor: ['#2e59d9', '#17a673'],
            hoverBorderColor: "rgba(234, 236, 244, 1)",
          }],
        },
        options: {
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            caretPadding: 10,
          },
          legend: {
            display: false
          },
          cutoutPercentage: 80,
        },
      });
}

    });

    /*

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
    */

    /*

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
*/
/*

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
    */


    /*

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
    */


    /*
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

    */

    /*

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
    */


}

//FIRESTORE MIGRATED FULLY
function showSchoolsOptionClick() {

    document.getElementById('main-body-content').innerHTML = `
    <section id = "createSchool-page">
    <h1 style="margin-bottom: 1%;">Create School</h1>

    <section id = "schoolCreateError">
        
    </section>
  
    <h5>School Name</h5>

    <input type="text" class="form-control bg-light border-3 large" placeholder="" aria-label="Search" aria-describedby="basic-addon2" id = "schoolName" style="margin-bottom: 1%;">

    <h5>School Address</h5>

    <input type="email" class="form-control bg-light border-3 large" placeholder="" aria-label="Search" aria-describedby="basic-addon2" id = "schoolAddress" style="margin-bottom: 1%;">

    <h5>School Website</h5>

    <input type="email" class="form-control bg-light border-3 large" placeholder="" aria-label="Search" aria-describedby="basic-addon2" id = "schoolWebsite" style="margin-bottom: 1%;">

    <h5>Principal Email</h5>

    <input type="email" class="form-control bg-light border-3 large" placeholder="" aria-label="Search" aria-describedby="basic-addon2" id = "principalEmail" style="margin-bottom: 1%;">

    <h5>School Phone</h5>

    <input type="tel" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" class="form-control bg-light border-3 large" placeholder="" aria-label="Search" aria-describedby="basic-addon2" id = "schoolPhone" style="margin-bottom: 1%;">

    <h5>School Logo Link (Direct Link)</h5>

    <input type="text"  class="form-control bg-light border-3 large" placeholder="ie. Instagram or Twitter" aria-label="Search" aria-describedby="basic-addon2" id = "schoolLogoLink" style="margin-bottom: 1%;">

    <p>By creating a school with ClassVibes you agree to our <a href = "#">Privacy Policy</a> and our <a href = "#">Terms & Conditions</a></p>

    <a href="#" class="btn btn-primary btn-icon-split btn-lg" onclick="createSchool()">
        <span class="text">Create School</span>
      </a>

</section>
    `;
}

//FIRESTORE MIGRATED FULLY
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

//FIRESTORE MIGRATED FULLY
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

            var _ref = firebase.firestore().collection('Districts').doc(districtID).collection('Schools').doc(schoolCode);

            _ref.get().then(function (snapshot) {
                var exists = snapshot.data();

                while (exists != null) {

                    function generateNew() {
                        _newRef.get().then(function (snapshot) {
                            if (snapshot.data() == null) {
                                schoolCode = snapshot.data();
                                return true;
                            } else {
                                return false;
                            }
                        });
                    }
                    console.log("exists");
                    var schoolCode = makeid(6);

                    console.log(schoolCode);

                    var _newRef = firebase.firestore().collection('Districts').doc(districtID).collection('Schools').doc(schoolCode);

                    var newCodeGenerated = generateNew();

                    if (newCodeGenerated == true) {
                        break
                    }


                }
            }).then(() => {

                const increment = firebase.firestore.FieldValue.increment(1);

                firebase.firestore().collection('Districts').doc(districtID).update({
                    "Schools Count": increment
                });

                firebase.firestore().collection('Districts').doc(districtID).collection("Schools").doc(schoolCode).set({
                    "School Name":schoolName,
                    "School Website":schoolWebsite,
                    "School Address":schoolAddress,
                    "Principal Email":principalEmail,
                    "School Phone":schoolPhone,
                    "School Logo Links":schoolLogo,
                    "School Code":schoolCode,
                });


            });

            //////////////////////
            /*

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

            */

            document.getElementById("main-body-content").innerHTML = `
            
            <section id = "schoolCreateSuccess">
                <center>
                    <div style = "margin-top: 23%;">
                        <i class="far fa-check-circle fa-5x" style="color: green;"></i>
                        <h2 style="margin-top: 10px;">School Created</h2>
                        <p class="col col-lg-4">Share your school code below with teachers, they can use it to join your school. Reload the page to view your school.</p>

                        <form class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                            <div class="input-group">
                              <input type="text" class="form-control bg-light border-4 small" value = "test" placeholder="loading..." aria-label="Search" aria-describedby="basic-addon2" id = "schoolCodeCopy" readonly>
                              <div class="input-group-append">
                                <button class="btn btn-primary" type="button" data-clipboard-action="copy" data-clipboard-target = "#schoolCodeCopy" id = "copyButtonText" onclick="copyToClipboard()">
                                  Copy
                                </button>
                              </div>
                            </div>
                          </form>
                    </div>
                </center>
            </section>
            `;

            document.getElementById("schoolCodeCopy").value = schoolCode;
        }
    }


}

//FIRESTORE MIGRATED FULLY
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

//FIRESTORE MIGRATED FULLY
function getSchoolsData() {
    var districtID = localStorage.getItem('district id');

    var _ref = firebase.firestore().collection("Districts").doc(districtID).collection("Schools");

    _ref.get().then(function (snapshot) {


        snapshot.forEach((snap) => {

            var data = snap.data();

            var schoolCode = data['School Code'];

            var schoolName = data['School Name'];

                var _refStudent = firebase.firestore().collection("UserData").where('School ID', '==', schoolCode).where('Account Type', '==', "Student");

                var studentCount = 0;

                _refStudent.get().then(studentSnap => {
                    studentSnap.forEach(studentDoc => {
                        studentCount += 1
                        console.log(studentDoc.data());
                    })
                }).then(() => {

                    elementHTML = `
            <div class="col-xl-12 col-md-6 mb-4">
                  <div class="card border-left-primary shadow h-100 py-2">
                    <div class="card-body">
                      <div class="row no-gutters align-items-center">
                        <div class="col mr-2">

                          <div class="row" style="margin-left: 4px;">
                            <i class="fas fa-users"></i>

                            <h5 style="margin-left: 5px; margin-top: -4px;">${studentCount} Students</h5>
                          </div>

                          <div class="h5 mb-0 font-weight-bold text-gray-800">${data["School Name"]}</div>
                        </div>

                        

                        <div class="col-auto" style="margin-right: 10px;">
                          <a onclick = "storePrefForSchoolView('${schoolCode}', '${districtID}', '${schoolName}')" href = "#" class="btn btn-primary btn-circle btn-lg">
                            <i class="fas fa-eye"></i>
                          </a>
                        </div>

                        <div class="col-auto" style="margin-right: 10px;">
                          <a data-toggle="collapse" href="#inviteInfoCollapse${data["School Code"]}" role="button" aria-expanded="false" aria-controls="inviteInfoCollapse${data["School Code"]}" class="btn btn-primary btn-circle btn-lg">
                            <i class="fas fa-user-plus"></i>
                          </a>
                        </div>

                        <div class="col-auto">
                          <a data-toggle="collapse" href="#multiCollapse${data["School Code"]}" role="button" aria-expanded="false" aria-controls="multiCollapse${data["School Code"]}" class="btn btn-primary btn-circle btn-lg">
                            <i class="far fa-edit"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="collapse multi-collapse" id="multiCollapse${data["School Code"]}">
                    <div class="card card-body">
                     
                      <h2>Edit School</h2>
  
                      <div class="row" style="margin-left: 3px;">
  
                        <div class="col">
                          <h5>School Name</h5>
                          <input type="text" class="form-control bg-light border-3 large" placeholder="" aria-label="Search" aria-describedby="basic-addon2" id = "schoolName${data["School Code"]}" style="margin-bottom: 1%;" value = '${data["School Name"]}'>  
                        </div>
  
                        <div class="col">
                          <h5>School Website</h5>
                          <input type="text" class="form-control bg-light border-3 large" placeholder="" aria-label="Search" aria-describedby="basic-addon2" id = "schoolWebsite${data["School Code"]}" style="margin-bottom: 1%;" value = '${data["School Website"]}'>  
                        </div>
  
                        <div class="col">
                          <h5>School Phone</h5>
                          <input type="tel" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" class="form-control bg-light border-3 large" placeholder="" aria-label="Search" aria-describedby="basic-addon2" id = "schoolPhone${data["School Code"]}" style="margin-bottom: 1%;" value = '${data["School Phone"]}'>
                        </div>
  
                      </div>
  
                      <div class="row" style="margin-left: 3px;">
  
                        <div class="col">
                          <h5>School Address</h5>
                          <input type="text" class="form-control bg-light border-3 large" placeholder="" aria-label="Search" aria-describedby="basic-addon2" id = "schoolAddress${data["School Code"]}" style="margin-bottom: 1%;" value = '${data["School Address"]}'>  
                        </div>
  
                        <div class="col">
                          <h5>Principal Email</h5>
                          <input type="text" class="form-control bg-light border-3 large" placeholder="" aria-label="Search" aria-describedby="basic-addon2" id = "principalEmail${data["School Code"]}" style="margin-bottom: 1%;" value = '${data["Principal Email"]}'>  
                        </div>
  
                      </div>

                      <div id = "updateErrorList${data['School Code']}">

                      </div>
  
                      <div class="float-right" style="margin-left: 11px; margin-top: 10px;">
                        <a href="#" class="btn btn-primary btn-icon-split btn-m" style="width: 150px;" align = "right" onclick="updateSchoolInfo('${data['School Code']}')">
                          <span class="text" >Save Changes</span>
                        </a>
                      </div>
                    </div>
  
                  </div>
               
                  <div class="collapse multi-collapse" id="inviteInfoCollapse${data["School Code"]}">
                    <div class="card card-body">

                      <h5 style="margin-left: 20px;">School ID</h5>

                      <div class = "row">

                      <form class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                        <div class="input-group">
                          <input type="text" class="form-control bg-light border-4 small" value = "${data["School Code"]}" placeholder="loading..." aria-label="Search" aria-describedby="basic-addon2" id = "schoolCodeCopy${data["School Code"]}" readonly>
                          <div class="input-group-append">
                            <button class="btn btn-primary" type="button" data-clipboard-action="copy" data-clipboard-target = "#schoolCodeCopy${data["School Code"]}" id = "copyButtonText${data["School Code"]}" onclick="copyToClipboard('${data["School Code"]}')">
                              Copy
                            </button>
                          </div>
                        </div>
                      </form>
                      

                      </div>


                    </div>
                  </div>
                </div>
            `;

            $(elementHTML).appendTo('#schoolsList');

                });

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
        var _ref = firebase.firestore().collection("Districts").doc(districtID).collection('Schools').doc(schoolCode);

        _ref.update({
            "School Name": schoolName,
            "School Website":schoolWebsite,
            "School Phone":schoolPhone,
            "School Address":schoolAddress,
            "Principal Email":principalEmail,
        }).then(() => {

            $('#multiCollapse' + schoolCode).collapse('toggle');

            location.reload();
        })
    


    }



}

//FIRESTORE MIGRATED FULLY
function storePrefForSchoolView(schoolID, districtID, schoolName){
    localStorage.setItem('School ID', schoolID);

    localStorage.setItem('District ID', districtID);

    localStorage.setItem('School Name', schoolName);

    window.location = 'viewSchool.html';
}

//FIRESTORE MIGRATED FULLY
function toggleCreateSchoolView() {

    document.getElementById("main-body-content").innerHTML = `
    <section id = "createSchool-page">
    <h1 style="margin-bottom: 1%;">Create School</h1>

    <section id = "schoolCreateError">
        
    </section>
  
    <h5>School Name</h5>

    <input type="text" class="form-control bg-light border-3 large" placeholder="" aria-label="Search" aria-describedby="basic-addon2" id = "schoolName" style="margin-bottom: 1%;">

    <h5>School Address</h5>

    <input type="email" class="form-control bg-light border-3 large" placeholder="" aria-label="Search" aria-describedby="basic-addon2" id = "schoolAddress" style="margin-bottom: 1%;">

    <h5>School Website</h5>

    <input type="email" class="form-control bg-light border-3 large" placeholder="" aria-label="Search" aria-describedby="basic-addon2" id = "schoolWebsite" style="margin-bottom: 1%;">

    <h5>Principal Email</h5>

    <input type="email" class="form-control bg-light border-3 large" placeholder="" aria-label="Search" aria-describedby="basic-addon2" id = "principalEmail" style="margin-bottom: 1%;">

    <h5>School Phone</h5>

    <input type="tel" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" class="form-control bg-light border-3 large" placeholder="" aria-label="Search" aria-describedby="basic-addon2" id = "schoolPhone" style="margin-bottom: 1%;">

    <h5>School Logo Link (Direct Link)</h5>

    <input type="text"  class="form-control bg-light border-3 large" placeholder="ie. Instagram or Twitter" aria-label="Search" aria-describedby="basic-addon2" id = "schoolLogoLink" style="margin-bottom: 1%;">

    <p>By creating a school with ClassVibes you agree to our <a href = "#">Privacy Policy</a> and our <a href = "#">Terms & Conditions</a></p>

    <a href="#" class="btn btn-primary btn-icon-split btn-lg" onclick="createSchool()">
        <span class="text">Create School</span>
      </a>

</section>
    `;

}

//FIRESTORE MIGRATED FULLY
function getSchoolPersonelInfo(type){
    var schoolID = localStorage.getItem('School ID');
    var districtID = localStorage.getItem('District ID');
    var schoolName = localStorage.getItem('School Name');

    document.getElementById('schoolName').innerHTML = schoolName;

    if(type == 'student'){

        var index = 0;

        var _personelRef = firebase.firestore().collection('UserData').where('School ID', '==', schoolID.toString()).where('District ID', '==', districtID.toString());
    
    
        _personelRef.get().then(snap => {
            snap.forEach(doc => {
    
                index += 1
                var data = doc.data();
    
                var classesCount = 0;
    
                firebase.firestore().collection('UserData').doc(data['email']).collection("Classes").get().then(snap => {
                    console.log("SIZE :" + snap.size);
                    classesCount = snap.size
                }).then(() => {
                    var output = `
                    <tr>
                    <td>${data["display-name"]}</td>
                    <td>${data['email']}</td>
                    <td>${data['Join Date']}</td>
                    <td><center>${classesCount}</center></td>
                    <td>
                    <center>
                    <a href="#" class="btn btn-danger btn-icon-split btn-lg">
                    <span class="text">Remove</span>
                  </a>
                  </center>
                  </td>
                  </tr>
                    `;
        
                    $(output).appendTo('#student-list-body');
                });
    
    
    
            })
        }).then(() => {
    
            console.log(index);
    
            if(index == 0){
    
                console.log('no students');
    
                var no_students_output = `
                <center style="margin-top:9%;">
                <img src="img/undraw_empty_xct9.svg" alt="" width="25%">
                <h1>No Students</h1>
    
                <p>Any students who join classes in your district will show up here</p>
              </center>
                `;
    
                document.getElementById('table-display-main').innerHTML = no_students_output;
                
                document.getElementById('loader-icon').style.display = 'none';
                document.getElementById('main-page-table').style.display = 'initial';
                
                
            } else {
                document.getElementById('loader-icon').style.display = 'none';
                document.getElementById('main-page-table').style.display = 'initial';
            }
        })
    }


}

function getTeacherRequests(){
    var districtID = localStorage.getItem('district id')
    var _ref = firebase.firestore().collection('Districts').doc(districtID).collection('Teacher Requests');

    var index = 0;

    document.getElementById('main-body-content').innerHTML = `
    <section id = "main-page" style = "display: none">
    <h1>Teacher Join Requests</h1>

    <div id = "request-list">
        
    </div>

    
    
   </section>
    `;

    _ref.get().then(snapshot => {

        snapshot.forEach(doc => {
            index += 1
            console.log(doc.data());

            var data = doc.data();

            var teacherName = data['Teacher Name'];

            var schoolName = data['School Name'];

            var schoolID = data['Teacher School ID Request'];

            var teacherEmail = data['Teacher Email']

            var requestDocID = doc.id;

            console.log(requestDocID);

            var output = `
            <div class="col-xl-12 col-md-6 mb-4">
            <div class="card border-left-primary shadow h-100 py-2">
              <div class="card-body">
                <div class="row no-gutters align-items-center">
                  <div class="col mr-2">

                    <div class="row">

                        <div class="col">
                            <div class="row" style="margin-left: 4px;">
                                <i class="fas fa-school"></i>
        
                              <h5 style="margin-left: 5px; margin-top: -4px;">${schoolName}</h5>
                            </div>
        
                            <div class="h5 mb-0 font-weight-bold text-gray-800">${teacherName}</div>
                        </div>

                        <a href="#" class="btn btn-success btn-circle btn-lg" style="margin-right: 1%;" onclick = "acceptRequest('${schoolID}', '${districtID}', '${requestDocID}', '${teacherEmail}')">
                            <i class="fas fa-check"></i>
                          </a>

                        <a href="#" class="btn btn-danger btn-circle btn-lg" onclick = "declineRequest('${schoolID}', '${districtID}', '${requestDocID}', '${teacherEmail}')">
                        <i class="fas fa-trash"></i>
                        </a>

                    </div>



                  </div>
                </div>
              </div>
            </div>
         </div>
            `;

            $(output).appendTo('#request-list');
        })
    }).then(() => {

        document.getElementById('loader-icon').style.display = "none";
        if(index == 0){
            document.getElementById('main-body-content').innerHTML = `
            <div id = "request-list">
            <center style="margin-top: 15%;">
                <img src="img/undraw_browsing_online_sr8c.svg" alt="" width="20%" >

                <h1 style="margin-top: 1%;">No Pending Requests</h1>

                <p>There are no pending teacher requests at the moment</p>
            </center>
            </div>
            `;
        } else {
            document.getElementById('main-page').style.display = "initial"
        }
    })
}

function acceptRequest(schoolID, districtID, requestID, teacherEmail){

    const decrement = firebase.firestore.FieldValue.increment(-1);

    firebase.firestore().collection("Districts").doc(districtID).update({
        "Pending Requests": decrement,
    }).then(() => {
        firebase.firestore().collection("Districts").doc(districtID).collection('Teacher Requests').doc(requestID).delete().then(() => {
            firebase.firestore().collection("UserData").doc(teacherEmail).update({
                "Pending District Request": firebase.firestore.FieldValue.delete(),
                "Pending School Request": firebase.firestore.FieldValue.delete(),
                "Pending School Request Name": firebase.firestore.FieldValue.delete(),
                "Pending Request ID":firebase.firestore.FieldValue.delete(),

                "District Code": districtID
            }).then(() => {
                window.location.reload();
            });
        });
    })
}

function declineRequest(schoolID, districtID, requestID, teacherEmail){

    const decrement = firebase.firestore.FieldValue.increment(-1);

    firebase.firestore().collection("Districts").doc(districtID).update({
        "Pending Requests": decrement,
    }).then(() => {
        firebase.firestore().collection("Districts").doc(districtID).collection('Teacher Requests').doc(requestID).delete().then(() => {
            firebase.firestore().collection("UserData").doc(teacherEmail).update({
                "Pending District Request": firebase.firestore.FieldValue.delete(),
                "Pending School Request": firebase.firestore.FieldValue.delete(),
                "Pending School Request Name": firebase.firestore.FieldValue.delete(),
                "Pending Request ID":firebase.firestore.FieldValue.delete(),
            }).then(() => {
                window.location.reload();
            });
        });
    })
}