import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaCopy } from "react-icons/fa";
import { auth, db } from "../src/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./StaffAccountForm.module.css";
import { getSecondaryAuth } from "../src/firebaseConfig";
import { deleteApp } from "firebase/app";

const StaffAccountForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [staffId, setStaffId] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);
  

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-10) + "Aa1!";
  };

  const generateStaffId = async (role: string): Promise<string> => {
    if (role === "Special Assignment") return staffId; // Manual input

    const rolePrefixes: { [key: string]: string } = {
      Secretary: "Secretary",
      Repairer: "Repairer",
      "Store Keeper": "StoreKeeper",
    };

    const prefix = rolePrefixes[role];
    if (!prefix) return "";

    const staffCollection = collection(db, "staffs");
    const q = query(staffCollection, where("role", "==", role));
    const querySnapshot = await getDocs(q);

    let maxNumber = 0;
    querySnapshot.forEach((doc) => {
      const id = doc.data().staff_id;
      const match = id.match(/\d+$/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (num > maxNumber) maxNumber = num;
      }
    });

    const nextNumber = (maxNumber + 1).toString().padStart(3, "0");
    return `${prefix}${nextNumber}`;
  };

  const handleSubmit = async () => {
    if (!role || !email || (role === "Special Assignment" && !staffId)) {
      toast.error("All fields are required!");
      return;
    }

    const password = generateRandomPassword();
    setGeneratedPassword(password);

    try {
      const secondaryAuth = getSecondaryAuth(); // 👈 use secondary auth

      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        password
      );
      const user = userCredential.user;

      const newStaffId = await generateStaffId(role);

      await setDoc(doc(db, "staffs", user.uid), {
        uid: user.uid,
        staff_id: newStaffId,
        email,
        role,
        isFirstLogin: true,
        createdAt: serverTimestamp(),
        name: "",
        phone: "",
        address: "",
      });

      setStaffId(newStaffId);
      setAccountCreated(true);
      toast.success(
        "Staff account created successfully! Copy the password below."
      );

      // ✅ Cleanup secondary app
      await deleteApp(secondaryAuth.app);
    } catch (error: any) {
      console.error("❌ Error during account creation:", error);

      let errorMessage = "Account creation failed. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already associated with an account.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Use a stronger one.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format. Please check and try again.";
      }

      toast.error(errorMessage);
    }
  };

  const copyToClipboard = () => {
    const textArea = document.createElement("textarea");
    textArea.value = generatedPassword;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alert("Copied to clipboard!");
  };

  return (
    <div className={`${styles.formWrapper} ${isVisible ? styles.visible : ""}`}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={`${styles.form} ${isVisible ? styles.formVisible : ""}`}>
        <div className={styles.title}>Welcome</div>
        <div className={styles.subtitle}>Let's Create Staff Account!</div>

        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <input
            type="text"
            className={styles.input}
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            placeholder="Staff ID"
          />
        </div>

        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>

        <div className={`${styles.inputContainer} ${styles.ic1}`}>
          <select
            className={styles.input}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="Secretary">Secretary</option>
            <option value="Repairer">Repairer</option>
            <option value="Store Keeper">Store Keeper</option>
          </select>
        </div>

        {/* Display Generated Password After Account Creation */}
        {accountCreated && (
          <div className={styles.generatedPasswordContainer}>
            <div className={styles.generatedPassword}>
              <span>{generatedPassword}</span>
              <button onClick={copyToClipboard} className={styles.copyButton}>
                <FaCopy size={18} />
              </button>
            </div>
            <p className={styles.passwordNote}>
              Copy this password and share it with the staff.
            </p>
          </div>
        )}

        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`${styles.button} ${styles.submitButton}`}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffAccountForm;
