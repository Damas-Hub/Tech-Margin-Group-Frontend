import React, { useEffect, useState } from "react";
import styles from "./forgot-password.module.css";
import { useRouter } from "next/router";

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setTimeout(() => {
      setIsVisible(true);
    }, 100);  
  }, []);

  if (!isClient) return null;

  return (
    <div className={styles.container}>
      {/* Left Image Section */}
      <div className={styles.imageContainer}>
        <img
          src="https://images.pexels.com/photos/7534378/pexels-photo-7534378.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Forgot Password"
          className={styles.image}
        />
      </div>

      {/* Right Form Section */}
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
              placeholder=""
              type="text"
              className={styles.input}
              id="Staffid"
            />
            <div className={styles.cut} />
            <label className={styles.iLabel} htmlFor="Staffid">
              Staff ID
            </label>
          </div>
          <div className={`${styles.inputContainer} ${styles.ic1}`}>
            <input
              placeholder=""
              type="email"
              className={styles.input}
              id="Email"
            />
            <div className={styles.cut} />
            <label className={styles.iLabel} htmlFor="Email">
              Email
            </label>
          </div>
          <div className={`${styles.inputContainer} ${styles.ic1}`}>
            <input
              placeholder=""
              type="password"
              className={styles.input}
              id="NewPassword"
            />
            <div className={styles.cut} />
            <label className={styles.iLabel} htmlFor="NewPassword">
              New Password
            </label>
          </div>
          <div className={`${styles.inputContainer} ${styles.ic1}`}>
            <input
              placeholder=""
              type="password"
              className={styles.input}
              id="ConfirmPassword"
            />
            <div className={styles.cut} />
            <label className={styles.iLabel} htmlFor="ConfirmPassword">
              Confirm Password
            </label>
          </div>

          <div className={styles.buttonContainer}>
            <button
              className={`${styles.button} ${styles.cancelButton}`}
              type="button"
            >
              Cancel
            </button>
            <button
              className={`${styles.button} ${styles.submitButton}`}
              type="button"
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
