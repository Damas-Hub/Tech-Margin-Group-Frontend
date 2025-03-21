import React, { useState } from "react";
import styles from "../componnets/forgot-password.module.css";
import { useRouter } from "next/router";
import { auth } from "../src/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
      setTimeout(() => router.push("/login"), 4000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Failed to send reset email: ${error.message}`);
        console.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
        console.error("Unknown error:", error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.imageContainer}>
        <Image
          src="https://images.pexels.com/photos/7534378/pexels-photo-7534378.jpeg"
          alt="Forgot Password"
          className={styles.image}
          width={500}
          height={300}
          layout="responsive"
        />
      </div>

      <div className={styles.formWrapper}>
        <div className={styles.form}>
          <div className={styles.title}>Forgot Your Password?</div>
          <div className={styles.subtitle}>Enter your email to reset it</div>

          <div className={styles.inputContainer}>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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
