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
        var saveButtonHTML = `<button class="btn btn-primary" style="width: 100%;" onclick = 'changeUserName()'>Save</button>`

        document.getElementById('saveButtonField').innerHTML = saveButtonHTML
    } else {
        document.getElementById('saveButtonField').innerHTML = ""
    }
}

function changeUserName(){

    var name = document.getElementById('nameInputField').value

    var user = firebase.auth().currentUser;

    try{
        user.updateProfile({
            displayName: name,
        }).then(function() {
            document.getElementById('feedback-error-feild').innerHTML = ""
            window.location.reload()
        }).catch(function(error) {
            document.getElementById('feedback-error-feild').innerHTML = error.message
        });
    }catch(error){
        document.getElementById('feedback-error-feild').innerHTML = "An error has occured, try again later"
    }

}

async function getBillingInformation(){
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        var email = user.email;
  
        firebase.firestore().collection("UserData").doc(email).get().then(async doc => {
          var data = doc.data();
      
          var billingStatus = data['billing status']
      
          if(billingStatus == 'active'){
  
            var paymentSettingsHTML = `
            <h2 style="margin-left: 20px; margin-top: 20px;">Payment Settings</h2>
  
            <div style="margin-left: 20px;">
  
              <!--
  <div class="card3">
                <div class="row">
                  <img src =  'img/undraw_credit_card_payment_12va.svg' width="17%" style="margin-top: 2%; margin-left: 2%;">
  
                  <div class="col">
  
                    <h4 style="margin-left: 2%; margin-top: 2%;">Active Plan</h4>
  
                    <h5 style="margin-left: 2%; margin-top: 1%;">Pay as you go <span class="badge badge-primary">Yearly</span></h5>
  
                    <h4 style="margin-left: 2%; margin-top: 2%;">Billing Cycle</h4>
  
                    <h5 style="margin-left: 2%; margin-top: 1%; font-size: 16px;">Stars 8/27/2020</h5>
  
                  </div>
  
                </div>
              
  
              </div>
              -->
  
    
  
              <h5 style="margin-top: 30px;">Active Plan</h5>
  
              <hr/>
  
              <div class="payment-plan">
                <div style="display: flex; justify-content: space-between; margin-left: 1%;">
                  <h6 style="font-size: 20px; margin-top: 1%;">Pay as you go <span class="badge badge-primary">Yearly</span></h6>
  
                  <h6 style="margin-right: 15%; margin-top: 1%;">Exp 8/27/2020</h6>
                </div>
              </div>
  
          <hr/>
  
          <h5 style="margin-top: 30px;">Payment Methods <a href = '#addPayment'><i class="fas fa-plus-circle" data-toggle="modal" data-target="#exampleModal"></i></a></h5>
  
          <hr/>
  
          <div class="payment-plan"  id = 'payment-method-list'>
          </div>
  
  
  
  
            <h5 style="margin-top: 30px;">Payment History</h5>
            <div style="height: 50px; width: 85%; background-color: rgba(209, 209, 209, 0.158); border-radius: 10px;">
              <div class="row" style="margin-top: 10px;">
                <p style="margin-left: 5%; margin-top: 11px; font-weight: 200px; font-size: 17px;">Amount</p>
                <p style="margin-left: 9%; margin-top: 11px; font-size: 17px;">Status</p>
                <p style="margin-left: 10%; margin-top: 11px; font-size: 17px;">Date</p>
                <p style="margin-left: 45%; margin-top: 11px; font-size: 17px;">Payment Method</p>
  
              </div>
            </div>
  
            <div style="height: 250px; overflow-y: scroll; width: 90%; margin-top: 20px" id='payment-history'>

            </div>
          </div>
            `
  
            document.getElementById('payment-settings-body').innerHTML = paymentSettingsHTML
  
            
            await getPaymentMethods()
            await getTransactionHistory();
  
          } else {
            var billingSetupHTML = `
                <center style = 'margin-top: 10%'>
                    <img  src = '/settings/img/undraw_pay_online_b1hk.svg' width = '25%'/>

                </center>

                <center>
                <button class = 'btn btn-primary'>Setup Billing</button>
                </center>
            `
  
            document.getElementById('payment-settings-body').innerHTML = billingSetupHTML
          }
        })
      }
    })
  
  }