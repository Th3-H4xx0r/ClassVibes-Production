/*
============================
GLOBAL CONFIG
---------------------------
*/


function setVersionFooter(){
    var VERSION_CODE = '0.9.0-beta'

    if(document.getElementById('footer-version-code') != null){
        document.getElementById('footer-version-code').innerHTML = `
        <span>© 2021 Proto Systems. All rights reserved. v${VERSION_CODE}</span>
    `;
    }

}