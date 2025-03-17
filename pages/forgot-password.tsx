import React, { useEffect, useState } from "react";
import styles from "../componnets/forgot-password.module.css";
import { useRouter } from "next/router";
import { auth, db } from "../src/firebaseConfig";
import {
  getDocs,
  query,
  collection,
  where,
  updateDoc,
} from "firebase/firestore";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [staffId, setStaffId] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setIsClient(true);
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  if (!isClient) return null;

  const handleForgotPassword = async () => {
    if (!staffId || !email || !newPassword || !confirmPassword) {
      toast.error("All fields are required!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      // Check if user exists in Firestore
      const userQuery = query(
        collection(db, "users"),
        where("staff_id", "==", staffId),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        toast.error("Staff ID and Email do not match any account.");
        return;
      }

      // Get user data
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Authenticate user to update password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        userData.password
      );
      const user = userCredential.user;

      // Update Firebase Authentication Password
      await updatePassword(user, newPassword);

      // Update Firestore for reference
      await updateDoc(userDoc.ref, { password: newPassword });

      toast.success("Password updated successfully! Redirecting...");
      setTimeout(() => router.push("/login"), 3000);
    } catch (error: any) {
      toast.error("Error updating password. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.imageContainer}>
        <img
          src="https://images.pexels.com/photos/7534378/pexels-photo-7534378.jpeg"
          alt="Forgot Password"
          className={styles.image}
        />
      </div>

      <div
        className={`${styles.formWrapper} ${
          isVisible ? styles.formVisible : ""
        }`}
      >
        <div className={styles.form}>
          <div className={styles.title}>Forgot Your Password?</div>
          <div className={styles.subtitle}>Let's help you create a new one</div>

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
            <input
              type="password"
              className={styles.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
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
              onClick={() => router.push("/login")}
            >
              Cancel
            </button>

            <button
              className={`${styles.button} ${styles.submitButton}`}
              onClick={handleForgotPassword}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
