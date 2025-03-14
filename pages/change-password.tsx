import React, { useState } from "react";
import { auth, db } from "../src/firebaseConfig";
import { updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../componnets/ChangePassword.module.css";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("All fields are required!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        toast.error("User not found. Please log in again.");
        return;
      }

      await updatePassword(user, newPassword);

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { isFirstLogin: false });

      toast.success("Password changed successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      toast.error("Failed to change password. Try again.");
      console.error("Password Change Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.changePasswordContainer}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className={styles.title}>Change Password</h2>
      <form className={styles.form} onSubmit={handleChangePassword}>
        <input
          type="password"
          className={styles.input}
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
