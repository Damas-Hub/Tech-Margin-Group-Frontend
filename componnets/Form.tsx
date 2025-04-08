import React, { useEffect, useState } from "react";
import { db } from "../src/firebaseConfig";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Form.module.css";

const Form: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    staff_id: "",
    fullName: "",
    address: "",
    phoneNumber: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { staff_id, fullName, address, phoneNumber, dateOfBirth } = formData;

    if (!staff_id || !fullName || !address || !phoneNumber || !dateOfBirth) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setLoading(true);

      // 🔹 Query Firestore to find staff where staff_id matches
      const staffsRef = collection(db, "staffs");
      const q = query(staffsRef, where("staff_id", "==", staff_id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // 🔹 Get the first document (assuming staff_id is unique)
        const staffDoc = querySnapshot.docs[0];
        const staffDocRef = doc(db, "staffs", staffDoc.id);

        // 🔹 Update the staff profile
        await updateDoc(staffDocRef, {
          fullName,
          address,
          phoneNumber,
          dateOfBirth,
        });

        toast.success("Profile updated successfully!");
      } else {
        console.error("Staff ID not found in Firestore:", staff_id);
        toast.error("Staff profile not found. Please check the ID.");
      }
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
          <div className={`${styles.inputContainer} ${styles.ic1}`}>
            <input
              placeholder="Staff ID (Enter manually)"
              type="text"
              name="staff_id"
              value={formData.staff_id}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={`${styles.inputContainer} ${styles.ic1}`}>
            <input
              placeholder="Full Name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={`${styles.inputContainer} ${styles.ic1}`}>
            <input
              placeholder="Address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={`${styles.inputContainer} ${styles.ic1}`}>
            <input
              placeholder="Phone Number"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={`${styles.inputContainer} ${styles.ic2}`}>
            <input
              placeholder="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.buttonContainer}>
            <button className={`${styles.button} ${styles.cancelButton}`} type="button" onClick={onClose}>
              Cancel
            </button>
            <button className={`${styles.button} ${styles.submitButton}`} type="submit" disabled={loading}>
              {loading ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
