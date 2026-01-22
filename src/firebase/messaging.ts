import { getMessaging, getToken } from "firebase/messaging";
import { firebaseApp } from "./app";

export async function initializeFirebaseCloudMessaging() {
    const messaging = getMessaging(firebaseApp);
    const vapidKey = import.meta.env.VITE_FIREBASE_SECURE_VAPID_KEY;
    console.log(messaging);
    console.log("Requesting permission...");
    Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            console.log("Notification permission granted.");
        }
    });
    getToken(messaging, {
        vapidKey: vapidKey,
    })
        .then((currentToken) => {
            if (currentToken) {
                console.log(currentToken);
            } else {
                // Show permission request UI
                console.log(
                    "No registration token available. Request permission to generate one.",
                );
                // ...
            }
        })
        .catch((err) => {
            console.log("An error occurred while retrieving token. ", err);
        });
}
