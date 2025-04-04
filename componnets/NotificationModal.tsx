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
  const [notifications, setNotifications] = useState<Message[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const unreadCount = notifications.filter((msg) => !msg.read).length;

  useEffect(() => {
    if (!staffRole) return;

    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, where("recipient", "==", staffRole));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toMillis?.() || Date.now(),
      })) as Message[];
      setNotifications(newMessages);
    });

    return () => unsubscribe();
  }, [staffRole]);

  const markAsRead = async (message: Message) => {
    if (!message.read) {
      const msgRef = doc(db, "messages", message.id);
      await updateDoc(msgRef, { read: true });

      setNotifications((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, read: true } : msg
        )
      );
    }
  };

  const toggleNotificationModal = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setSelectedMessage(null); // Reset to show notification list
  };

  const openMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsNotificationOpen(false); // Close the notification modal
    markAsRead(message);
  };

  const closeMessage = () => {
    setSelectedMessage(null); // Close only the message modal
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
          <span className="absolute -top-2 -right-2 bg-red-500 text-red font-extrabold text-xs w-5 h-5 flex items-center justify-center rounded-full">
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
              <X className="cursor-pointer" onClick={toggleNotificationModal} />
            </div>
            <div className={styles.notificationContent}>
              {notifications.length > 0 ? (
                notifications.map((msg) => (
                  <div
                    key={msg.id}
                    className={styles.notificationItem}
                    onClick={() => openMessage(msg)}
                  >
                    <span className={styles.notificationMessage}>
                      {!msg.read && (
                        <span className="bg-green-500 w-3 h-3 rounded-full flex-shrink-0 mr-2"></span>
                      )}
                      <strong>From {msg.sender}:</strong>{" "}
                      {msg.message.length > 50
                        ? msg.message.substring(0, 50) + "..."
                        : msg.message}
                    </span>

                    <span className={styles.notificationTimestamp}>
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm p-3">No new notifications</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Message Modal (Only This One Stays Open) */}
      {/* Message Modal (Full Display) */}
      {selectedMessage && (
        <div className={styles.notificationContainer}>
          <div className={styles.messageModal}>
            <div className={styles.messageHeader}>
              <span>Message Details</span>
              <X className="cursor-pointer" onClick={closeMessage} />
            </div>
            <div className={styles.messageContent}>
              <p>
                <strong>From:</strong> {selectedMessage.sender}
              </p>
              <p className={styles.fullMessage}>{selectedMessage.message}</p>
              <p className={styles.timestamp}>
                {new Date(selectedMessage.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationModal;
