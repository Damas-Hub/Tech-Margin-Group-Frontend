import React, { useEffect, useState } from "react";
import { db } from "../src/firebaseConfig"; // Adjust the path if needed
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import bcrypt from "bcryptjs"; // Import bcrypt for hashing
import styles from "./StaffAccountForm.module.css";

const StaffAccountForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [staffId, setStaffId] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async () => {
    if (!staffId || !role || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Hash the password before storing
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      await addDoc(collection(db, "users"), {
        staff_id: staffId,
        password: hashedPassword, // Store the hashed password
        role: role,
        isFirstLogin: true,
        createdAt: serverTimestamp(),
        name: "",
        email: "",
        phone: "",
        address: "",
      });

      alert("Staff account created successfully!");
      onClose();
    } catch (err) {
      console.error("Error adding staff:", err);
      setError("Failed to create account.");
    }
  };

  return (
    <div className={`${styles.formWrapper} ${isVisible ? styles.visible : ""}`}>
      <div className={`${styles.form} ${isVisible ? styles.formVisible : ""}`}>
        <div className={styles.title}>Welcome</div>
        <div className={styles.subtitle}>Let's Create Staff Account!</div>

        {error && <p className={styles.error}>{error}</p>}

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
          <select className={styles.input} value={role} onChange={(e) => setRole(e.target.value)}>
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
          <button className={`${styles.button} ${styles.cancelButton}`} onClick={onClose}>
            Cancel
          </button>
          <button className={`${styles.button} ${styles.submitButton}`} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffAccountForm;
