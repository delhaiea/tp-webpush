function checkBrowser() {
    return (('serviceWorker' in navigator) && ('PushManager' in window))
}