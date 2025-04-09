import React, { useState, useEffect } from "react";
import styles from "./NotificationModal.module.css";
import { db } from "../src/firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Bell, X } from "lucide-react";

interface NotificationModalProps {
  staffRole: string;
  className?: string;
}

interface Message {
  id: string;
  message: string;
  recipient: string;
  sender: string;
  timestamp: number;
  read: boolean;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  staffRole,
  className,
}) => {
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([]);
  const [readMessages, setReadMessages] = useState<Message[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const unreadCount = unreadMessages.length;

  useEffect(() => {
    if (!staffRole) return;

    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, where("recipient", "==", staffRole));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMessages: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toMillis?.() || Date.now(),
      })) as Message[];

      const unread = allMessages.filter((msg) => !msg.read);
      const read = allMessages.filter((msg) => msg.read);

      setUnreadMessages(unread);
      setReadMessages(read);
    });

    return () => unsubscribe();
  }, [staffRole]);

  // Merge and sort messages
  const notifications = [...unreadMessages, ...readMessages].sort(
    (a, b) => b.timestamp - a.timestamp
  );

  const markAsRead = async (message: Message) => {
    if (!message.read) {
      const msgRef = doc(db, "messages", message.id);
      await updateDoc(msgRef, { read: true });
      // No need to update state manually due to onSnapshot
    }
  };

  const toggleNotificationModal = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setSelectedMessage(null);
  };

  const openMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsNotificationOpen(false);
    markAsRead(message);
  };

  const closeMessage = () => {
    setSelectedMessage(null);
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <div
        className={`cursor-pointer relative ${className}`}
        onClick={toggleNotificationModal}
      >
        <Bell className="w-7 h-7 text-red-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white font-bold text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Notification List Modal */}
      {isNotificationOpen && !selectedMessage && (
        <div className={styles.notificationContainer}>
          <div className={styles.notificationModal}>
            <div className={styles.notificationHeader}>
              <span>Notifications</span>
              <X size={18} onClick={toggleNotificationModal} />
            </div>
            <div className={styles.notificationContent}>
              {notifications.length > 0 ? (
                notifications.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${styles.notificationItem} ${
                      !msg.read ? styles.unreadItem : ""
                    }`}
                    onClick={() => openMessage(msg)}
                  >
                    <div className={styles.messagePreview}>
                      {!msg.read && <span className={styles.greenDot} />}
                      <div className={styles.messageContent}>
                        <span className={styles.sender}>From {msg.sender}</span>
                        <p className={styles.messageText}>{msg.message}</p>
                      </div>
                    </div>
                    <span className={styles.notificationTimestamp}>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <p className={styles.noNotifications}>No notifications</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Selected Message Modal */}
      {selectedMessage && (
        <div className={styles.notificationContainer}>
          <div className={styles.messageModal}>
            <div className={styles.messageHeader}>
              <span>Message Details</span>
              <X size={18} onClick={closeMessage} />
            </div>
            <p>
              <strong>From:</strong> {selectedMessage.sender}
            </p>
            <p className={styles.fullMessage}>{selectedMessage.message}</p>
            <p className={styles.messageTimestamp}>
              {new Date(selectedMessage.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationModal;
