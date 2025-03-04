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
            id="Email "
          />
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="email">
            Email
          </label>
        </div>
        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <input
            placeholder=""
            type="text"
            className={styles.input}
            id="NewPassword"
          />
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="newPassword">
            New Password
          </label>
        </div>
        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <input
            placeholder=""
            type="text"
            className={styles.input}
            id="ComfirmPassword"
          />
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="comfirmPassword">
          Comfirm Password
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
