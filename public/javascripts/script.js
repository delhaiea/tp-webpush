window.onload = function main() {
    if(!checkBrowser()) {
        console.error("pas compatible déso");
        return;
    }
    if ( Notification.permission === "granted") {
        document.getElementById("msg").innerHTML = "<b>Notification déjà activées</b>";
    } else if ( Notification.permission === "denied") {
        document.getElementById("msg").innerHTML = "<b>Pas de notification</b>";
    }
}

function notification() {
    askPermission().then( function() {
        document.getElementById("msg").innerHTML = "<b>Notification activées</b>";
        subscribeUserToPush();
    }).catch( function() {
        document.getElementById("msg").innerHTML = "<b>Pas de notification</b>";
    })
}