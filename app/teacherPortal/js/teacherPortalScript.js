function getTeacherAccountStatus(pageType, classCode = "null", additionalParams) {
  
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var email = user.email

      firebase.firestore().collection('UserData').doc(email).get().then(function (doc) {
        var data = doc.data();
    
        var in_a_district = data['District Code'] != undefined ? data['District Code'] : null;
    
        //console.log("DISTRICT: " + in_a_district);
    
        var pendingSchoolRequestName = data["Pending School Request Name"];
    
        var pendingRequestID = data["Pending Request ID"];
    
        var pendingDistrictRequestID = data["Pending District Request"];

        var billingStatus = data["billing status"];

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
      
                //console.log('Executing 1');
      
                var data = doc.data()["Status"];
      
                //console.log("STATUS:" + data);
      
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
      
                  //console.log('Executing 2');
      
                  if(document.getElementById('loader-icon') != null){
                    document.getElementById('loader-icon').style.display = 'none';
                  }
      
                  if (pageType == 'meetings-page') {
                    document.getElementById('main-page-content-meetings-page').style.display = "initial";
                    getProfileInfo();
                    //getClassData();
                    getClassDataDropdown(email);
                    getMeetings();
                  }
                  else if (pageType == "") {
                  }
      
                  else if(pageType == 'create-class'){
                    getProfileInfo();
                    getClassDataDropdown(email);

                    if(billingStatus != 'active'){
                    
                        var billingErrorHTML = `<center style="margin-top: 18%;">
                        <img src = '/teacher/img/undraw_online_payments_luau.svg' width = '20%'/>
                  
                        <h2 style="margin-top: 2%;">Billing Setup Required</h2>
                  
                        <p>Please go to <a href = '/settings/payments'>billing settings</a> to get started with your account's free trial!</p>
                  
                      </center>
                        `;
                  
                        $('#main-body-page-teacher').html(billingErrorHTML);
                    }
                    
                  }
      
                  else if (pageType == 'class-page') {
                    getProfileInfo();
                    //getClassData();
                    getClassDataDropdown(email)
                    getStudentData(classCode);
                    getEditData(classCode);
                    getAnnouncementForClass(classCode);
                    getMeetingForClass(classCode);
                    getStudentJoinRequests(classCode)
                  }
      
                  else if (pageType == 'dashboard') {
                    getProfileInfo();
                    getClassData(email);
                    //getWeekStudentAverageReactions_ALL_CLASSES()
                  }
      
                  else if(pageType == "student-requests"){
                    getProfileInfo();
                    getStudentRequests();
                  }
      
                  else if(pageType == "announcementsTeacher"){
                    getProfileInfo();
                    getClassDataDropdown(email);
                    getAnnouncements(email);
      
                  }
      
                  else if(pageType == "chat-page-teacher"){
                    getProfileInfo();
                    getClassDataDropdown(email);
                    getMessagesForChat_chatPage_teacher(additionalParams.code, additionalParams.student)
                  }
      
                  else {
                    //getClassData();
                    getProfileInfo();
                  }
      
                }
              });
      
            }
            //NOT IN A DISTRICT
            else {
              var accountStatus = data['account status'];
      
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
                  //getClassData();
                  getClassDataDropdown(email);
                  getMeetings();
                }
                else if (pageType == "") {
                  getClassDataDropdown(email);
                }
                else if (pageType == 'class-page') {
                  getProfileInfo();
                  //getClassData();
                  getClassDataDropdown(email);
                  getStudentData(classCode);
                  getEditData(classCode);
                  getAnnouncementForClass(classCode);
                  getMeetingForClass(classCode);    
                  getStudentJoinRequests(classCode)
                }
                else if (pageType == 'dashboard') {
                  //console.log("executing");
                  getProfileInfo();
                  getClassData(email);
                  //getWeekStudentAverageReactions_ALL_CLASSES()
                }
      
                else if(pageType == 'create-class'){
                  getProfileInfo();
                  getClassDataDropdown(email);

                  if(billingStatus != 'active'){
                    
                    var billingErrorHTML = `<center style="margin-top: 18%;">
                    <img src = '/teacher/img/undraw_online_payments_luau.svg' width = '20%'/>
              
                    <h2 style="margin-top: 2%;">Billing Setup Required</h2>
              
                    <p>Please go to <a href = '/settings/payments'>billing settings</a> to get started with your account's free trial!</p>
              
                  </center>
                    `;
              
                    $('#main-body-page-teacher').html(billingErrorHTML);
                }
                }
      
                else if(pageType == "announcementsTeacher"){
                  getProfileInfo();
                  getAnnouncements(email);
                  getClassDataDropdown(email);
                }
      
                else if(pageType == "student-requests"){
                  getProfileInfo();
                  getStudentRequests();
                }
      
                else if(pageType == "chat-page-teacher"){
                  getProfileInfo();
                  getClassDataDropdown(email);
                  getMessagesForChat_chatPage_teacher(additionalParams.code, additionalParams.student)
      
                }
      
                else {
                  //getClassData();
                  //getProfileInfo();
                  //getClassDataDropdown();
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
  
                if(document.getElementById('loader-icon') != null){
                  document.getElementById('loader-icon').style.display = 'none';
                }
                
                $('#main-body-page-teacher').html(activateDistrictHTML);
                getProfileInfo();
              }
            }
          }
         
    

      });
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

        var className = data["class name"]

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

        //console.log("works");
        var className1 = classData[1];
        var classCode = classData[0];

        var _ref = firebase.firestore().collection('Classes').doc(classCode).collection('Student Requests');
      
        _ref.get().then(snapshot => {
      
            snapshot.forEach(doc => {

              var className = className1
              totalIndex += 1
                //console.log(doc.data());
      
                var data = doc.data();
      
                var classID = data['Class Code'];

                var studentName = data['Student Name']

                var studentEmail = data['Student Email']
      
                var requestDocID = doc.id;
      
                //console.log(className1);
      
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
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var teacher_email = user.email
      var teacher_name = user.displayName

      var district_code = document.getElementById('searchInputDistrict').value;
      var school_code = document.getElementById('searchInputSchool').value;

    
      firebase.firestore().collection('Districts').doc(district_code).collection("Schools").doc(school_code).get().then(function (doc) {
        var data = doc.data();
    
        if (data != null && data != undefined) {
    
          $('#joinSchool-district-err').html('');
    
    
          firebase.firestore().collection('Districts').doc(district_code).collection("Schools").doc(school_code).collection('Teachers').doc(teacher_email).set({
            "Teacher Name": teacher_name,
            "Teacher Email": teacher_email,
          });
    
    
          firebase.firestore().collection('UserData').doc(teacher_email).update({
            "District Code": district_code,
          })
    
    
    
          firebase.firestore().collection('Districts').doc(district_code).collection("Schools").doc(school_code).collection('Teachers').doc(teacher_email).set({
            "Teacher Name": teacher_name,
            "Teacher Email": teacher_email,
          });
    
    
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
  });


}

function getProfileInfo() {

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var name = user.displayName;
      var pic = user.photoURL;

      firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
        //socket.emit('send-announcement-emails-to-students', {"code": code, 'title': messageTitle, 'message': messageText, 'className': className, 'authToken': idToken});
        console.log(idToken)
  
      }).catch(function(error) {
        // Handle error
      });

      var outputPic = ``;

      if(pic != null && pic != undefined && pic != ""){
          outputPic = `<img class="img-profile rounded-circle" src="${pic}">`;
      } else {
          outputPic = `<img class="img-profile rounded-circle" src="https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144849704.jpg">`;
      }
    
      $("#profilePic").html( outputPic)

      if(name != null && name != undefined){
        document.getElementById("displayName").innerHTML = name
      } else {
        document.getElementById("displayName").innerHTML = "Error Occured"
      }
    } else {
      console.log("user Signed out");
      
    }
  })
}

