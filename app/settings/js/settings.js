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

            var customerID = data['customer stripe id']
  
            
            await getPaymentMethods(customerID)
            await getTransactionHistory(customerID);
            
  
          } else {
            var billingSetupHTML = `
                <center style = 'margin-top: 15%'>
                    <img  src = '/settings/img/undraw_pay_online_b1hk.svg' width = '25%'/>

                </center>

                <center style = 'margin-top: 2%'>
                <button class = 'btn btn-primary' onclick = 'setupBillingPressed()'>Setup Billing Details</button>

                <a href = '#haveCuponCode' onclick = "showCuponCodePopup('${email}')" style = 'text-decoration: none'><p style = 'margin-top: 1%; color: #5469d4'>I have a cupon code</p></a>
                </center>
            `
  
            document.getElementById('payment-settings-body').innerHTML = billingSetupHTML
          }
        })
      }
    })
  
  }

  function showCuponCodePopup(email){
    var modalHTML = `
    <div class="modal fade" id="couponModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Redeem Coupon</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="recipient-name" class="col-form-label">Code</label>
            <input type="text" class="form-control" id="coupon-code-input">
          </div>

          <p id = 'coupon-code-error-field' style = 'color: red; font-weight: 700'></p>
          
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onclick = "validateCoupon('${email}')" id = 'redeem-button'>Redeem</button>
      </div>
    </div>
  </div>
</div>
    `

    document.getElementById('pageModalSection').innerHTML = ''

    $(modalHTML).appendTo('#pageModalSection')

    $('#couponModal').modal('toggle')
  }

  function validateCoupon(email){

    document.getElementById('redeem-button').innerHTML = `<img src = 'img/oval.svg' width = '30%'/>`

    setTimeout(function(){ 

      var code = document.getElementById('coupon-code-input').value

      var errorField = document.getElementById('coupon-code-error-field')
  
      if(code){
        firebase.firestore().collection('Coupons').doc(code).get().then(doc => {
          var data = doc.data()
    
          if(data){
            var redeemed = data['redeemed']
  
            if(redeemed == false){
              console.log("coupon redeemed success")
              firebase.firestore().collection('Coupons').doc(code).update({
                redeemed: true
              }).then(() => {
                firebase.firestore().collection('UserData').doc(email).update({
                  'billing status': 'active',
                  'billing platform': 'stripe',
                  'coupon redeemed': true,
                  "account status": "Activated"
                }).then(() => {
                  window.location.reload();
                })
              })
              
            } else {
              errorField.innerHTML = 'Coupon already redeemed'
              document.getElementById('redeem-button').innerHTML = `Redeem`
            }
          } else {
            errorField.innerHTML = 'Coupon does not exist'
            document.getElementById('redeem-button').innerHTML = `Redeem`
          }
        })
      } else {
        errorField.innerHTML = 'Coupon does not exist'
        document.getElementById('redeem-button').innerHTML = `Redeem`
      }
  
  
      console.log(code)
     }, 1000);

  
  }


  function setupBillingPressed(){
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
          var email = user.email;
    
          firebase.firestore().collection("UserData").doc(email).update({
              'billing status': 'active',
              'billing platform': 'stripe',
              'account status': "Activated",
          }).then(() => {
              window.location.reload()
          });
        }
    })  
  }

  async function getTransactionHistory(customerID) {
  
    var url = `https://api-v1.classvibes.net/api/getTransactions?id=${customerID}`
  
    const xhr = new XMLHttpRequest();
  
      xhr.onreadystatechange = () => {
        try{
        if (xhr.readyState === XMLHttpRequest.DONE) {
          // Code to execute with response
          //console.log(xhr.responseText);
    
          var transactionsList = JSON.parse(xhr.responseText);
    
          for (var i = 0; i <= transactionsList.length; i++) {
            var transaction = transactionsList[i]
    
            if (transaction != undefined) {

              console.log(transaction)
              var amount = (transaction['amount']/100).toFixed(2)

              var amount_refunded = (transaction['amount_refunded']/100).toFixed(2)
    
              var status = transaction['status']
    
              var currency = transaction['currency'].toUpperCase()
    
              var date = transaction['created']
    
              var formattedDate = new Date(date * 1000).toLocaleString()
    
              var lastFour = transaction['payment_method_details']['card']['last4']

              var brand = transaction['payment_method_details']['card']['brand']

              var brandHTML = ``

              var statusHTML = ``

              console.log(status)

              if(status == 'succeeded'){

                if(amount_refunded == amount){
                  statusHTML = ` <div class="badge badge-custom" style="margin-left: 50px; opacity: 0.6; padding-bottom: -40px; height: 23px; margin-top: 3px; color: #4f566b; background-color: #e3e8ee; font-weigth: 700; ">Refunded <i class="fas fa-redo"></i></div>`

                } else {
                  statusHTML = ` <div class="badge badge-custom" style="margin-left: 50px; opacity: 0.6; padding-bottom: -40px; height: 23px; margin-top: 3px; color: #0e6245; background-color: #cbf4c9; font-weigth: 700; ">Succeeded <i class="fas fa-check"></i></div>`

                }
              } else{
                statusHTML = ` <div class="badge badge-custom" style="margin-left: 50px; opacity: 0.6; padding-bottom: -40px; height: 23px; margin-top: 3px; color: #983705; background-color: #f8e5b9; font-weigth: 700; ">Failed <i class="fas fa-redo"></i></div>`
              }



              if(brand.toLowerCase() == "visa"){
                brandHTML = `<i class="fab fa-cc-visa" style = "margin-top: 2%; color: #192061; font-size: 30px;"></i>`
              } else {
                brandHTML = `<i class="far fa-credit-card" style = "margin-top: 2%; color: #192061; font-size: 30px;"></i>`
              }
    
              var transactionHTML = `
                <div class="history-item">
                            <div style="margin-left: 30px; margin-top: 20px; display: flex; justify-content: space-between">
                            <div class='row'>
                              <h5>$${amount} ${currency}</h4>
                             ${statusHTML}                              
                             <h5 style="margin-left: 80px; margin-top: 7px">${formattedDate}</h5>
                            </div>
    
                            <div class='row' style = 'margin-right: 5%'>
                              ${brandHTML}
                              <p style="margin-left: 20px; font-size: 20px;">${lastFour}</p>
                            </div>
                               
                              
                            </div>
                        </div>
              `
              $(transactionHTML).appendTo('#payment-history')
            }
          }
    
        }
      } catch(e){
        document.getElementById('payment-history').innerHTML = `<h5 style = 'color: red'>Failed to get payment history</h5>`
      }
      }
  
    
  
    xhr.open('GET', url);
    xhr.send();
  }
  
  async function getPaymentMethods(id){

  
            console.log("gettings payment methods")
          
            firebase.auth().onAuthStateChanged(user => {
              if (user) {
                firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
                  //socket.emit('send-announcement-emails-to-students', {"code": code, 'title': messageTitle, 'message': messageText, 'className': className, 'authToken': idToken});
              
                  var url = `https://api-v1.classvibes.net/api/getPaymentMethods?id=${id}&authToken=${idToken}`
          
                  console.log(url)
              
                  const xhr = new XMLHttpRequest();
              
                    xhr.onreadystatechange = () => {
                      console.log("Got")
                        if(xhr.readyState === XMLHttpRequest.DONE){
                            // Code to execute with response
                            //console.log(xhr.responseText);
              
                            var response = JSON.parse(xhr.responseText);
          
          
                            if(response.status == "success"){

                              var responseText = xhr.responseText

                              console.log(responseText)

                              var paymentMethodsJSON = JSON.parse(responseText);

                              var paymentMethodsList = paymentMethodsJSON.message.data
          
                              console.log(paymentMethodsList)
              
                              for(var i = 0; i <= paymentMethodsList.length; i++){
                                console.log(paymentMethodsList[i])
            
                                var paymentMethod = paymentMethodsList[i]
            
                                if(paymentMethod != undefined){
            
                                  var lastFour = paymentMethod['last4']
            
                                  var brand = paymentMethod['brand']
              
                                  var expireMonth = paymentMethod['exp_month']
              
                                  var expireYear = paymentMethod['exp_year']
            
                                  var cardIcon = ``
            
                                  if(brand.toLowerCase() == 'visa'){
                                    cardIcon = `<i class="fab fa-cc-visa" style = "font-size: 40px; margin-top: 3%; color: #192061"></i>`
                                  } else if(brand.toLowerCase() == 'mastercard'){
                                    cardIcon = `<i class="fab fa-cc-mastercard" style = "font-size: 40px; margin-top: 3%; color: black"></i>`
                                  } else if(brand.toLowerCase() == 'american express'){
                                    cardIcon = `<i class="fab fa-cc-amex" style = "font-size: 40px; margin-top: 3%; color: #1c71b9"></i>`
                                  }else if(brand.toLowerCase() == 'discover'){
                                    cardIcon = `<i class="fab fa-cc-discover" style = "font-size: 40px; margin-top: 3%; color: #1c71b9"></i>`
                                  }
            
                                  var paymentMethodHTML = `
                                  <div style="display: flex; justify-content: space-between; margin-left: 1%;">
                                    <div class="row">
                                      ${cardIcon}
                                      <div class="col" style = 'padding-top: 2%'>
                                        <p> ${brand} •••• ${lastFour} </p>
                                        <p style="margin-right: 15%; margin-top: -15px; color: gray">Exp ${expireMonth}/${expireYear}</p>
                                      </div>
                                    </div>
            
                                    <a href = '#editPayment' style = 'margin-right: 15%; margin-top: 1%; '><i class="fas fa-ellipsis-h" style='color: gray'></i></a>
            
                                   
                                  </div>
            
                                  <hr style="margin-top: -7px;"/>
                                  `
            
                                  $(paymentMethodHTML).appendTo('#payment-method-list')
                                }
            
          
                                //payment-method-list
                              }
                            } else {
                              console.log(response.message)
          
                              document.getElementById('payment-method-list').innerHTML = `
                                <a style = 'color: red'>Failed to get payment methods</a>
                              `
                            }
              
          
                        }
                      }
          
                      xhr.open('GET', url);
                      xhr.send();
          
                }).catch(function(error) {
                  console.log(error)
                  // Handle error
                });
          
          
            }
      
    })
   
  }
  
  
  function addCardToAccount(){

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var email = user.email
            document.getElementById('CancelButton').enabled = false
            document.getElementById('add-card-text').innerHTML = `
            <img src = 'img/oval.svg' width = '7%'/>`

            
          
          
            var name = document.getElementById('NameOnCard').value
            var cardNumber = document.getElementById('CreditCardNumber').value
            var expireDate = document.getElementById('ExpiryDate').value
            var securityCode = document.getElementById('SecurityCode').value
            var zipCode = document.getElementById('ZIPCode').value

            var numberError = document.getElementById('cardNumberError').innerHTML
            var cvcError = document.getElementById('cvcError').innerHTML
            var dateError = document.getElementById('dateError').innerHTML

            console.log(numberError, cvcError, dateError)
       

            if(name && cardNumber && expireDate && securityCode && zipCode){

              document.getElementById('CancelButton').enabled = true
            document.getElementById('add-card-text').innerHTML = 'Add Card'
            document.getElementById('feedback-error-add-card').innerHTML = ''

              if((numberError == '' && cvcError == "" && dateError == "")  ){

                document.getElementById('CancelButton').enabled = false
                document.getElementById('add-card-text').innerHTML = `
                <img src = 'img/oval.svg' width = '7%'/>`
                
            document.getElementById('feedback-error-add-card').innerHTML = ''

                var str = expireDate.split('/');
          
                var expireMonth = str[0]
              
                var expireYear = str[1]
              
                const xhr = new XMLHttpRequest();
            
                firebase.firestore().collection('UserData').doc(email).get().then(doc => {
            
                    var data = doc.data();
            
                    var customerID = data['customer stripe id']
              
                    var url = `https://api-v1.classvibes.net/api/linkPaymentMethod?id=${customerID}&cardNumber=${cardNumber}&expMonth=${expireMonth}&expYear=${expireYear}&cvcNumber=${securityCode}&name=${name}&zip=${zipCode}`
                      
                    xhr.onreadystatechange = () => {
                      console.log("Got")
                        if(xhr.readyState === XMLHttpRequest.DONE){
                            // Code to execute with response
                            //console.log(xhr.responseText); 

                            document.getElementById('CancelButton').enabled = true
                            document.getElementById('add-card-text').innerHTML = 'Add Card'
                  
                            var response = JSON.parse(xhr.responseText);
                  
                            console.log(response)
                  
                            if(response.status == 'failed'){
                              if(response.data.code == 'card_declined'){
                                document.getElementById('feedback-error-add-card').innerHTML = "Card was declined"
                              } else {
                                document.getElementById('feedback-error-add-card').innerHTML = response.message
                              }
                              
                            } else {
                              console.log(xhr.responseText)
                              document.getElementById('feedback-error-add-card').innerHTML = ''
                              window.location.reload()
                            }
                  
                        }
                      }
                  
                      
                      xhr.open('GET', url);
                      xhr.send();
                  
                })
              } else {
                document.getElementById('CancelButton').enabled = true
            document.getElementById('add-card-text').innerHTML = 'Add Card'
            document.getElementById('feedback-error-add-card').innerHTML = ''
                document.getElementById('feedback-error-add-card').innerHTML = 'Card is invalid'

              }

            } else {
              document.getElementById('CancelButton').enabled = true
            document.getElementById('add-card-text').innerHTML = 'Add Card'
            document.getElementById('feedback-error-add-card').innerHTML = ''
              document.getElementById('feedback-error-add-card').innerHTML = 'Please fill out all the fields'

            }
          

          
        
        }
    })
  
  
  
  }
  
  function clearCardAddFields(){
    document.getElementById('NameOnCard').value = ''
    document.getElementById('CreditCardNumber').value = ''
    document.getElementById('ExpiryDate').value = ''
    document.getElementById('SecurityCode').value = ''
    document.getElementById('ZIPCode').value = ''
  }
  
  