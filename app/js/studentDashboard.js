var classCodes = {};
var selectedClass = "";

var dropDownMenuItems = ``;

//realtime db
/*
function updateReaction(reaction) {
  var box = document.getElementById("moodBox");

  box.innerHTML = '<div class="card shadow mb-4" style="width: max-content;"><div class="card-header py-3"><h6 class="m-0 font-weight-bold text-primary">Your Mood</h6></div><div class="card-body"><div class="center-text">Response reported.</div><div><button class = "btn btn-primary" onclick = "reloadPage()">Update Response</button></div></div></div>';

  var currentDate = new Date();

  var studentEmail = localStorage.getItem("email");

  var _ref = firebase.database().ref().child("Classes").child(classCodes[selectedClass]).child("Student Reactions").push();

  _ref.child("Student Email").set(studentEmail);
  _ref.child("Reaction").set(reaction);
  _ref.child("Date").set(currentDate.toString());

  var _reactionRef = firebase.database().ref().child("Classes").child(classCodes[selectedClass]).child("Students").child(studentEmail);
  _reactionRef.child("Reaction").set(reaction);

  var _reactionRefStudent = firebase.database().ref().child("UserData").child(studentEmail);
  _reactionRefStudent.child("Reaction").set(reaction);

  getStudentStatus();


}
*/

// firestore
function updateReaction(reaction) {
  var box = doc.getElementById("moodBox");

  box.innerHTML = '<div class="card shadow mb-4" style="width: max-content;"><div class="card-header py-3"><h6 class="m-0 font-weight-bold text-primary">Your Mood</h6></div><div class="card-body"><div class="center-text">Response reported.</div><div><button class = "btn btn-primary" onclick = "reloadPage()">Update Response</button></div></div></div>';

  var currentDate = new Date();

  var studentEmail = localStorage.getItem("email");

  var _ref = db.collection("Classes");

  _ref.doc(classCodes[selectedClass]).collection("Student Reactions").doc().set({
    studentEmail: studentEmail,
    reaction: reaction,
    date: currentDate.toString()
  });


  /*
  var _ref = firebase.database().ref().child("Classes").child(classCodes[selectedClass]).child("Student Reactions").push();

  _ref.child("Student Email").set(studentEmail);
  _ref.child("Reaction").set(reaction);
  _ref.child("Date").set(currentDate.toString());
  */

  _reactionRef = db.collection("Classes").doc(classCodes[selectedClass]).collection("Students").doc(studentEmail).set({
    reaction: reaction
  });

  _reactionRefStudent = db.collection("UserData").doc(studentEmail).set({
    reaction: reaction
  });

  getStudentStatus();


}

function reloadPage() {
  window.location.reload();

}


function setMainClassForMood(selectedClassName) {

  var dropDownButton = document.getElementById("selectedClassForDropdown");
  var dropDownButton1 = document.getElementById("selectedClassForDropdown1");

  var dropDownMenu = document.getElementById("dropDownMoodPicker");

  outputButton = `<button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="selectedClassForDropdown">
  ${selectedClassName}
</button>
`;

  dropDownButton.innerHTML = outputButton;
  dropDownButton1.innerHTML = outputButton;

  dropDownMenu.innerHTML = dropDownMenuItems;

  selectedClass = selectedClassName;

}

function getStudentClasses(studentUsername) {

  if (document.getElementById("classesRowDisplay") != null) {
    document.getElementById("classesRowDisplay").innerHTML = "";
  }

  let output = "";

  classesList = [];

  var _ref = firebase.database().ref().child("UserData").child(studentUsername).child("Classes");

  _ref.once('value').then(function (snapshot) {

    if (snapshot.val() != null) {
      snapshot.forEach((child) => {
        var classCode = child.child("Code").val();
        var className = child.child("class-name").val();

        classesList.push(className);
        classCodes[className] = classCode;
      });

      console.log(classCodes);
    }

  }).then(() => {
    console.log(classesList.length);

    console.log(classesList);

    inital = `
        <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="selectedClassForDropdown">
                  ${classesList[0]}
                </button>
        `;

    selectedClass = classesList[0];

    $(inital).appendTo("#selectedClassForDropdown");


    classesList.forEach(function (item, index) {
      console.log(item, index);
      output = `
          <div class="col-xl-3 col-md-6 mb-4">
                  <div class="card border-left-primary shadow h-100 py-2">
                    <div class="card-body">
                      <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                          <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">CLASS</div>
                          <div class="h5 mb-0 font-weight-bold text-gray-800">${item}</div>
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
          <a class="collapse-item">${item}</a>
          `;

      output3 = `
          <div class="dropdown-item" onclick="setMainClassForMood('${item}', '${classesList[0]}')" id = "${item}">${item}</div>
          `;

      dropDownMenuItems += output3;

      $(output3).appendTo("#dropDownMoodPicker");

      $(output2).appendTo("#classesListSideBar");

      $(output).appendTo("#classesRowDisplay");
    });
  });

}

