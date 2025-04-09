import React, { useEffect, useState } from "react";
import { db, auth } from "../src/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Form.module.css";

const Form: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userUid, setUserUid] = useState("");
  const [formData, setFormData] = useState({
    staff_id: "",
    fullName: "",
    email: "",
    address: "",
    phoneNumber: "",
    dateOfBirth: "",
  });

  // 🔹 Fetch logged-in user data
  useEffect(() => {
    setIsVisible(true);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);

        const staffRef = doc(db, "staffs", user.uid);
        const staffSnap = await getDoc(staffRef);

        if (staffSnap.exists()) {
          const staffData = staffSnap.data();

          setFormData({
            staff_id: staffData.staff_id || "",
            fullName: staffData.fullName || "",
            email: staffData.email || user.email || "",
            address: staffData.address || "",
            phoneNumber: staffData.phoneNumber || "",
            dateOfBirth: staffData.dateOfBirth || "",
          });
        } else {
          toast.error("Staff record not found.");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { fullName, address, phoneNumber, dateOfBirth } = formData;

    if (!fullName || !address || !phoneNumber || !dateOfBirth) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      const staffRef = doc(db, "staffs", userUid);

      await updateDoc(staffRef, {
        fullName,
        address,
        phoneNumber,
        dateOfBirth,
      });

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating staff profile:", error.message);
      toast.error(`Error updating profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.formWrapper} ${isVisible ? styles.visible : ""}`}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={`${styles.form} ${isVisible ? styles.formVisible : ""}`}>
        <div className={styles.title}>Update Staff Profile</div>
        <form onSubmit={handleSubmit}>
          {/* Staff ID - Read Only */}
          {/* Staff ID - Read Only */}
          <div className={`${styles.inputContainer} ${styles.ic1}`}>
            <input
              id="staff_id"
              type="text"
              name="staff_id"
              value={formData.staff_id}
              className={styles.input}
              readOnly
            />
            <div className={styles.cut}></div>
            <label htmlFor="staff_id" className={styles.iLabel}>
              Staff ID
            </label>
          </div>

          {/* Email - Read Only */}
          <div className={`${styles.inputContainer} ${styles.ic1}`}>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              className={styles.input}
              readOnly
            />
            <div className={styles.cut}></div>
            <label htmlFor="email" className={styles.iLabel}>
              Email
            </label>
          </div>

          {/* Full Name */}
          <div className={`${styles.inputContainer} ${styles.ic1}`}>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <div className={styles.cut}></div>
            <label htmlFor="fullName" className={styles.iLabel}>
              Full Name
            </label>
          </div>

          {/* Address */}
          <div className={`${styles.inputContainer} ${styles.ic1}`}>
            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <div className={styles.cut}></div>
            <label htmlFor="address" className={styles.iLabel}>
              Address
            </label>
          </div>

          {/* Phone Number */}
          <div className={`${styles.inputContainer} ${styles.ic1}`}>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <div className={styles.cut}></div>
            <label htmlFor="phoneNumber" className={styles.iLabel}>
              Phone Number
            </label>
          </div>

          {/* Date of Birth */}
          <div className={`${styles.inputContainer} ${styles.ic2}`}>
            <input
              id="dateOfBirth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <div className={styles.cut}></div>
            <label htmlFor="dateOfBirth" className={styles.iLabel}>
              Date of Birth
            </label>
          </div>

          <div className={styles.buttonContainer}>
            <button
              className={`${styles.button} ${styles.cancelButton}`}
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`${styles.button} ${styles.submitButton}`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
