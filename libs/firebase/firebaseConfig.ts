/* eslint-disable @typescript-eslint/no-explicit-any */
import "firebase/messaging";

import * as firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBemWH3u_Uef2a65mw4UZiRt4CpGJ1HDOw",
  authDomain: "ezmobiletrading-dev.firebaseapp.com",
  databaseURL: "https://ezmobiletrading-dev.firebaseio.com",
  projectId: "ezmobiletrading-dev",
  storageBucket: "ezmobiletrading-dev.appspot.com",
  messagingSenderId: "585304294071",
  appId: "1:585304294071:web:b0bb14713ec20dcfff4332",
};

let messaging: firebase.default.messaging.Messaging;
// let getToken;
// let onMessage;
// const messageQueue: any[] = [];

if (typeof window !== "undefined" && "navigator" in window) {
  firebase.default.initializeApp(firebaseConfig);
  messaging = firebase.default.messaging();

  messaging.onMessage((payload) => {
    const payloadNoti = payload.notification;
    console.log(payloadNoti);
  });
}

function subscribeTokenTopic(token: string, topic: string) {
  fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
    method: "POST",
    headers: new Headers({
      Authorization: `key=AAAAwdTHxo8:APA91bHHAvF2F96v_QzRdt6_vutnXQXRml_sEc4eudh7XMhf8gkf-moefvA_9_LwPq29NQkDYGWTpTpvAZxBIhsB364SJ_2_8KOm70RYkx7cud_Ir8BDAqDggqu2IwRNeBYlHvIj_vbJ`,
      // Authorization: `key=AAAAiEbawrc:APA91bHuAJwzsawDC60mbs43VQfj66I2u5XUXjeFqaSTu8qineKoRoXxUi5NVIMUfX9J3IDBHBYQIRLwJu9DMjrBST-qEzJ81tW52XsD2_2Kj4tatrAT8jW2L9hRGg7Vv6oQEzOrHNsp`
    }),
  })
    .then((response) => {
      if (response.status < 200 || response.status >= 400) {
        console.log(response.status, response);
      }
      console.log(`"${topic}" is subscribed`);
    })
    .catch((error) => {
      console.error(error.result);
    });
  return true;
}

function getRegToken() {
  messaging
    .getToken()
    .then((token) => {
      subscribeTokenTopic(token, "all");
    })
    .catch((error) => {
      console.log(error);
    });
}

// Custom getMessage function
// function getMessage(): Promise<any> {
//     return new Promise((resolve, reject) => {
//         if (messageQueue.length > 0) {
//             // Lấy message mới nhất
//             const latestMessage = messageQueue[messageQueue.length - 1];
//             messageQueue = []; // Xóa queue sau khi lấy
//             resolve(latestMessage);
//             return;
//         }

//         // Nếu không có message, chờ 5 giây
//         const timeout = setTimeout(() => {
//             reject(new Error('Không có message nào trong 5 giây'));
//         }, 5000);

//         // Tạo listener tạm thời
//         const tempListener = (payload: any) => {
//             clearTimeout(timeout);
//             messaging.onMessage(tempListener); // Xóa listener
//             resolve(payload);
//         };

//         messaging.onMessage(tempListener);
//     });
// }

// // Helper functions
// function getQueuedMessages(): any[] {
//     return [...messageQueue];
// }

// function clearMessageQueue(): void {
//     messageQueue = [];
// }

export { getRegToken, messaging };