function checkIfClassCodeExists() {

  var code = document.getElementById("inputClassCode").value;

  var error = document.getElementById("errorMessage");

  console.log(code);

  var exists = false;

  // var _ref = firebase.database().ref().child("Classes").child(code).child("Code");

  firebase.firestore().collection('Classes').doc(code).get().then(function (doc) {
    var classCode = doc.data()['Code'];

    if (classCode != null) {
      exists = true;
    } else {
      exists = false;
    }

    if (exists == false) {
      error.innerHTML = `
      <div class="alert alert-danger" role="alert" style="width: 310px;">
      Class code doesn't exist
     </div>
     `;
    }

    if (exists == true) {
      error.innerHTML = `
      <div class="alert alert-success" role="alert" style="width: 310px;">
      You have joined this class
     </div>
     `;

      addClassToStudentData(code);

      getStudentClasses(localStorage.getItem("email"));
    }

    console.log(exists);

  });
  // _ref.once('value').then(function (snapshot) {

  // if (snapshot.val() != null) {
  //   exists = true;
  // } else {
  //   exists = false;

  // }

  // if(exists == false){
  //   error.innerHTML = `
  //   <div class="alert alert-danger" role="alert" style="width: 310px;">
  //   Class code doesn't exist
  //  </div>
  //  `;
  // }

  // if(exists == true){
  //   error.innerHTML = `
  //   <div class="alert alert-success" role="alert" style="width: 310px;">
  //   You have joined this class
  //  </div>
  //  `;

  //  addClassToStudentData(code);

  //  getStudentClasses(localStorage.getItem("email"));
  // }

  // console.log(exists);


  // });

}

function addClassToStudentData(classCode) {


  firebase.firestore().collection("Classes").doc(classCode).get().then(function (doc) { 
    var classNamE = doc.data()['class-name'];

    firebase.firestore().collection("UserData").doc(localStorage.getItem("email")).collection("Classes").doc(classCode).set({
      'Code':classCode.toString(),
      'class-name':classNamE,
    });
    firebase.firestore().collection("Classes").doc(classCode).collection("Students").doc(studentEmail).set({
      'Name':classNamE,
      'Email':studentEmail,
    });
  });

  // var _classInfoRef = firebase.database().ref().child("Classes").child(classCode).child("class-name");

  // _classInfoRef.once('value').then(function (snapshot) {
  //   console.log("LOG:" + snapshot.val());
  //   if (snapshot.val() != null) {
  //     className = snapshot.val();
  //   }
  // }).then(() => {
  //   console.log("CLASS NAME: " + className);

  //   var _studentRef = firebase.database().ref().child("UserData").child(localStorage.getItem("email")).child("Classes").child(classCode);

  //   _studentRef.child("Code").set(classCode.toString());
  //   _studentRef.child("class-name").set(className);

  // });

  // var studentEmail = localStorage.getItem("email");

  // var studentName = localStorage.getItem("name");//localStorage.getItem("Formatted Email");

  // var _classInfoStudentRef = firebase.database().ref().child("Classes").child(classCode).child("Students").child(studentEmail);

  // _classInfoStudentRef.child("Name").set(studentName);
  // _classInfoStudentRef.child("Email").set(studentEmail);





}


function updateAddClasesDropdown(studentUsername) {

  let output = "";

  classesList = [];

  var _ref = firebase.database().ref().child("UserData").child(studentUsername).child("Classes");

  _ref.once('value').then(function (snapshot) {

    if (snapshot.val() != null) {
      snapshot.forEach((child) => {
        var classCode = child.child("Code").val();
        var className = child.child("class-name").val();

        classesList.push(className);
        classCodes[className] = classCode;
      });

      console.log(classCodes);
    }

  }).then(() => {
    console.log(classesList.length);

    console.log(classesList);

    inital = `
        <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="selectedClassForDropdown">
                  ${classesList[0]}
                </button>
        `;

    selectedClass = classesList[0];

    $(inital).appendTo("#selectedClassForDropdown");


    classesList.forEach(function (item, index) {
      console.log(item, index);
      output = `
          <div class="col-xl-3 col-md-6 mb-4">
                  <div class="card border-left-primary shadow h-100 py-2">
                    <div class="card-body">
                      <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                          <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">CLASS</div>
                          <div class="h5 mb-0 font-weight-bold text-gray-800">${item}</div>
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
          <a class="collapse-item">${item}</a>
          `;

      output3 = `
          <div class="dropdown-item" onclick="setMainClassForMood('${item}', '${classesList[0]}')" id = "${item}">${item}</div>
          `;

      dropDownMenuItems += output3;

      $(output3).appendTo("#dropDownMoodPicker");

      $(output2).appendTo("#classesListSideBar");

      $(output).appendTo("#classesRowDisplay");
    });
  });

}