function getWeekStudentAverageReactions_ALL_CLASSES(){

  var code = localStorage.getItem("graphClassCode") != null ? localStorage.getItem("graphClassCode") : "none";

  //console.log(code)

  var getNewData = false;

  document.getElementById('studentReportText').innerText = "Student Report - " + code

  firebase.firestore().collection("Classes-Cache").doc(code).get().then(doc => {
    var data = doc.data();

    if(data != undefined && data != null){
      var lastWeeklyReport = data['Last Weekly Report']

      var reportData = data['Weekly Reaction Report Data']
  
      var dateNow = new Date()
  
      if(lastWeeklyReport != null){
        var restrictionTimeEnd = new Date(lastWeeklyReport)
        restrictionTimeEnd.setHours(restrictionTimeEnd.getHours() + 5)

        //console.log(dateNow.getTime(),  restrictionTimeEnd.getTime(), restrictionTimeEnd)
  
        if(dateNow.getTime() >= restrictionTimeEnd.getTime()){
          getNewData = true
          //console.log("SHOULD GET NEW REPORT")
        }
      } else {
        getNewData = true
      }

      //console.log("GET NEW REPORT:" + getNewData)

      if(getNewData == false){
        
        return reportData
      } 
      
      if(getNewData == true){
        return []
      }


    } else {
      return null
    }



  }).then((reportData) => {
    
    var monAverage = 0;
    var tueAverage = 0;
    var wedAverage = 0;
    var thuAverage = 0;
    var friAverage = 0;
    var satAverage = 0;
    var sunAverage = 0;

    var monTotal = [];
    var tueTotal = [];
    var wedTotal = [];
    var thuTotal = [];
    var friTotal = [];
    var satTotal = [];
    var sunTotal = [];

    //console.log(reportData)

    if(reportData == null || reportData.length == 0){
      //console.log("GETTING NEW DATA")
      var d = new Date();
      var day = d.getDay(),
          diff = d.getDate() - day + (day == 0 ? -6:1);
          d.setHours(0);
          d.setMinutes(0);
          d.setSeconds(0);
          d.setMilliseconds(0);
  
      var weekStart =  new Date(d.setDate(diff));
  
      //console.log(weekStart)
  
      var weekStartTimestamp = weekStart.getTime().toString();
  
  
      firebase.firestore().collection("Classes").doc(code).collection("Student Reactions").where('timestamp', '>', weekStartTimestamp).get().then(snap => {
  
        snap.forEach(doc => {
          var data = doc.data();
  
          var studentReaction = data['status']
  
          var date = data['date']
  
          var reactionDate = new Date(date)
          
          var reactionDay = reactionDate.getDay()
  
          var reactionKey = 0;
  
          if(studentReaction == 'doing great'){
            reactionKey = 3
          } else if (studentReaction == 'need help') {
            reactionKey = 2
          } else if (studentReaction == 'frustrated'){
            reactionKey = 1
          }
  
          //console.log(reactionDay)
  
          if(reactionDay == 1){
            monTotal.push(reactionKey)
          }
  
          if(reactionDay == 2){
            tueTotal.push(reactionKey)
          }
  
          if(reactionDay == 3){
            wedTotal.push(reactionKey)
          }
  
          if(reactionDay == 4){
            thuTotal.push(reactionKey)
          }
  
          if(reactionDay == 5){
            friTotal.push(reactionKey)
          }
  
          if(reactionDay == 6){
            satTotal.push(reactionKey)
          }
  
          if(reactionDay == 7){
            sunTotal.push(reactionKey)
          }
  
         // console.log(doc.data());
        })
      }).then(() => {
  
        //Monday
        let sumMon = monTotal.length != 0 ? monTotal.reduce((previous, current) => current += previous): 0;
        monAverage = sumMon / monTotal.length;
        monAverage = sumMon / monTotal.length ? sumMon / monTotal.length: 0
        
        //Tuesday
  
        let sumTue = tueTotal.length != 0 ? tueTotal.reduce((previous, current) => current += previous) : 0;
        tueAverage = sumTue / tueTotal.length;
        tueAverage = tueAverage? sumTue / tueTotal.length: 0
  
        //Wednesday
        let sumWed = wedTotal.length != 0 ? monTotal.reduce((previous, current) => current += previous): 0;
        wedAverage = sumWed / wedTotal.length;
        wedAverage = wedAverage ? wedAverage: 0
  
        //Thursday
        let sumThu = thuTotal.length != 0 ? thuTotal.reduce((previous, current) => current += previous): 0;
        thuAverage = sumThu / thuTotal.length;
        thuAverage = thuAverage ? thuAverage: 0
  
        //Friday
        let sumFri = friTotal.length != 0 ?  friTotal.reduce((previous, current) => current += previous): 0;
        friAverage = sumFri / friTotal.length;
        friAverage = friAverage ? friAverage: 0
  
        //Saturday
        let sumSat = satTotal.length != 0 ?  satTotal.reduce((previous, current) => current += previous): 0;
        satAverage = sumSat / satTotal.length;
        satAverage = satAverage ? satAverage: 0
  
        //Sunday
        let sumSun = sunTotal.length != 0 ? sunTotal.reduce((previous, current) => current += previous): 0;
        sunAverage = sumSun / sunTotal.length;
        sunAverage = sunAverage ? sunAverage: 0
  
       // console.log(monAverage, tueAverage, wedAverage, thuAverage, friAverage, satAverage, sunAverage)
        //console.log('//')

        firebase.firestore().collection("Classes-Cache").doc(code).set({
          "Last Weekly Report": new Date().toString(),
          "Weekly Reaction Report Data": [monAverage, tueAverage, wedAverage, thuAverage, friAverage, satAverage, sunAverage]
          
        })


      })
    } else {
      //onsole.log("GETTING FROM CACHE")
      monAverage = reportData[0],
      tueAverage = reportData[1],
      wedAverage = reportData[2],
      thuAverage = reportData[3],
      friAverage = reportData[4],
      satAverage = reportData[5],
      sunAverage = reportData[6]
    }

    return [monAverage, tueAverage, wedAverage, thuAverage, friAverage, satAverage, sunAverage]

  }).then((avgList) => {
    //console.log("Setting area chart")
    //Configure Graph
    // Set new default font family and font color to mimic Bootstrap's default styling
    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#858796';
    
    // Area Chart Example
    var ctx = document.getElementById("myAreaChart");
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
          label: "Average Reaction Index: ",
          lineTension: 0.3,
          backgroundColor: "rgba(78, 115, 223, 0.05)",
          borderColor: "rgba(78, 115, 223, 1)",
          pointRadius: 3,
          pointBackgroundColor: "rgba(78, 115, 223, 1)",
          pointBorderColor: "rgba(78, 115, 223, 1)",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
          pointHoverBorderColor: "rgba(78, 115, 223, 1)",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: [avgList[0], avgList[1], avgList[2], avgList[3], avgList[4], avgList[5], avgList[6]],
        }],
      },
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 25,
            top: 25,
            bottom: 0
          }
        },
        scales: {
          xAxes: [{
            time: {
              unit: 'date'
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              maxTicksLimit: 7
            }
          }],
          yAxes: [{
            ticks: {
              maxTicksLimit: 5,
              padding: 10,
              // Include a dollar sign in the ticks
              callback: function(value, index, values) {
                return value;
              }
            },
            gridLines: {
              color: "rgb(234, 236, 244)",
              zeroLineColor: "rgb(234, 236, 244)",
              drawBorder: false,
              borderDash: [2],
              zeroLineBorderDash: [2]
            }
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          titleMarginBottom: 10,
          titleFontColor: '#6e707e',
          titleFontSize: 14,
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          intersect: false,
          mode: 'index',
          caretPadding: 10,
          callbacks: {
            label: function(tooltipItem, chart) {
              var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
              return datasetLabel + tooltipItem.yLabel;
            }
          }
        }
      }
    });
  })
    
}

function getGraphData_Classes_page(code){

  document.getElementById('chartBody').innerHTML = `
  <a href='/teacher/classes/${code}' style = 'text-decoration: none'>
            <div class="card" style="width: 25rem; Box-shadow:0 10px 20px rgba(0,0,0,0.10), 0 6px 6px rgba(0,0,0,0.10); margin-right: 50px; margin-left: 5px; margin-bottom: 40px">
                <div class="card-body">
                    <h2><span id = 'unreadMessages${code}'></span></h2>
                  <div class="chart-pie pt-4 pb-2" id = "chartPie${code}">
                    <canvas id="myPieChart${code}"></canvas>
                  </div>
                  <div style="height: 30px"></div>
                  <center><h5 class="card-title" id = 'classNameLabel'></h5>
                  </center>

                </div>
              </div>
            </a>
  `

  firebase.firestore().collection('Classes').doc(code).get().then(function (doc) {

      var data = doc.data();

      var classCode = data["class code"];

      var className = data["class name"];

      document.getElementById('classNameLabel').innerHTML = `${className}`

      getChartData(code)
    });

}

function getClassData(emailRef) {
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

      var classCode = data["class code"];
      var className = data["class name"];
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

          var className = classData[1];
          var classCode = classData[0];

          if (i == 0) {
            storeClassforChart(classCode)
            storeGraphReactionsCode(classCode)
            
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
            <a class="collapse-item" href="/teacher/classes/${classCode}" style = 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'>${className}</a>
            `;

          output3 = `
            <a class="dropdown-item" href="#" style = 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' onclick = "storeClassforChart('${classCode}')">${className.toString()}</a>
                        <div class="dropdown-divider"></div>
            `

            //output4 = `
           // <a class="dropdown-item" href="#" style = 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' onclick = "storeGraphReactionsCode('${classCode}', 'onclick')">${className.toString()}</a>
              // <div class="dropdown-divider"></div>`
            
            output5 = `
            <a href="classes/${classCode}" style = 'text-decoration: none'>
            <div class="card" style="width: 25rem; Box-shadow:0 10px 20px rgba(0,0,0,0.10), 0 6px 6px rgba(0,0,0,0.10); margin-right: 50px; margin-left: 5px; margin-bottom: 40px">
                <div class="card-body">
                <h2><span id = 'unreadMessages${classCode}'></span></h2>
                  <div class="chart-pie pt-4 pb-2" id = "chartPie${classCode}">
                    <canvas id="myPieChart${classCode}"></canvas>
                  </div>
                  <div style="height: 30px"></div>
                  <center><h5 class="card-title">${className}</h5>
                  </center>

                </div>
              </div>
            </a>
            `

          $(output5).appendTo("#topClassesSection");
          $(output2).appendTo("#classesOp");
          $(output3).appendTo("#classesOp1");
          //$(output4).appendTo("#classesDropdownGraphWeeklyReactions");
          $(output2).appendTo("#dropdown-sidebar");

          
          // Pie Chart Example
          getChartData(classCode)
        }
      }
    }
  }).then(function () {
    if (document.getElementById('dashboard-section') != null) {
      document.getElementById('dashboard-section').style.display = "initial";
    }
  })
}

function setClassCode(classCode) {
  localStorage.setItem("code", classCode);
}

function storeClassforChart(code) {
  localStorage.setItem("codeForChart", code);
}

function sendRealtimeAnnouncement(code, title, message){

  //console.log("Senindg realtime announcement")
  
  
          socket.emit('join-class-room', code.toString());
  
          socket.emit('send-announcement-to-class-realtime', {"code": code, "title": title, "message": message});
          
  }


