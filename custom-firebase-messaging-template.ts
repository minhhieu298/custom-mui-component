/**
 * Custom Firebase Messaging Wrapper Template
 * Dành cho Firebase phiên bản cũ (v8.x) không có hàm getMessage()
 * 
 * Cách sử dụng:
 * 1. Copy file này vào project của bạn
 * 2. Import và khởi tạo với Firebase app instance
 * 3. Sử dụng các phương thức custom thay vì API gốc
 */

// ===== TYPES ĐỊNH NGHĨA CHO FIREBASE v8 =====

interface FirebaseMessage {
  notification?: {
    title?: string;
    body?: string;
    icon?: string;
    image?: string;
  };
  data?: Record<string, string>;
  from?: string;
  collapseKey?: string;
  messageId?: string;
  google?: {
    'delivered_priority'?: number;
    'original_priority'?: number;
    'received_time'?: number;
  };
}

interface FirebaseApp {
  messaging(): FirebaseMessaging;
  options?: {
    messagingSenderId?: string;
  };
}

interface FirebaseMessaging {
  onMessage(callback: (payload: FirebaseMessage) => void): void;
  getToken(): Promise<string>;
  deleteToken(): Promise<boolean>;
  requestPermission(): Promise<NotificationPermission>;
  useServiceWorker(registration: ServiceWorkerRegistration): void;
  usePublicVapidKey(vapidKey: string): void;
}

// ===== CUSTOM MESSAGING WRAPPER =====

class CustomFirebaseMessaging {
  private messaging: FirebaseMessaging | null = null;
  private messageQueue: FirebaseMessage[] = [];
  private messageListeners: ((payload: FirebaseMessage) => void)[] = [];
  private isListening = false;

  constructor(firebaseApp: FirebaseApp) {
    this.initialize(firebaseApp);
  }

  /**
   * Khởi tạo messaging với Firebase app
   */
  private initialize(firebaseApp: FirebaseApp): void {
    try {
      if (firebaseApp && typeof firebaseApp.messaging === 'function') {
        this.messaging = firebaseApp.messaging();
        this.setupMessageHandling();
        this.setupBackgroundMessageHandling();
        console.log('Custom Firebase Messaging initialized successfully');
      } else {
        console.error('Firebase app không có messaging function');
      }
    } catch (error) {
      console.error('Lỗi khởi tạo Firebase Messaging:', error);
    }
  }

  /**
   * Setup xử lý message foreground
   */
  private setupMessageHandling(): void {
    if (!this.messaging) return;

    this.messaging.onMessage((payload: FirebaseMessage) => {
      console.log('Received foreground message:', payload);
      
      // Thêm vào queue
      this.messageQueue.push(payload);
      
      // Giới hạn queue size (giữ 50 message gần nhất)
      if (this.messageQueue.length > 50) {
        this.messageQueue.shift();
      }
      
      // Thông báo cho tất cả listeners
      this.notifyMessageListeners(payload);
    });

    this.isListening = true;
  }

