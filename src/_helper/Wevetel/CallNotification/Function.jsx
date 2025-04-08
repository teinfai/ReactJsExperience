import React from 'react';

class CallNotification extends React.Component {
    // Request permission for notifications (if not granted already)
    componentDidMount() {
        if ('Notification' in window) {
            if (Notification.permission !== 'granted') {
                Notification.requestPermission();
            }

            // console.log('1234532112345676');

            // Register the service worker
        }


    }

    showCallNotification() {
        if ("Notification" in window) {
            if (Notification.permission === "granted") {
                const notification = new Notification("Incoming Call", {
                    body: "You have an incoming call.",
                    actions: [
                        { action: "answer", title: "Answer" },
                        { action: "reject", title: "Reject" },
                    ],
                });

                setTimeout(notification.close.bind(notification), 5000);

                notification.addEventListener("notificationclick", (event) => {
                    event.notification.close();

                    const action = event.action;
                    if (action === "answer") {
                        // Handle answer button click
                        // console.log("Answer clicked!");
                    } else if (action === "reject") {
                        // Handle reject button click
                        // console.log("Reject clicked!");
                    }
                });
            }
        }
    }


    // Example call handling logic (you can integrate this with your actual call handling logic)
    handleIncomingCall() {
        // Simulating an incoming call
        setTimeout(() => {
            this.showCallNotification();
        }, 2000);
    }

    render() {
        return (
            <div>
                <h1>React Call Notification Example</h1>
                <button onClick={() => this.handleIncomingCall()}>Simulate Incoming Call</button>
            </div>
        );
    }
}

export default CallNotification;