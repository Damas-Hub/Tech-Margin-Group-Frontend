import { useState, useEffect } from "react";
import { db } from "../src/firebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { Bell } from "lucide-react";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          message: data.message,
          timestamp: data.timestamp.toDate(),
          read: data.read,
          type: data.type,
        } as Notification;
      });
      setNotifications(notifList);
    });
    return () => unsubscribe();
  }, []);

  const markAsRead = async (id: string): Promise<void> => {
    const notifRef = doc(db, "notifications", id);
    await updateDoc(notifRef, { read: true });
  };

  interface AddNotificationParams {
    message: string;
    type: string;
  }

  const addNotification = async ({
    message,
    type,
  }: AddNotificationParams): Promise<void> => {
    await addDoc(collection(db, "notifications"), {
      message,
      timestamp: new Date(),
      read: false,
      type,
    });
    toast.success("Notification added!");
  };

  return (
    <div className="relative">
      <Bell
        className={`w-7 h-7 cursor-pointer ${
          notifications.some((n) => !n.read) ? "text-red-600" : ""
        }`}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      />

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-3 z-50">
          <h3 className="text-lg font-semibold">Notifications</h3>
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm">No notifications</p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-2 cursor-pointer ${
                  notif.read ? "text-gray-500" : "text-black font-bold"
                }`}
                onClick={() => markAsRead(notif.id)}
              >
                {notif.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
