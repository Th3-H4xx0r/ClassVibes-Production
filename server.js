const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const firebase = require('firebase');
const ejs = require('ejs')
var http = require('http').createServer(app);
var socket = require('socket.io-client')('https://api-v1.classvibes.net');


////////////////////////////////////////
//----------GLOBAL VARIABLES -----------
////////////////////////////////////////
var serverStatus = true


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
  if(serverStatus){
    res.sendFile(path.join(__dirname+'/app/authentication/studentLogin.html'));
  } else {
    res.sendFile(path.join(__dirname+'/serverDown.html'));
  }
});

router.get('/login-teacher',function(req,res){
  if(serverStatus){
    res.sendFile(path.join(__dirname+'/app/authentication/teacherLogin.html'));

  } else {
    res.sendFile(path.join(__dirname+'/serverDown.html'));
  }
});

router.get('/login-district',function(req,res){
  if(serverStatus){
    res.sendFile(path.join(__dirname+'/app/authentication/districtLogin.html'));

  } else {
    res.sendFile(path.join(__dirname+'/serverDown.html'));
  }
  });

router.get('/login',function(req,res){
  if(serverStatus){
    res.sendFile(path.join(__dirname+'/app/authentication/loginOptions.html'));

  } else {
    res.sendFile(path.join(__dirname+'/serverDown.html'));
  }
});

router.get('/signup',function(req,res){
  if(serverStatus){
    res.sendFile(path.join(__dirname+'/app/authentication/signup.html'));

  } else {
    res.sendFile(path.join(__dirname+'/serverDown.html'));
  }
  });

/////////////////////////
//Student Portal Paths
/////////////////////////
router.get('/student/dashboard',function(req,res){
  if(serverStatus){
    res.sendFile(path.join(__dirname+'/app/studentPortal/studentDashboard.html'));

  } else {
    res.sendFile(path.join(__dirname+'/serverDown.html'));
  }
});

router.get('/student/add',function(req,res){
  if(serverStatus){
    res.sendFile(path.join(__dirname+'/app/studentPortal/addClassStudentPortal.html'));

  } else {
    res.sendFile(path.join(__dirname+'/serverDown.html'));
  }
});

router.get('/student/announcements',function(req,res){
  if(serverStatus){
    res.sendFile(path.join(__dirname+'/app/studentPortal/announcementsPageStudentPortal.html'));

  } else {
    res.sendFile(path.join(__dirname+'/serverDown.html'));
  }
});

router.get('/student/meetings',function(req,res){
  if(serverStatus){
    res.sendFile(path.join(__dirname+'/app/studentPortal/meetingsPageStudentPortal.html'));

  } else {
    res.sendFile(path.join(__dirname+'/serverDown.html'));
  }
});

router.get('/student/chat',function(req,res){
  if(serverStatus){
    res.sendFile(path.join(__dirname+'/app/studentPortal/chatPageStudentPortal.html'));

  } else {
    res.sendFile(path.join(__dirname+'/serverDown.html'));
  }
});

router.get('/student/classes/:class',function(req,res){
  if(serverStatus){
    var classCode = req.params.class
    res.render(path.join(__dirname+'/app/studentPortal/classPageStudent.ejs'), {code: classCode})
  } else {
    res.sendFile(path.join(__dirname+'/serverDown.html'));
  }
  
});

router.get('/student/login',function(req,res){
  if(serverStatus){
    res.redirect('/login');

  } else {
    res.sendFile(path.join(__dirname+'/serverDown.html'));
  }
  });

  
router.get('/student/serverDown',function(req,res){
  if(serverStatus){
    res.redirect('/serverDown');

  } else {
    res.sendFile(path.join(__dirname+'/serverDown.html'));
  }
  });

/////////////////////////
//Teacher Portal Paths
/////////////////////////

router.get('/teacher/dashboard',function(req,res){
  if(serverStatus){
    res.sendFile(path.join(__dirname+'/app/teacherPortal/dashboard.html'));

  } else {
    res.sendFile(path.join(__dirname+'/serverDown.html'));
  }
});

router.get('/teacher/class',function(req,res){
  if(serverStatus){
    res.sendFile(path.join(__dirname+'/app/teacherPortal/classPage.html'));

  } else {
    res.sendFile(path.join(__dirname+'/serverDown.html'));
  }
});

router.get('/teacher/create-class',function(req,res){
  if(serverStatus){
    res.sendFile(path.join(__dirname+'/app/teacherPortal/createClass.html'));

  } else {
    res.sendFile(path.join(__dirname+'/serverDown.html'));
  }
});

router.get('/teacher/announcements',function(req,res){
  if(serverStatus){
    res.sendFile(path.join(__dirname+'/app/teacherPortal/announcementTeacher.html'));

  } else {
    res.sendFile(path.join(__dirname+'/serverDown.html'));
  }
  });

