import React from "react";
import styles from "./Form.module.css";
import { AiOutlineClose } from "react-icons/ai";

const StaffAccountForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className={styles.formWrapper}>
      <div className={styles.form}>
        <AiOutlineClose className={styles.closeIcon} onClick={onClose} />
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
            type="pasword"
            className={styles.input}
            id="  Password"
          />
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="phoneNumber">
            Password
          </label>
        </div>
        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <input
            placeholder=""
            type="Comfirmpasword"
            className={styles.input}
            id="ComfirmPassword"
          />
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="phoneNumber">
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

export default StaffAccountForm;
