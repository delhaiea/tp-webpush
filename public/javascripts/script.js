window.onload = function main() {
    document.getElementById('send').addEventListener('submit', (e) => {
        e.preventDefault();
        send_notif();
    })
    if(!checkBrowser()) {
        console.error("pas compatible déso");
        return;
    }
    navigator.serviceWorker.register('service-worker.js').then(function(registration) { });
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

function send_notif() {
    const title = document.getElementById('title').value;
    const message = document.getElementById('message').value;
    const tag = document.getElementById('tag').value;
    const picture = document.getElementById('picture').value;
    const icon = document.getElementById('icon').value;
    fetch('/api/send-notification', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title,
            message,
            tag,
            picture,
            icon
        })
    })
}