router.get('/teacher/meetings',function(req,res){
  if(serverStatus){
    res.sendFile(path.join(__dirname+'/app/teacherPortal/meetingsPage.html'));

  } else {
    res.sendFile(path.join(__dirname+'/serverDown.html'));
  }
});

router.get('/teacher/students-requests',function(req,res){
  if(serverStatus){
    res.sendFile(path.join(__dirname+'/app/teacherPortal/studentRequest.html'));

  } else {
    res.sendFile(path.join(__dirname+'/serverDown.html'));
  }
});

router.get('/teacher/classes/:class',function(req,res){
  if(serverStatus){
    var classCode = req.params.class
    res.render(path.join(__dirname+'/app/teacherPortal/classPage.ejs'), {code: classCode})
  } else {
    res.sendFile(path.join(__dirname+'/serverDown.html'));
  }
  
});

router.get('/teacher/chats/:classCode/:studentEmail',function(req,res){
  if(serverStatus){
    var classCode = req.params.classCode
    var studentEmail = req.params.studentEmail
  
  
    res.render(path.join(__dirname+'/app/teacherPortal/chatPageTeacher.ejs'), {code: classCode, email: studentEmail})
  } else {
    res.sendFile(path.join(__dirname+'/serverDown.html'));
  }

});

router.get('/teacher/login',function(req,res){
  if(serverStatus){
    res.redirect('/login');
  } else {
    res.sendFile(path.join(__dirname+'/serverDown.html'));
  }
  
  });


  router.get('/teacher/serverDown',function(req,res){
    if(serverStatus){
      res.redirect('/serverDown');
  
    } else {
      res.sendFile(path.join(__dirname+'/serverDown.html'));
    }
    });


/////////////////////////
//District Portal Paths
/////////////////////////

router.get('/district/dashboard',function(req,res){
  if(serverStatus){
    res.sendFile(path.join(__dirname+'/app/districtPortal/districtDashboard.html'));
    

  } else {
    res.redirect('/serverDown');  }
  });

  router.get('/district/create',function(req,res){
    if(serverStatus){
      res.sendFile(path.join(__dirname+'/app/districtPortal/createDistrict.html'));

    } else {
      res.redirect('/serverDown');
    }
    });


  router.get('/district/schools',function(req,res){
    if(serverStatus){
      res.sendFile(path.join(__dirname+'/app/districtPortal/manageSchools.html'));

  
    } else {
      res.redirect('/serverDown');

    }
    });

  router.get('/district/requests',function(req,res){
    if(serverStatus){
      res.sendFile(path.join(__dirname+'/app/districtPortal/teacherRequest.html'));

    } else {
      res.redirect('/serverDown');

    }
    });


  router.get('/district/school',function(req,res){
    if(serverStatus){
      res.sendFile(path.join(__dirname+'/app/districtPortal/viewSchool.html'));

  
    } else {
      res.redirect('/serverDown');

    }
    });


/////////////////////////
//Settings Pages Paths
/////////////////////////

router.get('/settings',function(req,res){
  if(serverStatus){
    res.sendFile(path.join(__dirname+'/app/settings/settings.html'));


  } else {
    res.redirect('/serverDown');

  }
  });

  router.get('/settings/payments',function(req,res){
    if(serverStatus){
      res.sendFile(path.join(__dirname+'/app/settings/payment.html'));
  
  
    } else {
      res.redirect('/serverDown');
  
    }
    });




router.get('/serverdown',function(req,res){
  res.sendFile(path.join(__dirname+'/serverDown.html'));
});

router.get('/legal',function(req,res){

  res.sendFile(path.join(__dirname+'/terms-conditions.html'));
});

router.get('/pricing',function(req,res){

  res.sendFile(path.join(__dirname+'/pricing.html'));
});

router.get('/privacy',function(req,res){

  res.sendFile(path.join(__dirname+'/privacy.html'));
});

router.get('/webRTC',function(req,res){

  res.sendFile(path.join(__dirname+'/app/liveClass/test.html'));
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
app.use('/district', express.static('app/districtPortal/'))

app.use('/teacher', express.static('app/teacherPortal/'))
app.use('/app', express.static('app/'))
app.use('/teacherjs', express.static('app/teacherPortal/js/'))
app.use('/teachercss', express.static('app/teacherPortal/css/'))
app.use('/404page', express.static('PageNotFound/'))
app.use('/socket.io', express.static('socket.io/'))
app.use('/settings', express.static('app/settings/'))

//add the router
app.use('/', router);
//app.listen(process.env.port || 3000);

socket.on('connect', function () {
  // socket connected
  socket.on('serverStatus', function(data) {
    console.log(data);

    if(data == false){
      serverStatus = false
  } else if(data == null || data == undefined){
      serverStatus = false
  } else if(data == true){
    serverStatus = true
  }
});
});


/////////////////////////
//HTTP SERVER LISTENER CONFIG
/////////////////////////

app.get('*', function(req, res){
  res.status(404).sendFile(path.join(__dirname+'/PageNotFound/404.html'));
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

