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
  
        var data = CryptoJS.AES.decrypt(message, AES_KEY);
  
        return data.toString();
  }


//FIRESTORE MIGRATED
function facebookLoginStudent() {
    base_provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(base_provider).then(function (result) {
        var user = result.user;
        var email = user.email;
        var name3 = user.displayName;
        var profilePic = user.photoURL;

        var errorMessage = document.getElementById('signupError');

        firebase.firestore().collection('UserData').doc(email).get().then(function (doc) {
            if (doc.exists) {
                var accountType = doc.data()["account type"];


                if (accountType != null) {
                    if (accountType == "Student") {

                        //localStorage.setItem("email", email);

                        window.location = "/student/dashboard";
                    } else {

                        errorHTML = `<div class="alert alert-danger" role="alert" 
                style="margin-top: 20px; width: 94%; margin-left: 6%;">
                <strong>Oops! </strong> This account was signed up as a ${accountType} account. You do not have sufficient permissions.
            </div>`;

                        document.getElementById('signupError').innerHTML = errorHTML;

                    }
                } else {

                    errorHTML = `<div class="alert alert-danger" role="alert" 
            style="margin-top: 20px; width: 94%; margin-left: 6%;">
                 <strong>Oops! </strong> This account is not yet registered. <a href = "/signup">Sign Up</a>
           </div>`;

                    document.getElementById('signupError').innerHTML = errorHTML;
                }


            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });

    }).catch(function (err) {

        var errorMessage = document.getElementById('signupError');

        console.log(err)
        console.log("Facebook Sign In Failed");

        if (err.code == "auth/account-exists-with-different-credential") {
            errorHTML = `<div class="alert alert-danger" role="alert" 
            style="margin-top: 20px; width: 94%; margin-left: 6%;">
            <strong>Oops! </strong> An account with this email is already registered.
        </div>`;

            errorMessage.innerHTML = errorHTML;
        }
    })
}


//FIRESTORE MIGRATED
function facebookLoginDistrict() {
    base_provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(base_provider).then(function (result) {
        var user = result.user;
        var email = user.email;
        var name3 = user.displayName;
        var profilePic = user.photoURL;

        var errorMessage = document.getElementById('signupError');

        firebase.firestore().collection('UserData').doc(email).get().then(function (doc) {

            var accountType = doc.data()["account type"];

            if (accountType != null) {
                if (accountType == "District") {
                    console.log('Login Success');

                    //localStorage.setItem("email", email);
                    window.location = "/district/dashboard";
                } else {

                    errorHTML = `<div class="alert alert-danger" role="alert" 
                        style="margin-top: 20px; width: 94%; margin-left: 6%;">
                        <strong>Oops! </strong> This account was signed up as a ${accountType} account. You do not have sufficient permissions.
                    </div>`;

                    document.getElementById('signupError').innerHTML = errorHTML;

                }
            } else {

                errorHTML = `<div class="alert alert-danger" role="alert" 
            style="margin-top: 20px; width: 94%; margin-left: 6%;">
                 <strong>Oops! </strong> This account is not yet registered. <a href = "/signup">Sign Up</a>
           </div>`;

                document.getElementById('signupError').innerHTML = errorHTML;
            }

        }).catch(function (error) {
            console.log("Error getting document:", error);
        });




    }).catch(function (err) {

        var errorMessage = document.getElementById('signupError');

        console.log(err)
        console.log("Facebook Sign In Failed");

        if (err.code == "auth/account-exists-with-different-credential") {
            errorHTML = `<div class="alert alert-danger" role="alert" 
            style="margin-top: 20px; width: 94%; margin-left: 6%;">
            <strong>Oops! </strong> An account with this email is already registered.
        </div>`;

            errorMessage.innerHTML = errorHTML;
        }
    })
}


//FIRESTORE MIGRATED WORKING
function facebookLoginTeacher() {
    base_provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(base_provider).then(function (result) {
        var user = result.user;
        var email = user.email;
        var name3 = user.displayName;
        var profilePic = user.photoURL;



        firebase.firestore().collection('UserData').doc(email).get().then(function (doc) {

            var accountType = doc.data()['account type'];


            if (accountType != null) {
                if (accountType == "Teacher") {

                    console.log('Login Success');
                    //localStorage.setItem("photo", profilePic);
                    //localStorage.setItem("email", email);
                    //localStorage.setItem("name", name3);

                    window.location = "teacher/dashboard";
                } else {

                    errorHTML = `<div class="alert alert-danger" role="alert" 
                        style="margin-top: 20px; width: 94%; margin-left: 6%;">
                        <strong>Oops! </strong> This account was signed up as a ${accountType} account. You do not have sufficient permissions.
                    </div>`;

                    document.getElementById('signupError').innerHTML = errorHTML;

                }
            } else {

                errorHTML = `<div class="alert alert-danger" role="alert" 
            style="margin-top: 20px; width: 94%; margin-left: 6%;">
                 <strong>Oops! </strong> This account is not yet registered. <a href = "/signup">Sign Up</a>
           </div>`;

                document.getElementById('signupError').innerHTML = errorHTML;
            }

        }).catch(function (error) {
            console.log("Error getting document:", error);
        });



    }).catch(function (err) {

        var errorMessage = document.getElementById('signupError');

        console.log(err)
        console.log("Facebook Sign In Failed");

        if (err.code == "auth/account-exists-with-different-credential") {
            errorHTML = `<div class="alert alert-danger" role="alert" 
            style="margin-top: 20px; width: 94%; margin-left: 6%;">
            <strong>Oops! </strong> An account with this email is already registered.
        </div>`;

            errorMessage.innerHTML = errorHTML;
        }
    })
}


//FIRESTORE MIGRATED SHOULD WORK?
googleSignInStudent = () => {
    console.log('this is executing');

    base_provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(base_provider).then(function (result) {
        var user = result.user;
        var email = user.email;
        var name3 = user.displayName;
        var profilePic = user.photoURL;

        firebase.firestore().collection('UserData').doc(email).get().then(function (doc) {

            console.log("data from doc : ", doc.data());

            var data = doc.data();

            if(data != undefined){

                var accountType = data['account type']

                if (accountType != undefined) {
                    if (accountType == "Student") {
                        console.log('Login Success');
    
                        window.localStorage.setItem("clientType", '35TK-KSMY-C7NR-2CEF');

                        const url = `https://api-v1.classvibes.net/api/authLogger?email=${email}&platform=web`

                        $.get(url, function(data, status){
                            //console.log(data)
                            window.location = "/student/dashboard";
                        })
    
    
                    } else {
    
                        errorHTML = `<div class="alert alert-danger" role="alert" 
                         style="margin-top: 20px; width: 94%; margin-left: 6%;">
                          <strong>Oops! </strong> This account was signed up as a ${accountType} account. You do not have sufficient permissions.
                    </div>`;
    
                        document.getElementById('signupError').innerHTML = errorHTML;
    
                    }
                } else {
    
                    errorHTML = `<div class="alert alert-danger" role="alert" 
                       style="margin-top: 20px; width: 94%; margin-left: 6%;">
                            <strong>Oops! </strong> This account is not yet registered. <a href = "/signup">Sign Up</a>
                      </div>`;
    
                    document.getElementById('signupError').innerHTML = errorHTML;
    
                }
            } else {
                errorHTML = `<div class="alert alert-danger" role="alert" 
                style="margin-top: 20px; width: 94%; margin-left: 6%;">
                 <strong>Oops! </strong> Google login failed. This account might not be registered yet. <a href = "/signup">Sign Up</a>
           </div>`;

               document.getElementById('signupError').innerHTML = errorHTML;
            }

        }).catch(function (error) {
            console.log("Error getting document:", error);
        });

    });

}


//FIRESTORE MIGRATED WORKING
googleSignInTeacher = () => {
    base_provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(base_provider).then(function (result) {
        var user = result.user;
        var email = user.email;
        var name3 = user.displayName;
        var profilePic = user.photoURL;



        var errorMessage = document.getElementById('signupError');



        firebase.firestore().collection('UserData').doc(email).get().then(function (doc) {


           // localStorage.setItem("email", email);

            console.log("data from doc : ", doc.data());

            if (doc.exists) {
                var accountType = doc.data()['account type'];
                console.log("Document data:", doc.data()["account type"]);

                if (accountType != null) {
                    if (accountType == "Teacher" || accountType == 'Solo Teacher') {
                        console.log('Login Success');

                        window.localStorage.setItem("clientType", '9HX4-5H7Y-4CEH-UKPT');

                        const url = `https://api-v1.classvibes.net/api/authLogger?email=${email}&platform=web`

                        $.get(url, function(data, status){
                            //console.log(data)
                            window.location = "teacher/dashboard";
                        })
    

                        
                    } else {

                        errorHTML = `<div class="alert alert-danger" role="alert" 
                        style="margin-top: 20px; width: 94%; margin-left: 6%;">
                        <strong>Oops! </strong> This account was signed up as a ${accountType} account. You do not have sufficient permissions.
                    </div>`;

                        document.getElementById('signupError').innerHTML = errorHTML;

                    }
                } else {

                    errorHTML = `<div class="alert alert-danger" role="alert"
                    style="margin-top: 20px; width: 94%; margin-left: 6%;">
                    <strong>Error! </strong> An unexpected error has acurred, please contact customer support.
                </div>`;

                    document.getElementById('signupError').innerHTML = errorHTML;
                }
            } else {

                errorHTML = `<div class="alert alert-danger" role="alert" 
                style="margin-top: 20px; width: 94%; margin-left: 6%;">
                <strong>Oops! </strong> This account is not yet registered. <a href = "/signup">Sign Up</a>
           </div>`;

                errorMessage.innerHTML = errorHTML;

            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });





    }).catch(function (err) {
        console.log(err)
        console.log("Google Sign In Failed");
    })
}


//FIRESTORE MIGRATED
googleSignInDistrict = () => {
    base_provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(base_provider).then(function (result) {
        var user = result.user;
        var email = user.email;
        var name3 = user.displayName;
        var profilePic = user.photoURL;

        var errorMessage = document.getElementById('signupError');


        firebase.firestore().collection('UserData').doc(email).get().then(function (doc) {

            var accountType = "";

            if (doc.exists) {
                accountType = doc.data()["account type"];
                // console.log("Document data:", doc.data()["Account Type"]);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }


            if (accountType != null) {
                if (accountType == "District") {
                    console.log('Login Success');
                    //localStorage.setItem("email", email);

                    const url = `https://api-v1.classvibes.net/api/authLogger?email=${email}&platform=web`

                    $.get(url, function(data, status){
                        //console.log(data)
                        window.location = "/district/dashboard";
                    })

                    
                } else {

                    errorHTML = `<div class="alert alert-danger" role="alert" 
                style="margin-top: 20px; width: 94%; margin-left: 6%;">
                <strong>Oops! </strong> This account was signed up as a ${accountType} account. You do not have sufficient permissions.
            </div>`;

                    document.getElementById('signupError').innerHTML = errorHTML;

                }
            } else {

                errorHTML = `<div class="alert alert-danger" role="alert"
            style="margin-top: 20px; width: 94%; margin-left: 6%;">
            <strong>Error! </strong> An unexpected error has acurred, please contact customer support.
        </div>`;

                document.getElementById('signupError').innerHTML = errorHTML;
            }

        }).catch(function (error) {
            console.log("Error getting document:", error);
        });

    }).catch(function (err) {
        console.log(err)
        console.log("Google Sign In Failed");
    })
}





const btnLogout = document.getElementById("btnLogout");

//FIRESTORE MIGRATED
function emailSignUp(type) {

    document.getElementById('signup-btn-text').style.display = "none";
    document.getElementById('signup-btn-main-button').disabled = true;
    document.getElementById('btn-loading').style.display = "initial";

    var email = document.getElementById('inputEmail').value;
    var displayName = document.getElementById('inputDisplayName').value;
    var password = document.getElementById('inputPassword').value;
    var repeatPassword = document.getElementById('inputRepeatPassword').value;
    var agreeChecked = document.getElementById('agreeCheck').checked

    var errorMessage = document.getElementById('signupError');

    if(agreeChecked){

        errorMessage.innerHTML = ''

        var loginSuccess = true;
    
        var errorHTML = `<div class="alert alert-danger" role="alert"
        style="margin-top: 20px; width: 94%; margin-left: 6%;">
        <strong>Oops! </strong>${errorMessage}
    </div>`;
    
        if (email == "" || displayName == "" || password == "" || repeatPassword == "") {
            errorHTML = `<div class="alert alert-danger" role="alert" 
        style="margin-top: 20px; width: 94%; margin-left: 6%;">
        <strong>Oops! </strong> You cannot leave any of the fields blank
    </div>`;
    
            errorMessage.innerHTML = errorHTML;
        } else {
            if (password != repeatPassword) {
                errorHTML = `<div class="alert alert-danger" role="alert"
                style="margin-top: 20px; width: 94%; margin-left: 6%;">
                <strong>Oops! </strong> Password and repeat password don't match
            </div>`;
    
                errorMessage.innerHTML = errorHTML;
            } else {
    
                firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
    
                    document.getElementById('signupError').innerHTML = "";
    
    
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
    
                    console.log(errorMessage);
                    console.log(errorCode);
    
                    loginSuccess = false;
    
                    if (errorCode == "auth/invalid-email") {
                        document.getElementById('email-error').innerHTML = errorMessage;
                        document.getElementById('password-error').innerHTML = "";
                    }
    
                    if (errorCode == "auth/weak-password") {
                        document.getElementById('password-error').innerHTML = errorMessage;
                        document.getElementById('email-error').innerHTML = "";
                    }
    
                    if (errorCode == "auth/email-already-in-use") {
                        document.getElementById('email-error').innerHTML = errorMessage;
                        document.getElementById('password-error').innerHTML = "";
                    }
    
                }).then(() => {

                    firebase.auth().currentUser.sendEmailVerification()
                    .then(function() {
                        console.log("Success send email verification")
                        if (loginSuccess == true) {
                            var user = firebase.auth().currentUser;
        
                            user.updateProfile({
                              displayName: displayName,
                            }).then(function() {
                              console.log("update success")
                            }).catch(function(error) {
                                console.log("update Failed")
                            });
        
        
                           
        
                            //FIREBASE DATABASE UPLOAD
        
                            if (type == "student") {
        
                                firebase.firestore().collection("UserData").doc(email).set({
                                    "display name": displayName,
                                    "email": email,
                                    "username": email,
                                    "account type": "Student",
                                    "account status": "Activated",
                                }).then(() => {

                                    const increment = firebase.firestore.FieldValue.increment(1);
        
                                    firebase.firestore().collection("Application Management").doc("Statistics").update({
                                        "webUsers": increment,
                                        "totalUsers": increment,
                                    }).then(() => {
                                        var signUpPage = document.getElementById('signup-page-full');
        
                                        signUpPage.style.display = "none";
                    
                                        var successPage = document.getElementById('signup-success-form');
                    
                                        successPage.style.display = "initial";
                                    });


                                });
        

                            }
        
                            else if (type == 'teacher' || type == 'Solo Teacher') {
                                firebase.firestore().collection("UserData").doc(email).set({
                                    "display name": displayName,
                                    "email": email,
                                    "username": email,
                                    "account type": "Teacher",
                                    "account status": "Activated",
                                    "billing status": "Activated",
                                }).then(() => {
    
                                    
                                var url = "https://api-v1.classvibes.net/api/createCustomer?email=" + email
    
                                const xhr = new XMLHttpRequest();
                                xhr.onreadystatechange = () => {
                                    if(xhr.readyState === XMLHttpRequest.DONE){
                                        // Code to execute with response
    
                                        console.log(xhr.responseText)
    
                                        var responseText = xhr.responseText
                                        
                                        var response = JSON.parse(responseText);
    
                                        var customerID = response.message
    
                                        console.log(response, customerID)
    
                                        firebase.firestore().collection("UserData").doc(email).update({
                                            "customer stripe id": customerID
                                        }).then(() => {

                                            var url1 = `https://api.revenuecat.com/v1/subscribers/${user.uid}`
    
                                            const xhr1 = new XMLHttpRequest();


                                            xhr1.onreadystatechange = () => {
                                                if(xhr1.readyState === XMLHttpRequest.DONE){
                                                    // Code to execute with response
                
                                                    console.log(xhr1.responseText)
                
                                                    var responseText = xhr1.responseText
                                                    
                                                    var response = JSON.parse(responseText);
    
                                                    //console.log(response)

                                                    var url2 = `https://api-v1.classvibes.net/api/createClass?email=${email}&mode=signup`
    
                                                    const xhr2 = new XMLHttpRequest();
                                                    xhr2.onreadystatechange = () => {
                                                        if(xhr2.readyState === XMLHttpRequest.DONE){
                                                            // Code to execute with response
                        
                                                            console.log(xhr2.responseText)
                        
                                                            var responseText = xhr2.responseText
                                                            
                                                            var response = JSON.parse(responseText);
            
                                                            console.log(response)


                                                                    
                                                            const increment = firebase.firestore.FieldValue.increment(1);
                                    
                                                            firebase.firestore().collection("Application Management").doc("Statistics").update({
                                                                "webUsers": increment,
                                                                "totalUsers": increment,
                                                            }).then(() => {
                                                                var signUpPage = document.getElementById('signup-page-full');
        
                                                                signUpPage.style.display = "none";
                                            
                                                                var successPage = document.getElementById('signup-success-form');
                                            
                                                                successPage.style.display = "initial";
                                                            });


                    
                                                    
                                                        }
                                                    }
                                                    
                                                    xhr2.open('GET', url2);
                                                    
                                                    xhr2.send();
            
                                                }
                                            }
                                            
                                            xhr1.open('GET', url1);

                                            xhr1.setRequestHeader("Authorization", "Bearer icBZdQAfwvIZlcBZcMCTKxplUedWSFtM");
                                            xhr1.setRequestHeader("Content-Type", "application/json");
                                            xhr1.setRequestHeader("X-Platform", "ios");

                                            xhr1.send();

                                            

                                        })
                                
                                    }
                                }
                                
                                xhr.open('GET', url);
                                xhr.send();
    
                            });
    

    
                            }
        
                            else if (type == 'district') {
                                firebase.firestore().collection("UserData").doc(email).set({
                                    "display name": displayName,
                                    "email": email,
                                    "username": email,
                                    "account type": "District",
                                    "account status": "Activated",
                                });
        
                                const increment = firebase.firestore.FieldValue.increment(1);
        
                                firebase.firestore().collection("Application Management").doc("Statistics").update({
                                    "webUsers": increment,
                                    "totalUsers": increment,
                                    "totalDistricts": increment
                                });

                                var signUpPage = document.getElementById('signup-page-full');
        
                                signUpPage.style.display = "none";
            
                                var successPage = document.getElementById('signup-success-form');
            
                                successPage.style.display = "initial";
                            }
        
        
                        }
                      })
                      .catch(function(error) {
                        console.log(error)
                      });

                    console.log(loginSuccess);
    

    
                });
            }
        }
    } else {
        errorHTML = `<div class="alert alert-danger" role="alert" 
    style="margin-top: 20px; width: 94%; margin-left: 6%;">
    <strong>Oops! </strong>You must agree with our terms and conditions and privacy policy
</div>`;

        errorMessage.innerHTML = errorHTML;
    }


    setTimeout(() => {
        document.getElementById('signup-btn-text').style.display = "initial";
        document.getElementById('signup-btn-main-button').disabled = false;
        document.getElementById('btn-loading').style.display = "none";
    }, 500)
}

function sendEmailVerification(){
    firebase.auth().currentUser.sendEmailVerification()
    .then(function() {
        var errorHTML = `<div class="alert alert-success" role="alert" 
                style="margin-top: 20px; width: 94%; margin-left: 6%;">
                <strong>Success</strong> Verification email sent 
            </div>`;

                    document.getElementById('signupError').innerHTML = errorHTML;
    }).catch(err => {
        errorHTML = `<div class="alert alert-danger" role="alert" 
                style="margin-top: 20px; width: 94%; margin-left: 6%;">
                <strong>Oops! </strong> Something went wrong. <a onclick = 'sendEmailVerification()' href = "#sendVerification">Resend Verification</a>
            </div>`;

                    document.getElementById('signupError').innerHTML = errorHTML;
    })
}

//FIRESTORE MIGRATED
facebookSignUp = (type) => {

    base_provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(base_provider).then(function (result) {

        console.log("Facebook login success:");

        var user = result.user;
        var email = user.email;
        var displayName = user.displayName;
        var profilePic = user.photoURL;

        firebase.firestore().collection("UserData").doc(email).get().then((documentSnapshot) => {

            var value = documentSnapshot.data();

            console.log(value);

            if (value != undefined || value != null) {

                errorHTML = `<div class="alert alert-danger" role="alert"
                style="margin-top: 20px; width: 94%; margin-left: 6%;">
                <strong>Error! </strong> An account with this email already exists
            </div>`;

                document.getElementById('signupError').innerHTML = errorHTML;

            } else {
                if (type == "student") {

                    firebase.firestore().collection("UserData").doc(email).set({
                        "display name": displayName,
                        "email": email,
                        "username": email,
                        "account type": "Student",
                        "account status": "Activated",
                    });

                    const increment = firebase.firestore.FieldValue.increment(1);

                        firebase.firestore().collection("Application Management").doc("Statistics").update({
                            "webUsers": increment,
                            "totalUsers": increment,
                        });
                }

                else if (type == 'teacher' || type == 'Solo Teacher') {
                    firebase.firestore().collection("UserData").doc(email).set({
                        "display name": displayName,
                        "email": email,
                        "username": email,
                        "account type": "Teacher",
                        "account status": "Activated",
                    });

                    const increment = firebase.firestore.FieldValue.increment(1);

                        firebase.firestore().collection("Application Management").doc("Statistics").update({
                            "webUsers": increment,
                            "totalUsers": increment,
                        });
                }

                else if (type == 'district') {

                    firebase.firestore().collection("UserData").doc(email).set({
                        "display name": displayName,
                        "email": email,
                        "username": email,
                        "account type": "District",
                        "account status": "Activated",
                    });

                    const increment = firebase.firestore.FieldValue.increment(1);

                        firebase.firestore().collection("Application Management").doc("Statistics").update({
                            "webUsers": increment,
                            "totalUsers": increment,
                            "totalDistricts": increment,
                        });
                }

                console.log('signup success facebook');

                setTimeout(() => {
                    var signUpPage = document.getElementById('signup-page-full');

                    signUpPage.style.display = "none";

                    var successPage = document.getElementById('signup-success-form');

                    successPage.style.display = "initial";
                }, 200)

            }
        }).catch((e) => {
            console.log(e);
        });


    }).catch(function (err) {
        console.log(err)
        console.log("Facebook Sign In Failed")
        errorHTML = `<div class="alert alert-danger" role="alert"
            style="margin-top: 20px; width: 94%; margin-left: 6%;">
            <strong>Error! </strong> Facebook Login Failed
        </div>`;

        document.getElementById('signupError').innerHTML = errorHTML;
    })
}


//FIRESTORE MIGRATED
googleSignUp = (type) => {

    var agreeChecked = document.getElementById('agreeCheck').checked
    
    var errorMessage = document.getElementById('signupError');

    if(agreeChecked){

        errorMessage.innerHTML = ''

        console.log("TYPE Signup:" + type);

        base_provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(base_provider).then(function (result) {
    
            console.log("Google login success:");
    
            var user = result.user;
            var email = user.email;
            var displayName = user.displayName;
    
            firebase.firestore().collection("UserData").doc(email).get().then((documentSnapshot) => {
    
                var value = documentSnapshot.data();
    
                console.log(value);
    
                if (value != undefined || value != null) {
    
                    console.log("EXISTS:" + value);
    
                    errorHTML = `<div class="alert alert-danger" role="alert"
                    style="margin-top: 20px; width: 94%; margin-left: 6%;">
                    <strong>Error! </strong> An account with this email already exists
                </div>`;
    
                    document.getElementById('signupError').innerHTML = errorHTML;
    
                } else {
                    if (type == "student") {
    
                        firebase.firestore().collection("UserData").doc(email).set({
                            "display name": displayName,
                            "email": email,
                            "username": email,
                            "account type": "Student",
                            "account status": "Activated",
                        });
    
                        const increment = firebase.firestore.FieldValue.increment(1);
    
                            firebase.firestore().collection("Application Management").doc("Statistics").update({
                                "webUsers": increment,
                                "totalUsers": increment,
                            });
                        
                        var signUpPage = document.getElementById('signup-page-full');

                        signUpPage.style.display = "none";
    
                        var successPage = document.getElementById('signup-success-form');
    
                        successPage.style.display = "initial";
                    }
    
                    else if (type == 'teacher' || type == 'Solo Teacher') {
                        firebase.firestore().collection("UserData").doc(email).set({
                            "display name": displayName,
                            "email": email,
                            "username": email,
                            "account type": "Teacher",
                            "account status": "Activated",
                            "billing status": "Inactive",
                        }).then(() => {

                            var url = "https://api-v1.classvibes.net/api/createCustomer?email=" + email

                            const xhr = new XMLHttpRequest();
                            xhr.onreadystatechange = () => {
                                if(xhr.readyState === XMLHttpRequest.DONE){
                                    // Code to execute with response

                                    console.log(xhr.responseText)

                                    var responseText = xhr.responseText
                                    
                                    var response = JSON.parse(responseText);

                                    var customerID = response.message

                                    console.log(response, customerID)

                                    firebase.firestore().collection("UserData").doc(email).update({
                                        "customer stripe id": customerID
                                    }).then(() => {
                                        var url1 = `https://api-v1.classvibes.net/api/createClass?email=${email}&mode=signup`

                                        const xhr1 = new XMLHttpRequest();
                                        xhr1.onreadystatechange = () => {
                                            if(xhr1.readyState === XMLHttpRequest.DONE){
                                                // Code to execute with response
            
                                                console.log(xhr1.responseText)
            
                                                var responseText = xhr1.responseText
                                                
                                                var response = JSON.parse(responseText);

                                                console.log(response)

                                                const increment = firebase.firestore.FieldValue.increment(1);
    
                                                firebase.firestore().collection("Application Management").doc("Statistics").update({
                                                    "webUsers": increment,
                                                    "totalUsers": increment,
                                                }).then(() => {

                                                    var signUpPage = document.getElementById('signup-page-full');
    
                                                    signUpPage.style.display = "none";
                                
                                                    var successPage = document.getElementById('signup-success-form');
                                
                                                    successPage.style.display = "initial";
                                                });
                                        
                                            }
                                        }
                                        
                                        xhr1.open('GET', url1);
                                        xhr1.send();
                                    })
                            
                                }
                            }
                            
                            xhr.open('GET', url);
                            xhr.send();

                        });
    

                    }
    
                    else if (type == 'district') {
    
                        firebase.firestore().collection("UserData").doc(email).set({
                            "display name": displayName,
                            "email": email,
                            "username": email,
                            "account type": "District",
                            "account status": "Activated",
                        });
    
                        const increment = firebase.firestore.FieldValue.increment(1);
    
                            firebase.firestore().collection("Application Management").doc("Statistics").update({
                                "webUsers": increment,
                                "totalUsers": increment,
                                "totalDistricts": increment,
                            });
                        
                        var signUpPage = document.getElementById('signup-page-full');

                        signUpPage.style.display = "none";
    
                        var successPage = document.getElementById('signup-success-form');
    
                        successPage.style.display = "initial";
                    }
    
                    console.log('signup success google');
    
                }
            }).catch((e) => {
                console.log(e);
            });
    
        }).catch(function (err) {
            console.log(err)
            console.log("Google Sign In Failed")
        })
} else {
 errorHTML = `<div class="alert alert-danger" role="alert" 
    style="margin-top: 20px; width: 94%; margin-left: 6%;">
    <strong>Oops! </strong>You must agree with our terms and conditions and privacy policy
</div>`;

        errorMessage.innerHTML = errorHTML;
}


}


//Firestore Migrated
function loginWithEmailStudent() {
    var email = document.getElementById('inputEmail').value;
    var password = document.getElementById('inputPassword').value;

    var authValid = true;

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorMessage);

        errorHTML = `<div class="alert alert-danger" role="alert"
        style="margin-top: 20px; width: 94%; margin-left: 6%;">
        <strong>Error! </strong> Credentials are not valid.
    </div>`;

        document.getElementById('signupError').innerHTML = errorHTML;

        authValid = false;
        // ...
    }).then(() => {

        if (authValid == true) {
            firebase.firestore().collection('UserData').doc(email).get().then(function (doc) {
                var accountType = doc.data()['account type'];

                console.log(accountType);

                if (accountType != null) {
                    if (accountType == "Student") {
                        
                            window.localStorage.setItem("clientType", '35TK-KSMY-C7NR-2CEF');

                            const url = `https://api-v1.classvibes.net/api/authLogger?email=${email}&platform=web`

                            $.get(url, function(data, status){
                                //console.log(data)
                                window.location = "/student/dashboard";

                            })


                    } else {

                        errorHTML = `<div class="alert alert-danger" role="alert" 
                        style="margin-top: 20px; width: 94%; margin-left: 6%;">
                        <strong>Oops! </strong> This account was signed up as a ${accountType} account. You do not have sufficient permissions.
                    </div>`;

                        document.getElementById('signupError').innerHTML = errorHTML;

                    }
                } else {

                    errorHTML = `<div class="alert alert-danger" role="alert" 
             style="margin-top: 20px; width: 94%; margin-left: 6%;">
               <strong>Oops! </strong> This account is not yet registered. <a href = "/signup">Sign Up</a>
             </div>`;

                    document.getElementById('signupError').innerHTML = errorHTML;
                }

            }).catch(function (error) {
                console.log("Error getting document:", error);
            });


        }
    });

}

