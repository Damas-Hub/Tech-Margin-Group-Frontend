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
import { useRouter } from "next/router";

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

const NotificationModal: React.FC<NotificationModalProps> = ({ staffRole, className }) => {
  const [notifications, setNotifications] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((msg) => !msg.read).length;
const router = useRouter();
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

  const markAsRead = async () => {
    const unreadMessages = notifications.filter((msg) => !msg.read);
    unreadMessages.forEach(async (msg) => {
      const msgRef = doc(db, "messages", msg.id);
      await updateDoc(msgRef, { read: true });
    });
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
          <span className="absolute -top-2 -right-2 bg-red-500 text-red font-extrabold text-xs w-5 h-5 flex items-center justify-center rounded-full">
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
                 <span 
  className={styles.notificationMessage} 
  onClick={() =>
    router.push(
      `/NotificationMessage?sender=${encodeURIComponent(msg.sender)}&message=${encodeURIComponent(msg.message)}&timestamp=${msg.timestamp}`
    )
  }
  

  style={{ cursor: "pointer", textDecoration: "underline" }}
>
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
