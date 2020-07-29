function encrypt(message){
  var AES_KEY = `
      MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7EiRUS/MhtKsEGNIq6zGsoWhE
      0hqRK8YbBEbWJP1u+Olec5c0+CNdHt+y6oBC5wphQrpDrVQWwJgHRa6sRJMgwDz8
      XKV1hUMBhxcfPICA60OyBR5lo/vZC8GwQIhJJBgF4EHjkFuvccYLNlLdSAzLTsVj
      GSs9e0fkp+LX193UXQIDAQAB
      `;

      var data = CryptoJS.AES.encrypt(message, AES_KEY);

      return data.toString();
}

function decrypt(message){
  var AES_KEY = `
      MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7EiRUS/MhtKsEGNIq6zGsoWhE
      0hqRK8YbBEbWJP1u+Olec5c0+CNdHt+y6oBC5wphQrpDrVQWwJgHRa6sRJMgwDz8
      XKV1hUMBhxcfPICA60OyBR5lo/vZC8GwQIhJJBgF4EHjkFuvccYLNlLdSAzLTsVj
      GSs9e0fkp+LX193UXQIDAQAB
      `;

      var decrypted = CryptoJS.AES.decrypt(message, AES_KEY);
      var originalText = decrypted.toString(CryptoJS.enc.Utf8);

      console.log(originalText)

      return originalText.toString();
}
var classCodes = {};
var selectedClass = "";

var dropDownMenuItems = ``;

function getProfileInfo() {

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var name = user.displayName;
      var pic = user.photoURL;

      console.log(user)

      var outputPic = ``;

      if(pic != null && pic != undefined && pic != ""){
          outputPic = `<img class="img-profile rounded-circle" src="${pic}">`;
      } else {
          outputPic = `<img class="img-profile rounded-circle" src="https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144849704.jpg">`;
      }
    
    
      $(outputPic).appendTo("#profilePic")

      if(name != null&& name != undefined){
        document.getElementById("displayName").innerHTML = name
      } else {
        document.getElementById("displayName").innerHTML = "Error Occured"
      }
    
      
    } else {
      console.log("user Signed out");
      
    }
  })

}

function getGrayStudentStatus(email, classCode){

  firebase.firestore().collection("Classes").doc(classCode).get().then(snapshot => {

    var data = snapshot.data();

    var className = data["class name"];

    var greyTimeLimit = data['max days inactive'];

    if(greyTimeLimit != null && greyTimeLimit != undefined){
      var _ref = firebase.firestore().collection("UserData").doc(email).collection("Classes").doc(classCode)

      _ref.get().then(snapshot => {
        var data = snapshot.data();
    
        var lastStatusUpdate = data['Last Status Update']
    
        if(lastStatusUpdate != null && lastStatusUpdate != undefined){

          var lastStatusUpdate = new Date(lastStatusUpdate)

          var today = new Date();

            var days = greyTimeLimit;

            var lastDate = new Date();

            lastDate.setDate ( lastStatusUpdate.getDate() + days );
            lastDate.setHours ( lastStatusUpdate.getHours() );
            lastDate.setMinutes ( lastStatusUpdate.getMinutes() );
            lastDate.setSeconds ( lastStatusUpdate.getSeconds() );

            if(today.getTime() > lastDate.getTime()){

              var output = `
              <!-- Modal -->
              <div class="modal fade" id="exampleModal${classCode}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
              <div class="modal-content">
              <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel"><i class="fas fa-stopwatch"></i> Gray Time Exceeded</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
              </button>
              </div>
              <div class="modal-body">
              You have exceeded your gray time for the class ${className}. Please update you reaction for this class.
              </div>
              <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">OK</button>
              </div>
              </div>
              </div>
              </div>
              `;

              $(output).appendTo('#main-body-content')

              $(`#exampleModal${classCode}`).modal('toggle')
          } else {
            
          }
        }
      });
    }
  })

}

