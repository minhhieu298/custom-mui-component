importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-messaging.js');

self.addEventListener('notificationclick', function (event) {
    const url = event.notification.data.FCM_MSG.data.click_action;
    event.notification.close(); // Android needs explicit close.
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (const i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                // If so, just focus it.
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

self.addEventListener("message", function (event) {
    //event.source.postMessage("Responding to " + event.data);
    self.clients.matchAll().then(all => all.forEach(client => {
        client.postMessage("Responding to " + event.data);
    }));
});   

const firebaseConfig = {
   apiKey: "AIzaSyBemWH3u_Uef2a65mw4UZiRt4CpGJ1HDOw",
   authDomain: "ezmobiletrading-dev.firebaseapp.com",
   databaseURL: "https://ezmobiletrading-dev.firebaseio.com",
   projectId: "ezmobiletrading-dev",
   storageBucket: "ezmobiletrading-dev.appspot.com",
   messagingSenderId: "585304294071",
   appId: "1:585304294071:web:b0bb14713ec20dcfff4332"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function () {
    self.registration.hideNotification();    
});

messaging.onBackgroundMessage(function (payload) {    
    console.log('[firebase-messaging-sw.js] Received background message 2', payload);
    // Customize notification here
    const payNotiConv = typeof payload == 'string' ? JSON.parse(payload.notification) : payload.notification;
    const notificationTitle = payNotiConv.title;
    const notificationOptions = {
        body: payNotiConv.body,
        icon: '/favicon.ico',
        data: { url: payload.data.click_action }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);   
});

