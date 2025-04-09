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
import { motion, AnimatePresence } from "framer-motion";
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let role = "";

        const staffRef = doc(db, "staffs", user.uid);
        const staffSnap = await getDoc(staffRef);

        if (staffSnap.exists()) {
          role = staffSnap.data().role;
        } else {
          const adminRef = doc(db, "users", user.uid);
          const adminSnap = await getDoc(adminRef);
          if (adminSnap.exists() && adminSnap.data().role === "Admin") {
            role = "Admin";
          }
        }

        setSenderRole(role);
        console.log("🔐 Logged-in role:", role);
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

    try {
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

  // All possible roles
  const allRoles = ["Admin", "Secretary", "Repairer", "Store Keeper"];
  const filteredRoles = allRoles.filter((role) => role !== senderRole);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles.formWrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ToastContainer position="top-right" autoClose={3000} />
          <motion.div
            className={styles.form}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
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
                {filteredRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessageForm;