function getAnnouncementForClass(code) {
  var announcementCount = 0;

  firebase.firestore().collection('Classes').doc(code).collection('Announcements').get().then(function(doc) {
    doc.forEach(snapshot => {
      announcementCount = announcementCount + 1
      var data = snapshot.data()
      var date = data["date"]
      var message = data["message"]
      var title = data["title"]

      var formattedDate = new Date(date.seconds*1000).toLocaleString() 

      output = `
      <div class="col-xl-12 col-md-6 mb-4">
                <div class="card border-left-success" style = 'height: max-content'>
                      <div class="card-body">

                        <h4 style = 'font-weight: 700; margin: 2px; style = 'overflow: hidden; text-overflow: ellipsis; margin-top: 10px;
                        display: -webkit-box;
                        -webkit-line-clamp: 1; /* number of lines to show /
                        -webkit-box-orient: vertical;''>${title}</h4>

                        <p style = '   overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 1; / number of lines to show */
                        -webkit-box-orient: vertical;'>${message}</p>

                        <h3 style = 'font-size: 15px'>${formattedDate}</h3>
                      </div>
                    </div>

                    </div>
      `

      $(output).appendTo('#classAnnouncement')
    })

  }).then(() => {
      if(announcementCount == 0){
        var noAnnouncementsHTML = `
        <div class="d-flex justify-content-center" style="margin-top: 10%;">
        <img src="/teacher/img/undraw_popular_7nrh.svg" alt="" width="20%">
    </div>
    <center style="margin-top: 1%;">
        <h2>No Announcements</h2>
        <p>There aren't any announcements for this class</p>
  
    </center>
        `

        document.getElementById('classAnnouncement').innerHTML = noAnnouncementsHTML;
      }
    })
}

function getClassDataClassesPage(code){
  firebase.firestore().collection("Classes").doc(code).get().then(snap => {
    var data = snap.data();

    var className = data['class name']
    var course = data['Course']
    var courseDescription = data["courseDescription"]
    var teacherName = ""
    var teacherPicture = ""
    var teacherEmail = data['teacher email']
    var teacherNote = data['teachersNote']
    console.log(data['max days inactive'])
    var grayTimelimit = data['max days inactive'] != undefined? data['max days inactive']: "Not Set"

    firebase.firestore().collection('UserData').doc(teacherEmail).get().then(snap => {
      var data = snap.data();

      teacherName = data['display name']
      teacherPicture = data['Profile Picture'] != undefined ? data['Profile Picture'] : "https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144849704.jpg"
    }).then(() => {
      if(document.getElementById('className') != null){
        document.getElementById('className').innerHTML = `<h1>${className}</h1>`
      }
  
      var courseInfoHTML = `
      <h3>Instructor</h3>
  
      <div style="margin-top: 20px;">
  
          <div class="row" style = "margin-left: 6px">
              <img class="img-profile rounded-circle" style= "width: 90px; height: 90px; object-fit: cover" src="${teacherPicture}">
             <div class="col" style="margin-left: 20px; margin-top: 10px;">
              <h4>${teacherName}</h4>
              <p>${teacherEmail}</p>
             </div>
          </div>
  
      </div>
  
      <h3 style="margin-top: 40px;">Course Description</h3>
  
      <div style="margin-top: 20px; width: 95%;">
          
          <p>${courseDescription}</p>
  
      </div>
  
      <h3 style="margin-top: 40px;">Teacher's Note</h3>
  
      <div style="margin-top: 20px; width: 95%;">
          
          <p>${teacherNote}</p>
  
      </div>
  
      <h3 style="margin-top: 40px;">Student Inactive Time Limit</h3>
  
      <div style="margin-top: 20px; width: 95%;">
          
          <p>Inactive time limit: ${grayTimelimit} Days</p>
  
      </div>

      <h3 style="margin-top: 30px;">Leave Class</h3>

      <button type="button" class="btn btn-outline-danger" onclick = "toggleLeaveClassPopup('${className}', '${code}')">Leave Class</button>
      `;
  
      document.getElementById('info-pannel').innerHTML = courseInfoHTML;
    })




  })
}

function toggleLeaveClassPopup(className, classCode){

  var modalHTML = `
  <!-- Modal -->
<div class="modal fade" id="leaveClassModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Leave Class?</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        Are you sure you want to leave the class <strong>${className}?</strong>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-danger" onclick = "leaveClass('${classCode}')">Leave Class</button>
      </div>
    </div>
  </div>
</div>
  `;


  $(modalHTML).appendTo('#page-top');

  $('#leaveClassModal').modal('toggle')

}

