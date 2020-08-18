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

      firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
        //socket.emit('send-announcement-emails-to-students', {"code": code, 'title': messageTitle, 'message': messageText, 'className': className, 'authToken': idToken});
        //console.log(idToken)
  
      }).catch(function(error) {
        // Handle error
      });

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
/*

async function getAnnouncementForClass(code, email) {
  var index = 0;

  document.getElementById('classAnnouncement').innerHTML = ``

  let announcementRef = firebase.firestore().collection('Classes').doc(code).collection('Announcements')
  let announcementRefGet = await announcementRef.get();
  for(const doc of announcementRefGet.docs){

    index = index + 1
    var data = doc.data()
    var date = data["timestamp"]
    var message = data["message"]
    var title = data["title"]
    var announcementId = doc.id
    console.log("THING:" + announcementId)

    var myReaction = "nonet"

    var x = await firebase.firestore().collection('Classes').doc(code).collection("Announcements").doc(doc.id).collection('Student Reactions').doc(email).get().then(snap => {
        var data = snap.data();

        var reaction = "none"

        if(data != undefined && data != null){
          reaction = data['reaction']

          console.log(reaction)
        }




        if(reaction == "doing great"){
          myReaction = 'doing great'
        }

        else if(reaction == "frustrated"){
          myReaction = 'frustrated'
        }
        else {
          myReaction = 'none'
        }

    }).then(() => {
      output = `
      <div class="col-xl-12 col-md-6 mb-4">
                <div class="card shadow h-100 py-2">
                  <div class="card-body">
                    <div class="row no-gutters align-items-center">
                      <div class="col mr-2">

                        <h4 style = 'font-weight: 700; margin: 2px'>${title}</h4>

                        <p style = 'color: gray'>${message}</p>
                        
                      </div>
                      <div class="col-auto">
                      <div class = 'row' style = 'margin-right: 20px' id = "announceReactionSection${doc.id}">
        
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          
      `
      
      $(output).appendTo('#classAnnouncement')
      
      console.log(myReaction)
      if(myReaction == "doing great"){
        var announcementReactionSectionHTML = `
        <a onclick="updateAnnouncementReaction( '${doc.id}', '${code}', 'doing great', '${email}')" href="javascript:;"><i class="fas fa-thumbs-up" style="font-size: 50px; color: lightslategray;"></i></a>
              
        <a onclick="updateAnnouncementReaction('${doc.id}', '${code}', 'frustrated', '${email}')" href="javascript:;"><i class="far fa-thumbs-down" style="font-size: 50px; margin-left: 15px; color: lightslategray"></i></a>
        `
  
        document.getElementById(`announceReactionSection${doc.id}`).innerHTML = announcementReactionSectionHTML
        
      }else if(myReaction == "none"){
        var announcementReactionSectionHTML = `
        <a onclick="updateAnnouncementReaction( '${doc.id}', '${code}', 'doing great', '${email}')" href="javascript:;"><i class="far fa-thumbs-up" style="font-size: 50px; color: lightslategray;"></i></a>
              
        <a onclick="updateAnnouncementReaction('${doc.id}', '${code}', 'frustrated', '${email}')" href="javascript:;"><i class="far fa-thumbs-down" style="font-size: 50px; margin-left: 15px; color: lightslategray"></i></a>
        `
  
        document.getElementById(`announceReactionSection${doc.id}`).innerHTML = announcementReactionSectionHTML
      }
      
      else if(myReaction == "frustrated"){
        var announcementReactionSectionHTML = `
        <a onclick="updateAnnouncementReaction( '${doc.id}', '${code}', 'doing great', '${email}')" href="javascript:;"><i class="far fa-thumbs-up" style="font-size: 50px; color: lightslategray;"></i></a>
              
        <a onclick="updateAnnouncementReaction('${doc.id}', '${code}', 'frustrated', '${email}')" href="javascript:;"><i class="fas fa-thumbs-down" style="font-size: 50px; margin-left: 15px; color: lightslategray"></i></a>
        `
  
        document.getElementById(`announceReactionSection${doc.id}`).innerHTML = announcementReactionSectionHTML
      }
     
    })


    }
      if(index == 0){
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
}
*/

