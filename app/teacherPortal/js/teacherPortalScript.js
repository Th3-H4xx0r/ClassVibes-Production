function initializeFirebase() {
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

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  //firebase.firestore().enablePersistence();
}

function getTeacherAccountStatus(pageType) {

  var email = localStorage.getItem('email');

  firebase.firestore().collection('UserData').doc(email).get().then(function (doc) {
    var data = doc.data();

    var in_a_district = data['District Code'] != undefined ? data['District Code'] : null;

    console.log("DISTRICT: " + in_a_district);

    var pendingSchoolRequestName = data["Pending School Request Name"];

    var pendingRequestID = data["Pending Request ID"];

    var pendingDistrictRequestID = data["Pending District Request"];

    if (pendingSchoolRequestName) {

      var waitingRequestHTML = `
      <center style="margin-top: 23%;">
      <i class="far fa-check-circle" style = "font-size: 80px; color: green"></i>

      <h2 style="margin-top: 2%;">Request Sent</h2>

      <p>You have successfully sent a request to join ${pendingSchoolRequestName}</p>

      <button class="btn-screen danger" onclick = "cancelTeacherRequest('${pendingRequestID}', '${pendingDistrictRequestID}', '${email}')">Cancel</button>
    </center>
      `;

      $('#main-body-page-teacher').html(waitingRequestHTML);
    } else {
      //IN A DISTRICT
      if (in_a_district != null && in_a_district != undefined) {
        firebase.firestore().collection('Districts').doc(in_a_district).get().then(function (doc) {

          console.log('Executing 1');

          var data = doc.data()["Status"];

          console.log("STATUS:" + data);

          //DISTRICT IS NOT ACTIVATED
          if (data != "Activated") {

            var activateDistrictHTML = `
          <center style="margin-top: 23%;">
          <i class="fas fa-exclamation-triangle" style="font-size: 70px;"></i>

          <h2 style="margin-top: 2%;">District Not Active</h2>

          <p>If this is an error, contact you district admin for more info.</p>
        </center>
          `;

            document.getElementById('loader-icon').style.display = 'none';

            $('#main-body-page-teacher').html(activateDistrictHTML);
          } else {

            console.log('Executing 2');

            if(document.getElementById('loader-icon') != null){
              document.getElementById('loader-icon').style.display = 'none';
            }


            if (pageType == 'meetings-page') {
              document.getElementById('main-page-content-meetings-page').style.display = "initial";
              getProfileInfo();
              getClassData();
              getMeetings();
            }
            else if (pageType == "") {

            }

            else if(pageType == 'create-class'){
              getClassDataDropdown();
            }

            else if (pageType == 'class-page') {
              getProfileInfo();
              //getClassData();
              getClassDataDropdown()
              getStudentData();
              getEditData();
            }

            else if (pageType == 'dashboard') {
              getProfileInfo();
              getClassData();
            }

            else if(pageType == "student-requests"){
              getProfileInfo();
              getStudentRequests();
            }

            else {
              getClassData();
              getProfileInfo();
              getChartData();
            }

          }
        });

      }
      //NOT IN A DISTRICT
      else {

        var accountStatus = data['Account Status'];

        //ACCOUNT ACTIVE
        if (accountStatus == "Activated") {

          if (document.getElementById('loader-icon') != null) {
            document.getElementById('loader-icon').style.display = 'none';

          }

          if (document.getElementById('dashboard-section') != null) {
            document.getElementById('dashboard-section').style.display = 'none';
          }


          if (pageType == 'meetings-page') {
            document.getElementById('main-page-content-meetings-page').style.display = "initial";
            getProfileInfo();
            getClassData();
            getMeetings();
          }
          else if (pageType == "") {
            getClassDataDropdown();
          }
          else if (pageType == 'class-page') {
            getProfileInfo();
            //getClassData();
            getStudentData();
            getClassDataDropdown()
            getEditData();
          }
          else if (pageType == 'dashboard') {
            console.log("executing");
            getProfileInfo();
            getClassData();
          }

          else if(pageType == 'create-class'){
            getClassDataDropdown();
          }

          else if(pageType == "student-requests"){
            getProfileInfo();
            getStudentRequests();
          }

          else {
            getClassData();
            getProfileInfo();
            getChartData();
            getClassDataDropdown();
          }


          //ACCOUNT NOT ACTIVE
        } else {
          var activateDistrictHTML = `
        
        <center style="margin-top: 20%;">
        <i class="fas fa-exclamation-triangle" style="font-size: 70px;"></i>

        <h2 style="margin-top: 2%;">Account Not Activated</h2>

        <p>If you are a solo teacher please contact <a href="mailto:sales@classvibes.net">sales@classvibes.net</a>
          <br> to activate your account.</p>

        <h5>Or</h5>

          <div id = "district-join-input">
            <form class="d-none d-sm-inline-block form-inline mr-auto ml-md-6 my-4 my-md-0 mw-100 navbar-search">
              <div class="input-group">
                  <input type="text" class="form-control bg-light border-3 small" placeholder="District code.." aria-label="Search" aria-describedby="basic-addon2" id="searchInputDistrict">
                  <div class="input-group-append">
                      <button class="btn btn-primary" type="button" onclick="checkIfDistrictCodeExists()">
                          Join
                      </button>
                  </div>
              </div>
          </form>
          </div>

        <div id = "school-join-input" style="display: none;">
          <form class="d-none d-sm-inline-block form-inline mr-auto ml-md-6 my-4 my-md-0 mw-100 navbar-search">
            <div class="input-group">
                <input type="text" class="form-control bg-light border-3 small" placeholder="School Code..." aria-label="Search" aria-describedby="basic-addon2" id="searchInputSchool">
                <div class="input-group-append">
                    <button class="btn btn-primary" type="button" onclick="checkIfSchoolCodeExists()">
                        Join
                    </button>
                </div>
            </div>
        </form>
        </div>

      <div id = "joinSchool-district-err">

      </div>

      </center>
       `;
          document.getElementById('loader-icon').style.display = 'none';
          $('#main-body-page-teacher').html(activateDistrictHTML);
        }
      }
    }
  });
}