function leaveClass(code){

}

// FIRESTORE MIGRATED FULLY
async function getStudentClasses(studentUsername, pageType) {


  if (document.getElementById("classesRowDisplay") != null) {
    document.getElementById("classesRowDisplay").innerHTML = "";
  }

  if (document.getElementById("classesListSideBar") != null) {
    document.getElementById("classesListSideBar").innerHTML = "";
  }

  let output = "";

  classesList = [];

  var reactionsList = {}

  var index = 0;

  let classesRef = firebase.firestore().collection('UserData').doc(studentUsername).collection("Classes");
  let classesRefGet = await classesRef.get();
  for(const doc of classesRefGet.docs){

    var classData = doc.data();

    var classCode = classData["code"];

    var reaction = classData["status"];

    reactionsList[classCode] = reaction

    var className = "loading"

    console.log(classData['status'])

    var x = await firebase.firestore().collection('Classes').doc(classCode).get().then(snap => {
      var data = snap.data();
  
      if(data != null && data != undefined){
          className = data['class name'];
      }
    }).then(() => {
      
      classesList.push(className);
      classCodes[className] = classCode;
    })
  }

    if (classesList.length != 0) {


      inital = `
          <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="selectedClassForDropdown">
                    ${classesList[0]}
                  </button>
          `;

      selectedClass = classesList[0];

      $(inital).appendTo("#selectedClassForDropdown");


      classesList.forEach(async function (item, index) {

        var classCode = classCodes[item]

        await getGrayStudentStatus(studentUsername, classCode)

        localStorage.setItem("selectedClassDropdown", classCode);


        index = index + 1
      
        console.log(reactionsList[classCode])

        var reaction = reactionsList[classCode]

        var buttonsGrid = ``;

        if(reaction == 'doing great'){
          buttonsGrid = `
          
          <a onclick = "updateReaction('doing great', '${classCode}', '${studentUsername}', '${pageType}')" href = "javascript:;"><i class="fas fa-smile" style="font-size: 50px; color: #1cc88a;"></i></a>

          <a onclick = "updateReaction('need help', '${classCode}','${studentUsername}', '${pageType}')" href = "javascript:;"><i class="far fa-meh" style="font-size: 50px; margin-left: 15px; color: lightslategray"></i></a>

          <a onclick = "updateReaction('frustrated', '${classCode}','${studentUsername}', '${pageType}')" href = "javascript:;"><i class="far fa-frown" style="font-size: 50px; margin-left: 15px; color: lightslategray"></i></a>


          `
        } else if (reaction == "need help"){
          buttonsGrid = `
          
          <a onclick = "updateReaction('doing great', '${classCode}','${studentUsername}', '${pageType}')" href = "javascript:;"><i class="far fa-smile" style="font-size: 50px; color: lightslategray"></i></a>

          <a onclick = "updateReaction('need help', '${classCode}','${studentUsername}', '${pageType}')" href = "javascript:;"><i class="fas fa-meh" style="font-size: 50px; margin-left: 15px; color: #f6c23e;"></i></a>

          <a onclick = "updateReaction('frustrated', '${classCode}','${studentUsername}', '${pageType}')" href = "javascript:;"><i class="far fa-frown" style="font-size: 50px; margin-left: 15px; color: lightslategray"></i></a>

          `
        } else if (reaction == "frustrated"){
          buttonsGrid = `
          
          <a onclick = "updateReaction('doing great', '${classCode}','${studentUsername}', '${pageType}')" href = "javascript:;"><i class="far fa-smile" style="font-size: 50px; color: lightslategray"></i></a>

          <a onclick = "updateReaction('need help', '${classCode}','${studentUsername}', '${pageType}')" href = "javascript:;"><i class="far fa-meh" style="font-size: 50px; margin-left: 15px; color: lightslategray"></i></a>

          <a onclick = "updateReaction('frustrated', '${classCode}','${studentUsername}', '${pageType}')" href = "javascript:;"><i class="fas fa-frown" style="font-size: 50px; margin-left: 15px; color: #e74a3b;"></i></a>

          `
        } else {
          buttonsGrid = `
          
          <a onclick = "updateReaction('doing great', '${classCode}','${studentUsername}', '${pageType}')" href = "javascript:;"><i class="fas fa-smile" style="font-size: 50px; color: #1cc88a;"></i></a>

          <a onclick = "updateReaction('need help', '${classCode}','${studentUsername}', '${pageType}')" href = "javascript:;"><i class="far fa-meh" style="font-size: 50px; margin-left: 15px; color: lightslategray"></i></a>

          <a onclick = "updateReaction('frustrated', '${classCode}','${studentUsername}', '${pageType}')" href = "javascript:;"><i class="far fa-frown" style="font-size: 50px; margin-left: 15px; color: lightslategray"></i></a>


          `
        }

        output = `
        <div class="col-lg-6 mb-6" style="margin-bottom: 20px;">
        <div class="card bg-white text-black shadow">
          <div class="card-body">
            <div style="display: inline;">
              <a href = "classes/${classCode}" style = "text-decoration:none; color: gray;"><h4 style="margin-left:20px; padding-top: 2%;">${item}</h4></a>
              
              <section>
                <div class="row" style=" margin-top: 2%; float: right; margin-top: -40px; margin-right: 10px;">
                     ${buttonsGrid}

                </div>
              </section>

             
            </div>
            
          </div>
        </div>
    </div>
            `;


            

            if(pageType == 'class-page'){
              output2 = `
              <a href = "${classCode}" class="collapse-item" style = 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'>${item}</a>
              `;
            } else {
              output2 = `
              <a href = "/student/classes/${classCode}" class="collapse-item" style = 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'>${item}</a>
              `;
            }
        output3 = `
        <option selected value="base">${item}</option>
            `;

        dropDownMenuItems += output3;

        $(output3).appendTo("#dropDownMoodPicker");

        $(output2).appendTo("#classesListSideBar");

        $(output).appendTo("#classesRowDisplay");

        if (pageType == "student-joinClass") {
          document.getElementById('loadingIndicator').style.display = "none";

          document.getElementById('classesSection-description').style.display = "initial";

          document.getElementById('noClasses-Section').style.display = "none";

        } else {
          document.getElementById('loadingIndicator').style.display = "none";

          document.getElementById('dashboardSection-content').style.display = "initial";

          document.getElementById('noClassesSection').style.display = "none";
        }

      });

    } else {

      if (pageType == "student-joinClass") {
        document.getElementById('loadingIndicator').style.display = "none";

        document.getElementById('classesSection-description').style.display = "none";

        document.getElementById('noClasses-Section').style.display = "initial";

      } else {
        document.getElementById('loadingIndicator').style.display = "none";

        document.getElementById('dashboardSection-content').style.display = "none";

        document.getElementById('noClassesSection').style.display = "initial";

      }
    }   

}


