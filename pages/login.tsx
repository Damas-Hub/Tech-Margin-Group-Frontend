import React, { useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../src/firebaseConfig";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import styles from ".././componnets/Login.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const router = useRouter();
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let userEmail: string | null = null;
      let userRole: string | null = null;
      let userCollection: "staffs" | "users" | null = null;
      let userId: string | null = null;
      let isFirstLogin = false;

      // 🔍 Step 1: Check in "staffs" collection first
      const staffQuery = query(
        collection(db, "staffs"),
        where("staff_id", "==", staffId)
      );
      const staffSnapshot = await getDocs(staffQuery);

      if (!staffSnapshot.empty) {
        const staffData = staffSnapshot.docs[0].data();
        userEmail = staffData.email;
        userRole = staffData.role;
        userCollection = "staffs";
        userId = staffSnapshot.docs[0].id;
        isFirstLogin = staffData.isFirstLogin ?? true; // Default to true if missing
      } else {
        const adminQuery = query(
          collection(db, "users"),
          where("staff_id", "==", staffId)
        );
        const adminSnapshot = await getDocs(adminQuery);

        if (!adminSnapshot.empty) {
          const adminData = adminSnapshot.docs[0].data();
          userEmail = adminData.email;
          userRole = adminData.role;
          userCollection = "users";
          userId = adminSnapshot.docs[0].id;
          isFirstLogin = false; // Admin doesn't need to change password
        }
      }

      // 🚨 Step 3: Ensure user was found
      if (!userEmail || !userId || !userCollection) {
        toast.error("Invalid Staff ID!");
        setLoading(false);
        return;
      }

      // 🔐 Step 4: Sign in with Email & Password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userEmail,
        password
      );
      const user = userCredential.user;

      // 🔄 Fetch user data from Firestore
      const userRef = doc(db, userCollection, userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        toast.error("User not found in Firestore.");
        return;
      }

      // 🔄 Step 5: Redirect if First Login (Staff Only)
      if (userCollection === "staffs" && isFirstLogin) {
        toast.success("Login successful! Redirecting to Change Password...");
        setTimeout(() => {
          router.push("/change-password");
        }, 2000);
        return;
      }

      // 🔄 Step 6: Redirect Based on Role
      toast.success("Login successful! Redirecting...", { autoClose: 2000 });

      setTimeout(() => roleRedirect(userRole), 2000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Invalid Staff ID or Password.");
        console.error("Login Error:", error.message);
      } else {
        toast.error("An unexpected error occurred.");
        console.error("Unknown error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Function to handle role-based redirects
  const roleRedirect = (role: string | null) => {
    if (role === "Admin") {
      router.push("/admin/AdminDashboard");
    } else {
      const rolePaths: { [key: string]: string } = {
        Repairer: "/repairer/RepairerDashboard",
        Secretary: "/secretary/SecretaryDashboard",
        "Store Keeper": "/store/StoreKeeperDashboard",
      };

      if (role && rolePaths[role]) {
        router.push(rolePaths[role]);
      } else {
        toast.error("Invalid role. Contact Admin.");
      }
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
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            <span
              className={styles.forgotPassword}
              onClick={() => router.push("/forgot-password")}
              style={{
                cursor: "pointer",
                color: "wheat",
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