async function writeAnnouncement(code, className) {
  var messageTitle = document.getElementById("messageTitle").value;
  var messageText = document.getElementById("messageText").value;
  var button = document.getElementById('sendAnnouncementButton')
  var dateNow = new Date();

  var formattedDate = dateNow.toLocaleString();

  button.innerHTML = `
  <button class="btn btn-primary" type="button" disabled>
  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  <span class="sr-only"> Sending Announcement...</span>
</button>
  `
  var socket = io.connect('https://api-v1.classvibes.net', {transports: ['polling']});

  sendRealtimeAnnouncement(code, messageTitle, messageText)


  socket.on('connect', function(data) {
    //console.log("Connected to Email Server - Sender:" + data)
    
});
  
  firebase.firestore().collection("Classes").doc(code).collection("Announcements").doc().set({
    "title": messageTitle,
    "message": messageText,
    "date": dateNow,
    "timestamp": dateNow.toLocaleString().toString(),
  }).then(async () => {
    
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
      socket.emit('send-announcement-emails-to-students', {"code": code, 'title': messageTitle, 'message': messageText, 'className': className, 'authToken': idToken});

    }).catch(function(error) {
      // Handle error
    });

    
  }).then(() => {

    setTimeout(function(){ 
        console.log('Completed')
        $('#exampleModal').modal('toggle')
        window.location.reload()
     }, 4000);

  });
}

var meetingsList_PageNation_MainPageList = []

function getMeetings_pageNation(lastElement) {

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var email = user.email;

      //console.log("geeting page nation")

      var index = 0;
    
      //console.log(lastElement)
    
      firebase.firestore().collection('UserData').doc(email).collection("Meetings").orderBy('timestamp', 'desc').startAfter(lastElement).limit(4).get().then(function (doc) {
        doc.forEach(snapshot => {
          index = index + 1
          var data1 = snapshot.data();
          var classForMeeting = data1["course"]
    
          var date = data1["date and time"];
          var title = data1["title"];
          var message = data1["message"]
          var length = data1["length"]
    
          lastElement = data1['timestamp']
          //console.log(meetingsList_PageNation_MainPageList)
    
          if(meetingsList_PageNation_MainPageList.includes(snapshot.id) != true){
    
            meetingsList_PageNation_MainPageList.push(snapshot.id)
    
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
          }
    
     
        })
      }).then(() => {
        $('#meetingsList').on('scroll', function() { 
          if ($(this).scrollTop() + 
              $(this).innerHeight() >=  
              $(this)[0].scrollHeight) { 
      
                getMeetings_pageNation(lastElement)
          } 
        });
      });
    }
  });

}


function getMeetings() {
  
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var email = user.email;

      var index = 0;

      var lastElement = ''
    
      firebase.firestore().collection('UserData').doc(email).collection("Meetings").orderBy('timestamp', 'desc').limit(4).get().then(function (doc) {
        doc.forEach(snapshot => {
          index = index + 1
          var data1 = snapshot.data();
          var classForMeeting = data1["course"]
    
          var date = data1["date and time"];
          var title = data1["title"];
          var message = data1["message"]
          var length = data1["length"]
    
          lastElement = data1['timestamp']
    
          meetingsList_PageNation_MainPageList.push(snapshot.id)
    
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
        } else {
          $('#meetingsList').on('scroll', function() { 
            if ($(this).scrollTop() + 
                $(this).innerHeight() >=  
                $(this)[0].scrollHeight) { 
        
                  getMeetings_pageNation(lastElement)
            } 
          });
        }
      });

    }
  })
}

var lastItemGlobalAnnouncements = ''

var announcementsIDList = []

async function getAnnouncementForClass_Pagenation(code, lastElement) {
  console.log("LAST ELEMENT: " + lastElement)

  var lastElementID = lastElement


firebase.firestore().collection('Classes').doc(code).collection('Announcements').orderBy('date', 'desc').startAfter(lastElement).limit(2).get().then(snap => {
    snap.forEach(doc => {
      var data = doc.data()
      var date = data["timestamp"]
      var message = data["message"]
      var title = data["title"]
      var announcementId = doc.id
  
      console.log(title)

      if(announcementsIDList.includes(announcementId) != true){
        announcementsIDList.push(doc.id)
      
        lastElementID = data['date']
    
        console.log(lastElementID)
    
        /*
    
        var studentReactions = {
          "doing great": 0,
          "need help": 0,
          "frustrated": 0
        }
    
        var x = await firebase.firestore().collection('Classes').doc(code).collection("Announcements").doc(doc.id).collection('Student Reactions').get().then(snap => {
          snap.forEach((document) => {
            var data = document.data();
    
            var reaction = data['reaction']
    
            if(reaction == "doing great"){
              studentReactions['doing great'] = studentReactions['doing great'] + 1
            }
    
            if(reaction == "need help"){
              studentReactions['need help'] = studentReactions['need help'] + 1
            }
    
    
            if(reaction == "frustrated"){
              studentReactions['frustrated'] = studentReactions['frustrated'] + 1
            }
          })
    
        }).then(() => {
          */
          output = `
          <div class="col-xl-12 col-md-6 mb-4">
                    <div class="card shadow h-100 py-2">
                      <div class="card-body">
                        <div class="row no-gutters align-items-center">
                          <div class="col mr-2">
    
                            <h4 style = 'font-weight: 700; margin: 2px'>${title}</h4>
    
                            <p style = 'color: gray'>${message}</p>
    
                            <h3 style = 'margin-left: 5px'><i class="fa fa-trash" aria-hidden="true" onclick = "deleteAnnouncement('${announcementId}', '${code}')"></i></h3>
    
                            
                          </div>
                          <div class="col-auto">
                          <!--
    
                          <div class="chart-container" style="position: relative; height:100px; width:100px">
                            <canvas id="announcementChart${doc.id}"></canvas>
                        </div>
                        -->
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              
          `
          
          $(output).appendTo('#classAnnouncement')
    
          /*
    
          // Set new default font family and font color to mimic Bootstrap's default styling
    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#858796';
    
    // Pie Chart Example
    var ctx = document.getElementById(`announcementChart${doc.id}`);
    new Chart(ctx, {
    type: 'doughnut',
    data: {
    labels: ["Liked", "Needs Help", "Disliked"],
    datasets: [{
    data: [studentReactions["doing great"], studentReactions["need help"], studentReactions["frustrated"]],
    backgroundColor: ['#1cc88a', '#f6c23e', '#e74a3b'],
    hoverBackgroundColor: ['#17a673', '#f6c23e', '#e74a3b'],
    hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
    },
    options: {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
    backgroundColor: "rgb(255,255,255)",
    bodyFontColor: "#858796",
    borderColor: '#dddfeb',
    borderWidth: 1,
    xPadding: 10,
    yPadding: 5,
    displayColors: false,
    caretPadding: 2,
    },
    legend: {
    display: false
    },
    cutoutPercentage: 60,
    },
    });
        });
        */
    
      }
  
     
    })
}).then(() => {
  
  $('#classAnnouncement').on('scroll', function() { 
    if ($(this).scrollTop() + 
        $(this).innerHeight() >=  
        $(this)[0].scrollHeight) { 

          getAnnouncementForClass_Pagenation(code, lastElementID)
    } 
  });
})
  
}

async function getAnnouncementForClass(code) {
  var index = 0;

  var lastItem = '';



  firebase.firestore().collection('Classes').doc(code).collection('Announcements').orderBy('date', 'desc').limit(4).get().then(snap => {
      snap.forEach(doc => {
        index = index + 1
        var data = doc.data()
        var date = data["timestamp"]
        var message = data["message"]
        var title = data["title"]
        var announcementId = doc.id
    
        console.log(title)
    
        announcementsIDList.push(doc.id)
        
        lastItem = data['date']
    
        console.log(lastItem)
    
        /*
    
        var studentReactions = {
          "doing great": 0,
          "need help": 0,
          "frustrated": 0
        }
    
        var x = await firebase.firestore().collection('Classes').doc(code).collection("Announcements").doc(doc.id).collection('Student Reactions').get().then(snap => {
          snap.forEach((document) => {
            var data = document.data();
    
            var reaction = data['reaction']
    
            if(reaction == "doing great"){
              studentReactions['doing great'] = studentReactions['doing great'] + 1
            }
    
            if(reaction == "need help"){
              studentReactions['need help'] = studentReactions['need help'] + 1
            }
    
    
            if(reaction == "frustrated"){
              studentReactions['frustrated'] = studentReactions['frustrated'] + 1
            }
          })
    
        }).then(() => {
          */
          output = `
          <div class="col-xl-12 col-md-6 mb-4">
                    <div class="card shadow h-100 py-2">
                      <div class="card-body">
                        <div class="row no-gutters align-items-center">
                          <div class="col mr-2">
    
                            <h4 style = 'font-weight: 700; margin: 2px'>${title}</h4>
    
                            <p style = 'color: gray'>${message}</p>
    
                            <h3 style = 'margin-left: 5px'><i class="fa fa-trash" aria-hidden="true" onclick = "deleteAnnouncement('${announcementId}', '${code}')"></i></h3>
    
                            
                          </div>
                          <div class="col-auto">
                          <!--
    
                          <div class="chart-container" style="position: relative; height:100px; width:100px">
                            <canvas id="announcementChart${doc.id}"></canvas>
                        </div>
                        -->
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              
          `
          
          $(output).appendTo('#classAnnouncement')
    
          /*
    
          // Set new default font family and font color to mimic Bootstrap's default styling
    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#858796';
    
    // Pie Chart Example
    var ctx = document.getElementById(`announcementChart${doc.id}`);
    new Chart(ctx, {
    type: 'doughnut',
    data: {
    labels: ["Liked", "Needs Help", "Disliked"],
    datasets: [{
    data: [studentReactions["doing great"], studentReactions["need help"], studentReactions["frustrated"]],
    backgroundColor: ['#1cc88a', '#f6c23e', '#e74a3b'],
    hoverBackgroundColor: ['#17a673', '#f6c23e', '#e74a3b'],
    hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
    },
    options: {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
    backgroundColor: "rgb(255,255,255)",
    bodyFontColor: "#858796",
    borderColor: '#dddfeb',
    borderWidth: 1,
    xPadding: 10,
    yPadding: 5,
    displayColors: false,
    caretPadding: 2,
    },
    legend: {
    display: false
    },
    cutoutPercentage: 60,
    },
    });
        });
        */
    
      })
  }).then(() => {

    if(index == 0){
      var noAnnouncementsHTML = ` 
      
      <center>
      <img src="/teacher/img/undraw_news_go0e.svg" width="20%" style = 'margin-top: 5%'>  
    
      <h2 style="margin-top: 3%;">No Announcements</h2>
      <p>You're all caught up</p>

      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo" style = 'margin-bottom: 20px; margin-left: 20px;'>Send Announcement</button>

    </center>
      `;

      document.getElementById('send_announcement_top_classPage').style.display = "none"
    document.getElementById("classAnnouncement").innerHTML = noAnnouncementsHTML;
    } else {
      $('#classAnnouncement').on('scroll', function() { 
        if ($(this).scrollTop() + 
            $(this).innerHeight() >=  
            $(this)[0].scrollHeight) { 
    
            getAnnouncementForClass_Pagenation(code, lastItem)
        } 
      });
    }
  })




}