// FIRESTORE MIGRATED FULLY
function updateReaction(reaction, classSelected, studentUsername, pageType) {
  //var box = document.getElementById("moodBox");

  //box.innerHTML = '<center><div class="center-text">Response reported.</div><div><button class = "btn btn-primary" onclick = "reloadPage()">Update Response</button></div></center>';

  var currentDate = new Date();

  
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var studentEmail = user.email;


      //var classSelected = localStorage.getItem("selectedClassDropdown");

      firebase.firestore().collection("UserData").doc(studentEmail).collection("Classes").doc(classSelected).update({
        "Last Status Update": currentDate.toString(),
        "status": reaction
      }).then(() => {
        firebase.firestore().collection("Classes").doc(classSelected).collection("Student Reactions").doc().set({
          studentEmail: studentEmail,
          status: reaction,
          date: currentDate.toString(),
          timestamp: currentDate.getTime().toString()
        }).then(() => {
          firebase.firestore().collection("Classes").doc(classSelected).collection("Students").doc(studentEmail).update({
            status: reaction,
            "date": new Date()
          });
        
          firebase.firestore().collection("UserData").doc(studentEmail).update({
            status: reaction
          }).then(() => {
            getStudentClasses(studentUsername, pageType)
          });
        });
      });
    

    
      //getStudentStatus(studentEmail);
    }
  })

}

