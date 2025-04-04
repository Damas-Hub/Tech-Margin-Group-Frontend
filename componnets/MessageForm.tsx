import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db, auth } from "../src/firebaseConfig";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import styles from "./MessageForm.module.css";

interface MessageFormProps {
  isVisible: boolean;
  onClose: () => void;
}

const MessageForm: React.FC<MessageFormProps> = ({ isVisible, onClose }) => {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [senderRole, setSenderRole] = useState("");

  useEffect(() => {
    const fetchSenderRole = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log("Authenticated UID:", user.uid); // Check if correct user is logged in
    
          try {
            // Try to fetch from 'staffs' collection first
            const staffRef = doc(db, "staffs", user.uid);
            const staffSnap = await getDoc(staffRef);
    
            if (staffSnap.exists()) {
              const role = staffSnap.data().role;
              console.log("Role found in staffs:", role);
              setSenderRole(role); // Set the correct role
              return;
            }
    
            // If not found in staffs, check 'users' collection
            const adminRef = doc(db, "users", user.uid);
            const adminSnap = await getDoc(adminRef);
    
            if (adminSnap.exists()) {
              const role = adminSnap.data().role || "Admin";
              console.log("Role found in users:", role);
              setSenderRole(role);
              return;
            }
    
            console.error("User role not found in both collections");
            toast.error("Your role could not be determined. Contact Admin.");
          } catch (error) {
            console.error("Error fetching sender role:", error);
            toast.error("Failed to fetch sender role.");
          }
        } else {
          console.error("No authenticated user found");
        }
      });
    };
    
    

    fetchSenderRole();
  }, []);

  const handleSubmit = async () => {
    if (!message || !recipient) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!senderRole) {
      toast.error("Could not determine sender role. Try again.");
      return;
    }

    try {
      await addDoc(collection(db, "messages"), {
        message,
        recipient,
        sender: senderRole,  
        timestamp: serverTimestamp(),
        read: false,
      });

      toast.success("Message sent successfully!");
      setMessage("");
      setRecipient("");
    } catch (error) {
      console.error("Error sending message: ", error);
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
            onClick={onClose}
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
