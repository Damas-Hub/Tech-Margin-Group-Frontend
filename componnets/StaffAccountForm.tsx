import React, { useEffect, useState } from "react";
import styles from "./StaffAccountForm.module.css";

const StaffAccountForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  return (
    <div className={`${styles.formWrapper} ${isVisible ? styles.visible : ""}`}>
      <div className={`${styles.form} ${isVisible ? styles.formVisible : ""}`}>
        <div className={styles.title}>Welcome</div>
        <div className={styles.subtitle}>Let's Create Staff Account!</div>

        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <input
            placeholder=""
            type="staffid"
            className={styles.input}
            id="Staffid"
          />
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="Staffid">
            Staff ID
          </label>
        </div>
        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <select className={styles.input} id="Role">
            <option value=""></option>
            <option value="Secretary">Secretary</option>
            <option value="Repairer">Repairer</option>
            <option value="Store Keeper">Store Keeper</option>
            <option value="Special Assignment">Special Assignment</option>
          </select>
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="Role">
            Role
          </label>
        </div>
        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <input
            placeholder=""
            type="password"
            className={styles.input}
            id="Password"
          />
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="Password">
            Password
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

export default StaffAccountForm;