function reloadPage() {
  window.location.reload();
}


//Firestore Migrated Fully
function setMainClassForMood(index) {

  className = classesList[index];

  selectedClass = classCodes[className];

  localStorage.setItem("selectedClassDropdown", selectedClass);

}

//Firestore migrated fully
function checkIfClassCodeExists(addType) {

  if (addType == "no-classes") {

    var code = document.getElementById("inputClassCode-noClasses").value;

    var error = document.getElementById("errorMessage-noClasses");


    var exists = false;

    // var _ref = firebase.database().ref().child("Classes").child(code).child("Code");

    firebase.firestore().collection('Classes').doc(code).get().then(function (doc) {
      var classCode = doc.data();

      var allowJoin = classCode['allow join']

      if (classCode != null) {
        if(allowJoin == true){
          exists = true;
        } else {
          error.innerHTML = `
          <div class="alert alert-danger" role="alert" style="width: 310px;">
          This class isn't currently accepting students
         </div>
         `;
        }
        

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

      if (exists == "enrolledInClass") {
        error.innerHTML = `
     <div class="alert alert-danger" role="alert" style="width: 310px;">
     You are already enrolled in this class
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

      }


    });

  } else {

    var code = document.getElementById("inputClassCode").value;

    var error = document.getElementById("errorMessage");


    //var exists = false;

    // var _ref = firebase.database().ref().child("Classes").child(code).child("Code");

    firebase.firestore().collection('Classes').doc(code).get().then(function (doc) {
      var classCode = doc.data();

      var exist = false;

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

      if (exists == "enrolledInClass") {
        error.innerHTML = `
      <div class="alert alert-danger" role="alert" style="width: 310px;">
      You are already enrolled in this class
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
      }
    });
  }
}



//Firestore migrated fully
function addClassToStudentData(classCode) {

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var name = user.displayName;
      var email = user.email;

      firebase.firestore().collection("Classes").doc(classCode).get().then(function (doc) {

        var classNamE = doc.data()['class name'];
    
        firebase.firestore().collection("UserData").doc(email).collection("Classes").doc(classCode).set({
          'code': classCode.toString(),
          'class name': classNamE,
        });
    
        firebase.firestore().collection("Classes").doc(classCode).collection("Students").doc(email).set({
          'name': name,
          'email': email,
          'date': new Date(),
        });
    
      }).then(() => {
        setTimeout(function(){
          window.location.reload();
       }, 500);
        
      });
    }
  });
}

//FIRESTORE MIGRATED FULLY
async function updateAddClasesDropdown(studentUsername, pageType) {

  let output = "";

  classesList = [];

  var classCodesList = []

  let classesRef = firebase.firestore().collection('UserData').doc(studentUsername).collection("Classes");
  let classesRefGet = await classesRef.get();
  for(const doc of classesRefGet.docs){

    var classData = doc.data();

    var classCode = classData["code"];

    var className = "loading"

    var x = await firebase.firestore().collection('Classes').doc(classCode).get().then(snap => {
      var data = snap.data();
  
      if(data != null && data != undefined){
          className = data['class name'];
      }
    }).then(() => {
      classesList.push(className);
      classCodesList.push(classCode)
    })
  }

    inital = `
        <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="selectedClassForDropdown">
                  ${classesList[0]}
                </button>
        `;

    selectedClass = classesList[0];

    $(inital).appendTo("#selectedClassForDropdown");


    classesList.forEach(function (item, index) {

          if(pageType == 'class-page'){
            output2 = `
            <a href = "${classCodesList[index]}" class="collapse-item" style = 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'>${item}</a>
            `;
          } else {
            output2 = `
            <a href = "/student/classes/${classCode}" class="collapse-item" style = 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'>${item}</a>
            `;
          }

      $(output2).appendTo("#classesListSideBar");

  });;

}


