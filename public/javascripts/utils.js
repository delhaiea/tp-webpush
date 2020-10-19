function checkBrowser() {
    return (('serviceWorker' in navigator) && ('PushManager' in window))
}

function askPermission() {
    return new Promise(function (resolve, reject) {

        Notification.requestPermission().then((result) => {
            //
            if (result === 'denied') {
                reject('La permission n\'a pas été validé, les notifications sont bloquées');
            }
            if (result === 'default') {
                reject('La réponse à la requête pour la permission a été remis à plus tard.');
            }
            // Do something with the granted permission.
            resolve();
        })
    })
}

function subscribeUserToPush() {
    return navigator.serviceWorker.register('javascripts/service-worker.js')
        .then((registration) => {
            const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(__ApplicationServerKey)
            };

            return registration.pushManager.subscribe(subscribeOptions);
        })
        .then((pushSubscription) => {
            console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
            return pushSubscription;
        });
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}