function showSendAnnouncementModal(code, className){
  var modalHTML = `
  <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
  aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Send Announcement</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form onsubmit="event.preventDefault();">
      <div class="form-group" style="padding-left: 10px; padding-right: 10px;">
        <label for="message-text" class="col-form-label">Title:</label>
        <input class="form-control" id="messageTitle" maxlength="100"></input>
      </div>
      <div class="form-group" style="padding-left: 10px; padding-right: 10px;">
        <label for="message-text" class="col-form-label">Message:</label>
        <textarea class="form-control" id="messageText"></textarea>
      </div>
      <center>
        <button class="btn btn-primary" onclick="writeAnnouncement('${code}', '${className}'); event.preventDefault();" id = 'sendAnnouncementButton' style="width: 200px; margin-top: 10px; margin-bottom: 5px">Send
          Announcement</button>
      </center>
      </form>
     
    </div>
   
    
  </div>
</div>
  `;

  $(modalHTML).appendTo('#page-top')
}

function deleteAnnouncement(id, classCode){
  console.log(id)

  firebase.firestore().collection("Classes").doc(classCode).collection("Announcements").doc(id).delete().then(() => {
    window.location.reload()
  })
}

var lastElement_Get_meetings_classLIST = []

function getMeetingForClass_Pagenation(code, lastElement) {


  $('#meetingsListforClassPage').on('scroll', function() { 
    if ($(this).scrollTop() + 
        $(this).innerHeight() >=  
        $(this)[0].scrollHeight) { 

          getMeetingForClass_Pagenation(code, lastElement)
    } 
  });


  //if(lastElement_Get_meetings_class == lastElement){
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        var name = user.displayName;
        var email = user.email;
  
        var index = 0;
  
        firebase.firestore().collection('UserData').doc(email).collection('Meetings').where('class id', '==', code).orderBy('timestamp', "desc").limit(4).startAt(lastElement).get().then(function(doc) {
          doc.forEach(snapshot => {
            index  = index + 1
            var data = snapshot.data();
            var classForMeeting = data["class id"]
            var date = data["date and time"];
            var title = data["title"];
            var message = data["message"]
            var length = data["length"]
            var recipient = data["recipient"]

            lastElement = data['timestamp']

            if(lastElement_Get_meetings_classLIST.includes(snapshot.id) != true){

              lastElement_Get_meetings_classLIST.push(snapshot.id)
          
              var meetingID = snapshot.id
  
              output = `
              <section class="resume" style="margin-left: 20px;">
                <div class="row">
                <div class="col-lg-6" data-aos="fade-up">
                      <h3 class="resume-title">${date} </h3>
                      <div class="resume-item pb-0">
                        <h4 style="width: 500px">${title}</h4>
                        <h5>${length}</h5>
                        <p style="width: 100%">
                          ${message}
                        </p>
                        <button type="button" class="btn btn-outline-danger" onclick = "cancelMeeting('${meetingID}', '${recipient}', '${classForMeeting}', '${message}', '${title}', '${email}', '${date}')">Cancel</button>
                      </div>
    
                </div>
              </section>
                `;
    
                $(output).appendTo("#meetingsListforClassPage")

                
            }

          })
        }).then(() => {
          
        })
      }
    })
  //}

}


function getMeetingForClass(code) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var name = user.displayName;
      var email = user.email;

      var index = 0;

      var lastElement = ''

      $('#meetingsListforClassPage').on('scroll', function() { 
        if ($(this).scrollTop() + 
            $(this).innerHeight() >=  
            $(this)[0].scrollHeight) { 
    
              getMeetingForClass_Pagenation(code, lastElement)
        } 
      });

      document.getElementById('meetingsListforClassPage').innerHTML = '';

      firebase.firestore().collection('UserData').doc(email).collection('Meetings').where('class id', '==', code).orderBy('timestamp', "desc").limit(4).get().then(function(doc) {
        doc.forEach(snapshot => {
          index  = index + 1
          var data = snapshot.data();
          var classForMeeting = data["class id"]
          var date = data["date and time"];
          var title = data["title"];
          var message = data["message"]
          var length = data["length"]
          var recipient = data["recipient"]

          lastElement = data['timestamp']


          lastElement_Get_meetings_classLIST.push(snapshot.id)

          var meetingID = snapshot.id

          output = `
          <section class="resume" style="margin-left: 20px;">
            <div class="row">
            <div class="col-lg-6" data-aos="fade-up">
                  <h3 class="resume-title">${date} </h3>
                  <div class="resume-item pb-0">
                    <h4 style="width: 500px">${title}</h4>
                    <h5>${length}</h5>
                    <p style="width: 100%">
                      ${message}
                    </p>
                    <button type="button" class="btn btn-outline-danger" onclick = "cancelMeeting('${meetingID}', '${recipient}', '${classForMeeting}', '${message}', '${title}', '${email}', '${date}')">Cancel</button>
                  </div>

            </div>
          </section>
            `;

            $(output).appendTo("#meetingsListforClassPage")
        })
      }).then(() => {
        if(index == 0){

          var noMeetingsHTML = `
    <center style="margin-top: 8%;">
    <img src = '/teacher/img/undraw_checking_boxes_2ibd.svg' width="25%"/>
  
    <h1 style="margin-top: 20px;">No Meetings</h1>
    <p>You do not have any scheduled meetings yet, go <br> to <strong> Sidebar > Classes > Class</strong> to schedule <br> meetings with your students</p>
    </center>
    `;
          document.getElementById('meetingsListforClassPage').innerHTML = noMeetingsHTML;
        }
      })
    }
  })
}

function cancelMeeting(teacherMeetingID, recipient, meetingClass, message, title, teacherEmail, date){
  //Delete for Teacher
  firebase.firestore().collection('UserData').doc(teacherEmail).collection('Meetings').doc(teacherMeetingID).delete().then(() => {

  //Delete for Student
  firebase.firestore().collection('UserData').doc(recipient).collection('Meetings').where('class id', '==', meetingClass).where('date and time', '==', date).where('title', '==', title).get().then(snap => {
    snap.forEach(doc => {
      console.log(doc.data())
      doc.ref.delete()
    })
  }).then(() => {
    getMeetingForClass(meetingClass)
  });

  });


}