function getStudentContactsList(studentUsername) {

  let output = "";

  var classesListContacts = [];

  var _ref = firebase.database().ref().child("UserData").child(studentUsername).child("Classes");

  _ref.once('value').then(function (snapshot) {

    if (snapshot.val() != null) {
      snapshot.forEach((child) => {
        var className = child.child("class name").val();

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
      output = `
      <div class="chat-contactBox">

      <h3 style="font-weight: 700; padding-top: 28px; margin-left: 20px;">${item}</h3>

    </div>
          `;

      $(output).appendTo("#contactsSection");
    });
  });

}


//FIRESTORE FULLY MIGRATED
function getStudentStatus(studentEmail) {

  var page = document.getElementById('currentStatusSection');

  firebase.firestore().collection('UserData').doc(studentEmail).get().then(function (doc) {
    var value = doc.data()["status"];

    if (value != undefined) {
      if (value == "frustrated") {
        page.innerHTML = `<h1  class="icon-hover" style = "margin-right: 20px; font-size: 70px;" >&#128545;</h1>`;
      }

      if (value == "need help") {
        page.innerHTML = `<h1  class="icon-hover" style = "margin-right: 20px; margin-left: 20px; font-size: 70px;" style="color: yellow;">&#128533;</h1>`;
      }

      if (value == "doing great") {
        page.innerHTML = `<h1 class="icon-hover" style = "margin-left: 20px; font-size: 70px;" style="color: green;">&#128513;</h1>`;
      }
    } else {
      page.innerHTML = `<h1  class="icon-hover" style = "margin-right: 20px; font-size: 70px;" >&#128513;</h1>`;
    }

  });

}

//FIRESTORE MIGRATED FULLY
function getMeetings(email, pageType) {

  //GETS MEETINGS FOR MEETINGS PAGE
  if(pageType == "meetingsPage"){
    firebase.firestore().collection('UserData').doc(email).collection("Meetings").orderBy("Date").get().then(function (doc) {

      var meetingsCount = 0;
  
      doc.forEach(snapshot => {
  
        meetingsCount += 1;
  
        var meetingsData = snapshot.data();
  
        var classForMeeting = meetingsData["Course"];
        var date = meetingsData["Date"];
        var title = meetingsData["Title"];
  
  
        output = `
          <div class="col-xl-12 col-md-6 mb-4">
          <div class="card border-left-primary shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">${classForMeeting}</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">${title}</div>
                  <h6 style = 'color: gray; font-weight: 700'>${date}</h6>
                </div>
                <div class="col-auto">
  
                  <i class="fas fa-microphone-alt fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
          `;
  
        $(output).appendTo("#meetingsList-main-page");
      });
  

  
      if (meetingsCount == 0) {
  
       document.getElementById("loadingIndicator").style.display = "none";
       document.getElementById("all-meetings-widget").style.display = "none";
       document.getElementById("no-meetings-section").style.display = "initial";

      } else {
        document.getElementById("loadingIndicator").style.display = "none";
        document.getElementById("all-meetings-widget").style.display = "initial";
        document.getElementById("no-meetings-section").style.display = "none";
      }
  
    });
  } 
  
  
  //GETS MEETINGS FOR DASHBOARD PAGE SECTION 

  if(pageType == "dashboard"){
    firebase.firestore().collection('UserData').doc(email).collection("Meetings").orderBy("Date").limitToLast(3).get().then(function (doc) {

  
      var meetingsCount = 0;
  
      doc.forEach(snapshot => {
  
        meetingsCount += 1;
  
        var meetingsData = snapshot.data();
  
        var classForMeeting = meetingsData["Course"];
        var date = meetingsData["Date"];
        var title = meetingsData["Title"];

        output = `
          <div class="col-xl-12 col-md-6 mb-4">
          <div class="card border-left-primary shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">${classForMeeting}</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800" style = 'overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 1;
                  max-width: 25ch;
                  -webkit-box-orient: vertical;'>${title}</div>
                  <h6 style = 'color: gray; font-weight: 700; margin-top: 10px'>${date}</h6>
                </div>
                <div class="col-auto">
  
                  <i class="fas fa-microphone-alt fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
          `;
  
        $(output).appendTo("#meetingsList");
      });
    
  
      if (meetingsCount == 0) {
        outputError = `
        <center>
        <img src = "img/undraw_Booked_j7rj.svg" width="70%">
  
        <h2 style="margin-top: 2%;">No Scheduled Meetings</h2>
        <p>You're all caught up</p>
      </center>
          `;
  
        $(outputError).appendTo("#meetingsList");
      } else {
  
      }
  
    });
  }

  /*

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

  */
}

async function getAnnouncements(email, pageType = "annoncements-page-main") {

  document.getElementById("loadingIndicator").style.display = "initial";

  var classesListCodes = [];

  var classnamesList = [];

  classesList = [];

  var index = 0;

  let classesRef = firebase.firestore().collection('UserData').doc(email).collection("Classes");
  let classesRefGet = await classesRef.get();
  for(const doc of classesRefGet.docs){

    var classData = doc.data();

    var classCode = classData["code"];

    var className = "loading"

    var x = await firebase.firestore().collection('Classes').doc(classCode).get().then(snap => {
      var data = snap.data();
  
      if(data != null && data != undefined){
          className = data['class name'];
      }
    }).then(() => {
      classesListCodes.push(classCode)
      classnamesList.push(className)
    })
  }

    if(pageType == 'dashboard'){

      var announcementsCount = 0;

      for (let i = 0; i <= classesListCodes.length; i++) {
        var classcode = classesListCodes[i];
  
        if (classcode != undefined && classcode != null) {
  
          firebase.firestore().collection('Classes').doc(classcode).collection("Announcements").orderBy("date").limitToLast(3).get().then(function (doc) {
  
  
            doc.forEach(snapshot => {
  
              var annoucementData = snapshot.data();
  
              if (annoucementData != undefined && annoucementData != null) {
                outputAnnouncements = "";
  
                announcementsCount += 1;

  
                var title = annoucementData["title"];
                var message = annoucementData["message"];
                var date = annoucementData['date'];
                var formattedDate = new Date(date.seconds*1000).toLocaleString() 
        

  
                var nameClass = classnamesList[i];
  
                outputDashboard = `

                <div class="col-xl-12 col-md-6 mb-4">
                <div class="card border-left-success" style = 'height: max-content'>
                      <div class="card-body">
                        <h4 class="badge badge-info">${nameClass}</h4>

                        <h5 style = 'overflow: hidden;
                        text-overflow: ellipsis;
                        max-width: 25ch;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;'>${title}</h5>

                        <p style = 'overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        max-width: 30ch;
                        -webkit-box-orient: vertical;'>${message}</p>

                        
                      </div>
                    </div>

                    </div>
                `;

                $(outputDashboard).appendTo("#AnnouncementsPageSection");
  
              }
            });
          });
        }
  
      }
  
      setTimeout(() => {
  //IF there is no annonucements
  
  if (announcementsCount == 0) {
  
    var noAnnouncementsHTML = ` 
      
    <center>
    <img src="img/undraw_work_chat_erdt.svg" width="73%">
  
    <h2 style="margin-top: 3%;">No Announcements</h2>
    <p>You're all caught up</p>
  </center>
    `;
  document.getElementById("AnnouncementsPageSection").innerHTML = noAnnouncementsHTML;
  
  } else {
  
  }
       }, 1000)
    } 
    
    //////////////////////////////////////////////////////////////////////////////////////////
    
    else {
      var announcementsCount = 0;

      for (let i = 0; i <= classesListCodes.length; i++) {
        var classcode = classesListCodes[i];
  
        if (classcode != undefined && classcode != null) {
  
          firebase.firestore().collection('Classes').doc(classcode).collection("Announcements").orderBy('date').get().then(function (doc) {
  
            doc.forEach(snapshot => {
  
              var annoucementData = snapshot.data();
  
              if (annoucementData != undefined && annoucementData != null) {
                outputAnnouncements = "";
  
                announcementsCount += 1;
  
  
                var title = annoucementData["title"];
                var message = annoucementData["message"];
                var date = annoucementData['date'];

                var formattedDate = new Date(date.seconds*1000).toLocaleString() 

  
                var nameClass = classnamesList[i];
  
                outputAnnouncements = `
                <div class="col-xl-12 col-md-6 mb-4">
                <div class="card border-left-primary shadow h-100 py-2">
                  <div class="card-body">
                    <div class="row no-gutters align-items-center">
                      <div class="col mr-2">
                        <h4 class="badge badge-info">${nameClass}</h4>

                        <h4 style = 'font-weight: 700; margin: 2px'>${title}</h4>

                        <p style = 'color: gray'>${message}</p>
  
                        <div class="h6 mb-0" style = "color: #a2a39b">${formattedDate}</div>
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
  
                  $(outputAnnouncements).appendTo("#annoucementsSection");
              }
            });
          });
        }
      }
  
      setTimeout(() => {
  //IF there is no annonucements
  
  if (announcementsCount == 0) {

      document.getElementById("loadingIndicator").style.display = "none";
  
      document.getElementById("announcementsSection-section").style.display = "none";
      
      document.getElementById("no-Announcements-section").style.display = "initial";
  
  } else {

      document.getElementById("loadingIndicator").style.display = "none";
  
      document.getElementById("announcementsSection-section").style.display = "initial";
      
      document.getElementById("no-Announcements-section").style.display = "none";
  }
       }, 1000)
    }
}


var classCodeChat = 'NONE'

function getMessagesForChat_Classes_page(classCode){
  console.log("Getting messages")

  classCodeChat = classCode

  var lastID = '';

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var email = user.email;

      firebase.firestore().collection('Class-Chats').doc(classCode).collection(email).orderBy('timestamp').get().then(snap => {
        snap.forEach(doc => {
          var data = doc.data();
    
          lastID = doc.id
    
          var message = data.message;
          var time = data.timestamp;
    
          var user = data.user
    
          var formattedTime = new Date(time.seconds).toLocaleString()
    
          console.log(formattedTime)
    
          console.log(data)
    
          var messageHTML = `
          <div class="message-component" style="margin-top: 50px">
          <div class="row">
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="Avatar" class="avatar">
            <div class="col">
              <div class="row" style="margin-left: 5px;">
                <h5>${user}</h5>
                <div style="width: 80%;"></div>
                <p style="float: right">${formattedTime}</p>
              </div>
              <div>
              <p>${message}</p>
              </div>
              
            </div>
          </div>
          <hr>
        </div>
        `
    
          $(messageHTML).appendTo('#message-components')
    
          
        })
    
      }).then(() => {
        scrollSmoothToBottom()
    
          firebase.firestore().collection('Class-Chats').doc(classCode).collection(email).orderBy('timestamp').limitToLast(1).onSnapshot(snap => {
            snap.forEach(doc => {
              var data = doc.data();
    
              if (doc.id != lastID){
                var message = data.message;
                var time = data.timestamp;
          
                var user = data.user
    
                var formattedTime = new Date(time.seconds).toLocaleString()
    
                console.log(formattedTime)
          
                console.log(data)
          
                var messageHTML = `
                <div class="message-component" style="margin-top: 50px">
                <div class="row">
                  <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="Avatar" class="avatar">
                  <div class="col">
                    <div class="row" style="margin-left: 5px;">
                      <h5>${user}</h5>
                      <div style="width: 80%;"></div>
                      <p style="float: right">${formattedTime}</p>
                    </div>
                    <div >
                      <p>${message}</p>
                      </div>
                  </div>
                </div>
                <hr>
              </div>
              `
          
                $(messageHTML).appendTo('#message-components')
              }
      
            })
    
            scrollSmoothToBottom()
          })
    
      })
    }
  });


} 

function sendMessage_Classes_page(classCode){
  console.log("Message queued")
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var email = user.email;
      var name = user['displayName'];
      var date = new Date()

      var message = document.getElementById('message-input').value
    
      firebase.firestore().collection('Class-Chats').doc(classCode).collection(email).doc().set({
          "message": message,
          "user": name,
          "timestamp": date,
          "sent type": "student"
    
      }).then(() => {
        console.log("Message sent")
        document.getElementById('message-input').value = '';
    
      })
    }
    });
} 

function scrollSmoothToBottom() {
  console.log("scrolling")
  var div = document.getElementById('message-components');
  $(div).animate({
    scrollTop: div.scrollHeight - div.clientHeight
  }, 500);
}