//Firestore Migrated
function loginWithEmailTeacher() {
    var email = document.getElementById('inputEmail').value;
    var password = document.getElementById('inputPassword').value;
    var authValid = true;

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorMessage);

        errorHTML = `<div class="alert alert-danger" role="alert"
        style="margin-top: 20px; width: 94%; margin-left: 6%;">
        <strong>Error! </strong> Credentials are not valid.
    </div>`;

        document.getElementById('signupError').innerHTML = errorHTML;

        authValid = false;
        // ...
    }).then(() => {

        if (authValid == true) {

            var currentUser = firebase.auth().currentUser

            var emailVerified = currentUser.emailVerified

            if(emailVerified == true){
                firebase.firestore().collection('UserData').doc(email).get().then(function (doc) {

                    var accountType = doc.data()['account type'];
    
    
                    if (doc.exists) {
    
    
                        if (accountType != null) {
                            if (accountType == "Teacher" || accountType == 'Solo Teacher') {
                                window.localStorage.setItem("clientType", '9HX4-5H7Y-4CEH-UKPT');


                                 const url = `https://api-v1.classvibes.net/api/authLogger?email=${email}&platform=web`

                                 $.get(url, function(data, status){
                                     //console.log(data)
                                         
                                    window.location = "teacher/dashboard";
     
                                 })
    
    
                            } else {
    
                                errorHTML = `<div class="alert alert-danger" role="alert" 
                            style="margin-top: 20px; width: 94%; margin-left: 6%;">
                            <strong>Oops! </strong> This account was signed up as a ${accountType} account. You do not have sufficient permissions.
                        </div>`;
    
                                document.getElementById('signupError').innerHTML = errorHTML;
    
                            }
                        } else {
    
                            errorHTML = `<div class="alert alert-danger" role="alert"
                        style="margin-top: 20px; width: 94%; margin-left: 6%;">
                        <strong>Error! </strong> An unexpected error has acurred, please contact customer support.
                    </div>`;
    
                            document.getElementById('signupError').innerHTML = errorHTML;
                        }
                    } else {
                        errorHTML = `<div class="alert alert-danger" role="alert" 
                 style="margin-top: 20px; width: 94%; margin-left: 6%;">
                   <strong>Oops! </strong> This account is not yet registered. <a href = "/signup">Sign Up</a>
                 </div>`;
    
                        errorMessage.innerHTML = errorHTML;
                    }
                }).catch(function (error) {
                    console.log("Error getting document:", error);
                });
            } else {
                errorHTML = `<div class="alert alert-danger" role="alert" 
                style="margin-top: 20px; width: 94%; margin-left: 6%;">
                <strong>Oops! </strong> This account is not yet verified. Check your inbox for the verification email. <a onclick = 'sendEmailVerification()' href = "#sendVerification">Resend Verification</a>
            </div>`;

                    document.getElementById('signupError').innerHTML = errorHTML;

            }


        }
    });





}

