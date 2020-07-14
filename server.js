const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

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



app.get('/test/:username', function(req, res) {
    var username = req.params.username;

    res.sendFile(path.join(__dirname+'/test.html'));
    //get user's stories from database using the username
})




//Add assets
app.use('/css', express.static('css'))
app.use('/img', express.static('img'))
app.use('/js', express.static('js'))
app.use('/vendor', express.static('vendor'))
app.use('/authcss', express.static('app/authentication/css/'))
app.use('/authjs', express.static('app/authentication/js/'))
app.use('/authimg', express.static('app/authentication/img/'))
app.use('/student', express.static('app/studentP