function getClassDataDropdown(emailRef) {
  var classesList = [];

  firebase.firestore().collection('UserData').doc(emailRef).collection("Classes").get().then(function (doc) {
    doc.forEach(snapshot => {
      var data1 = snapshot.data();

      if(data1 != undefined){
        var classCode = data1["class code"];
        var className = data1["class name"];

        classesList.push([classCode, className])
      }

    });

  }).then(function () {

    for (var i = 0; i <= classesList.length; i++) {
      let output = "";
      let output2 = "";
      let output3 = "";
      var classData = classesList[i];

      if (classData != null || classData != undefined) {

        //console.log("works");
        var className = classData[1];
        var classCode = classData[0];

        output2 = `
    <a class="collapse-item" href="#" style = 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' onclick = "storeClassPref('${classCode}')">${className}</a>
    `;

        output3 = `
    <a class="dropdown-item" href="#" style = 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' onclick = "storeClassPref('${classCode}')">${className}</a>
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

function storeClassPref(code) {
  window.location = "/teacher/classes/" + code
}

function createClass() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var name = user.displayName;
      var email = user.email;

      var code = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
      var className = document.getElementById("className").value;
      var maxInactiveDaysInput = document.getElementById('max-inactive-days').value
      var maxInactiveDays = Number(maxInactiveDaysInput)

      if(maxInactiveDays <= 14){
        var paymentPopupHTML = `
          <div class="modal fade" tabindex="-1" role="dialog" id = 'paymentModal'>
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id = 'payment-modal-header'>Payment Confirmation</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" id = 'payment-modal-text'>
   
        <p>Your default payment method will be charged with $1.99 for the creation of this class. Continue?</p>
        <p style = 'color: red;' id = 'feedback-error-payment'></p>
   

      

      </div>
      <div class="modal-footer" id = 'payment-modal-options'>
        <button type="button" class="btn btn-primary" onclick = "chargeCardForClassCreation('${email}', '${code}', '${className}', ${maxInactiveDays})" id = 'continueButton'>Checkout</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
      </div>
    </div>
  </div>
</div>
          `

          $(paymentPopupHTML).appendTo('#page-top')

          $('#paymentModal').modal('toggle')
     
 
      } else {
        document.getElementById('feedbackError').innerText = "Max days inactive has to been between 1 and 14 days"
      }

}
})
}


function chargeCardForClassCreation( email, code, className, maxInactiveDays){

  document.getElementById('continueButton').disabled = true

  document.getElementById('continueButton').innerHTML = ` <img src = '/teacher/img/infinity.svg' style = 'margin-left: 40px; margin-right: 40px; max-height: 23px' width = '30px' height = '30px' />`

    firebase.firestore().collection("UserData").doc(email).get().then(doc => {

      var data = doc.data();

      var customerID = data['customer stripe id']

      
     var val = "pk_test_51HJSAPHxKyunjmTecWP4BIWHHPha6jEzvfJopOrydgMBJmW0F5yJDEIb1eh57hVvZGm7h3KxciXREcXotTqjrHwR00GuN4JVdJ";

     var stripe = Stripe(val);


     var handleResult = function (result) {
       if (result.error) {
         var displayError = document.getElementById("error-message");
         displayError.textContent = result.error.message;
       }
     };

     var url = `https://api-v1.classvibes.net/api/createCheckoutSession?id=${customerID}&email=${email}&name=${className}&maxdays=${maxInactiveDays}&code=${code}`
    
     const xhr = new XMLHttpRequest();
   
     xhr.onreadystatechange = () => {
       if (xhr.readyState === XMLHttpRequest.DONE) {
         // Code to execute with response
         //console.log(xhr.responseText);
   
         var responseText = JSON.parse(xhr.responseText);
   
         var status = responseText['status']
   
         if(status == 'success'){
           //window.location = "dashboard.html"

           var sessionID = responseText.message.id

           
          stripe
          .redirectToCheckout({
            sessionId: sessionID,
          })
          .then(handleResult);

          var handleResult = function (result) {
            if (result.error) {
              document.getElementById('feedback-error-payment').innerHTML = result.error.message
            }
          };
   
   
         } else {
           console.log(responseText['data'])
           document.getElementById('continueButton').innerHTML = "Continue"
           document.getElementById('feedback-error-payment').innerHTML = responseText['message']
         }
       }
     }
     xhr.open('GET', url);
     xhr.send();



  /*
    
      var url = `https://api-v1.classvibes.net/api/subscribe?id=${customerID}&class=${code}`
    
      const xhr = new XMLHttpRequest();
    
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          // Code to execute with response
          //console.log(xhr.responseText);
    
          var responseText = JSON.parse(xhr.responseText);
    
          var status = responseText['status']
    
          if(status == 'success'){
            //window.location = "dashboard.html"
    
            firebase.firestore().collection("UserData").doc(email).collection("Classes").doc(code).set({
              "class code": code,
              "class name": className,
              "max days inactive": maxInactiveDays,
              "teacher email" : email,
              "allow join": true
          
            });
          
            firebase.firestore().collection("Classes").doc(code).set({
              "class code": code,
              "class name": className,
              "teacher email" : email,
              "max days inactive": maxInactiveDays,
              "allow join": true
    
            })
    
            console.log("payment success")
            document.getElementById('feedback-error-payment').innerHTML = ''
            document.getElementById('continueButton').innerHTML = "Continue"
    
            document.getElementById('payment-modal-text').innerHTML = `
            <center>
            <i class="far fa-check-circle" style = 'color: green; font-size: 55px'></i>
            <h2 style = 'margin-top: 10px'>Payment Success</h2>
    
            <p>The payment has been added to your card and an reciept has been mailed to you. You have successfully created your class.</p>
            </center>
            `
    
            document.getElementById('payment-modal-header').innerHTML = `
            Class successfully created
            `
    
            document.getElementById('payment-modal-options').innerHTML = `
            <button type="button" class="btn btn-primary" onclick = 'window.location = "/teacher/dashboard"'>Continue</button>
            `
    
    
          } else {
            console.log(responseText['data'])
            document.getElementById('continueButton').innerHTML = "Continue"
            document.getElementById('feedback-error-payment').innerHTML = responseText['message']
          }
        }
      }
      xhr.open('GET', url);
      xhr.send();

      */
    })





  
}


function getStudentData(code) {

  var happyCount = 0
  var mehCount = 0
  var frustratedCount = 0
  var inactiveCount = 0
  var totalCount = 0

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var teacherEmail = user.email;

      
  var classInfoList = [];
  //console.log(classInfoList);
  var maxdays = 0


  var className = '';
  var today = Math.floor(Date.now()/1000);

  firebase.firestore().collection('Classes').doc(code).get().then(function (doc) {
      var data = doc.data();

      className = data["class name"];
      maxdays = data["max days inactive"]

    }).then(() => {
      firebase.firestore().collection('Classes').doc(code).collection("Students").where('accepted', '==', true).get().then(function (doc) {
        doc.forEach(snapshot => {
          var data = snapshot.data();
    
          var reaction = data["status"];
          var studentName = data["name"];
          var studentEmail = data["email"];
          var unread = data['teacher unread'];
          var date = data["date"];

          var exceedDate = date.seconds + (maxdays * 86400);

          console.log(exceedDate)


          //console.log(unread)
          var dateReported = new Date(data['date'].seconds * 1000).toLocaleString()
          classInfoList.push([studentName, reaction, studentEmail,dateReported, unread, exceedDate])
          //console.log(classInfoList)
    
        });

    
        document.getElementById("studentTable").innerHTML = "";
    
        for (var i = 0; i <= classInfoList.length; i++) {
          let descriptionOutput = "";
          classInfoData = classInfoList[i];
          var happy = '<i class="fas fa-user" style="font-size: 70px; color: #1cc88a;"></i>';
          var meh = '<i class="fas fa-user" style="font-size: 70px; color: #f6c23e;"></i>';
          var sad = '<i class="fas fa-user" style="font-size: 70px; color: #e74a3b;"></i>'

          var inactive_happy = '<i class="fas fa-user" style="font-size: 70px; color: #b5b0a3;"></i>'
          var inactive_meh = '<i class="fas fa-user" style="font-size: 70px; color: #b5b0a3;"></i>'
          var inactive_sad = '<i class="fas fa-user" style="font-size: 70px; color: #b5b0a3;"></i>'


          if (classInfoData != null || classInfoData != undefined) {
            //console.log("works")
            var studentName = classInfoData[0];
    
            var studentReaction = classInfoData[1];
    
            var studentEmail = classInfoData[2];

            var unreadMessages = classInfoData[4]

            var studentReportedDate = classInfoData[3]

            var exceedDate = classInfoData[5]

            console.log(exceedDate)

            
            var unreadMessagesHTML = ''

            if(unreadMessages && unreadMessages != undefined && unreadMessages != 0){
              unreadMessagesHTML =  `<span class = 'badge badge-warning'>${unreadMessages}</span>`
            }
            
            //console.log(classInfoData)
    
            descriptionOutput2 = `
            <div class="shadow-m p-3 mb-3 bg-white rounded" style = 'margin-top: 0px; margin-bottom: 5px; margin-top: 5px; margin-right: 10px'>
            <div class = "row">
            <div style = 'margin-left: 10px; font-size: 30px'><div id = "face" ></div></div>
            <div style = 'margin-left: 20px;'> <h4 style = 'margin-top: 10px'>${studentName} 
            <a href = '#' onclick = "showRemoveStudentPopup('${studentEmail}', '${code}', '${teacherEmail}')" style = 'margin-top: 10px'><i class="fas fa-minus-circle"  data-toggle="tooltip" data-placement="top" title="Remove Student"></i></a>
            ${unreadMessagesHTML} </h4> <br> <p style = 'margin-top: -25px'>${studentReportedDate}</p></div>
            </div>
            <div style = 'float: right; margin-top: -65px; margin-right: 20px'>
            <div class = 'row'>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal${i}" data-whatever="@mdo" style = "height: 50px; margin-right: 20px;">Schedule Meeting</button>
            <a href = '/teacher/chats/${code}/${studentEmail}?'>${unreadMessagesHTML}<i class="fas fa-comments" style = 'font-size: 40px;'></i></a>
            </div>       
            </div>
            </div>
          
          `;
    
            happy_face_Column = `
            <div class="shadow-m p-3 mb-3 bg-white rounded" style = 'margin-top: 0px; margin-bottom: 5px; margin-top: 5px; margin-right: 10px'>
            <div class = "row">
            <div style = 'margin-left: 10px; font-size: 30px'>${happy}</div>
            <div style = 'margin-left: 20px;'> <h4 style = 'margin-top: 10px'>${studentName}  <a href = '#' onclick = "showRemoveStudentPopup('${studentEmail}', '${code}', '${teacherEmail}')" style = 'margin-top: 10px'><i class="fas fa-minus-circle"  data-toggle="tooltip" data-placement="top" title="Remove Student"></i></a></h4> <br> <p style = 'margin-top: -25px'>${studentReportedDate}</p></div>        
            </div>
            <div style = 'float: right; margin-top: -65px; margin-right: 20px'>
            <div class = 'row'>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal${i}" data-whatever="@mdo" style = "height: 50px; margin-right: 20px;">Schedule Meeting</button>
            <a href = '/teacher/chats/${code}/${studentEmail}?'>${unreadMessagesHTML}<i class="fas fa-comments" style = 'font-size: 40px;'></i></a>
            </div>        
            </div>
            </div>
          `;
    
            meh_colum_face = `
            <div class="shadow-m p-3 mb-3 bg-white rounded" style = 'margin-top: 0px; margin-bottom: 5px; margin-top: 5px; margin-right: 10px'>
            <div class = "row">
            <div style = 'margin-left: 10px; font-size: 30px'>${meh}</div>
            <div style = 'margin-left: 20px;'> <h4 style = 'margin-top: 10px'>${studentName}  <a href = '#' onclick = "showRemoveStudentPopup('${studentEmail}', '${code}', '${teacherEmail}')" style = 'margin-top: 10px'><i class="fas fa-minus-circle"  data-toggle="tooltip" data-placement="top" title="Remove Student"></i></a></h4> <br> <p style = 'margin-top: -25px'>${studentReportedDate}</p></div>      
            </div>
            <div style = 'float: right; margin-top: -65px; margin-right: 20px'>
            <div class = 'row'>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal${i}" data-whatever="@mdo" style = "height: 50px; margin-right: 20px;">Schedule Meeting</button>
            <a href = '/teacher/chats/${code}/${studentEmail}?'>${unreadMessagesHTML}<i class="fas fa-comments" style = 'font-size: 40px;'></i></a>
            </div>
            </div>
            </div>
          `;
    
            frustrated_column_face = `
            <div class="shadow-m p-3 mb-3 bg-white rounded" style = 'margin-top: 0px; margin-bottom: 5px; margin-top: 5px; margin-right: 10px'>
            <div class = "row">
            <div style = 'margin-left: 10px; font-size: 30px'>${sad}</div>
            <div style = 'margin-left: 20px;'> <h4 style = 'margin-top: 10px'>${studentName}  <a href = '#' onclick = "showRemoveStudentPopup('${studentEmail}', '${code}', '${teacherEmail}')" style = 'margin-top: 10px'><i class="fas fa-minus-circle"  data-toggle="tooltip" data-placement="top" title="Remove Student"></i></a></h4> <br> <p style = 'margin-top: -25px'>${studentReportedDate}</p></div>
            </div>
            <div style = 'float: right; margin-top: -65px; margin-right: 20px'>
            <div class = 'row'>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal${i}" data-whatever="@mdo" style = "height: 50px; margin-right: 20px;">Schedule Meeting</button>
            <a href = '/teacher/chats/${code}/${studentEmail}?'>${unreadMessagesHTML}<i class="fas fa-comments" style = 'font-size: 40px;'></i></a>
            </div>
            </div>
            </div>
          `;

            inactive_column_face = `
            <div class="shadow-m p-3 mb-3 bg-white rounded" style = 'margin-top: 0px; margin-bottom: 5px; margin-top: 5px; margin-right: 10px'>
            <div class = "row">
            <div style = 'margin-left: 10px; font-size: 30px'><div id = "inactive_face" ></div></div>
            <div style = 'margin-left: 20px;'> <h4 style = 'margin-top: 10px'>${studentName} <a href = '#' onclick = "showRemoveStudentPopup('${studentEmail}', '${code}', '${teacherEmail}')" style = 'margin-top: 10px'><i class="fas fa-minus-circle"  data-toggle="tooltip" data-placement="top" title="Remove Student"></i></a></h4> <br> <p style = 'margin-top: -25px'>${studentReportedDate}</p></div>
            </div>
            <div style = 'float: right; margin-top: -65px; margin-right: 20px'>
            <div class = 'row'>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal${i}" data-whatever="@mdo" style = "height: 50px; margin-right: 20px;">Schedule Meeting</button>
            <a href = '/teacher/chats/${code}/${studentEmail}?'>${unreadMessagesHTML}<i class="fas fa-comments" style = 'font-size: 40px;'></i></a>
            </div>
            </div>
            </div>
            `
    
            outputModel = `
          <div class="modal fade" id="exampleModal${i}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel${i}" aria-hidden="true">
          <div class="modal-dialog" role="document">
              <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel${i}">Schedule Meeting</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div class="modal-body">
                  <form>
                  <div class="form-group">
                      <label for="recipient-name" class="col-form-label">Title:</label>
                      <input type="text" class="form-control" id="title1${i}" maxlength="100">
                  </div>
                  <div class="form-group">
                      <label for="recipient-name" class="col-form-label">Date/Time</label>
                      <input type="text" class="form-control" id="date${i}" maxlength="60">
                  </div>
                  <div class="form-group">
                      <label for="recipient-name" class="col-form-label">Message</label>
                      <textarea type="text" class="form-control" id="message${i}">
                      </textarea>
                  </div>
                  <div class="form-group">
                  <label for="recipient-name" class="col-form-label">Meeting Length</label>
                  <input type="text" class="form-control" id="len${i}" textarea >
                  </div>
                  <div class="form-group">
                      <label for="message-text" class="col-form-label">Student</label>
                      <input type="text" class="form-control" placeholder = "${studentName}" readonly>
                  </div>
                  </form>
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary" onclick = "schedualMeeting('${studentEmail}', '${className}', '${code}', '${i}')" data-dismiss = "modal">Send message</button>
              </div>
              </div>
          </div>
          </div>
          `

          var today = Math.floor(Date.now()/1000);

          console.log(exceedDate, today)

          if(today > exceedDate) {
            console.log('INACTIVE STUDENT: ' + studentEmail )

          } 

          console.log("Reaction:" + studentReaction  + ": " + studentEmail)

            $(outputModel).appendTo("#outputModel")
            $(descriptionOutput2).appendTo("#studentTable")

            totalCount = totalCount + 1
    
        if (studentReaction == "doing great") {
              //$(descriptionOutput2).appendTo("#studentsListGreat");
              $(happy_face_Column).appendTo('#studentTable-doing-good');

              happyCount = happyCount + 1


              if(today > exceedDate) {
                $(inactive_column_face).appendTo("#studentTable-inactive");

                inactiveCount = inactiveCount + 1

                document.getElementById("face").outerHTML = inactive_happy;
                document.getElementById("inactive_face").outerHTML = inactive_happy;
            

              } else {
                document.getElementById("face").outerHTML = happy;

              }
    
            } else if (studentReaction == "need help") {
              
              //$(descriptionOutput2).appendTo("#studentsListHelp");
              $(meh_colum_face).appendTo('#studentTable-meh');

              mehCount = mehCount + 1

              if(today > exceedDate) {

                $(inactive_column_face).appendTo("#studentTable-inactive");

                document.getElementById("face").outerHTML = inactive_meh;
                document.getElementById("inactive_face").outerHTML = inactive_meh;

                inactiveCount = inactiveCount + 1
    
              

              } else {
                document.getElementById("face").outerHTML = meh
              }
    
    
            } else if (studentReaction == "frustrated") {

              frustratedCount = frustratedCount + 1
    
              $(frustrated_column_face).appendTo("#studentTable-frustrated");

              if(today > exceedDate) {
                $(inactive_column_face).appendTo("#studentTable-inactive");
                document.getElementById("face").outerHTML = inactive_sad;
                document.getElementById("inactive_face").outerHTML = inactive_sad;

                inactiveCount = inactiveCount + 1
                

              } else {
                document.getElementById("face").outerHTML = sad;
              }
    
            }  else {
              $(happy_face_Column).appendTo("#studentsListGreat");
              document.getElementById("face").outerHTML = happy;
              

            }
            
            
          }

          
        }
      }).then(() => {


          var noStudentsHTML = `
            <h2 style = 'margin-top: 5%; margin-left: 15%'>No Students here</h2>
          `

          if(totalCount == 0){
            $(noStudentsHTML).appendTo("#studentTable")
          }

          if(happyCount == 0){
            $(noStudentsHTML).appendTo("#studentTable-doing-good")
          }

          if(mehCount == 0){
            $(noStudentsHTML).appendTo("#studentTable-meh")
          }

          if(frustratedCount == 0){
            $(noStudentsHTML).appendTo("#studentTable-frustrated")
          }

          if(inactiveCount == 0){
            $(noStudentsHTML).appendTo("#studentTable-inactive")
          }

      });
    })

    }
  })

  


}


