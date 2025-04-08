self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    const action = event.action;
    if (action === 'answer') {
        // Handle answer button click
        // ...
    } else if (action === 'reject') {
        // Handle reject button click
        // ...
    }
});

self.addEventListener('push', function (event) {
    const notificationOptions = {
        body: 'You have an incoming call.',
        actions: [
            { action: 'answer', title: 'Answer' },
            { action: 'reject', title: 'Reject' },
        ],
    };

    event.waitUntil(
        self.registration.showNotification('Incoming Call', notificationOptions)
    );
});