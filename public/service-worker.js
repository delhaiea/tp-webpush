self.addEventListener('push', function (event) {
    const d = JSON.parse(event.data.text());
    const promise = self.registration.showNotification(d.title, {
        body: d.message,
        icon: d.icon,
        tag: d.tag,
        image: d.picture,
    });

    event.waitUntil(promise);
});