import React from "react";
import styles from "./Form.module.css";
import { AiOutlineClose } from "react-icons/ai";

const Form: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className={styles.formWrapper}>
      <div className={styles.form}>
        <AiOutlineClose className={styles.closeIcon} onClick={onClose} />
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

        {/* Role Dropdown */}
        {/*   <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <select className={styles.input} id="Role">
            <option value="">Select Role</option>
            <option value="Secretary">Secretary</option>
            <option value="Repairer">Repairer</option>
            <option value="Store Keeper">Store Keeper</option>
            <option value="Special Assignment">Special Assignment</option>
          </select>
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="Role">
            Role
          </label>
        </div> */}
      {/*   <div className={`${styles.inputContainer} ${styles.ic2}`}>
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
        </div> */}
        <div className={`${styles.inputContainer} ${styles.ic2}`}>
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
        <button className={styles.submit} type="button">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Form;
