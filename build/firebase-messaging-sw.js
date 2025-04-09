importScripts(
  "https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyAeEgV39aQOKweJcWQm4wFeJfyLlJ-gs1Q",
  authDomain: "wevogortc.firebaseapp.com",
  projectId: "wevogortc",
  storageBucket: "wevogortc.appspot.com",
  messagingSenderId: "903979441830",
  appId: "1:903979441830:web:3f84a51924e7fe82df5e67",
  measurementId: "G-ZR6K0M42G3",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  // console.log("Received background message ", payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
