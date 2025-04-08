import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {

};

const requestNotificationPermission = async () => {
  try {
    // Check the current notification permission
    const permission = await Notification.requestPermission();
    // console.log(permission);
    if (permission === "granted") {
      // Notification permission granted, you can proceed with sending notifications or other actions
      // console.log("Notification permission granted.");
    } else {
      // User denied or dismissed the notification permission prompt
      // console.log("User denied or dismissed notification permission.");
    }
  } catch (error) {
    // console.error("Error while requesting notification permission:", error);
  }
};

// Call the function to prompt for notification permission
requestNotificationPermission();
// Initialize the Firebase app
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
let currentToken = null;

// console.log("TESTING");

// console.log(messaging);

export const requestForToken = async () => {
  // const registerServiceWorker = async () => {
  //   try {
  //     if ("serviceWorker" in navigator) {
  //       const registration = await navigator.serviceWorker.register(
  //         process.env.REACT_APP_PATH_RETRIEVE_TOKEN
  //       );
  //       // console.log("Service Worker registered with scope:", registration.scope);
  //     }
  //   } catch (error) {
  //     // console.error("Error registering Service Worker:", error);
  //   }
  // };

  // // Call the async function directly
  // registerServiceWorker();

  const registerServiceWorker = async () => {
    try {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.register(
          process.env.REACT_APP_PATH_RETRIEVE_TOKEN
        );
        // console.log(
        //   "Service Worker registered with scope:",
        //   registration.scope
        // );
        console.log("Service Worker registered");
      }
    } catch (error) {
      // console.error("Error registering Service Worker:", error);
    }
  };

  registerServiceWorker();

  try {
    const messaging = getMessaging();
    const registration = await navigator.serviceWorker.ready;
    currentToken = await getToken(messaging, {
      serviceWorkerRegistration: registration,
      vapidKey: `BNhLu75OyIQrWhLU7Sm04eL9VN6HnXLlExBdlykCbiSjYewpZuvWChAX1h2Ai_-TKiFKR9eMTdWgBPFgxC04Wgo`,
    });

    if (currentToken) {
      // console.log("Got token");
      // console.log("Current token for client:", currentToken);
      // Perform any other necessary action with the token
    } else {
      // console.log(
      //   "No registration token available. Request permission to generate one."
      // );
    }
  } catch (err) {
    // console.error("An error occurred while retrieving token:", err);
  }
};

export const getmessaging = () => messaging;
export const getCurrentToken = () => currentToken;

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      // console.log("payload", payload);
      resolve(payload);
    });
  });

// Request notification permission when the script runs
