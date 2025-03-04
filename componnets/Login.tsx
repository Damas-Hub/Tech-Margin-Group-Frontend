import React from "react";
import { useRouter } from "next/router"; // ✅ Use Next.js router
import styles from "./Login.module.css";

const Login = () => {
  const router = useRouter(); // ✅ Use useRouter instead of useNavigate

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
            <span
              className={styles.forgotPassword}
              onClick={() => router.push("/forgot-password")}  
              style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
            >
              Forgot Password?
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
