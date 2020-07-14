const express = require('express');
const app = express();
const fs = require('fs')
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



app.get('/classes/:class', function(req, res) {
    var username = req.params.class;

    const html = fs.readFileSync( __dirname + '/test.html' );
    res.json({html: html.toString(), data: username});
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
app.use('/student', express.static('app/studentPortal/'))

app.use('/teacher', express.static('app/teacherPortal/'))
app.use('/app', express.static('app/'))

app.use('/js', express.static('jsMain'))

//add the router
app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');