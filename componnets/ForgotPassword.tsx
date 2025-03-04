import React, { useEffect, useState } from "react";
import styles from "../componnets/ForgotPassword.module.css";

const ForgotPassword: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  return (
    <div className={`${styles.formWrapper} ${isVisible ? styles.visible : ""}`}>
      <div className={`${styles.form} ${isVisible ? styles.formVisible : ""}`}>
        <div className={styles.title}>Forgot Your Password?</div>
        <div className={styles.subtitle}>Let's Help you create new one</div>

        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <input
            placeholder=""
            type="text"
            className={styles.input}
            id="StaffName"
          />
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="StaffName">
            Full Name
          </label>
        </div>
        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <input
            placeholder=""
            type="text"
            className={styles.input}
            id="Address"
          />
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="address">
            Address
          </label>
        </div>
        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <input
            placeholder=""
            type="number"
            className={styles.input}
            id="Phone Number"
          />
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="phoneNumber">
            Phone Number
          </label>
        </div>
        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <input type="email" className={styles.input} id="Email" />
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="Email">
            Email
          </label>
        </div>

       
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            type="button"
            onClick={onClose}
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
  );
};

export default ForgotPassword;
