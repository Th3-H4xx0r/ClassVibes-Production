/*
============================
GLOBAL CONFIG
---------------------------
*/


function setVersionFooter(){
    var VERSION_CODE = '0.9.0-beta'

    if(document.getElementById('footer-version-code') != null){
        document.getElementById('footer-version-code').innerHTML = `
        <span>Copyright &copy; Proto Systems. v${VERSION_CODE}</span>
    `;
    }

}