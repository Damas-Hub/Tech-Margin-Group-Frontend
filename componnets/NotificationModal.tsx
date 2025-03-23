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
  orderBy,
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
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((msg) => !msg.read).length;

  useEffect(() => {
    if (!staffRole) return;

    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, where("recipient", "==", staffRole), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages: Message[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          message: data.message,
          recipient: data.recipient,
          sender: data.sender,
          read: data.read,
          timestamp: data.timestamp?.toMillis() || 0, // Ensure correct timestamp format
        };
      });

      console.log("Fetched messages:", newMessages); // Debugging line
      setNotifications(newMessages);
    });

    return () => unsubscribe();
  }, [staffRole]);

  const markAsRead = async () => {
    const unreadMessages = notifications.filter((msg) => !msg.read);
    for (const msg of unreadMessages) {
      const msgRef = doc(db, "messages", msg.id);
      await updateDoc(msgRef, { read: true });
    }
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
    if (!isOpen) markAsRead();
  };

  function clsx(...classes: (string | undefined)[]): string {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <div className={clsx("cursor-pointer relative", className)} onClick={toggleModal}>
        <Bell className="w-7 h-7 text-red-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white font-extrabold text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Notification Modal */}
      {isOpen && (
        <div className={styles.notificationModal}>
          <div className={styles.notificationHeader}>
            <span>Notifications</span>
            <X className="cursor-pointer" onClick={toggleModal} />
          </div>
          <div className={styles.notificationContent}>
            {notifications.length > 0 ? (
              notifications.map((msg) => (
                <div key={msg.id} className={styles.notificationItem}>
                  <span className={styles.notificationMessage}>
                    <strong>From {msg.sender}:</strong> {msg.message}
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
      )}
    </div>
  );
};

export default NotificationModal;
