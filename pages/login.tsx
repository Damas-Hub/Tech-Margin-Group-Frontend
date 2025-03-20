import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../src/firebaseConfig";
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import styles from "../componnets/Login.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const router = useRouter();
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);  

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);  
    }, 2000);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Find the email associated with the entered staff ID
      const userQuery = query(collection(db, "users"), where("staff_id", "==", staffId));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        toast.error("Invalid Staff ID!");
        setLoading(false);
        return;
      }

      const userData = querySnapshot.docs[0].data();
      const userEmail = userData.email; // Retrieve associated email

      // Step 2: Log in using email & password
      const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        console.log("User Data:", userData);

        if (userData.isFirstLogin) {
          toast.success("Login successful! Redirecting to Change Password...");
          setTimeout(() => {
            router.push("/change-password");  
          }, 2000);
          return;
        }

        toast.success("Login successful! Redirecting...", { autoClose: 2000 });
        setTimeout(() => {
          if (userData.role === "Admin") {
            router.push("/admin/AdminDashboard");
          } else {
            switch (userData.role) {
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
          }
        }, 2000);
      } else {
        toast.error("User not found in Firestore.");
      }
    } catch (error: any) {
      toast.error("Invalid Staff ID or Password.");
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
              placeholder="Staff ID"
              type="text"
              className={styles.input}
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
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
                className={`${styles.eyeIcon} ${styles.passwordWrapper}`}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <span
              className={styles.forgotPassword}
              onClick={() => router.push("/forgot-password")}
              style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
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
