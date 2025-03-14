import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db, signInWithEmailAndPassword } from "../src/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import styles from "../componnets/Login.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); // Page loading state

  // Simulate a loading screen before showing the login form
  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false); // Hide preloader after 2 seconds
    }, 2000);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        const userData = userSnap.data();
        console.log("User Data:", userData);
  
        // Check if this is the user's first login
        if (userData.isFirstLogin) {
          toast.success("Login successful! Redirecting to Change Password...");
          setTimeout(() => {
            router.push("/change-password");  
          }, 2000);
          return;
        }
  
        // Normal role-based redirection
        toast.success("Login successful! Redirecting...", { autoClose: 2000 });
  
        setTimeout(() => {
          switch (userData.role) {
            case "Admin":
              router.push("/admin/AdminDashboard");
              break;
            case "Repairer":
              router.push("/repairer/RepairerDashboard");
              break;
            case "Secretary":
              router.push("/secretary/SecretaryDashboard");
              break;
            case "Store Keeper":
              router.push("/store/StoreKeeperDashboard");
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
            <div className={styles.passwordWrapper}>
              <input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <span
              className={styles.forgotPassword}
              onClick={() => router.push("/forgot-password")}
              style={{
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              }}
            >
              Forgot Password?
            </span>
            <button
              type="submit"
              className={styles.loginButton}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