function updateAnnouncementReaction(announcementID, classCode, reaction, email){
  firebase.firestore().collection("Classes").doc(classCode).collection("Announcements").doc(announcementID).collection('Student Reactions').doc(email).set({
      "reaction": reaction
  }).then(() => {
    getAnnouncementForClass(classCode, email)
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

      <button type="button" class="btn btn-outline-danger" onclick = "toggleLeaveClassPopup('${code}')">Leave Class</button>
      `;
  
      //document.getElementById('info-pannel').innerHTML = courseInfoHTML;
    })




  })
}

function toggleLeaveClassPopup(classCode){

  console.log(classCode)

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
        Are you sure you want to leave the class?
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

  console.log(code)
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var email = user.email;

      firebase.firestore().collection("UserData").doc(email).collection("Classes").doc(code).delete().then(() => {
        console.log("Deleted class")
        firebase.firestore().collection("Classes").doc(code).collection("Students").doc(email).delete()
          window.location.href = "/student/dashboard";
  
        
      }).catch(err => {
        console.log(err)
      });
    }
  });
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

  var unreadList = []

  var acceptedList = []

  var index = 0;

  let classesRef = firebase.firestore().collection('UserData').doc(studentUsername).collection("Classes");
  let classesRefGet = await classesRef.get();
  for(const doc of classesRefGet.docs){

    var classData = doc.data();

    var accepted = classData['accepted'] != undefined ? classData['accepted'] : false


      var classCode = classData["code"];

      var reaction = classData["status"];
  
      var unreadMessages = classData['student unread']
  
  
      console.log("Unread for " + classCode + ": is " + unreadMessages)
  
      console.log("UNDREAD: " + unreadMessages)
  
      reactionsList[classCode] = reaction
  
      getRealtimeAnnouncements(classCode);
  
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
        unreadList.push(unreadMessages)
        acceptedList.push(accepted)
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

        //localStorage.setItem("selectedClassDropdown", classCode);

        var unreadMessages = unreadList[index]

        var unreadMessagesHTML = ''


        if(unreadMessages != undefined && unreadMessages != null && unreadMessages != 0){
          unreadMessagesHTML = `<h2><span class="badge badge-primary" style = 'position: absolute; margin-left: 92%; top: -10px'>${unreadMessages}</span><h2></h2>`
        }

        index = index + 1
      
        console.log(reactionsList[classCode])

        var reaction = reactionsList[classCode]

        var buttonsGrid = ``;

        if(reaction == 'doing great'){
          buttonsGrid = `
          
          <a onclick = "updateReaction('doing great', '${classCode}', '${studentUsername}', '${pageType}')" href = "javascript:;"><i class="fas fa-smile" style="font-size: 50px; color: #1cc88a;" id = 'doingGreat${classCode}'></i></a>

          <a onclick = "updateReaction('need help', '${classCode}','${studentUsername}', '${pageType}')" href = "javascript:;"><i class="far fa-meh" style="font-size: 50px; margin-left: 15px; color: #f6c23e"></i></a>

          <a onclick = "updateReaction('frustrated', '${classCode}','${studentUsername}', '${pageType}')" href = "javascript:;"><i class="far fa-frown" style="font-size: 50px; margin-left: 15px; color: #e74a3b"></i></a>


          `
        } else if (reaction == "need help"){
          buttonsGrid = `
          
          <a onclick = "updateReaction('doing great', '${classCode}','${studentUsername}', '${pageType}')" href = "javascript:;"><i class="far fa-smile" style="font-size: 50px; color: #1cc88a"></i></a>

          <a onclick = "updateReaction('need help', '${classCode}','${studentUsername}', '${pageType}')" href = "javascript:;"><i class="fas fa-meh" style="font-size: 50px; margin-left: 15px; color: #f6c23e;"></i></a>

          <a onclick = "updateReaction('frustrated', '${classCode}','${studentUsername}', '${pageType}')" href = "javascript:;"><i class="far fa-frown" style="font-size: 50px; margin-left: 15px; color: #e74a3b"></i></a>

          `
        } else if (reaction == "frustrated"){
          buttonsGrid = `
          
          <a onclick = "updateReaction('doing great', '${classCode}','${studentUsername}', '${pageType}')" href = "javascript:;"><i class="far fa-smile" style="font-size: 50px; color: #1cc88a"></i></a>

          <a onclick = "updateReaction('need help', '${classCode}','${studentUsername}', '${pageType}')" href = "javascript:;"><i class="far fa-meh" style="font-size: 50px; margin-left: 15px; color: #f6c23e;"></i></a>

          <a onclick = "updateReaction('frustrated', '${classCode}','${studentUsername}', '${pageType}')" href = "javascript:;"><i class="fas fa-frown" style="font-size: 50px; margin-left: 15px; color: #e74a3b;"></i></a>

          `
        } else {
          buttonsGrid = `
          
          <a onclick = "updateReaction('doing great', '${classCode}','${studentUsername}', '${pageType}')" href = "javascript:;"><i class="fas fa-smile" style="font-size: 50px; color: #1cc88a;"></i></a>

          <a onclick = "updateReaction('need help', '${classCode}','${studentUsername}', '${pageType}')" href = "javascript:;"><i class="far fa-meh" style="font-size: 50px; margin-left: 15px; color: lightslategray"></i></a>

          <a onclick = "updateReaction('frustrated', '${classCode}','${studentUsername}', '${pageType}')" href = "javascript:;"><i class="far fa-frown" style="font-size: 50px; margin-left: 15px; color: lightslategray"></i></a>


          `
        }

        if(acceptedList[index] == true){
          output = `
          <div class="col-lg-6 mb-6" style="margin-bottom: 20px;">
          <div class="card bg-white text-black shadow">
            <div class="card-body">
  
            ${unreadMessagesHTML}
  
              <div style="display: inline;">
                <a href = "classes/${classCode}" style = "text-decoration:none; color: gray;"><h4 style="margin-left:20px; padding-top: 2%;">${item}</h4></a>
                
                <section>
                  <div class="row" style=" margin-top: 2%; float: right; margin-top: -40px; margin-right: 10px;" id = 'reactionsSection${classCode}'>
                       ${buttonsGrid}
  
                  </div>
                </section>
  
               
              </div>
              
            </div>
          </div>
      </div>
              `;
        } else {
          output = `
          <div class="col-lg-6 mb-6" style="margin-bottom: 20px;">
          <div class="card bg-white text-black shadow">
            <div class="card-body">
  
              <div style="display: inline;">
                <a style = "text-decoration:none; color: gray;"><h4 style="margin-left:20px; padding-top: 2%;">${item}</h4></a>
                
                <section>
                  <div class="row" style=" margin-top: 2%; float: right; margin-top: -40px; margin-right: 10px;">
                       <h2><span class = 'badge badge-primary'>Pending</span></h2>
  
                  </div>
                </section>
  
               
              </div>
              
            </div>
          </div>
      </div>
              `;
        }

     

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
          if(document.getElementById('loadingIndicator') != null){
            document.getElementById('loadingIndicator').style.display = "none";

          }

          document.getElementById('classesSection-description').style.display = "initial";

          document.getElementById('noClasses-Section').style.display = "none";

        } else {
          if(document.getElementById('loadingIndicator') != null){
            document.getElementById('loadingIndicator').style.display = "none";
          }

          if(document.getElementById('dashboardSection-content') != null){
            document.getElementById('dashboardSection-content').style.display = "initial";
          }

          if(document.getElementById('noClassesSection') != null){
            document.getElementById('noClassesSection').style.display = "none";
          }
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

      updateClassReaction(classSelected, studentEmail, pageType, reaction)

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
          })
        });
      });
      //getStudentStatus(studentEmail);
    }
  })
}

function updateClassReaction(classCode, studentEmail, pageType, currentReaction){

  console.log('updating')

  var buttonsGrid = ''

      var reaction = currentReaction

      if(reaction == 'doing great'){
        buttonsGrid = `
          <a onclick = "updateReaction('doing great', '${classCode}', '${studentEmail}', '${pageType}')" href = "javascript:;"><i class="fas fa-smile" style="font-size: 50px; color: #1cc88a;" id = 'doingGreat${classCode}'></i></a>

          <a onclick = "updateReaction('need help', '${classCode}','${studentEmail}', '${pageType}')" href = "javascript:;"><i class="far fa-meh" style="font-size: 50px; margin-left: 15px; color: #f6c23e"></i></a>

          <a onclick = "updateReaction('frustrated', '${classCode}','${studentEmail}', '${pageType}')" href = "javascript:;"><i class="far fa-frown" style="font-size: 50px; margin-left: 15px; color: #e74a3b"></i></a>
          `

      } else if(reaction == 'need help'){
       buttonsGrid = `
          
          <a onclick = "updateReaction('doing great', '${classCode}','${studentEmail}', '${pageType}')" href = "javascript:;"><i class="far fa-smile" style="font-size: 50px; color: #1cc88a"></i></a>

          <a onclick = "updateReaction('need help', '${classCode}','${studentEmail}', '${pageType}')" href = "javascript:;"><i class="fas fa-meh" style="font-size: 50px; margin-left: 15px; color: #f6c23e;"></i></a>

          <a onclick = "updateReaction('frustrated', '${classCode}','${studentEmail}', '${pageType}')" href = "javascript:;"><i class="far fa-frown" style="font-size: 50px; margin-left: 15px; color: #e74a3b"></i></a>

          `
      } else if(reaction == 'frustrated'){
        buttonsGrid = `
          
        <a onclick = "updateReaction('doing great', '${classCode}','${studentEmail}', '${pageType}')" href = "javascript:;"><i class="far fa-smile" style="font-size: 50px; color: #1cc88a"></i></a>

        <a onclick = "updateReaction('need help', '${classCode}','${studentEmail}', '${pageType}')" href = "javascript:;"><i class="far fa-meh" style="font-size: 50px; margin-left: 15px; color: #f6c23e;"></i></a>

        <a onclick = "updateReaction('frustrated', '${classCode}','${studentEmail}', '${pageType}')" href = "javascript:;"><i class="fas fa-frown" style="font-size: 50px; margin-left: 15px; color: #e74a3b;"></i></a>

        `
      } else {
        buttonsGrid = `
          
          <a onclick = "updateReaction('doing great', '${classCode}','${studentEmail}', '${pageType}')" href = "javascript:;"><i class="fas fa-smile" style="font-size: 50px; color: #1cc88a;"></i></a>

          <a onclick = "updateReaction('need help', '${classCode}','${studentEmail}', '${pageType}')" href = "javascript:;"><i class="far fa-meh" style="font-size: 50px; margin-left: 15px; color: lightslategray"></i></a>

          <a onclick = "updateReaction('frustrated', '${classCode}','${studentEmail}', '${pageType}')" href = "javascript:;"><i class="far fa-frown" style="font-size: 50px; margin-left: 15px; color: lightslategray"></i></a>


          `
      }

      document.getElementById(`reactionsSection${classCode}`).innerHTML = buttonsGrid


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

function checkIfAlreadyinClass(addType) {
  var enrolledClasses = []
  var inputCode = document.getElementById('inputClassCode').value;
  var error = document.getElementById("errorMessage");

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var email = user.email
      firebase.firestore().collection('UserData').doc(email).collection('Classes').get().then(function (doc) {
        doc.forEach(snapshot => {
          var classesData = snapshot.data();
          var classCode = classesData['code'];
          enrolledClasses.push(classCode)
        })
      }).then(() => {

        console.log("list:" + enrolledClasses)
        if(enrolledClasses.includes(inputCode)) {
          error.innerHTML = `
            <div class="alert alert-danger" role="alert" style="width: 310px;">
            You are already enrolled in this class
           </div> `
        } else {
          checkIfClassCodeExists(addType)
        }

      })
    } else {
      // No user is signed in.
    }
  });

}
//Firestore migrated fully
function checkIfClassCodeExists(addType) {

  if (addType == "no-classes") {

    var code = document.getElementById("inputClassCode-noClasses").value;

    var error = document.getElementById("errorMessage-noClasses");


    var exists = false;

    var allowJoin = false

    // var _ref = firebase.database().ref().child("Classes").child(code).child("Code");

    firebase.firestore().collection('Classes').doc(code).get().then(function (doc) {
      var classCode = doc.data();

      try {

        if(classCode != undefined){
          exists = true

          var allowJoin = classCode['allow join']

                  
        if(allowJoin != undefined){
          allowJoin = classCode['allow join']
        } else {
          allowJoin = true
        }

        } else {
          exists = false
        }


          if(allowJoin == true){
            exists = true;
          } else {
            error.innerHTML = `
            <div class="alert alert-danger" role="alert" style="width: 310px;">
            This class isn't currently accepting students
           </div>
           `;
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
      } catch(e){
        console.log(e)
        error.innerHTML = `
        <div class="alert alert-danger" role="alert" style="width: 310px;">
        Failed to join class. Internal error
       </div>`
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
          'accepted': false,
        });
    
        firebase.firestore().collection("Classes").doc(classCode).collection("Students").doc(email).set({
          'name': name,
          'email': email,
          'date': new Date(),
          'status': 'doing great',
          'teacher unread': 0,
          'accepted': false,
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

  classesList = [];

  var classCodesList = []

  let classesRef = firebase.firestore().collection('UserData').doc(studentUsername).collection("Classes");
  let classesRefGet = await classesRef.get();
  for(const doc of classesRefGet.docs){

    var classData = doc.data();

    var accepted = classData['accepted'] != undefined ? classData['accepted'] : false

    if(accepted == true){
      var classCode = classData["code"];

      var className = ""
  
      getRealtimeAnnouncements(classCode);
  
      var x = await firebase.firestore().collection('Classes').doc(classCode).get().then(snap => {
        var data = snap.data();
    
        if(data != null && data != undefined){
            className = data['class name'];
        } else {
          className = undefined
        }
      }).then(() => {
        if(className != undefined){
          classesList.push(className);
          classCodesList.push(classCode)
        }
      })
    }

 
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
            console.log(classCodesList[index])
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


var  meetingsList_PageNation_MainPageList = []

//FIRESTORE MIGRATED FULLY
function getMeetings(email, pageType) {

  var lastElement = ''

  //GETS MEETINGS FOR MEETINGS PAGE
  if(pageType == "meetingsPage"){
    firebase.firestore().collection('UserData').doc(email).collection("Meetings").orderBy("timestamp", 'desc').limit(5).get().then(function (doc) {

      var meetingsCount = 0;
  
      doc.forEach(snapshot => {
  
        meetingsCount += 1;
  
        var meetingsData = snapshot.data();
  
        var classForMeeting = meetingsData["course"];
        var date = meetingsData["date and time"];
        var title = meetingsData["title"];
        lastElement = meetingsData['timestamp']
        meetingsList_PageNation_MainPageList.push(snapshot.id)
  
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
  
    }).then(() => {
      $('#meetingsList-main-page').on('scroll', function() { 
        if ($(this).scrollTop() + 
            $(this).innerHeight() >=  
            $(this)[0].scrollHeight) { 
    
              getMeetings_pageNation(email, "meetingsPage", lastElement)
        } 
      });
    });
  } 
  
  
  if(pageType == "class-page"){
    firebase.firestore().collection('UserData').doc(email).collection("Meetings").orderBy("timestamp", 'desc').limit(5).get().then(function (doc) {
  
      var meetingsCount = 0;
  
      doc.forEach(snapshot => {
  
        meetingsCount += 1;
  
        var meetingsData = snapshot.data();
  
        var classForMeeting = meetingsData["course"];
        var date = meetingsData["date and time"];
        var title = meetingsData["title"];
        lastElement = meetingsData['timestamp']
        meetingsList_PageNation_MainPageList.push(snapshot.id)


        output = `
          <div class="col-xl-12 col-md-3 mb-4">
          <div class="card border-left-primary shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
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
        <div class="justify-content-center" align = 'center' style = 'width: 100%; margin-top: 5%'>
        <section>
        <img src = "/student/img/undraw_Booked_j7rj.svg" width="30%">
  
        <h2 style="margin-top: 2%;">No Scheduled Meetings</h2>
        <p>You're all caught up</p>
        </section>  
        </div>     
        `;
  
        $("#meetingsList").html(outputError);
      } else {
  
      }
  
    }).then(() => {
      $('#meetingsList').on('scroll', function() { 
        if ($(this).scrollTop() + 
            $(this).innerHeight() >=  
            $(this)[0].scrollHeight) { 
    
              getMeetings_pageNation(email, "class-page", lastElement)
        } 
      });
    });
  }


}

function getMeetings_pageNation(email, pageType, lastElement) {

  //GETS MEETINGS FOR MEETINGS PAGE
  if(pageType == "meetingsPage"){
    firebase.firestore().collection('UserData').doc(email).collection("Meetings").orderBy("timestamp", 'desc').limit(5).startAfter(lastElement).get().then(function (doc) {

  
      doc.forEach(snapshot => {
  
        var meetingsData = snapshot.data();
  
        var classForMeeting = meetingsData["course"];
        var date = meetingsData["date and time"];
        var title = meetingsData["title"];
        lastElement = meetingsData['timestamp']

        if(meetingsList_PageNation_MainPageList.includes(snapshot.id) != true){
          meetingsList_PageNation_MainPageList.push(snapshot.id)
  
  
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

        }
      });
  
  
    }).then(() => {
      $('#meetingsList-main-page').on('scroll', function() { 
        if ($(this).scrollTop() + 
            $(this).innerHeight() >=  
            $(this)[0].scrollHeight) { 
    
              getMeetings_pageNation(email, "meetingsPage", lastElement)
        } 
      });
    });
  } 
  
  



  if(pageType == "class-page"){
    firebase.firestore().collection('UserData').doc(email).collection("Meetings").orderBy("timestamp", 'desc').limit(5).startAfter(lastElement).get().then(function (doc) {
  
      
      doc.forEach(snapshot => {
    
        var meetingsData = snapshot.data();
  
        var classForMeeting = meetingsData["course"];
        var date = meetingsData["date and time"];
        var title = meetingsData["title"];
        lastElement = meetingsData['timestamp']

        if(meetingsList_PageNation_MainPageList.includes(snapshot.id) != true){
          meetingsList_PageNation_MainPageList.push(snapshot.id)


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
        }
     
      });
    

  
    }).then(() => {
      $('#meetingsList').on('scroll', function() { 
        if ($(this).scrollTop() + 
            $(this).innerHeight() >=  
            $(this)[0].scrollHeight) { 
    
              getMeetings_pageNation(email, "class-page", lastElement)
        } 
      });
    });
  }


}

var announcementIDList = []

async function getAnnouncements_Pagenation(email, pageType = "annoncements-page-main", lastElement) {

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

    var className = "%&--PlaceHolder--&%"

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
    
      var announcementsCount = 0;

      var announcentsList = []

      for (let i = 0; i <= classesListCodes.length; i++) {
        var classcode = classesListCodes[i];
  
        if (classcode != undefined && classcode != null) {
  
          firebase.firestore().collection('Classes').doc(classcode).collection("Announcements").orderBy('date', 'desc').get().then(function (doc) {
  
            doc.forEach(snapshot => {
  
              var annoucementData = snapshot.data();
  
              if (annoucementData != undefined && annoucementData != null) {
                outputAnnouncements = "";
  
                announcementsCount += 1;
  
  
                var title = annoucementData["title"];
                var message = annoucementData["message"];
                var date = annoucementData['date'];

                console.log(date)

                //var formattedDate = new Date(date.seconds*1000).toLocaleString() 

  
                var nameClass = classnamesList[i];

                announcentsList.push({'title': title, 'message': message, 'date': date, 'class name': nameClass, 'timestamp': date.seconds * 1000})
  
                
              }
            });
          })
           
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



      console.log(announcentsList)

      const sortedannouncentsList = announcentsList.sort((a, b) => b.timestamp - a.timestamp)

      for(var i = 0; i <= sortedannouncentsList.length; i++){

        if(sortedannouncentsList[i] != undefined){
          var title = sortedannouncentsList[i]["title"];
          var message = sortedannouncentsList[i]["message"];
          var date = sortedannouncentsList[i]['date'];
  
          var formattedDate = new Date(date.seconds*1000).toLocaleString() 
  
  
          var nameClass = sortedannouncentsList[i]['class name'];
  
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

      }
  }
       }, 1000)

}

async function getAnnouncements(email, pageType = "annoncements-page-main", lastElement) {

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

    var className = "%&--PlaceHolder--&%"

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
      var announcementsCount = 0;

      var announcentsList = []

      for (let i = 0; i <= classesListCodes.length; i++) {
        var classcode = classesListCodes[i];
  
        if (classcode != undefined && classcode != null) {
  
          firebase.firestore().collection('Classes').doc(classcode).collection("Announcements").orderBy('date', 'desc').get().then(function (doc) {
  
            doc.forEach(snapshot => {
  
              var annoucementData = snapshot.data();
  
              if (annoucementData != undefined && annoucementData != null) {
                outputAnnouncements = "";
  
                announcementsCount += 1;
  
  
                var title = annoucementData["title"];
                var message = annoucementData["message"];
                var date = annoucementData['date'];

                console.log(date)

                //var formattedDate = new Date(date.seconds*1000).toLocaleString() 

  
                var nameClass = classnamesList[i];

                announcentsList.push({'title': title, 'message': message, 'date': date, 'class name': nameClass, 'timestamp': date.seconds * 1000})
  
                
              }
            });
          })
           
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



      console.log(announcentsList)

      const sortedannouncentsList = announcentsList.sort((a, b) => b.timestamp - a.timestamp)

      for(var i = 0; i <= sortedannouncentsList.length; i++){

        if(sortedannouncentsList[i] != undefined){
          var title = sortedannouncentsList[i]["title"];
          var message = sortedannouncentsList[i]["message"];
          var date = sortedannouncentsList[i]['date'];
  
          var formattedDate = new Date(date.seconds*1000).toLocaleString() 
  
  
          var nameClass = sortedannouncentsList[i]['class name'];
  
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

      }
  }
       }, 1000)
}

async function getAnnouncements_ForClass_pagenate(code, lastElement) {

  console.log("Geeting pagenate annc")
 
  var announcementsCount = 0;

  var lastElementID = ''

      firebase.firestore().collection('Classes').doc(code).collection("Announcements").orderBy('date', 'desc').limit(2).startAfter(lastElement).get().then(function (doc) {

        doc.forEach(snapshot => {

          var annoucementData = snapshot.data();

          console.log(annoucementData['title'])

          if(announcementIDList.includes(snapshot.id) != true){
            announcementIDList.push(snapshot.id)

            if (annoucementData != undefined && annoucementData != null) {
              outputAnnouncements = "";
  
              announcementsCount += 1;
  
  
              var title = annoucementData["title"];
              var message = annoucementData["message"];
              var date = annoucementData['date'];

              lastElementID = date
  
              console.log(date)
  
              var formattedDate = new Date(date.seconds*1000).toLocaleString() 
  
              outputAnnouncements = `
              <div class="col-xl-12 col-md-6 mb-4">
              <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
      
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
      
                $(outputAnnouncements).appendTo("#classAnnouncement");
  
              
            }
          }


        });
      }).then(() => {
        $('#classAnnouncement').on('scroll', function() { 
          if ($(this).scrollTop() + 
              $(this).innerHeight() >=  
              $(this)[0].scrollHeight) { 
      
                getAnnouncements_ForClass_pagenate(code, lastElementID)
          } 
        });
      })
       
}

