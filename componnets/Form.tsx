import React, { useEffect, useState } from "react";
import styles from "./Form.module.css";

const Form: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
      setIsVisible(true);
    }, []);
  return (
    <div className={`${styles.formWrapper} ${isVisible ? styles.visible : ""}`}>
      <div className={`${styles.form} ${isVisible ? styles.formVisible : ""}`}>
        <div className={styles.title}>Welcome</div>
        <div className={styles.subtitle}>Let's Complete Your Profile!</div>

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
 
        <div className={`${styles.inputContainerr} ${styles.ic2}`}>
          <input
            placeholder=""
            type="date"
            className={styles.input}
            id="date0fBirth"
          />
          <div className={`${styles.cut} ${styles.cutShort}`} />
          <label className={styles.iLabel} htmlFor="date0fBirth">
             Date of Birth
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

export default Form;
