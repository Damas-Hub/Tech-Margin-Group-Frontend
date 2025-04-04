import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db, auth } from "../src/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import styles from "./MessageForm.module.css";

interface MessageFormProps {
  isVisible: boolean;
  onClose: () => void;
}

const MessageForm: React.FC<MessageFormProps> = ({ isVisible, onClose }) => {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("🔥 Logged in user UID:", user.uid);
        console.log("🔥 Logged in email:", user.email);
      } else {
        console.log("❌ No user is logged in.");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!message || !recipient) {
      toast.error("Please fill in all fields.");
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      toast.error("No authenticated user.");
      return;
    }

    console.log("✅ Logged in UID:", user.uid);

    try {
    // Determine the sender's role
let senderRole = "";

const staffRef = doc(db, "staffs", user.uid);
const staffSnap = await getDoc(staffRef);

if (staffSnap.exists()) {
  senderRole = staffSnap.data().role;
  console.log("🔍 Role found in STAFFS:", senderRole);
} else {
  const adminRef = doc(db, "users", user.uid);
  const adminSnap = await getDoc(adminRef);

  if (adminSnap.exists()) {
    const adminRole = adminSnap.data().role;
    if (adminRole === "Admin") {
      senderRole = "Admin";
      console.log("👑 Role found in USERS:", senderRole);
    } else {
      console.warn("❌ Role in USERS is not Admin.");
      toast.error("Your role is not authorized to send messages.");
      return;
    }
  } else {
    console.warn("❌ User not found in STAFFS or USERS.");
    toast.error("Your role could not be determined.");
    return;
  }
}


      // Save the message
      await addDoc(collection(db, "messages"), {
        message,
        recipient,
        sender: senderRole,
        senderUid: user.uid,
        timestamp: serverTimestamp(),
        read: false,
      });

      toast.success("Message sent successfully!");
      setMessage("");
      setRecipient("");
    } catch (error) {
      console.error("🔥 Error sending message:", error);
      toast.error("Failed to send message.");
    }
  };

  return (
    <div className={`${styles.formWrapper} ${isVisible ? styles.visible : ""}`}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={`${styles.form} ${isVisible ? styles.formVisible : ""}`}>
        <div className={styles.titlee}>Send a Message</div>

        <div className={styles.inputContainerrr}>
          <textarea
            className={styles.inputr}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
          />
        </div>

        <div className={styles.inputContainer}>
          <select
            className={styles.input}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          >
            <option value="">Select Recipient</option>
            <option value="Admin">Admin</option>
            <option value="Secretary">Secretary</option>
            <option value="Repairer">Repairer</option>
            <option value="Store Keeper">Store Keeper</option>
            <option value="Special Assignment">Special Assignment</option>
          </select>
        </div>

        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            // onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`${styles.button} ${styles.submitButton}`}
            onClick={handleSubmit}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageForm;