async function getAnnouncements_ForClass(code) {
 
      var announcementsCount = 0;

      var lastElement = ''
  
          firebase.firestore().collection('Classes').doc(code).collection("Announcements").orderBy('date', 'desc').limit(4).get().then(function (doc) {
  
            doc.forEach(snapshot => {
  
              var annoucementData = snapshot.data();

              announcementIDList.push(snapshot.id)
  
              if (annoucementData != undefined && annoucementData != null) {
                outputAnnouncements = "";
  
                announcementsCount += 1;

  
  
                var title = annoucementData["title"];
                var message = annoucementData["message"];
                var date = annoucementData['date'];

                lastElement = date


                console.log(date)

                var formattedDate = new Date(date.seconds*1000).toLocaleString() 

                outputAnnouncements = `
                <div class="col-xl-12 col-md-6 mb-4">
                <div class="card border-left-primary shadow h-100 py-2">
                  <div class="card-body">
                    <div class="row no-gutters align-items-center">
                      <div class="col mr-2">
        
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
        
                  $(outputAnnouncements).appendTo("#classAnnouncement");
  
                
              }
            });
          }).then(() => {
  //IF there is no annonucements
  if (announcementsCount == 0) {

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
    
} else {
  $('#classAnnouncement').on('scroll', function() { 
    if ($(this).scrollTop() + 
        $(this).innerHeight() >=  
        $(this)[0].scrollHeight) { 

          getAnnouncements_ForClass_pagenate(code, lastElement)
    } 
  });
}
          })
           
}

var classCodeChat = 'NONE'
var chatList_PageNation_MainPageList = []

function getMessagesForChat_Classes_pageNation(classCode, studentEmail, lastElement){

  classCodeChat = classCode

  var lastElementPageNation = ''


      firebase.firestore().collection('Class-Chats').doc(classCode).collection('Students').doc(studentEmail).collection('Messages').orderBy('timestamp', 'desc').limit(5).startAfter(lastElement).get().then(snap => {
        snap.forEach(doc => {

          var data = doc.data();
    
          var message = data.message;
          var time = data.timestamp;
    
          var user = data.user

          var type = data['sent type']

          lastElementPageNation = data['timestamp']


          if(chatList_PageNation_MainPageList.includes(doc.id) != true){
            chatList_PageNation_MainPageList.push(doc.id)
    
            var formattedTime = new Date(time.seconds * 1000).toLocaleString()
      
            //console.log(formattedTime)
      
            //console.log(data)
      
            var newMessageUI = `
            <div>
            <div class="message-component" style=" float: right; margin-left: 50%"  >
              <div class="row"><div style="width: 100%" ></div><p style="color: white; background-color: royalblue; border-radius: 20px 20px 0px 20px; margin-right: 30px; padding: 20px; "><strong>${user}</strong> <br> ${message}</p></div>
            </div>
            </div>
            `
    
      var otherMessage = `
      <div>
        <div class="message-component" style= " float: left; min-width: 900px"  >
          <div class="row"><div class="container" style="width: 100%"></div><p style="color: black; background-color: #d8e6eb; border-radius: 20px 20px 20px 0px; margin-right: 30px; padding: 20px; "><strong>${user}</strong> <br>${message}</p></div>
        </div>
        </div>
      `
    
      if(type == "teacher") {
        $('#message-components').prepend(otherMessage)
    
      } else {
        $('#message-components').prepend(newMessageUI)
    
      }
        
          }

    
          
        })
    
      }).then(() => {
        $('#message-components').on('scroll', function() {
          var scrollTop = $(this).scrollTop();
          if (scrollTop <= 0) {
            //alert('top reached');
            getMessagesForChat_Classes_pageNation(classCode, studentEmail, lastElementPageNation)
          }
        });
      });

} 

function getMessagesForChat_Classes_page(classCode, studentEmail){


  classCodeChat = classCode

  var lastElement = '';

  var lastID = []

  var messagesListIDs = []

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var email = user.email;

        
  firebase.firestore().collection('Classes').doc(classCode).collection("Students").doc(studentEmail).update({
    'student unread': 0
  })

  firebase.firestore().collection('UserData').doc(studentEmail).collection("Classes").doc(classCode).update({
    'student unread': 0
  })


      firebase.firestore().collection('Class-Chats').doc(classCode).collection('Students').doc(email).collection('Messages').orderBy('timestamp', 'desc').limit(10).get().then(snap => {
        snap.forEach(doc => {
          var data = doc.data();
    
          var message = data.message;
          var time = data.timestamp;

          var type = data['sent type']

         // console.log(message)
    
          var user = data.user

          lastElement = data['timestamp']
          chatList_PageNation_MainPageList.push(doc.id)


          var formattedTime = new Date(time.seconds * 1000).toLocaleString()
    
          //console.log(formattedTime)
    
          //console.log(data)
          /*
    
          var messageHTML = `
          <div class="message-component" style="margin-top: 50px">
          <div class="row">
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="Avatar" class="avatar">
            <div class="col">
              <div class="row" style="margin-left: 5px;">
                <h5>${user}</h5>
                <div style="width: 80%;"></div>
              </div>
              <p>${formattedTime}</p>

              <p style="width: 100%;">${message}</p>
            </div>
          </div>
          <hr>
        </div>
        `
        */

        var newMessageUI = `
        

        <div>

            <div class="message-component" style=" float: right; margin-left: 50%"  >
              <div class="row"><div style="width: 100%" ></div><p style="color: white; background-color: royalblue; border-radius: 20px 20px 0px 20px; margin-right: 30px; padding: 20px; "><strong>${user}</strong> <br> ${message}</p></div>
            </div>
            </div>
        `

  var otherMessage = `

  <div>
        <div class="message-component" style= " float: left; min-width: 900px"  >
          <div class="row"><div class="container" style="width: 100%"></div><p style="color: black; background-color: #d8e6eb; border-radius: 20px 20px 20px 0px; margin-right: 30px; padding: 20px; "><strong>${user}</strong> <br>${message}</p></div>
        </div>
        </div>
  `

  if(type == "teacher") {
    $('#message-components').prepend(otherMessage)

  } else {
    $('#message-components').prepend(newMessageUI)

  }
    
          //$('#message-components').prepend(messageHTML)

          messagesListIDs.push(doc.id)
    
          
        })
    
      }).then(() => {
        scrollSmoothToBottom()

        $('#message-components').on('scroll', function() {
          var scrollTop = $(this).scrollTop();
          if (scrollTop <= 0) {
            //alert('top reached');
            getMessagesForChat_Classes_pageNation(classCode, email, lastElement)
          }
        });


    
          firebase.firestore().collection('Class-Chats').doc(classCode).collection('Students').doc(email).collection('Messages').orderBy('timestamp').limitToLast(1).onSnapshot(snap => {
            snap.forEach(doc => {

              var data = doc.data();
    
              if (messagesListIDs.includes(doc.id) != true){

                var message = data.message;
                var time = data.timestamp;

                messagesListIDs.push(doc.id)
                

                var user = data.user

                var type = data['sent type']
    
                var formattedTime = new Date(time.seconds * 1000).toLocaleString()

                var newMessageUI = `
        

                <div>

            <div class="message-component" style=" float: right; margin-left: 50%"  >
              <div class="row"><div style="width: 100%" ></div><p style="color: white; background-color: royalblue; border-radius: 20px 20px 0px 20px; margin-right: 30px; padding: 20px; "><strong>${user}</strong> <br> ${message}</p></div>
            </div>
            </div>
                `
        
          var otherMessage = `
        
          <div>

          <div class="message-component" style= " float: left; min-width: 900px"  >
            <div class="row"><div class="container" style="width: 100%"></div><p style="color: black; background-color: #d8e6eb; border-radius: 20px 20px 20px 0px; margin-right: 30px; padding: 20px; "><strong>${user}</strong> <br>${message}</p></div>
          </div>
          </div>
          `
        
          if(type == "teacher") {
            $(otherMessage).appendTo( '#message-components')
        
          } else {
            $(newMessageUI).appendTo( '#message-components')
        
          }
          
              }
      
            })
            scrollSmoothToBottom()
          })


        //   $('#message-components').on('scroll', function() {
        //     var scrollTop = $(this).scrollTop();
        
        //         var topDistance = $(this).offset().top;
        
        //         if ( (topDistance) < scrollTop ) {
        //             alert( $(this).text() + ' was scrolled to the top' );
        //         }
            
        // });

          // $('#message-components').on('scroll', function() { 
          //   if ($(this).scrollTop() + 
          //       $(this).innerHeight() >=  
          //       $(this)[0].scrollHeight) { 
        
          //       } 
          // });
      })
    }
  });
} 


function sendMessage_Classes_page(classCode){
  //console.log("Message queued")
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var email = user.email;
      var name = user['displayName'];
      var date = new Date()
      const increment = firebase.firestore.FieldValue.increment(1);

      var message = document.getElementById('message-input').value
    
      firebase.firestore().collection('Class-Chats').doc(classCode).collection('Students').doc(email).collection('Messages').doc().set({
          "message": message,
          "user": name,
          "timestamp": date,
          "sent type": "student"
    
      }).then(() => {
        //console.log("Message sent")

        firebase.firestore().collection('Classes').doc(classCode).collection('Students').doc(email).update({
          "teacher unread": increment,
      })

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