function getStudentJoinRequests(code){

  var requests = 0

  document.getElementById('student-requests-list').innerHTML = ''
  firebase.firestore().collection("Classes").doc(code).collection("Students").where('accepted', '==', false).get().then(snap => {
    snap.forEach(doc => {

      requests = requests + 1
      var data = doc.data()

      var name = data['name']

      var accepted = data['accepted']

      var email = data['email']


      var requestHTML = `
      <div class="col-xl-12 col-md-6 mb-4">
      <div class="card border-left-primary shadow h-100 py-2">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">

              <h3 style = 'font-weight: 700; margin: 2px'>${name}</h3>

              <p style = 'color: gray'>${email}</p>

            </div>
            <div class="col-auto">

              <div class = 'row'>
              <a onclick = "acceptStudentRequest('${code}', '${email}')" href = '#'><i class="fas fa-check-circle" style = 'color: green; font-size: 45px; margin-right: 20px'></i></a>
              <a onclick = "declineStudentRequest('${code}', '${email}')" href = '#'><i class="fas fa-times" style = 'color: red; font-size: 45px; margin-right: 25px'></i></a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
      `;

      $(requestHTML).appendTo('#student-requests-list')


    })
  }).then(() => {
    if(requests == 0){
      document.getElementById('student-requests-list').innerHTML = `
      <div class="d-flex justify-content-center">
        <img src = '/teacher/img/undraw_Checklist__re_2w7v.svg' width = '25%' style = 'margin-top: 5%'>
      
        </div>
        <div class="d-flex justify-content-center" style = 'margin-top: 1%'>

        <h1>No Pending Requests</h1>
       
        </div>
        <div class="d-flex justify-content-center">

        <p>Any pending student join requests will show up here</p>
        </div>

      `
    }
})
}

function declineStudentRequest(code, email){
  firebase.firestore().collection('UserData').doc(email).collection('Classes').doc(code).delete().then(() => {
    firebase.firestore().collection('Classes').doc(code).collection('Students').doc(email).delete().then(() => {
      getStudentJoinRequests(code)
    })
  })
}

