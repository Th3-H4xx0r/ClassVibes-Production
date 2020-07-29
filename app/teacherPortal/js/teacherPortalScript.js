function getTeacherAccountStatus(pageType, classCode = "null", additionalParams) {

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
              //getClassData();
              getClassDataDropdown();
              getMeetings();
            }
            else if (pageType == "") {
            }

            else if(pageType == 'create-class'){
              getProfileInfo();
              getClassDataDropdown();
            }

            else if (pageType == 'class-page') {
              getProfileInfo();
              //getClassData();
              getClassDataDropdown()
              getStudentData(classCode);
              getEditData(classCode);
              getAnnouncementForClass(classCode);
              getMeetingForClass(classCode);
              showSendAnnouncementModal();
            }

            else if (pageType == 'dashboard') {
              getProfileInfo();
              getClassData();
              //getWeekStudentAverageReactions_ALL_CLASSES()
            }

            else if(pageType == "student-requests"){
              getProfileInfo();
              getStudentRequests();
            }

            else if(pageType == "announcementsTeacher"){
              getProfileInfo();
              getClassDataDropdown();
              getAnnouncements(email);

            }

            else if(pageType == "chat-page-teacher"){
              getProfileInfo();
              getClassDataDropdown();
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
            getClassDataDropdown();
            getMeetings();
          }
          else if (pageType == "") {
            getClassDataDropdown();
          }
          else if (pageType == 'class-page') {
            getProfileInfo();
            //getClassData();
            getClassDataDropdown();
            getStudentData(classCode);
            getEditData(classCode);
            getAnnouncementForClass(classCode);
            getMeetingForClass(classCode);
            showSendAnnouncementModal();

          }
          else if (pageType == 'dashboard') {
            console.log("executing");
            getProfileInfo();
            getClassData();
            //getWeekStudentAverageReactions_ALL_CLASSES()
          }

          else if(pageType == 'create-class'){
            getProfileInfo();
            getClassDataDropdown();
          }

          else if(pageType == "announcementsTeacher"){
            getProfileInfo();
            getAnnouncements(email);
          }

          else if(pageType == "student-requests"){
            getProfileInfo();
            getStudentRequests();
          }

          else if(pageType == "chat-page-teacher"){
            getProfileInfo();
            getClassDataDropdown();
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

function getProfileInfo() {

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var name = user.displayName;
      var pic = user.photoURL;

      var outputPic = ``;

      if(pic != null && pic != undefined && pic != ""){
          outputPic = `<img class="img-profile rounded-circle" src="${pic}">`;
      } else {
          outputPic = `<img class="img-profile rounded-circle" src="https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144849704.jpg">`;
      }
    
      $(outputPic).appendTo("#profilePic")

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

  console.log(code)

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
  
          var studentReaction = data['reaction']
  
          var date = data['date']
  
          var reactionDate = new Date(date)
          
          var reactionDay = reactionDate.getDay()
  
          var reactionKey = 0;
  
          if(studentReaction == 'good'){
            reactionKey = 3
          } else if (studentReaction == 'meh') {
            reactionKey = 2
          } else if (studentReaction == 'needs help'){
            reactionKey = 1
          }
  
          console.log(reactionDay)
  
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
                  <div class="chart-pie pt-4 pb-2" id = "chartPie${classCode}">
                    <canvas id="myPieChart${classCode}"></canvas>
                  </div>
                  <div style="height: 30px"></div>
                  <center><h5 class="card-title">${className} <span class = 'badge badge-primary'>${classCode}</span></h5>
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
      //getChartData(classCode);
    }
  })
}

function setClassCode(classCode) {
  localStorage.setItem("code", classCode);
}

function storeClassforChart(code) {
  localStorage.setItem("codeForChart", code);
}