function getStudentContactsList(studentUsername) {

  let output = "";

  var classesListContacts = [];

  var _ref = firebase.database().ref().child("UserData").child(studentUsername).child("Classes");

  _ref.once('value').then(function (snapshot) {

    if (snapshot.val() != null) {
      snapshot.forEach((child) => {
        var className = child.child("class-name").val();

        classesListContacts.push(className);

      });

    }

  }).then(() => {

    inital = `
    <div class="chat-contactBox-active">

                    <h3 style="font-weight: 700; padding-top: 28px; margin-left: 20px;">${classesListContacts[0]}</h3>

                  </div>
        `;

    $(inital).appendTo("#contactsSection");


    classesListContacts.forEach(function (item, index) {
      console.log(item, index);
      output = `
      <div class="chat-contactBox">

      <h3 style="font-weight: 700; padding-top: 28px; margin-left: 20px;">${item}</h3>

    </div>
          `;

      $(output).appendTo("#contactsSection");
    });
  });

}

function getStudentStatus() {
  var studentEmail = localStorage.getItem("email");

  var _reactionRefStudent = firebase.database().ref().child("UserData").child(studentEmail).child("Reaction");

  var page = document.getElementById('currentStatusSection');

  _reactionRefStudent.once('value').then(function (snapshot) {
    var value = snapshot.val();

    console.log(value);

    if (value != null) {
      if (value == "needs help") {
        page.innerHTML = `<h1  class="icon-hover" style = "margin-right: 20px; font-size: 70px;" >&#128545;</h1>`;
      }

      if (value == "meh") {
        page.innerHTML = `<h1  class="icon-hover" style = "margin-right: 20px; margin-left: 20px; font-size: 70px;" style="color: yellow;">&#128533;</h1>`;
      }

      if (value == "good") {
        page.innerHTML = `<h1 class="icon-hover" style = "margin-left: 20px; font-size: 70px;" style="color: green;">&#128513;</h1>`;
      }
    } else {
      page.innerHTML = `<h1  class="icon-hover" style = "margin-right: 20px; font-size: 70px;">&#128545;</h1>`;
    }
  });

}

function getMeetings() {
  var name = localStorage.getItem("email");

  var _ref = firebase.database().ref().child("UserData").child(name).child("Meetings");


  _ref.once('value').then(function (snapshot) {

    console.log("MEETINGS:" + snapshot.val());

    if (snapshot.val() != null) {
      snapshot.forEach((child) => {
        var classForMeeting = child.child("Course").val();
        var date = child.child("Date").val();
        var title = child.child("Title").val();

        console.log(child.val());

        output = `
        <div class="col-xl-5 col-md-6 mb-4" style = "min-width: 400px">
        <div class="card border-left-primary shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">${classForMeeting}</div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">${title}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
        `;

        $(output).appendTo("#meetingsList");


      });

    } else {
      console.log("NONE");
      outputError = `
        <h1>No Scheduled Meetings</h1>
        `;

      $(outputError).appendTo("#meetingsList");
    }

  });
}

function getAnnouncements() {

  var email = localStorage.getItem("email");

  var classesListCodes = [];

  var classnamesList = [];

  var _ref = firebase.database().ref().child("UserData").child(email).child("Classes");

  _ref.once('value').then(function (snapshot) {

    if (snapshot.val() != null) {
      snapshot.forEach((child) => {
        var classCode = child.child("Code").val();

        classesListCodes.push(classCode);

        classnamesList.push(child.child("class-name").val());
      });

    }

  }).then(() => {
    for (let i = 0; i <= classesListCodes.length; i++) {
      var classcode = classesListCodes[i];
      console.log("CLASS CODE" + classcode);

      if (classcode != undefined || classcode != null) {
        var _classRef = firebase.database().ref().child("Classes").child(classcode).child("Announcements");

        _classRef.once('value').then(function (snapshot) {

          if (snapshot.val() != null) {
            snapshot.forEach((child) => {

              outputAnnouncements = "";

              var title = child.child("Title").val();
              var message = child.child("Message").val();

              console.log(title);
              console.log(message);

              var nameClass = classnamesList[i];

              outputAnnouncements = `
              <div class="col-xl-5 col-md-6 mb-4">
              <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">${nameClass}</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800">${message}</div>
                    </div>
                    <div class="col-auto">
                      <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
              `;

              outputDashboard = `
              <div class="card mb-4 py-3 border-left-success" style="height: 110px">
                    <div class="card-body">
                      <p class="m-0 font-weight-bold text-primary">${nameClass}</p>
                      <p>${message}</p>
                    </div>
                  </div>
              `;

              $(outputAnnouncements).appendTo("#annoucementsSection");
              $(outputDashboard).appendTo("#AnnouncementsPageSection");



              //DYNAMIC CODE HERE
            });

          }

        });
      }

    }
  });


}