import React from "react";
import styles from "./Form.module.css";

const Form: React.FC = () => {
  return (
    <div className={styles.formWrapper}>
      <div className={styles.form}>
        <div className={styles.title}>Welcome</div>
        <div className={styles.subtitle}>Let's create staff account!</div>
        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <input
            placeholder=""
            type="text"
            className={styles.input}
            id="StaffID"
          />
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="staffid">
            Staff ID
          </label>
        </div>
        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <input
            placeholder=""
            type="text"
            className={styles.input}
            id="StaffName"
          />
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="StaffName">
            Staff Name
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
          <input
            placeholder=""
            type="email"
            className={styles.input}
            id="Email"
          />
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="email">
            Email{" "}
          </label>
        </div>
        <div className={`${styles.inputContainer} ${styles.ic2}`}>
          <input
            placeholder=""
            type="text"
            className={styles.input}
            id="Password"
          />
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="password">
            Password
          </label>
        </div>
        <div className={`${styles.inputContainer} ${styles.ic2}`}>
          <input
            placeholder=""
            type="text"
            className={styles.input}
            id="confirmPassword"
          />
          <div className={`${styles.cut} ${styles.cutShort}`} />
          <label className={styles.iLabel} htmlFor="confirmPassword">
            Confirm Password
          </label>
        </div>
        <button className={styles.submit} type="button">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Form;
