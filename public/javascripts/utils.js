function checkBrowser() {
    return (('serviceWorker' in navigator) && ('PushManager' in window))
}

function askPermission() {
    return new Promise((resolve, reject) => {

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
    fetch('/api/get-vapid-public-key')
        .then(function(response) {
            return response.json();
        })
        .then(startServiceWorker);
}

function startServiceWorker(jsonKey) {
    return navigator.serviceWorker.register('service-worker.js')
        .then(function(registration) {
            const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(jsonKey.vapidKey)
            };

            return registration.pushManager.subscribe(subscribeOptions);
        })
        .then(function(pushSubscription) {
            console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
            return sendSubscriptionToBackEnd(pushSubscription);
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

function sendSubscriptionToBackEnd(subscription) {
    return fetch('/api/save-subscription/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
    })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Bad status code from server.');
            }

            return response.json();
        })
        .then(function(responseData) {
            if (!(responseData.data && responseData.data.success)) {
                throw new Error('Bad response from server.');
            }
        });
}