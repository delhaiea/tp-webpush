function checkBrowser() {
    return (('serviceWorker' in navigator) && ('PushManager' in window))
}

function registerServiceWorker() {
    return navigator.serviceWorker.register("javascripts/service-worker.js").then((reg) => {
        console.log('Service worker registered');
        return reg;
    }).catch((err) => {
        console.error("ptdr sa crash: " + err);
    })
}