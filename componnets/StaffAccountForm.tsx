import React, { useEffect, useState } from "react";
import { auth, db } from "../src/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./StaffAccountForm.module.css";

const StaffAccountForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [staffId, setStaffId] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    if (!staffId || !role || !password || !confirmPassword || !email) {
      toast.error("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      // Create user in Firebase Authentication with default password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save staff details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid, // Store Firebase Authentication User ID
        staff_id: staffId,
        email: email,
        role,
        isFirstLogin: true, // Mark that they need to change the password
        createdAt: serverTimestamp(),
        name: "",
        phone: "",
        address: "",
      });

      toast.success("Staff account created successfully!");
      setStaffId("");
      setRole("");
      setPassword("");
      setConfirmPassword("");
      setEmail("");
    } catch (error: any) {
      toast.error("Failed to create account: " + error.message);
    }
  };

  return (
    <div className={`${styles.formWrapper} ${isVisible ? styles.visible : ""}`}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={`${styles.form} ${isVisible ? styles.formVisible : ""}`}>
        <div className={styles.title}>Welcome</div>
        <div className={styles.subtitle}>Let's Create Staff Account!</div>

        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <input
            type="text"
            className={styles.input}
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            placeholder="Staff ID"
          />
        </div>
        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>

        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <select
            className={styles.input}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="Secretary">Secretary</option>
            <option value="Repairer">Repairer</option>
            <option value="Store Keeper">Store Keeper</option>
            <option value="Special Assignment">Special Assignment</option>
          </select>
        </div>

        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <input
            type="password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />
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
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffAccountForm;