function writeAnnouncement() {
  var numberClass = document.getElementById("numberClass").value;
  console.log("NUMBER CLASS" + numberClass);
  var messageTitle = document.getElementById("messageTitle").value;
  var messageText = document.getElementById("messageText").value;
  var dateNow = new Date();
  var formattedDate = dateNow.toLocaleString();

  firebase.firestore().collection("Classes").doc(numberClass).collection("Announcements").doc().set({
    "title": messageTitle,
    "message": messageText,
    "date": dateNow,
    "timestamp": dateNow.toLocaleString().toString(),
  }).then(() => {
    window.location.reload()
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

function getAnnouncementForClass(code) {
  var _ref = firebase.firestore().collection('Classes').doc(code).collection('Announcements')
  
  _ref.get().then(function(doc) {
    var index = 0;

    doc.forEach(snapshot => {
      index = index + 1
      var data = snapshot.data()
      var date = data["timestamp"]
      var message = data["message"]
      var title = data["title"]
      var announcementId = snapshot.id
      console.log("THING:" + announcementId)

      output = `
      <div class="col-xl-12 col-md-6 mb-4">
                <div class="card border-left-success" style = 'height: max-content'>
                      <div class="card-body">
                        <h4 class="badge badge-info">${date}</h4>

                        <h5 style = 'font-weight: 700; margin: 2px; style = 'overflow: hidden; text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 1; /* number of lines to show /
                        -webkit-box-orient: vertical;''>${title}</h5>

                        <p style = '   overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 1; / number of lines to show */
                        -webkit-box-orient: vertical;'>${message}</p>
                        <h3><i class="fa fa-trash" aria-hidden="true" onclick = "deleteAnnouncement('${announcementId}', '${code}')"></i></h3>


                      </div>
                    </div>

                    </div>
      `
      
      $(output).appendTo('#classAnnouncement')
    })

    if(index == 0){

      document.getElementById('send_announcement_top_classPage').style.display = 'none'
      var noAnnouncementsHTML = `
      <div class="d-flex justify-content-center" style="margin-top: 10%;">
      <img src="/teacher/img/undraw_popular_7nrh.svg" alt="" width="20%">
  </div>
  <center style="margin-top: 1%;">
      <h2>No Announcements</h2>
      <p>Click Send Announcement to create a announcement</p>

      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo">Send Announcement</button>

  </center>
      `;

      document.getElementById('classAnnouncement').innerHTML = noAnnouncementsHTML
    }
  })
}

function showSendAnnouncementModal(){
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
        <form>
          <div class="form-group">
            <label for="recipient-name" class="col-form-label">Recipient:</label>
            <div class="form-group" style="padding-left: 10px; padding-right: 10px;">
              <label for="message-text" class="col-form-label">Class Number:</label>
              <input class="form-control" id="numberClass" type="number"></input>
            </div>
          </div>
      </div>
      <div class="form-group" style="padding-left: 10px; padding-right: 10px;">
        <label for="message-text" class="col-form-label">Title:</label>
        <input class="form-control" id="messageTitle" maxlength="100"></input>
      </div>
      <div class="form-group" style="padding-left: 10px; padding-right: 10px;">
        <label for="message-text" class="col-form-label">Message:</label>
        <textarea class="form-control" id="messageText"></textarea>
      </div>
      <center>
        <div style="height: 30px;"></div>
        <button class="btn btn-primary" onclick="writeAnnouncement()" data-dismiss="modal" style="width: 200px;">Send
          Announcement</button>
          <div style="height: 30px;"></div>
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

function getMeetingForClass(code) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var name = user.displayName;
      var email = user.email;

      var index = 0;

      document.getElementById('meetingsListforClassPage').innerHTML = '';

      firebase.firestore().collection('UserData').doc(email).collection('Meetings').where('Class', '==', code).orderBy('Timestamp', "desc").get().then(function(doc) {
        doc.forEach(snapshot => {
          index  = index + 1
          var data = snapshot.data();
          var classForMeeting = data["Class"]
          var date = data["Date"];
          var title = data["Title"];
          var message = data["message"]
          var length = data["len"]
          var recipient = data["Recipient"]

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
  firebase.firestore().collection('UserData').doc(recipient).collection('Meetings').where('Class', '==', meetingClass).where('Date', '==', date).where('Title', '==', title).get().then(snap => {
    snap.forEach(doc => {
      console.log(doc.data())
      doc.ref.delete()
    })
  }).then(() => {
    getMeetingForClass(meetingClass)
  });

  });


}


function getClassDataDropdown() {
  var emailRef = localStorage.getItem("email")
  var classesList = [];

  firebase.firestore().collection('UserData').doc(emailRef).collection("Classes").get().then(function (doc) {
    doc.forEach(snapshot => {
      var data1 = snapshot.data();

      var classCode = data1["class code"];
      var className = data1["class name"];

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
      var course = document.getElementById("course").value;
      var teacher = document.getElementById("teacher").value;
      var classImg = document.getElementById("imageInput").value;
      var courseDescription = document.getElementById("courseDescription").value;
      var courseVideo = localStorage.getItem("videoLink");
      var teachersNote = document.getElementById("teachersNote").value;
      var classCreator = localStorage.getItem("email")
      var maxInactiveDaysInput = document.getElementById('max-inactive-days').value
      var maxInactiveDays = Number(maxInactiveDaysInput)

      if(maxInactiveDays <= 14){
    
        firebase.firestore().collection("UserData").doc(classCreator).collection("Classes").doc(code).set({
          "class code": code,
          "class name": className,
          "Course": course,
          "teacher": teacher,
          "classImg": classImg,
          "courseDescription": courseDescription,
          "courseVideo": courseVideo,
          "teachersNote": teachersNote,
          "max days inactive": maxInactiveDays,
          "teacher email" : email,
          "allow join": true
      
        });
      
        firebase.firestore().collection("Classes").doc(code).set({
          "class code": code,
          "class name": className,
          "Course": course,
          "teacher": teacher,
          "classImg": classImg,
          "courseDescription": courseDescription,
          "courseVideo": courseVideo,
          "teachersNote": teachersNote,
          "teacher email" : email,
          "max days inactive": maxInactiveDays,
          "allow join": true
  
  
      
        }).then(() => {
          window.location = "dashboard.html"
        });
      } else {
        document.getElementById('feedbackError').innerText = "Max days inactive has to been between 1 and 14 days"
      }

}
})
}

function getStudentData(code) {

  var classInfoList = [];
  console.log(classInfoList);

  var className = '';

  firebase.firestore().collection('Classes').doc(code).get().then(function (doc) {
      var data = doc.data();

      className = data["class name"];

    }).then(() => {
      firebase.firestore().collection('Classes').doc(code).collection("Students").get().then(function (doc) {
        doc.forEach(snapshot => {
          var data = snapshot.data();
    
          var reaction = data["reaction"];
          var studentName = data["name"];
          var studentEmail = data["email"];
          classInfoList.push([studentName, reaction, studentEmail])
          console.log(classInfoList)
    
        });
    
        document.getElementById("studentTable").innerHTML = "";
    
        for (var i = 0; i <= classInfoList.length; i++) {
          let descriptionOutput = "";
          classInfoData = classInfoList[i];
          var happy = '<h1 class="icon-hover" style = "font-size: 70px;"  style="color: green;">&#128513;</h1>';
          var meh = '<h1  class="icon-hover" style = "margin-left: 20px; font-size: 70px;"  style="color: yellow;">&#128533;</h1>';
          var sad = '<h1  class="icon-hover" style = "font-size: 70px;">&#128545;</h1>'
    
          if (classInfoData != null || classInfoData != undefined) {
            console.log("works")
            var studentName = classInfoData[0];
    
            var studentReaction = classInfoData[1];
    
            var studentEmail = classInfoData[2];
            console.log(classInfoData)
    
            descriptionOutput2 = `
          <tr role = "row" class = "odd">
          <td>${studentName}</td>
          <td>${studentEmail}</td>
          <td><center><div id = "face"></center></div></td>
          <td>2011/04/25</td>
          <td>
          <div class = 'row' style = 'margin-left: 10px'>
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal${i}" data-whatever="@mdo" style = "height: 50px; margin-right: 20px; margin-top: 15px">Schedual Meeting</button>
          <a href = '/teacher/chats/${code}/${studentEmail}?'><i class="fas fa-comments" style = 'font-size: 40px; margin-top: 20px'></i></a>
          </div>
         
          </td>
          </tr>
          `;
    
            happy_face_Column = `
          <tr "row" class = "odd">
          <td>${studentName}</td>
          <td>${studentEmail}</td>
          <td><h1 class="icon-hover" style = "margin-left: 20px; font-size: 70px;"  style="color: green;">&#128513;</h1></td>
          <td>2011/04/25</td>
          <td>
          <div class = 'row' style = 'margin-left: 10px'>
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal${i}" data-whatever="@mdo" style = "height: 50px; margin-right: 20px; margin-top: 15px">Schedual Meeting</button>
          <a href = '/teacher/chats/${code}/${studentEmail}?'><i class="fas fa-comments" style = 'font-size: 40px; margin-top: 20px'></i></a>  
          </div>
          </td>
          </tr>
          `;
    
            meh_colum_face = `
          <tr "row" class = "odd">
          <td>${studentName}</td>
          <td>${studentEmail}</td>
          <td><h1  class="icon-hover" style = "margin-right: 20px; margin-left: 20px; font-size: 70px;"  style="color: yellow;">&#128533;</h1></td>
          <td>2011/04/25</td>
          <td>
          <div class = 'row' style = 'margin-left: 10px'>
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal${i}" data-whatever="@mdo" style = "height: 50px; margin-right: 20px; margin-top: 15px">Schedual Meeting</button>
          <a href = '/teacher/chats/${code}/${studentEmail}?'><i class="fas fa-comments" style = 'font-size: 40px; margin-top: 20px'></i></a>  
          </div>
          </td>
          </tr>
          `;
    
            frustrated_column_face = `
          <tr "row" class = "odd">
          <td>${studentName}</td>
          <td>${studentEmail}</td>
          <td><h1  class="icon-hover" style = "margin-right: 20px; font-size: 70px;">&#128545;</h1></td>
          <td>2011/04/25</td>
          <td>
          <div class = 'row' style = 'margin-left: 10px'>
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal${i}" data-whatever="@mdo" style = "height: 50px; margin-right: 20px; margin-top: 15px">Schedual Meeting</button>
          <a href = '/teacher/chats/${code}/${studentEmail}?'><i class="fas fa-comments" style = 'font-size: 40px; margin-top: 20px'></i></a>  
          </div>          
          </td>
          </tr>
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
    })


}


function schedualMeeting(emailStudent, course, code, index) {
  console.log("schedual meeting")

  var nameLocal = localStorage.getItem("email");
  var meetingTitle = document.getElementById("title1" + index).value;
  var meetingDate = document.getElementById("date" + index).value;
  var meetingMessage = document.getElementById("message" + index).value;
  var len = document.getElementById("len" + index).value;
  var dateNow = new Date();
  var formattedDate = dateNow.toLocaleString();

  firebase.firestore().collection('UserData').doc(emailStudent).collection("Meetings").doc().set({
    "Title": meetingTitle,
    "Date": meetingDate,
    "Class": code,
    "Course": course,
    "Timestamp": dateNow.toString(),
    "message" : meetingMessage,
    "Recipient": emailStudent,
    "len" : len
  }).then(() => {
    firebase.firestore().collection('UserData').doc(nameLocal).collection("Meetings").doc().set({
      "Title": meetingTitle,
      "Date": meetingDate,
      "Class": code,
      "Course": course,
      "Timestamp": dateNow.toString(),
      "message" : meetingMessage,
      "Recipient": emailStudent,
      "len" : len
    }).then(() => {
      window.location.reload()
    });
  });



}

function showGreat() {
  document.getElementById('studentTable').style.display = "none";
  document.getElementById('allStudentsTable').style.display = "none";
  document.getElementById("doing-good-table-section").style.display = "initial";
  document.getElementById("meh-table-section").style.display = "none";
  document.getElementById("frustrated-table-section").style.display = "none";

}

function showHelp() {

  document.getElementById('studentTable').style.display = "none";
  document.getElementById('allStudentsTable').style.display = "none";
  document.getElementById("doing-good-table-section").style.display = "none";
  document.getElementById("meh-table-section").style.display = "initial";
  document.getElementById("frustrated-table-section").style.display = "none";
}

function showFrustrated() {
  document.getElementById('studentTable').style.display = "none";
  document.getElementById('allStudentsTable').style.display = "none";
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

function getEditData(code) {
  output = ''

  firebase.firestore().collection('Classes').doc(code).get().then(function (doc) {

    var data = doc.data();
    return data;


  }).then((data) => {
    var className = data['class name'];
    document.getElementById("className").innerHTML = `<h1>${className} <span class = "badge badge-primary">${code}</span></h1>`

    var course = data['Course']
    var teacherNote = data['teachersNote']
    var description = data['courseDescription']
    var inactiveDays = data['max days inactive']
    output += `

    <h6>Edit Class Name</h6>

  <div class="input-group mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text" id="basic-addon1">
    <i class="fa fa-pencil" aria-hidden="true" onclick = "editTitle()"></i>
    </span>
  </div>

  <input type="text" class="form-control" aria-label="Username" aria-describedby="basic-addon1" name="editName" id="editName" value = '${className}'>
</div>
<h6>Edit Class Course</h6>

<div class="input-group mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text" id="basic-addon1">
    <i class="fa fa-pencil" aria-hidden="true" onclick = "editTitle()"></i>
    </span>
  </div>

  <input type="text" class="form-control" value="${course}" aria-label="Username" aria-describedby="basic-addon1" name="editCourse" id="editCourse">
</div>
<h6>Edit Class Description</h6>

<div class="input-group mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text" id="basic-addon1">
    <i class="fa fa-pencil" aria-hidden="true" onclick = "editTitle()"></i>
    </span>
  </div>

  <input type="text" class="form-control" value="${description}" aria-label="Username" aria-describedby="basic-addon1" name="editDescription" id="editDescription">
</div>

<h6>Edit Teacher's Note</h6>

<div class="input-group mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text" id="basic-addon1">
    <i class="fa fa-pencil" aria-hidden="true" onclick = "editTitle()"></i>
    </span>
  </div>

  <input type="text" class="form-control" value="${teacherNote}" aria-label="Username" aria-describedby="basic-addon1" name="editTeacherNote" id="editTeacherNote">
</div>

<h6>Set the minimum number of days for you students to choose a mood.  Students who dont select will shod up as a gray color on your graph.</h6>

<div class="input-group mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text">Days</span>
    <span class="input-group-text">1-14</span>
  </div>
  <input type="number" class="form-control" aria-label="Number of Days" min="1" max = "14" id="maxDays" placeholder = ${inactiveDays}>
</div>

<p style = "color: red; font-weight: 700" id = "error-feedback-edit-class"></p>

<button class="btn btn-primary" onclick="updateDetails('${code}')">Update Class Details</button>

  `
    $(output).appendTo("#editInfo");   
  })
}

function updateDetails(code) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var email = user.email;
      console.log(email)

  var newName = document.getElementById('editName').value;
  var newCourse = document.getElementById('editCourse').value;
  var newDescription = document.getElementById('editDescription').value;
  var teachersNote = document.getElementById('editTeacherNote').value;
  var maxDays = document.getElementById('maxDays').value;
  let maxDaysNum = parseInt(maxDays);

  console.log(newName, newCourse, newDescription, maxDays, teachersNote)

  if(newName, newCourse, newDescription, maxDaysNum, teachersNote != null && newName, newCourse, newDescription, maxDaysNum, teachersNote != ""){

    if(maxDaysNum > 14){
      var feedbackError = document.getElementById('error-feedback-edit-class');

      feedbackError.innerHTML = 'The max inactive days has to be less than or equal to 14 days'
    } else {
      var feedbackError = document.getElementById('error-feedback-edit-class');

      feedbackError.innerHTML = ''
  
      firebase.firestore().collection('UserData').doc(email).collection('Classes').doc(code).update({
        "class name": newName,
        "Course": newCourse,
        "courseDescription": newDescription,
        "teachersNote": teachersNote,
        "max days inactive": maxDaysNum,
    
      }).then(() => {
        firebase.firestore().collection('Classes').doc(code).update({
          "class name": newName,
        "Course": newCourse,
        "courseDescription": newDescription,
        "teachersNote": teachersNote,
        "max days inactive": maxDaysNum,
    
    
        }).then(() => {
          window.location.reload()
        });
      });
    
    }

  } else {
    console.log("Feilds blank")
    var feedbackError = document.getElementById('error-feedback-edit-class');

    feedbackError.innerHTML = 'You cannot leave any fields blank'
  }
}
})
};


function getChartData(code) {
  
  //console.log("GETTING PIE CHART DEMO");

  var index = 0;


      firebase.firestore().collection('Classes').doc(code).collection("Students").onSnapshot(function (doc) {

        //document.getElementById('studentReportHeadline').innerHTML = "Student Report - " + code;

        var studentsReactionLists = [0,0,0];

        doc.forEach(snapshot => {
          index = index + 1
            var data1 = snapshot.data();

            var reaction = data1["status"];

            if(reaction == "doing great"){
              studentsReactionLists[0] = studentsReactionLists[0] + 1;
            }
    
            if(reaction == "need help"){
              studentsReactionLists[1] = studentsReactionLists[1] + 1;
            }
    
            if(reaction == "frustrated"){
              studentsReactionLists[2] = studentsReactionLists[2] + 1;
            }
        });
        setTimeout(function(){

          if(studentsReactionLists[0] == 0 && studentsReactionLists[1] == 0 && studentsReactionLists[2] == 0){

            var noStudentsHTML = `
            <center style = 'margin-top: 10%'>
              <img src = 'img/undraw_empty_xct9.svg' width = "50%" />
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
          }
    
        
       }, 700);
    });
}

function storeGraphReactionsCode(code, event = "none"){
  localStorage.setItem('graphClassCode', code)

  if(event == "onclick"){
    window.location.reload()
  }
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

    if(pageType == 'dashboard'){

      var announcementsCount = 0;

      for (let i = 0; i <= classesListCodes.length; i++) {
        var classcode = classesListCodes[i];
  
        if (classcode != undefined && classcode != null) {
  
          firebase.firestore().collection('Classes').doc(classcode).collection("Announcements").orderBy("Timestamp").limitToLast(3).get().then(function (doc) {
  
  
            doc.forEach(snapshot => {
  
              var annoucementData = snapshot.data();
  
              if (annoucementData != undefined && annoucementData != null) {
                outputAnnouncements = "";
  
                announcementsCount += 1;

  
                var title = annoucementData["Title"];
                var message = annoucementData["Message"];
                var date = annoucementData['Date'];

  
                var nameClass = classnamesList[i];
  
                outputDashboard = `

                <div class="col-xl-12 col-md-6 mb-4">
                <div class="card border-left-success" style = 'height: max-content'>
                      <div class="card-body">
                        <h4 class="badge badge-info">${nameClass}</h4>

                        <h5 style = 'font-weight: 700; margin: 2px; style = 'overflow: hidden; text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 1; /* number of lines to show */
                        -webkit-box-orient: vertical;''>${title}</h5>

                        <p style = '   overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 1; /* number of lines to show */
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
  
          firebase.firestore().collection('Classes').doc(classcode).collection("Announcements").get().then(function (doc) {
  
  
            doc.forEach(snapshot => {
  
              var annoucementData = snapshot.data();
  
              if (annoucementData != undefined && annoucementData != null) {
                outputAnnouncements = "";
  
                announcementsCount += 1;
  
  
                var title = annoucementData["Title"];
                var message = annoucementData["Message"];
                var date = annoucementData['Date'];
  
                var nameClass = classnamesList[i];
  
                outputAnnouncements = `
                <div class="col-xl-6 col-md-6 mb-4">
                <div class="card border-left-primary shadow h-100 py-2">
                  <div class="card-body">
                    <div class="row no-gutters align-items-center">
                      <div class="col mr-2">
                        <h4 class="badge badge-info">${nameClass}</h4>

                        <h4 style = 'font-weight: 700; margin: 2px'>${title}</h4>

                        <p style = 'color: gray'>${message}</p>
  
                        <div class="h6 mb-0" style = "color: #a2a39b">${date}</div>
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

function getMessagesForChat_chatPage_teacher(classCode, studentEmail){
  console.log("Getting messages")

  classCodeChat = classCode

  var lastID = '';

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var email = user.email;

      firebase.firestore().collection('Class-Chats').doc(classCode).collection(studentEmail).orderBy('timestamp').get().then(snap => {
        snap.forEach(doc => {
          var data = doc.data();
    
          lastID = doc.id
    
          var message = data.message;
          var time = data.timestamp;
    
          var user = data.user
    
          var formattedTime = new Date(time).toLocaleString()
    
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
                <p>${formattedTime}</p>
              </div>
              <p style="width: 100%;">${message}</p>
            </div>
          </div>
          <hr>
        </div>
        `
    
          $(messageHTML).appendTo('#message-components')
    
          
        })
    
      }).then(() => {
        scrollSmoothToBottom()
    
          firebase.firestore().collection('Class-Chats').doc(classCode).collection(studentEmail).orderBy('timestamp').limitToLast(1).onSnapshot(snap => {
            snap.forEach(doc => {
              var data = doc.data();
    
              if (doc.id != lastID){
                var message = data.message;
                var time = data.timestamp;
          
                var user = data.user
    
                var formattedTime = new Date(time).toLocaleString()
    
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
                      <p>${formattedTime}</p>
                    </div>
                    <p style="width: 100%;">${message}</p>
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

function sendMessage_ChatPage_teacher(classCode, studentEmail){
  console.log("Message queued")
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var email = user.email;
      var name = user['displayName'];

      var message = document.getElementById('message-input').value
    
      firebase.firestore().collection('Class-Chats').doc(classCode).collection(studentEmail).doc().set({
          "message": message,
          "user": name,
          "timestamp": new Date().getTime()
    
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