function acceptStudentRequest(code, email){
  firebase.firestore().collection('UserData').doc(email).collection('Classes').doc(code).update({
    'accepted': true
  }).then(() => {
    firebase.firestore().collection('Classes').doc(code).collection('Students').doc(email).update({
      'accepted': true
    }).then(() => {
      getStudentJoinRequests(code)
    })
  })
}

function showRemoveStudentPopup(email, code, teacherEmail){
  
  var popupHTML = `
  <div class="modal" tabindex="-1" role="dialog" id = 'removeStudentModal${code}'>
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Remove Student?</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to remove this student from the class?</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" onclick = "removeStudent('${email}', '${code}', '${teacherEmail}')" id = 'removeStudentButton${code}'>Remove Student</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
  `

  $(popupHTML).appendTo('#page-top')
  $(`#removeStudentModal${code}`).modal('toggle')
}


async function removeStudent(email, code, teacherEmail){

  console.log(teacherEmail)

  document.getElementById(`removeStudentButton${code}`).innerHTML = `

    <img src = '/teacher/img/infinity.svg' style = 'margin-left: 40px; margin-right: 40px; max-height: 23px' width = '30px' height = '30px' />
  `

  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
    //console.log(idToken)

    var url = "https://api-v1.classvibes.net/api/removeStudent?email=" + email + "&code=" + code + "&teacher=" + teacherEmail + "&classUID=" + code + "&authToken=" + idToken

    //console.log("Removing")

    /*
  
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    console.log(xmlHttp.responseText);
    */

    console.log("Getting")

    const xhr = new XMLHttpRequest();

xhr.onreadystatechange = () => {
    if(xhr.readyState === XMLHttpRequest.DONE){
        // Code to execute with response
        //console.log(xhr.responseText);

        var response = JSON.parse(xhr.responseText);

        console.log(response.status)

        if(response.status == 'success'){

          window.location.reload()
        }

        document.getElementById(`removeStudentButton${code}`).innerHTML = `Remove Student`

    }
}

xhr.open('GET', url);
xhr.send();

  


  }).catch(function(error) {
    console.log(error)
    console.log("Failed")

    document.getElementById(`removeStudentButton${code}`).innerHTML = `Remove Student`

  });




}

function schedualMeeting(emailStudent, course, code, index) {
  console.log("schedual meeting")

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var teacherEmail = user.email;

      var meetingTitle = document.getElementById("title1" + index).value;
      var meetingDate = document.getElementById("date" + index).value;
      var meetingMessage = document.getElementById("message" + index).value;
      var len = document.getElementById("len" + index).value;
      var dateNow = new Date();
      var formattedDate = dateNow.toLocaleString();
    
      firebase.firestore().collection('UserData').doc(emailStudent).collection("Meetings").doc().set({
        "title": meetingTitle,
        "date and time": meetingDate,
        "class id": code,
        "course": course,
        "timestamp": dateNow.toString(),
        "message" : meetingMessage,
        "recipient": emailStudent,
        "length" : len
      }).then(() => {
        firebase.firestore().collection('UserData').doc(teacherEmail).collection("Meetings").doc().set({
          "title": meetingTitle,
          "date and time": meetingDate,
          "class id": code,
          "course": course,
          "timestamp": dateNow.toString(),
          "message" : meetingMessage,
          "recipient": emailStudent,
          "length" : len
        }).then(() => {
          window.location.reload()
        });
      });
    } 
  })

 



}

function showGreat() {
  document.getElementById('studentTable').style.display = "none";
  document.getElementById('allStudentsTable').style.display = "none";
  document.getElementById("doing-good-table-section").style.display = "initial";
  document.getElementById("meh-table-section").style.display = "none";
  document.getElementById("frustrated-table-section").style.display = "none";
  document.getElementById("inactive-table-section").style.display = "none";


}

function showHelp() {

  document.getElementById('studentTable').style.display = "none";
  document.getElementById('allStudentsTable').style.display = "none";
  document.getElementById("doing-good-table-section").style.display = "none";
  document.getElementById("meh-table-section").style.display = "initial";
  document.getElementById("frustrated-table-section").style.display = "none";
  document.getElementById("inactive-table-section").style.display = "none";

}

function showFrustrated() {
  document.getElementById('studentTable').style.display = "none";
  document.getElementById('allStudentsTable').style.display = "none";
  document.getElementById("doing-good-table-section").style.display = "none";
  document.getElementById("meh-table-section").style.display = "none";
  document.getElementById("frustrated-table-section").style.display = "initial";
  document.getElementById("inactive-table-section").style.display = "none";

}

function showInactive() {

  document.getElementById('studentTable').style.display = "none";
  document.getElementById('allStudentsTable').style.display = "none";
  document.getElementById("doing-good-table-section").style.display = "none";
  document.getElementById("meh-table-section").style.display = "none";
  document.getElementById("frustrated-table-section").style.display = "none";
  document.getElementById("inactive-table-section").style.display = "initial";

}

function showAll() {
  document.getElementById('studentTable').style.display = "initial";
  document.getElementById('allStudentsTable').style.display = "initial";
  document.getElementById("doing-good-table-section").style.display = "none";
  document.getElementById("meh-table-section").style.display = "none";
  document.getElementById("frustrated-table-section").style.display = "none";
  document.getElementById("inactive-table-section").style.display = "none";
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


var classNameGlobal = ''

var maxDaysGlobal = ''

function getEditData(code) {
  output = ''

  firebase.firestore().collection('Classes').doc(code).get().then(function (doc) {

    var data = doc.data();
    return data;


  }).then((data) => {
    var className = data['class name'];

    var joinStatus = data['allow join']


    document.getElementById("className").innerHTML = `<h1>${className} <span class = "badge badge-primary">${code}</span></h1>`

    showSendAnnouncementModal(code, className);

    var inactiveDays = data['max days inactive'] != NaN ?  data['max days inactive'] : "Not Set"

    classNameGlobal = className

    maxDaysGlobal = inactiveDays

    output += `


    <h6>Edit Class Name</h6>

  <div class="input-group mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text" id="basic-addon1">
    <i class="fa fa-pencil" aria-hidden="true" onclick = "editTitle()"></i>
    </span>
  </div>

  <input type="text" class="form-control" aria-label="Username" aria-describedby="basic-addon1" name="editName" id="editName" value = '${className}' oninput = 'updateDetailsOnChange("${code}")'>
</div>

</div>
</div>

<h6>Set the minimum number of days for you students to choose a mood.  Students who dont select will shod up as a gray color on your graph.</h6>

<div class="input-group mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text">Days</span>
    <span class="input-group-text">1-14</span>
  </div>
  <input type="number" class="form-control" aria-label="Number of Days" min="1" max = "14" id="maxDays" value="${inactiveDays}" oninput = 'updateDetailsOnChange("${code}")'>
</div>

<h6>Allow Students To Join <h4><span class = 'badge badge-primary' id  = 'join-setting'>Join Enabled</span> <h4></h6>


    <label class="switch-container">
    <input class="switch sw-1" type="checkbox" id = 'allow-join-switch' onclick="changeJoinStatus(this, '${code}')">
    <span class="slider sl-1"></span>
  </label>

<p style = "color: red; font-weight: 700" id = "error-feedback-edit-class"></p>

<div id = 'update-details-section'></div>

  `

  //<button class="btn btn-primary" onclick="updateDetails('${code}')">Update Class Details</button>
    $(output).appendTo("#editInfo");   

    if(joinStatus == true){
      document.getElementById('join-setting').className  = "badge badge-primary"
      document.getElementById('join-setting').innerText = "Allowed"
      document.getElementById('allow-join-switch').checked = true


    } else {
      document.getElementById('join-setting').className  = "badge badge-danger"
      document.getElementById('join-setting').innerText = "Not Allowed"
      document.getElementById('allow-join-switch').checked = false
    }

    console.log("CHECKED: " +document.getElementById('allow-join-switch').checked)
  })
}

function updateDetailsOnChange(code){

  var updateClassButton = `<button class="btn btn-primary" onclick="updateDetails('${code}')">Update Class Details</button>`

  document.getElementById('update-details-section').innerHTML = updateClassButton

}

function changeJoinStatus(value, code){

  var updateClassButton = `<button class="btn btn-primary" onclick="updateDetails('${code}')">Update Class Details</button>`

  document.getElementById('update-details-section').innerHTML = updateClassButton
  if(value.checked == true){
    document.getElementById('join-setting').className  = "badge badge-primary"
    document.getElementById('join-setting').innerText = "Allowed"
  } else {
    document.getElementById('join-setting').className  = "badge badge-danger"
    document.getElementById('join-setting').innerText = "Not Allowed"
  }
}

function updateDetails(code) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var email = user.email;
      //console.log(email)

  var newName = document.getElementById('editName').value;
  var maxDays = document.getElementById('maxDays').value;

  var joinStatus = document.getElementById('allow-join-switch').checked
  let maxDaysNum = parseInt(maxDays);

  //console.log(newName, newCourse, newDescription, maxDays)

  if(newName, maxDaysNum != null && newName, maxDaysNum != ""){

    if(maxDaysNum > 14){
      var feedbackError = document.getElementById('error-feedback-edit-class');

      feedbackError.innerHTML = 'The max inactive days has to be less than or equal to 14 days'
    } else {
      var feedbackError = document.getElementById('error-feedback-edit-class');

      feedbackError.innerHTML = ''
  
      firebase.firestore().collection('UserData').doc(email).collection('Classes').doc(code).update({
        "class name": newName,
        "allow join": joinStatus,
        "max days inactive": maxDaysNum,
    
      }).then(() => {
        firebase.firestore().collection('Classes').doc(code).update({
          "class name": newName,
        "allow join": joinStatus,
        "max days inactive": maxDaysNum,
    
    
        }).then(() => {
          window.location.reload()
        });
      });
    
    }

  } else {
    //console.log("Feilds blank")
    var feedbackError = document.getElementById('error-feedback-edit-class');

    feedbackError.innerHTML = 'You cannot leave any fields blank'
  }
}
})
};


