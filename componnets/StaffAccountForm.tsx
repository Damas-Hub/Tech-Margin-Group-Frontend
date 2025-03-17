import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Imported the correct icons
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        staff_id: staffId,
        email: email,
        role,
        isFirstLogin: true,
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
      let errorMessage = "Account creation failed. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already associated with an account.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Use a stronger one.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format. Please check and try again.";
      }

      toast.error(errorMessage);
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

        {/* Password Input with Toggle */}
        <div className={`${styles.inputContainer} ${styles.ic1} ${styles.passwordWrapper}`}>
          <input
            type={showPassword ? "text" : "password"}
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button
            type="button"
            className={styles.eyeIcon}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>

        {/* Confirm Password Input with Toggle */}
        <div className={`${styles.inputContainer} ${styles.ic1} ${styles.passwordWrapper}`}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />
          <button
            type="button"
            className={styles.eyeIcon}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
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