  /**
   * Setup xử lý message background
   */
  private setupBackgroundMessageHandling(): void {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // Lắng nghe message từ service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'firebase-messaging') {
        const payload = event.data.payload as FirebaseMessage;
        console.log('Received background message:', payload);
        
        this.messageQueue.push(payload);
        if (this.messageQueue.length > 50) {
          this.messageQueue.shift();
        }
        
        this.notifyMessageListeners(payload);
      }
    });
  }

  /**
   * CUSTOM GET MESSAGE - Hàm chính thay thế getMessage() không có sẵn
   */
  async getMessage(): Promise<FirebaseMessage> {
    return new Promise((resolve, reject) => {
      // Nếu có message trong queue, trả về message mới nhất
      if (this.messageQueue.length > 0) {
        const latestMessage = this.messageQueue[this.messageQueue.length - 1];
        this.messageQueue = []; // Xóa queue sau khi lấy
        resolve(latestMessage);
        return;
      }

      // Nếu không có message, chờ message mới với timeout
      const timeout = setTimeout(() => {
        this.removeMessageListener(listener);
        reject(new Error('Không có message nào trong 5 giây'));
      }, 5000);

      const listener = (payload: FirebaseMessage) => {
        clearTimeout(timeout);
        this.removeMessageListener(listener);
        resolve(payload);
      };

      this.addMessageListener(listener);
    });
  }

  /**
   * Lấy tất cả messages đang có trong queue
   */
  getQueuedMessages(): FirebaseMessage[] {
    return [...this.messageQueue];
  }

  /**
   * Xóa tất cả messages trong queue
   */
  clearMessageQueue(): void {
    this.messageQueue = [];
  }

  /**
   * Lấy message theo index (0 = mới nhất)
   */
  getMessageByIndex(index: number): FirebaseMessage | null {
    const reversedIndex = this.messageQueue.length - 1 - index;
    return reversedIndex >= 0 ? this.messageQueue[reversedIndex] : null;
  }

  /**
   * Lấy message theo messageId
   */
  getMessageById(messageId: string): FirebaseMessage | null {
    return this.messageQueue.find(msg => msg.messageId === messageId) || null;
  }

  /**
   * Thêm listener cho message mới
   */
  addMessageListener(callback: (payload: FirebaseMessage) => void): void {
    this.messageListeners.push(callback);
  }

  /**
   * Xóa listener
   */
  removeMessageListener(callback: (payload: FirebaseMessage) => void): void {
    const index = this.messageListeners.indexOf(callback);
    if (index > -1) {
      this.messageListeners.splice(index, 1);
    }
  }

  /**
   * Thông báo cho tất cả listeners
   */
  private notifyMessageListeners(payload: FirebaseMessage): void {
    this.messageListeners.forEach(listener => {
      try {
        listener(payload);
      } catch (error) {
        console.error('Lỗi trong message listener:', error);
      }
    });
  }

  /**
   * Lấy FCM token
   */
  async getToken(): Promise<string> {
    if (!this.messaging) {
      throw new Error('Messaging chưa được khởi tạo');
    }

    try {
      const token = await this.messaging.getToken();
      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.error('Lỗi lấy token:', error);
      throw error;
    }
  }

  /**
   * Xóa FCM token
   */
  async deleteToken(): Promise<boolean> {
    if (!this.messaging) {
      return false;
    }

    try {
      const result = await this.messaging.deleteToken();
      console.log('Token deleted:', result);
      return result;
    } catch (error) {
      console.error('Lỗi xóa token:', error);
      return false;
    }
  }

  /**
   * Yêu cầu quyền notification
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Trình duyệt không hỗ trợ notifications');
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      return permission;
    } catch (error) {
      console.error('Lỗi yêu cầu quyền notification:', error);
      return 'denied';
    }
  }

  /**
   * Kiểm tra notifications có được hỗ trợ không
   */
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  /**
   * Setup service worker cho messaging
   */
  useServiceWorker(registration: ServiceWorkerRegistration): void {
    if (this.messaging && typeof this.messaging.useServiceWorker === 'function') {
      this.messaging.useServiceWorker(registration);
    }
  }

  /**
   * Setup VAPID key
   */
  usePublicVapidKey(vapidKey: string): void {
    if (this.messaging && typeof this.messaging.usePublicVapidKey === 'function') {
      this.messaging.usePublicVapidKey(vapidKey);
    }
  }

  /**
   * Lấy thông tin trạng thái
   */
  getStatus(): {
    isInitialized: boolean;
    isListening: boolean;
    queueSize: number;
    listenerCount: number;
    isSupported: boolean;
  } {
    return {
      isInitialized: !!this.messaging,
      isListening: this.isListening,
      queueSize: this.messageQueue.length,
      listenerCount: this.messageListeners.length,
      isSupported: this.isSupported()
    };
  }
}

// ===== EXAMPLE USAGE =====

/**
 * EXAMPLE: Cách sử dụng trong project
 * 
 * // 1. Import Firebase và custom wrapper
 * import firebase from 'firebase/app';
 * import 'firebase/messaging';
 * import { CustomFirebaseMessaging } from './customFirebaseMessaging';
 * 
 * // 2. Khởi tạo Firebase
 * const firebaseConfig = {
 *   apiKey: "your-api-key",
 *   authDomain: "your-project.firebaseapp.com",
 *   projectId: "your-project",
 *   messagingSenderId: "123456789",
 *   appId: "your-app-id"
 * };
 * 
 * firebase.initializeApp(firebaseConfig);
 * 
 * // 3. Khởi tạo custom messaging
 * const customMessaging = new CustomFirebaseMessaging(firebase);
 * 
 * // 4. Sử dụng các phương thức custom
 * 
 * // Lấy message mới nhất
 * customMessaging.getMessage()
 *   .then(message => {
 *     console.log('Message:', message);
 *   })
 *   .catch(error => {
 *     console.error('Error:', error);
 *   });
 * 
 * // Lắng nghe message mới
 * customMessaging.addMessageListener((payload) => {
 *   console.log('New message:', payload);
 *   // Handle message ở đây
 * });
 * 
 * // Lấy FCM token
 * customMessaging.getToken()
 *   .then(token => {
 *     console.log('Token:', token);
 *   });
 * 
 * // Kiểm tra trạng thái
 * console.log(customMessaging.getStatus());
 */

export { CustomFirebaseMessaging };
export type { FirebaseApp, FirebaseMessage, FirebaseMessaging };
export default CustomFirebaseMessaging;