function getChartData(code) {
  
  //console.log("GETTING PIE CHART DEMO");

  var index = 0;
  var maxdays = 0



  var today = Math.floor(Date.now()/1000);


      firebase.firestore().collection('Classes').doc(code).get().then(function (doc) {
        var data = doc.data();

        if( data != undefined){
          if(data["max days inactive"]){
          maxdays = data["max days inactive"] 
          }
        }
        


      }).then(() => {
        firebase.firestore().collection('Classes').doc(code).collection("Students").where('accepted', '==', true).onSnapshot(function (doc) {

          var unreadMessages = 0

          //document.getElementById('studentReportHeadline').innerHTML = "Student Report - " + code;
  
          var studentsReactionLists = [0,0,0,0];
  
          doc.forEach(snapshot => {
            index = index + 1
              var data = snapshot.data();
              
              var reaction = data["status"];
              var date = data["date"];

              //console.log(data["teacher unread"])

              if(data["teacher unread"] != undefined && data["teacher unread"] != null && data["teacher unread"] != NaN){
                unreadMessages = unreadMessages + data["teacher unread"];
                //
              } else {
                unreadMessages = unreadMessages + 0
              }

            
              //console.log("TIMESTAMP FORM FIRE:" + date.seconds + "//" + code)

              var studentTimeUpdateTimeStamp = new Date(date.seconds)

            
                var exceedDate = date.seconds + (maxdays * 86400); 

              //console.log('///////////////////////////////////////////')
              //console.log('Class:' + code)
              //console.log('student last updated:' + studentTimeUpdateTimeStamp.valueOf())
              //console.log('today:' + today)
              //console.log('update by:' + exceedDate)
              //console.log('maxdays' + maxdays)


          var happy = '<i class="fas fa-smile" style="font-size: 70px; color: #1cc88a;"></i>';
          var meh = '<i class="fas fa-meh" style="font-size: 70px; color: #f6c23e;"></i>';
          var sad = '<i class="fas fa-frown" style="font-size: 70px; color: #e74a3b;"></i>'
          var inactive = '<i class="fas fa-meh" style="font-size: 70px; color: #b5b0a3;"></i>'
              
              
              if(exceedDate > today) {
                if(reaction == "doing great"){
                  studentsReactionLists[0] = studentsReactionLists[0] + 1;
                
              }
      
                if(reaction == "need help"){
                  studentsReactionLists[1] = studentsReactionLists[1] + 1;
                
              }
      
                if(reaction == "frustrated"){
                
                  studentsReactionLists[2] = studentsReactionLists[2] + 1;
                
              }

              } else {
                //console.log("Gray Time")
                studentsReactionLists[3] = studentsReactionLists[3] + 1;

                //document.getElementById("face").outerHTML = inactive;
    
                //$(descriptionOutput2).appendTo("#studentsListFrustrated");
               

              }
              
              //console.log('///////////////////////////////////////////')
              
  
  
          });
  
            if(studentsReactionLists[0] == 0 && studentsReactionLists[1] == 0 && studentsReactionLists[2] == 0 && studentsReactionLists[3] == 0){
  
              var noStudentsHTML = `
              <center style = 'margin-top: 10%'>
                <img src = '/teacher/img/undraw_empty_xct9.svg' width = "50%" />
                <h3 style = 'margin-top: 10px'>No Students</h3>
              </center>
              `;
  
              document.getElementById(`chartPie${code}`).innerHTML = noStudentsHTML;
            } else {
    // Set new default font family and font color to mimic Bootstrap's default styling
    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#858796';
    
    // Pie Chart Example
    var ctx = document.getElementById(`myPieChart${code}`);
    var myPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ["Doing Great", "Needs Help", "Frustrated", "Inactive"],
        datasets: [{
          data: studentsReactionLists,
          backgroundColor: ['#4feb34', '#ebe834', '#eb0c00', '#808080'],
          hoverBackgroundColor: ['#15b809', '#c2cc00', '#cc0011', '#808080'],
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
      
            //console.log("UNREAD : " + unreadMessages)

            var unreadMessagesHTML = ''

            if(unreadMessages, unreadMessages != 0 && unreadMessages != NaN && unreadMessages != 'NaN'){
              var unreadMessagesHTML =  `<h2><span class="badge badge-warning" style = 'position: absolute; margin-left: 83%; top: 10px'>${unreadMessages}</span><h2></h2>`

            }
    
            document.getElementById(`unreadMessages${code}`).innerHTML = unreadMessagesHTML
         
      });
      })




}

function storeGraphReactionsCode(code, event = "none"){
  localStorage.setItem('graphClassCode', code)

  if(event == "onclick"){
    window.location.reload()
  }
}

var globalGetAnnouncements_AnnouncementsPage_pageNationList = []



async function getAnnouncements(email, pageType = "annoncements-page-main") {

  document.getElementById("loadingIndicator").style.display = "initial";

  var classesListCodes = [];

  var classnamesList = [];

  classesList = [];

  var announcentsList = []

  var index = 0;

  let classesRef = firebase.firestore().collection('UserData').doc(email).collection("Classes");
  let classesRefGet = await classesRef.get();
  for(const doc of classesRefGet.docs){

    var classData = doc.data();

    var classCode = classData["class code"];

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


      var announcementsCount = 0;



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

                lastElement = date

                var nameClass = classnamesList[i];

                announcentsList.push({'title': title, 'message': message, 'date': date, 'class name': nameClass, 'timestamp': date.seconds * 1000})

                /*

                var studentReactionsData = annoucementData['Student Reactions']

                var studentReactions = {
                  "doing great": 0,
                  "need help": 0,
                  "frustrated": 0
                }
                

                if(studentReactionsData != {} && studentReactionsData != undefined){

                  for (student in studentReactionsData)  {

                    var studentReaction = studentReactionsData[student]

                    var reaction = studentReaction['reaction']


                    if(reaction == "doing great"){
                      studentReactions['doing great'] = studentReactions['doing great'] + 1
                    }

                    if(reaction == "need help"){
                      studentReactions['need help'] = studentReactions['need help'] + 1
                    }


                    if(reaction == "frustrated"){
                      studentReactions['frustrated'] = studentReactions['frustrated'] + 1
                    }
                    
                  }                  
                }
                */

               

          
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

var classCodeChat = 'NONE'
var chatList_PageNation_MainPageList = []


function getMessagesForChat_chatPage_teacher_pageNation(classCode, studentEmail, lastElement){

  classCodeChat = classCode

  var lastElementPageNation = ''

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var email = user.email;

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

  <div class="message-component" style= " float: left; min-width: 1200px; width: -100%"  >
    <div class="row"><div class="container" style="width: 100%"></div><p style="color: black; background-color: #d8e6eb; border-radius: 20px 20px 20px 0px; margin-right: 30px; padding: 20px; "><strong>${user}</strong> <br> ${message}</p></div>
  </div>
  </div>
  `

  if(type == "student") {
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
           getMessagesForChat_chatPage_teacher_pageNation(classCode, studentEmail, lastElementPageNation)
          }
        });
      });
    }
  });
} 

function getMessagesForChat_chatPage_teacher(classCode, studentEmail){
  
  firebase.firestore().collection('Classes').doc(classCode).collection("Students").doc(studentEmail).update({
    'teacher unread': 0
  })


  classCodeChat = classCode

  var lastElement = '';

  var lastID = []

  var messagesListIDs = []

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var email = user.email;

      firebase.firestore().collection('Class-Chats').doc(classCode).collection('Students').doc(studentEmail).collection('Messages').orderBy('timestamp', 'desc').limit(10).get().then(snap => {
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

  <div class="message-component" style= " float: left; min-width: 900px">
    <div class="row">
    <div class="container" style="width: 100%"></div>
    
    <p style="color: black; background-color: #d8e6eb; border-radius: 20px 20px 20px 0px; margin-right: 30px; padding: 20px; "><strong>${user}</strong> <br> ${message}</p>
    
    </div>
  </div>
  </div>
  `

  if(type == "student") {
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
           getMessagesForChat_chatPage_teacher_pageNation(classCode, studentEmail, lastElement)
          }
        });


    
          firebase.firestore().collection('Class-Chats').doc(classCode).collection('Students').doc(studentEmail).collection('Messages').orderBy('timestamp').limitToLast(1).onSnapshot(snap => {
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

        <div class="message-component" style= " float: left; min-width: 1200px" >
          <div class="row"><div class="container" style="width: 100%"></div><p style="color: black; background-color: #d8e6eb; border-radius: 20px 20px 20px 0px; margin-right: 30px; padding: 20px; "><strong>${user}</strong> <br> ${message}</p></div>
        </div>
        </div>
          `
        
          if(type == "student") {
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

function sendMessage_ChatPage_teacher(classCode, studentEmail){
  //console.log("Message queued")
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var email = user.email;
      var name = user['displayName'];

      const increment = firebase.firestore.FieldValue.increment(1);

      var message = document.getElementById('message-input').value
    
      firebase.firestore().collection('Class-Chats').doc(classCode).collection('Students').doc(studentEmail).collection('Messages').doc().set({
          "message": message,
          "user": name,
          "sent type": "teacher",
          "timestamp": new Date()
    
      }).then(() => {

        firebase.firestore().collection('UserData').doc(studentEmail).collection('Classes').doc(classCode).update({
          "student unread": increment,
      })

        console.log("Message sent")
        document.getElementById('message-input').value = '';
      })
    }
    });
} 

function scrollSmoothToBottom() {
  //console.log("scrolling")
  var div = document.getElementById('message-components');
  $(div).animate({
    scrollTop: div.scrollHeight - div.clientHeight
  }, 500);
}

