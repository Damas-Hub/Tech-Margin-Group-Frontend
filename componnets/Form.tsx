import React from "react";
import { FaTimes } from "react-icons/fa";
import styles from "./Form.module.css";

interface FormProps {
  onClose: () => void;
}

const Form: React.FC<FormProps> = ({ onClose }) => {
  return (
    <div className={styles.formWrapper}>
      <div className={styles.form}>
        {/* Close Button */}
        <FaTimes className={styles.closeIcon} onClick={onClose} />

        <div className={styles.title}>Welcome</div>
        <div className={styles.subtitle}>Let's create a staff account!</div>

        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <input type="text" className={styles.input} id="StaffID" />
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="staffid">
            Staff ID
          </label>
        </div>

        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <input type="text" className={styles.input} id="StaffName" />
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="StaffName">
            Staff Name
          </label>
        </div>

        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <input type="text" className={styles.input} id="Address" />
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="address">
            Address
          </label>
        </div>

        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <input type="number" className={styles.input} id="PhoneNumber" />
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="phoneNumber">
            Phone Number
          </label>
        </div>

        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <input type="email" className={styles.input} id="Email" />
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="email">
            Email
          </label>
        </div>

        {/* Role Dropdown */}
        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <select className={styles.input} id="Role">
            <option value=""></option>
            <option value="Secretary">Secretary</option>
            <option value="Repairer">Repairer</option>
            <option value="StoreKeeper">Store Keeper</option>
            <option value="SpecialAssignment">Special Assignment</option>
          </select>
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="Role">
            Role
          </label>
        </div>

        <div className={`${styles.inputContainer} ${styles.ic2}`}>
          <input type="password" className={styles.input} id="Password" />
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="password">
            Password
          </label>
        </div>

        <div className={`${styles.inputContainer} ${styles.ic2}`}>
          <input
            type="password"
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
