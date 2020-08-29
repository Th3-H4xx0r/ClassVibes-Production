var nameGlobal = ''

function getProfileData(){

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
          var name = user.displayName;
          var pic = user.photoURL;
          var email = user.email

          nameGlobal = name
    
          document.getElementById('nameInputField').value = name
          document.getElementById('emailInputField').value = email
          //document.getElementById('nameInputField').value = ''

    
          var outputPic = ``;
    
          if(pic != null && pic != undefined && pic != ""){
              outputPic = `<img class="vl" src="${pic}">`;
          } else {
              outputPic = `<img class="vl" src="https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144849704.jpg">`;
          }
        
         document.getElementById("profilePic").innerHTML = outputPic
    
        } else {
          console.log("user Signed out");
          
        }
      })


}

function nameChanged(name){

    if(nameGlobal != name){
        var saveButtonHTML = `<button class="btn btn-primary" style="width: 100%;">Save</button>`

        document.getElementById('saveButtonField').innerHTML = saveButtonHTML
    } else {
        document.getElementById('saveButtonField').innerHTML = ""
    }
}

function changeUserName(){

    var name = document.getElementById('nameInputField').value

    
}