"use client";
import { useEffect, useState } from "react";
import "react-virtualized/styles.css";
import { getRegToken, messaging } from "../libs/firebase/firebaseConfig";

export interface IListData {
  "ATBLID": number,
  "ALOGINNAME": string,
  "AERRCODE": number,
  "AERRMESSAGE": string,
  "ASOURCE": string,
  "AIPSERVER": string,
  "AIPCLIENT": string,
  "AREFERER": string,
  "AUSERAGENT": string,
  "ABROWSER": string,
  "ALOGINTIME": string,
  "AACTIVITY": string,
  "AACTIVITYUSR": string,
  "AACTIVITYDSC": string,
  "AACTIVITYBTNTYPE": string,
  "AISMOBILE": string,
  "ABROWSERNAME": string,
  "ABROWSERVERS": string,
  "ABRKID": string,
  "AACTIVITYDES": string,
  "ADEVICE": string
}

// Component demo dùng để mount/unmount OtpInput bằng nút bấm
export default function Home() {
  const [isState, setIsState] = useState(false);

  useEffect(() => {
    setIsState(true);

    // Đăng ký service worker và khởi tạo Firebase
    const initializeFirebase = async () => {
      try {
        // Đăng ký service worker
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log('Service Worker registered:', registration);

          // Setup service worker cho Firebase messaging
          if (messaging && typeof messaging.useServiceWorker === 'function') {
            messaging.useServiceWorker(registration);
          }
        }

        // Lấy FCM token
        getRegToken();

      } catch (error) {
        console.error('Error initializing Firebase:', error);
      }
    };

    initializeFirebase();
  }, []);

  if (!isState) return null;

  return (
    <div style={{ width: "100%", height: "565px" }}>
      <h1>Firebase Messaging Demo</h1>
      <p>Service Worker Status: Active</p>
      <p>Check console for Firebase initialization logs</p>
    </div>
  );
}
