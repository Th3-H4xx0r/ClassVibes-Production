const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const firebase = require('firebase');

var http = require('http').createServer(app);
var io = require('socket.io')(http);


////////////////////////////////////////
//----------GLOBAL VARIABLES -----------
////////////////////////////////////////
var serverStatus = false;

var alertTitleGlobal = null
var alertMessageGlobal = null


router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

     
router.get('/index.html',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});
/////////////////////////////
//Auth Router Path
////////////////////////////
router.get('/login-student',function(req,res){
  res.sendFile(path.join(__dirname+'/app/authentication/studentLogin.html'));
});

router.get('/login-teacher',function(req,res){
  res.sendFile(path.join(__dirname+'/app/authentication/teacherLogin.html'));
});

router.get('/login',function(req,res){
res.sendFile(path.join(__dirname+'/app/authentication/loginOptions.html'));
});

/////////////////////////
//Student Portal Paths
/////////////////////////
router.get('/student/dashboard',function(req,res){
  res.sendFile(path.join(__dirname+'/app/studentPortal/studentDashboard.html'));
});

router.get('/student/add',function(req,res){
  res.sendFile(path.join(__dirname+'/app/studentPortal/addClassStudentPortal.html'));
});

router.get('/student/announcements',function(req,res){
  res.sendFile(path.join(__dirname+'/app/studentPortal/announcementsPageStudentPortal.html'));
});

router.get('/student/meetings',function(req,res){
  res.sendFile(path.join(__dirname+'/app/studentPortal/meetingsPageStudentPortal.html'));
});

router.get('/student/chat',function(req,res){
  res.sendFile(path.join(__dirname+'/app/studentPortal/chatPageStudentPortal.html'));
});

/////////////////////////
//Teacher Portal Paths
/////////////////////////
router.get('/teacher/dashboard',function(req,res){
  res.sendFile(path.join(__dirname+'/app/teacherPortal/dashboard.html'));
});

router.get('/teacher/class',function(req,res){
res.sendFile(path.join(__dirname+'/app/teacherPortal/classPage.html'));
});

router.get('/teacher/create-class',function(req,res){
res.sendFile(path.join(__dirname+'/app/teacherPortal/createClass.html'));
});

router.get('/teacher/meetings',function(req,res){
res.sendFile(path.join(__dirname+'/app/teacherPortal/meetingsPage.html'));
});

router.get('/teacher/students-requests',function(req,res){
res.sendFile(path.join(__dirname+'/app/teacherPortal/studentRequest.html'));
});

router.get('/test',function(req,res){
  res.sendFile(path.join(__dirname+'/test.html'));
});

router.get('/serverdown',function(req,res){
  res.sendFile(path.join(__dirname+'/serverDown.html'));
});



/////////////////////////
//FIREBBASE INIT
/////////////////////////
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

/////////////////////////
//LIVE SERVER STATUS
/////////////////////////
firebase.firestore().collection('Application Management').doc("ServerManagement").onSnapshot(function(result){



  var data = result.data()["serversAreUp"];

  if(data != false && data != null){
    console.log("new server status")
    serverStatus = true

  } else {
    console.log("new server status")
    serverStatus = false
  }

  io.emit('serverStatus', serverStatus); 
})

/////////////////////////
//LIVE SERVER ALERTS
/////////////////////////
firebase.firestore().collection('Application Management').doc("ServerAlerts").onSnapshot(function(result){

  var data = result.data();

  if(data == undefined || data == null){
    alertTitleGlobal = null
    alertMessageGlobal = null
  } else {
    console.log("new Alert")
    alertTitleGlobal = data.alertTitle;
    alertMessageGlobal = data.alertMessage;

    io.emit('serverAlertMessage', {alertTitle: alertTitleGlobal, alertMessage: alertMessageGlobal}); 
  }

  
})
  


/////////////////////////
//CLIENT CONNECTION HANDLER
/////////////////////////
io.on('connection', (socket) => {
  console.log('a user connected');
  io.emit('serverStatus', serverStatus); 
  io.emit('serverAlertMessage', {alertTitle: alertTitleGlobal, alertMessage: alertMessageGlobal}); 
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});





/////////////////////////
//STATIC ASSETS HANDLER
/////////////////////////
app.use('/css', express.static('css'))
app.use('/img', express.static('img'))
app.use('/js', express.static('js'))
app.use('/vendor', express.static('vendor'))
app.use('/authcss', express.static('app/authentication/css/'))
app.use('/authjs', express.static('app/authentication/js/'))
app.use('/authimg', express.static('app/authentication/img/'))
app.use('/student', express.static('app/studentPortal/'))

app.use('/teacher', express.static('app/teacherPortal/'))
app.use('/app', express.static('app/'))

app.use('/js', express.static('jsMain'))

//add the router
app.use('/', router);
//app.listen(process.env.port || 3000);


/////////////////////////
//HTTP SERVER LISTENER CONFIG
/////////////////////////
http.listen(3000, () => {
  console.log('listening on *:3000');
});

