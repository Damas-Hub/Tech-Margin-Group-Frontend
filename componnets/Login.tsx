import React from "react";
import styles from "./Login.module.css";

const Login = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.imageSide}></div>
      <div className={styles.formSide}>
        <div className={styles.container}>
          <div className={styles.heading}>Sign In</div>
          <form className={styles.form}>
            <input
              placeholder="Staff-ID"
              id="staff-id"
              name="staff-id"
              type="text"
              className={styles.input}
              required
            />
            <input
              placeholder="Password"
              id="password"
              name="password"
              type="password"
              className={styles.input}
              required
            />
            <span className={styles.forgotPassword}>
              <a href="#">Forgot Password?</a>
            </span>
            <button type="submit" className={styles.loginButton}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
