import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../componnets/NotificationMessage.module.css";

const NotificationMessage = () => {
  const router = useRouter();
  const [notification, setNotification] = useState({ sender: "", message: "", timestamp: "" });

  useEffect(() => {
    if (router.isReady) {
      const { sender, message, timestamp } = router.query;
      setNotification({
        sender: sender as string,
        message: message as string,
        timestamp: timestamp ? new Date(Number(timestamp)).toLocaleString() : "",
      });
    }
  }, [router.isReady, router.query]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Notification Message</h1>
      <div className={styles.messageBox}>
        <p><strong>From:</strong> {notification.sender}</p>
        <p className={styles.message}>{notification.message}</p>
        <p className={styles.timestamp}>{notification.timestamp}</p>
      </div>
      <button className={styles.backButton} onClick={() => router.back()}>Back</button>
    </div>
  );
};

export default NotificationMessage;
