import React, { useEffect, useState } from "react";
import { auth, db } from "../src/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Form.module.css";

const Form: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.address || !formData.phoneNumber || !formData.dateOfBirth) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        toast.error("User not found. Please log in again.");
        return;
      }

      // Save data to Firestore under "staff" collection
      const staffRef = doc(db, "staff", user.uid);
      await setDoc(staffRef, {
        fullName: formData.fullName,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        uid: user.uid,
      });

      toast.success("Profile updated successfully!");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error("Error saving data:", error.message);
      toast.error("Failed to save data. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.formWrapper} ${isVisible ? styles.visible : ""}`}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={`${styles.form} ${isVisible ? styles.formVisible : ""}`}>
        <div className={styles.title}>Welcome</div>
        <div className={styles.subtitle}>Let's Complete Your Profile!</div>

        <form onSubmit={handleSubmit}>
          <div className={`${styles.inputContainer} ${styles.ic1}`}>
            <input
              placeholder=""
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={styles.input}
              id="fullName"
              required
            />
            <div className={styles.cut} />
            <label className={styles.iLabel} htmlFor="fullName">
              Full Name
            </label>
          </div>

          <div className={`${styles.inputContainer} ${styles.ic1}`}>
            <input
              placeholder=""
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={styles.input}
              id="address"
              required
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
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={styles.input}
              id="phoneNumber"
              required
            />
            <div className={styles.cut} />
            <label className={styles.iLabel} htmlFor="phoneNumber">
              Phone Number
            </label>
          </div>

          <div className={`${styles.inputContainer} ${styles.ic2}`}>
            <input
              placeholder=""
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={styles.input}
              id="dateOfBirth"
              required
            />
            <div className={`${styles.cut} ${styles.cutShort}`} />
            <label className={styles.iLabel} htmlFor="dateOfBirth">
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
