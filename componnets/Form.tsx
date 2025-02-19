 
import React from 'react';
import styles from './Form.module.css';  

const Form: React.FC = () => {
  return (
    <div className={styles.formWrapper}>
      <div className={styles.form}>
        <div className={styles.title}>Welcome</div>
        <div className={styles.subtitle}>Let's create your account!</div>
        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <input placeholder="" type="text" className={styles.input} id="firstname" />
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="firstname">First name</label>
        </div>
        <div className={`${styles.inputContainer} ${styles.ic2}`}>
          <input placeholder="" type="text" className={styles.input} id="lastname" />
          <div className={styles.cut} />
          <label className={styles.iLabel} htmlFor="lastname">Last name</label>
        </div>
        <div className={`${styles.inputContainer} ${styles.ic2}`}>
          <input placeholder="" type="text" className={styles.input} id="email" />
          <div className={`${styles.cut} ${styles.cutShort}`} />
          <label className={styles.iLabel} htmlFor="email">Email</label>
        </div>
        <button className={styles.submit} type="button">Submit</button>
      </div>
    </div>
  );
}

export default Form;
