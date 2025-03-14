import React, { useState } from "react";
import { useRouter } from "next/router";
import { auth, db, signInWithEmailAndPassword } from "../src/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import styles from "./Login.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user details from Firestore using email
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        console.log("User Data:", userData);

        // success toast
        toast.success("Login successful! Redirecting...", { autoClose: 2000 });

        // Redirect based on role
        setTimeout(() => {
          switch (userData.role) {
            case "Admin":
              router.push("/admin/AdminDashboard");
              break;
            case "Repairer":
              router.push("/repairer/Dashboard");
              break;
            case "Secretary":
              router.push("/secretary/Dashboard");
              break;
            case "Store Keeper":
              router.push("/store/Dashboard");
              break;
            default:
              toast.error("Invalid role. Contact Admin.");
          }
        }, 2000);
      } else {
        toast.error("User not found in Firestore.");
      }
    } catch (error: any) {
      toast.error("Invalid email or password.");
      console.error("Login Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <ToastContainer position="top-right" />
      <div className={styles.imageSide}></div>
      <div className={styles.formSide}>
        <div className={styles.container}>
          <div className={styles.heading}>Welcome back!</div>
          <div className={styles.subheading}>Sign in to your account</div>
          <form className={styles.form} onSubmit={handleLogin}>
            <input
              placeholder="Email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              placeholder="Password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className={styles.forgotPassword}
              onClick={() => router.push("/forgot-password")}
              style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
            >
              Forgot Password?
            </span>
            <button type="submit" className={styles.loginButton} disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