//Firestore Migrated
function loginWithEmailDistrict() {
    var email = document.getElementById('inputEmail').value;
    var password = document.getElementById('inputPassword').value;
    var authValid = true;

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorMessage);

        errorHTML = `<div class="alert alert-danger" role="alert"
        style="margin-top: 20px; width: 94%; margin-left: 6%;">
        <strong>Error! </strong> Credentials are not valid.
    </div>`;

        document.getElementById('signupError').innerHTML = errorHTML;

        authValid = false;
        // ...
    }).then(() => {

        if (authValid == true) {

    

            firebase.firestore().collection('UserData').doc(email).get().then(function (doc) {

                var accountType = doc.data()["account type"];

                if (accountType != null) {
                    if (accountType == "District") {

                            window.location = "/district/dashboard";


                    } else {

                        errorHTML = `<div class="alert alert-danger" role="alert" 
                style="margin-top: 20px; width: 94%; margin-left: 6%;">
                <strong>Oops! </strong> This account was signed up as a ${accountType} account. You do not have sufficient permissions.
            </div>`;

                        document.getElementById('signupError').innerHTML = errorHTML;

                    }
                } else {

                    errorHTML = `<div class="alert alert-danger" role="alert" 
             style="margin-top: 20px; width: 94%; margin-left: 6%;">
               <strong>Oops! </strong> This account is not yet registered. <a href = "/signup">Sign Up</a>
             </div>`;

                    document.getElementById('signupError').innerHTML = errorHTML;
                }


            }).catch(function (error) {
                console.log("Error getting document:", error);
            });

        }
    });

}

function forgotPassword() {
    var email = document.getElementById('forgotPasswordEmail').value;
    var auth = firebase.auth();
    var emailAddress = email;

    auth.sendPasswordResetEmail(emailAddress).then(function() {
    // Email sent.
    }).catch(function(error) {
    // An error happened.
    });
}
