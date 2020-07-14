function initializeFirebase(){
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
}


function getLiveSeverAlerts(){
    firebase.firestore().collection('Application Management').doc("ServerAlerts").onSnapshot(function(result){

        var data = result.data();

        if(data == undefined || data == null){
           
        } else {
          var title = data.alertTitle;
          var message = data.alertMessage;
  
          var toastHTML = `
          <!-- Modal -->
          <div class="modal fade" id="serverAlertModal" tabindex="-1" role="dialog" aria-labelledby="serverAlertModal" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel"><i class="fas fa-cloud"></i> Server Alert</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <h1>${title}</h1>
                  <p>${message}</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
          
          `;

          $(toastHTML).appendTo('#page-top');
  
          $('#serverAlertModal').modal('show')
        }

        console.log(data);
    });
}

function getServerStatus(){
  firebase.firestore().collection('Application Management').doc("ServerManagement").onSnapshot(function(result){

      var data = result.data()["serversAreUp"];

      if(data == false || data == null){
          window.location = "../../../serverDown.html";
      } 
      
  });
}

function checkUserAuthStatus(){
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
          // User just signed in, we should not display dialog next time because of firebase auto-login
          console.log("Firebase" + user.email);

          email = user.email;

        } else {
          // User just signed-out or auto-login failed, we will show sign-in form immediately the next time he loads the page

          console.log("user Signed out");

          window.location = "../authentication/loginOptions.html";
          
          // Here implement logic to trigger the login dialog or redirect to sign-in page, if necessary. Don't redirect if dialog is already visible.
          // e.g. showDialog()
        }
      })
}

function logout(){
    firebase.auth().signOut().then(function() {
      localStorage.clear();

        window.location = "../authentication/loginOptions.html";
      }, function(error) {
        console.log(error);
      });
}


function liveServerRedirects(){
  firebase.firestore().collection('Application Management').doc("ServerManagement").onSnapshot(function(result){

    var data = result.data()["serversAreUp"];

    if(data == true){
        window.location = "app/authentication/loginOptions.html";
    } 
    
});
}