function getStudentRequests(){

  var totalIndex = 0;

  var emailRef = localStorage.getItem("email")

  var classesList = [];

  firebase.firestore().collection('UserData').doc(emailRef).collection("Classes").get().then(function (doc) {

    doc.forEach(snapshot => {

      var data1 = snapshot.data();

      var classCode = data1["Code"];

      firebase.firestore().collection('Classes').doc(classCode).get().then(function (doc) {
        var data = doc.data();

        var className = data["class-name"]

        classesList.push([classCode, className])

      })

    });

  }).then(function () {

    setTimeout(function(){

      document.getElementById('main-body-page-teacher').innerHTML = `
      <section id = "main-page" style = "display: none">
      <h1>Teacher Join Requests</h1>
    
      <div id = "request-list">
          
      </div>
    
      
     </section>
      `;
      
    for (var i = 0; i <= classesList.length; i++) {
      var classData = classesList[i];

      if (classData != null || classData != undefined) {

        console.log("works");
        var className1 = classData[1];
        var classCode = classData[0];

        var _ref = firebase.firestore().collection('Classes').doc(classCode).collection('Student Requests');
      
        _ref.get().then(snapshot => {
      
            snapshot.forEach(doc => {

              var className = className1
              totalIndex += 1
                console.log(doc.data());
      
                var data = doc.data();
      
                var classID = data['Class Code'];

                var studentName = data['Student Name']

                var studentEmail = data['Student Email']
      
                var requestDocID = doc.id;
      
                console.log(className1);
      
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
            
                                  <h5 style="margin-left: 5px; margin-top: -4px;">${className}</h5>
                                </div>
            
                                <div class="h5 mb-0 font-weight-bold text-gray-800">${studentName}</div>
                            </div>
      
                            <a href="#" class="btn btn-success btn-circle btn-lg" style="margin-right: 1%;">
                                <i class="fas fa-check"></i>
                              </a>
      
                            <a href="#" class="btn btn-danger btn-circle btn-lg">
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
        })
      }

    }

   }, 1000);

  }).then(() => {

    setTimeout(function(){
      if(totalIndex == 0){
        document.getElementById('main-body-page-teacher').innerHTML = `
        <div id = "request-list">
        <center style="margin-top: 15%;">
            <img src="img/undraw_empty_xct9.svg" alt="" width="20%" > 
  
            <h1 style="margin-top: 1%;">No Pending Requests</h1>
  
            <p>There are no pending teacher student at the moment</p>
        </center>
        </div>
        `;
    } else {
        document.getElementById('main-page').style.display = "initial"
    }
   }, 1200);



  })
}


function checkIfDistrictCodeExists() {
  var code = document.getElementById('searchInputDistrict').value;

  firebase.firestore().collection('Districts').doc(code).get().then(function (doc) {
    var data = doc.data();

    if (data != null && data != undefined) {

      $('#joinSchool-district-err').html('');

      document.getElementById('school-join-input').style.display = "initial";
      document.getElementById('district-join-input').style.display = "none";

    } else {

      var errHTML = `<p style = 'color: red; margin-top: 5px'>District doesn't exist</p>`;

      $('#joinSchool-district-err').html(errHTML);
    }
  });
}

function checkIfSchoolCodeExists() {
  var district_code = document.getElementById('searchInputDistrict').value;
  var school_code = document.getElementById('searchInputSchool').value;

  var teacher_email = localStorage.getItem('email');
  var teacher_name = localStorage.getItem('name');

  firebase.firestore().collection('Districts').doc(district_code).collection("Schools").doc(school_code).get().then(function (doc) {
    var data = doc.data();

    if (data != null && data != undefined) {

      $('#joinSchool-district-err').html('');

      /*
      firebase.firestore().collection('Districts').doc(district_code).collection("Schools").doc(school_code).collection('Teachers').doc(teacher_email).set({
        "Teacher Name": teacher_name,
        "Teacher Email": teacher_email,
      });
      */

      /*

      firebase.firestore().collection('UserData').doc(teacher_email).update({
        "District Code": district_code,
      })
      */

      /*
      firebase.firestore().collection('Districts').doc(district_code).collection("Schools").doc(school_code).collection('Teachers').doc(teacher_email).set({
        "Teacher Name": teacher_name,
        "Teacher Email": teacher_email,
      });
      */

      firebase.firestore().collection('Districts').doc(district_code).collection('Schools').doc(school_code).get().then(snapshot => {
        var data = snapshot.data();

        var schoolName = data['School Name']

        return schoolName

      }).then((name) => {

        const increment = firebase.firestore.FieldValue.increment(1);

        firebase.firestore().collection('Districts').doc(district_code).update({
          "Pending Requests": increment
        })

        var _requestRef = firebase.firestore().collection('Districts').doc(district_code).collection("Teacher Requests").doc()

        _requestRef.set({
          "Teacher Name": teacher_name,
          "Teacher Email": teacher_email,
          "Teacher School ID Request": school_code,
          "School Name": name,
        }).then(() => {

          console.log(_requestRef.id);


          firebase.firestore().collection('UserData').doc(teacher_email).update({
            "Pending District Request": district_code,
            "Pending School Request": school_code,
            "Pending School Request Name": name,
            "Pending Request ID": _requestRef.id,
          }).then(() => {
            window.location.reload();
          })

        })

      })



    } else {

      var errHTML = `<p style = 'color: red; margin-top: 5px'>School doesn't exist</p>`;

      $('#joinSchool-district-err').html(errHTML);
    }
  });
}

function getProfileInfo() {
  var name = localStorage.getItem("name");
  var pic = localStorage.getItem("photo");

  var outputPic = ``;

  if (pic != null && pic != undefined && pic != "") {
    outputPic = `<img class="img-profile rounded-circle" src="${pic}">`;
  } else {
    outputPic = `<img class="img-profile rounded-circle" src="https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144849704.jpg">`;
  }




  $(outputPic).appendTo("#profilePic")

  document.getElementById("displayName").innerHTML = name

}

function getClassData() {

  var emailRef = localStorage.getItem("email")
  var classesList = [];

  var no_classes_HTML = `
  <center style="margin-top: 15%;">
  <img src = 'img/undraw_taking_notes_tjaf.svg'/ width="25%">

  <h1 style="margin-top: 20px;">No Classes To See</h1>
  <p>You have not created any classes yet. <br> Go to <strong>Sidebar > Classes > Create Class</strong> <br> to get started</p>
  </center>
  `;

  var index = 0;

  firebase.firestore().collection('UserData').doc(emailRef).collection("Classes").get().then(function (doc) {

    doc.forEach(snapshot => {

      index = index + 1

      var data = snapshot.data();

      var classCode = data["Code"];
      var className = data["class-name"];
      classesList.push([classCode, className])
    });

  }).then(function () {

    if (index == 0) {
      document.getElementById('main-body-page-teacher').innerHTML = no_classes_HTML;
    } else {
      for (var i = 0; i <= classesList.length; i++) {

        let output = "";
        let output2 = "";
        let output3 = "";
        var classData = classesList[i];

        if (classData != null || classData != undefined) {

          console.log("works");
          var className = classData[1];
          var classCode = classData[0];

          if (i == 0) {
            storeClassforChart(classCode)
          }
          output = `
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-success shadow h-100 py-2">
                  <div class="card-body">
                    <div class="row no-gutters align-items-center">
                      <div class="col mr-2">
                        <div class="text-xs font-weight-bold text-success text-uppercase mb-1">${className}</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800">Class Code: ${classCode}</div>
                      </div>
                      <div class="col-auto">
                        <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `;

          output2 = `
            <a class="collapse-item" href="classPage.html" style = 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' onclick = "setClassCode(${classCode})">${className}</a>
            `;

          output3 = `
            <a class="dropdown-item" href="#" style = 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' onclick = "storeClassforChart('${classCode}')">${className.toString()}</a>
                        <div class="dropdown-divider"></div>
            
            `

          $(output).appendTo("#topClassesSection");
          $(output2).appendTo("#classesOp");
          $(output3).appendTo("#classesOp1");
          $(output2).appendTo("#dropdown-sidebar");
        }
      }
    }
  }).then(function () {
    if (document.getElementById('dashboard-section') != null) {
      document.getElementById('dashboard-section').style.display = "initial";
      getChartData();
    }
  })
}

function setClassCode(classCode) {
  localStorage.setItem("code", classCode);
}

function storeClassforChart(code) {
  localStorage.setItem("codeForChart", code);
  getChartData();

}

function writeAnnouncement() {
  var numberClass = document.getElementById("numberClass").value;
  console.log("NUMBER CLASS" + numberClass);
  var messageTitle = document.getElementById("messageTitle").value;
  var messageText = document.getElementById("messageText").value;
  var dateNow = new Date();
  var formattedDate = dateNow.toLocaleString();

  firebase.firestore().collection("Classes").doc(numberClass).collection("Announcements").doc().set({
    "Title": messageTitle,
    "Message": messageText,
    "Date": formattedDate.toString(),
    "Timestamp": dateNow.toString(),
  });
}

function getMeetings() {
  var name = localStorage.getItem("email");

  var index = 0;

  firebase.firestore().collection('UserData').doc(name).collection("Meetings").get().then(function (doc) {

    doc.forEach(snapshot => {
      index = index + 1

      var data1 = snapshot.data();
      var classForMeeting = data1["Course"]

      var date = data1["Date"];
      var title = data1["Title"];
      var message = data1["message"]
      var length = data1["len"]

      output = `
      <section class="resume" style="margin-left: 0px;">
        <div class="row">
        <div class="col-lg-6" data-aos="fade-up">
              <h3 class="resume-title">${date} </h3>

              <h3 class="resume-title" style="width: 500px">${classForMeeting}</h3>
              <div class="resume-item pb-0">
                <h4 style="width: 500px">${title}</h4>
                <h5>${length}</h5>
                <p style="width: 100%">
                  ${message}

                </p>
              </div>

        </div>
      </section>
        `;

      $(output).appendTo("#meetingsList");
    })
  }).then(() => {
    var noMeetingsHTML = `
    <center style="margin-top: 15%;">
    <img src = 'img/undraw_checking_boxes_2ibd.svg' width="25%"/>
  
    <h1 style="margin-top: 20px;">No Meetings</h1>
    <p>You do not have any scheduled meetings yet, go <br> to <strong> Sidebar > Classes > Class</strong> to schedule <br> meetings with your students</p>
    </center>
    `;

    if (index == 0) {
      document.getElementById('main-body-page-teacher').innerHTML = noMeetingsHTML;
    }
  });

}


function getClassDataDropdown() {
  var emailRef = localStorage.getItem("email")

  var classesList = [];

  firebase.firestore().collection('UserData').doc(emailRef).collection("Classes").get().then(function (doc) {

    doc.forEach(snapshot => {

      var data1 = snapshot.data();

      var classCode = data1["Code"];
      var className = data1["class-name"];

      classesList.push([classCode, className])

    });

  }).then(function () {


    for (var i = 0; i <= classesList.length; i++) {
      let output = "";
      let output2 = "";
      let output3 = "";
      var classData = classesList[i];

      if (classData != null || classData != undefined) {

        console.log("works");
        var className = classData[1];
        var classCode = classData[0];

        output2 = `
    <a class="collapse-item" href="#" style = 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' onclick = "storeClassPref('${classCode}', '${className}')">${className}</a>
    `;

        output3 = `
    <a class="dropdown-item" href="#" style = 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' onclick = "storeClassPref('${classCode}', '${className}')">${className}</a>
<div class="dropdown-divider"></div>
    
    `;
        $(output).appendTo("#topClassesSection");
        $(output2).appendTo("#classesOp");
        $(output3).appendTo("#classesOp1");
        $(output3).appendTo("#classesOp2")
      }

    }
  })
}

function storeClassPref(code, name) {
  localStorage.setItem("code", code);
  localStorage.setItem("className", name);
  var name = localStorage.getItem("className");
  console.log(code);
  window.location = "classPage.html"
  output = ''
  output += `
  <h1 class="h3 mb-4 text-gray-800" id="className">${name}</h1>

  
  `
  $(output).appendTo('#className')
}

function createClass() {
  var code = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  var className = document.getElementById("className").value;
  var course = document.getElementById("course").value;
  var teacher = document.getElementById("teacher").value;
  var classImg = document.getElementById("imageInput").value;
  var courseDescription = document.getElementById("courseDescription").value;
  var courseVideo = localStorage.getItem("videoLink");
  var teachersNote = document.getElementById("teachersNote").value;
  var classCreator = localStorage.getItem("email")

  firebase.firestore().collection("UserData").doc(classCreator).collection("Classes").doc(code).set({
    "Code": code,
    "class-name": className,
    "Course": course,
    "teacher": teacher,
    "classImg": classImg,
    "courseDescription": courseDescription,
    "courseVideo": courseVideo,
    "teachersNote": teachersNote,

  });

  firebase.firestore().collection("Classes").doc(code).set({
    "Code": code,
    "class-name": className,
    "Course": course,
    "teacher": teacher,
    "classImg": classImg,
    "courseDescription": courseDescription,
    "courseVideo": courseVideo,
    "teachersNote": teachersNote,

  }).then(() => {
    window.location = "dashboard.html"
  });
}


function storeClassPref(code, name) {
  localStorage.setItem("code", code);
  localStorage.setItem("className", name);
  var name = localStorage.getItem("className");
  console.log(code);
  window.location = "classPage.html"
  output = ''
  output += `
  <h1 class="h3 mb-4 text-gray-800" id="className">${name}</h1>

  
  `
  $(output).appendTo('#className')
}

function getStudentData() {
  var code = localStorage.getItem("code");

  var className = localStorage.getItem("className");
  document.getElementById("className").innerHTML = `<h1>${className}</h1>`

  var classInfoList = [];
  console.log(classInfoList);

  firebase.firestore().collection('Classes').doc(code).collection("Students").get().then(function (doc) {

    doc.forEach(snapshot => {

      var data = snapshot.data();

      var reaction = data["reaction"];
      var studentName = data["name"];
      var studentEmail = data["email"]
      classInfoList.push([studentName, reaction, studentEmail])
      console.log(classInfoList)

    });

    document.getElementById("studentTable").innerHTML = "";

    for (var i = 0; i <= classInfoList.length; i++) {
      let descriptionOutput = "";
      classInfoData = classInfoList[i];
      var happy = '<h1 class="icon-hover" style = "margin-left: 20px; font-size: 70px;"  style="color: green;">&#128513;</h1>';
      var meh = '<h1  class="icon-hover" style = "margin-right: 20px; margin-left: 20px; font-size: 70px;"  style="color: yellow;">&#128533;</h1>';
      var sad = '<h1  class="icon-hover" style = "margin-right: 20px; font-size: 70px;">&#128545;</h1>'

      if (classInfoData != null || classInfoData != undefined) {
        console.log("works")
        var studentName = classInfoData[0];

        var studentReaction = classInfoData[1];

        var studentEmail = classInfoData[2];
        console.log(classInfoData)

        descriptionOutput2 = `
      <tr>
      <td>${studentName}</td>
      <td>${studentEmail}</td>
      <td>Some Comment</td>
      <td><div id = "face"></div></td>
      <td>2011/04/25</td>
      <td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal${i}" data-whatever="@mdo" style = "height: 50px; margin-right: 20px; margin-top: 15px">Schedual Meeting</button></td></tr>
      `;

        happy_face_Column = `
      <tr>
      <td>${studentName}</td>
      <td>${studentEmail}</td>
      <td>Some Comment</td>
      <td><h1 class="icon-hover" style = "margin-left: 20px; font-size: 70px;"  style="color: green;">&#128513;</h1></td>
      <td>2011/04/25</td>
      <td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal${i}" data-whatever="@mdo" style = "height: 50px; margin-right: 20px; margin-top: 15px">Schedual Meeting</button></td></tr>
      `;

        meh_colum_face = `
      <tr>
      <td>${studentName}</td>
      <td>${studentEmail}</td>
      <td>Some Comment</td>
      <td><h1  class="icon-hover" style = "margin-right: 20px; margin-left: 20px; font-size: 70px;"  style="color: yellow;">&#128533;</h1></td>
      <td>2011/04/25</td>
      <td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal${i}" data-whatever="@mdo" style = "height: 50px; margin-right: 20px; margin-top: 15px">Schedual Meeting</button></td></tr>
      `;

        frustrated_column_face = `
      <tr>
      <td>${studentName}</td>
      <td>${studentEmail}</td>
      <td>Some Comment</td>
      <td><h1  class="icon-hover" style = "margin-right: 20px; font-size: 70px;">&#128545;</h1></td>
      <td>2011/04/25</td>
      <td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal${i}" data-whatever="@mdo" style = "height: 50px; margin-right: 20px; margin-top: 15px">Schedual Meeting</button></td></tr>
  </div>
      `;

        outputModel = `
      <div class="modal fade" id="exampleModal${i}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel${i}" aria-hidden="true">
      <div class="modal-dialog" role="document">
          <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel${i}">Schedual Meeting</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
              </button>
          </div>
          <div class="modal-body">
              <form>
              <div class="form-group">
                  <label for="recipient-name" class="col-form-label">Title:</label>
                  <input type="text" class="form-control" id="title${i}">
              </div>
              <div class="form-group">
                  <label for="recipient-name" class="col-form-label">Date/Time</label>
                  <input type="text" class="form-control" id="date${i}">
              </div>
              <div class="form-group">
                  <label for="recipient-name" class="col-form-label">Message</label>
                  <textarea type="text" class="form-control" id="message${i}">
                  </textarea>
              </div>
              <div class="form-group">
              <label for="recipient-name" class="col-form-label">Length</label>
              <input type="text" class="form-control" id="len${i}" textarea>
              </div>
              <div class="form-group">
                  <label for="message-text" class="col-form-label">Student</label>
                  <input type="text" class="form-control" placeholder = "${studentName}" readonly>
              </div>
              </form>
          </div>
          <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" onclick = "schedualMeeting('${studentEmail}', '${className}', '${i}')" data-dismiss = "modal">Send message</button>
          </div>
          </div>
      </div>
      </div>
      `
        $(outputModel).appendTo("#outputModel")
        $(descriptionOutput2).appendTo("#studentTable")

        if (studentReaction == "good") {
          document.getElementById("face").outerHTML = happy;
          $(descriptionOutput2).appendTo("#studentsListGreat");
          $(happy_face_Column).appendTo('#studentTable-doing-good');

        } else if (studentReaction == "meh") {
          document.getElementById("face").outerHTML = meh;
          $(descriptionOutput2).appendTo("#studentsListHelp");
          $(meh_colum_face).appendTo('#studentTable-meh');


        } else if (studentReaction == "needs help") {

          document.getElementById("face").outerHTML = sad;

          $(descriptionOutput2).appendTo("#studentsListFrustrated");
          $(frustrated_column_face).appendTo("#studentTable-frustrated");

        } else {
          document.getElementById("face").outerHTML = happy;

          $(happy_face_Column).appendTo("#studentsListGreat");
        }
      }
    }
  });
}


function schedualMeeting(emailStudent, course, index) {
  console.log("schedual meeting")

  var nameLocal = localStorage.getItem("email");
  var meetingTitle = document.getElementById("title" + index).value;
  var meetingDate = document.getElementById("date" + index).value;
  var meetingMessage = document.getElementById("message" + index).value;
  var len = document.getElementById("len" + index).value;
  var dateNow = new Date();
  var formattedDate = dateNow.toLocaleString();

  firebase.firestore().collection('UserData').doc(emailStudent).collection("Meetings").doc().set({
    "Title": meetingTitle,
    "Date": meetingDate,
    "Course": course,
    "Timestamp": dateNow.toString(),
    "message" : meetingMessage,
    "len" : len
  });

  firebase.firestore().collection('UserData').doc(nameLocal).collection("Meetings").doc().set({
    "Title": meetingTitle,
    "Date": meetingDate,
    "Course": course,
    "Timestamp": dateNow.toString(),
    "message" : meetingMessage,
    "len" : len


  });

}

function showGreat() {
  document.getElementById('studentTable').style.display = "none";
  document.getElementById("doing-good-table-section").style.display = "initial";
  document.getElementById("meh-table-section").style.display = "none";
  document.getElementById("frustrated-table-section").style.display = "none";

}

function showHelp() {

  document.getElementById('studentTable').style.display = "none";
  document.getElementById("doing-good-table-section").style.display = "none";
  document.getElementById("meh-table-section").style.display = "initial";
  document.getElementById("frustrated-table-section").style.display = "none";
}

function showFrustrated() {
  document.getElementById('studentTable').style.display = "none";
  document.getElementById("doing-good-table-section").style.display = "none";
  document.getElementById("meh-table-section").style.display = "none";
  document.getElementById("frustrated-table-section").style.display = "initial";
}

function showAll() {
  window.location.reload();
}


function cancelTeacherRequest(ID, districtID, teacher_email) {
  firebase.firestore().collection('Districts').doc(districtID).collection('Teacher Requests').doc(ID).delete().then(() => {
    firebase.firestore().collection('UserData').doc(teacher_email).update({
      "Pending District Request": null,
      "Pending School Request": null,
      "Pending School Request Name": null,
      "Pending Request ID": null,
    }).then(() => {
      window.location.reload()
    })
  });
}

function getEditData() {
  var code = localStorage.getItem("code");
  output = ''

  firebase.firestore().collection('Classes').doc(code).get().then(function (doc) {

    var data = doc.data();
    return data;


  }).then((data) => {
    var className = data['class-name'];
    var course = data['Course']
    var teacher = data['teacher']
    output += `

    <h6>Edit Class Name</h6>

  <div class="input-group mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text" id="basic-addon1">
    <i class="fa fa-pencil" aria-hidden="true" onclick = "editTitle()"></i>
    </span>
  </div>

  <input type="text" class="form-control" placeholder="${className}" aria-label="Username" aria-describedby="basic-addon1" name="editName" id="editName">
</div>
<h6>Edit Class Course</h6>

<div class="input-group mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text" id="basic-addon1">
    <i class="fa fa-pencil" aria-hidden="true" onclick = "editTitle()"></i>
    </span>
  </div>

  <input type="text" class="form-control" placeholder="${course}" aria-label="Username" aria-describedby="basic-addon1" name="editCourse" id="editCourse">
</div>
<h6>Edit Class Teacher</h6>

<div class="input-group mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text" id="basic-addon1">
    <i class="fa fa-pencil" aria-hidden="true" onclick = "editTitle()"></i>
    </span>
  </div>

  <input type="text" class="form-control" placeholder="${teacher}" aria-label="Username" aria-describedby="basic-addon1" name="editTeacher" id="editTeacher">
</div>

<button class="btn btn-primary" onclick="updateDetails()">Update Class Details</button>

  `

    $(output).appendTo("#editInfo");

    

  })
}

function updateDetails() {
  var code = localStorage.getItem("code");
  var emailRef = localStorage.getItem("email")


  var newName = document.getElementById('editName').value;
  var newCourse = document.getElementById('editCourse').value;
  var newTeacher = document.getElementById('editTeacher').value;

  firebase.firestore().collection('UserData').doc(emailRef).collection('Classes').doc(code).update({
    "class-name": newName,
    "Course": newCourse,
    "teacher": newTeacher

  }).then(() => {
    window.location.reload()

  });

  firebase.firestore().collection('Classes').doc(code).update({
    "class-name": newName,
    "Course": newCourse,
    "teacher": newTeacher

  }).then(() => {
    window.location.reload()

  });
};


function getChartData() {
  
  console.log("GETTING PIE CHART DEMO");

  var code = localStorage.getItem("codeForChart");

  //var _chartDataRef = firebase.database().ref().child("Classes").child(code).child("Students");
 // _chartDataRef.on('value', get);


      firebase.firestore().collection('Classes').doc(code).collection("Students").onSnapshot(function (doc) {

        document.getElementById('studentReportHeadline').innerHTML = "Student Report - " + code;

        var studentsReactionLists = [0,0,0];

        doc.forEach(snapshot => {

            var data1 = snapshot.data();

            console.log(data1);

            var reaction = data1["reaction"];

            if(reaction == "good"){
              studentsReactionLists[0] = studentsReactionLists[0] + 1;
            }
    
            if(reaction == "meh"){
              studentsReactionLists[1] = studentsReactionLists[1] + 1;
            }
    
            if(reaction == "needs help"){
              studentsReactionLists[2] = studentsReactionLists[2] + 1;
            }


        });

        setTimeout(function(){
          console.log(studentsReactionLists);
    
          // Set new default font family and font color to mimic Bootstrap's default styling
          Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
          Chart.defaults.global.defaultFontColor = '#858796';
          
          // Pie Chart Example
          var ctx = document.getElementById("myPieChart");
          var myPieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: ["Doing Great", "Needs Help", "Frustrated"],
              datasets: [{
                data: studentsReactionLists,
                backgroundColor: ['#4feb34', '#ebe834', '#eb0c00'],
                hoverBackgroundColor: ['#15b809', '#c2cc00', '#cc0011'],
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
       }, 700);//wait 2 seconds
    
        

    });

}











