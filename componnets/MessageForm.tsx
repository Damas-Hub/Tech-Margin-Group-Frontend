import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../src/firebaseConfig"

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import styles from "./StaffAccountForm.module.css";
import MessageList from "./MessageList";

interface MessageFormProps {
  isVisible: boolean;
  onClose: () => void;
}

const MessageForm: React.FC<MessageFormProps> = ({ isVisible, onClose }) => {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");

  const handleSubmit = async () => {
    if (!message || !recipient) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "messages"), {
        message,
        recipient,
        timestamp: serverTimestamp(),
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
      <MessageList recipient={recipient} />
    </div>
  );
};

export default MessageForm;
