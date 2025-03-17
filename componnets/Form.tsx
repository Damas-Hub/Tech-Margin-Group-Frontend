import React, { useEffect, useState } from "react";
import { db } from "../src/firebaseConfig";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Form.module.css";

const Form: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValidStaff, setIsValidStaff] = useState(false);
  const [staffIdChecked, setStaffIdChecked] = useState(false);
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

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Check if staff_id exists in Firestore
  const checkStaffId = async () => {
    if (!formData.staff_id.trim()) {
      toast.error("Please enter a Staff ID.");
      return;
    }

    try {
      setLoading(true);

      // Query Firestore for staff_id inside users collection
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("staff_id", "==", formData.staff_id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setIsValidStaff(true);
        setStaffIdChecked(true);
        toast.success("Staff ID verified. You can proceed.");
      } else {
        setIsValidStaff(false);
        setStaffIdChecked(true);
        toast.error("Invalid Staff ID. Please contact the admin.");
      }
    } catch (error: any) {
      console.error("Error checking staff ID:", error.message);
      toast.error("Error verifying Staff ID. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidStaff) {
      toast.error("Please verify your Staff ID before proceeding.");
      return;
    }

    const { staff_id, fullName, address, phoneNumber, dateOfBirth } = formData;

    if (!fullName || !address || !phoneNumber || !dateOfBirth) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setLoading(true);

      // Save to Firestore
      const userDoc = doc(db, "users", staff_id);
      await setDoc(userDoc, {
        staff_id,
        fullName,
        address,
        phoneNumber,
        dateOfBirth,
      });

      toast.success("Profile updated successfully!");
      setFormData({ staff_id: "", fullName: "", address: "", phoneNumber: "", dateOfBirth: "" });
      setIsValidStaff(false);
      setStaffIdChecked(false);
    } catch (error: any) {
      console.error("Error saving data:", error.message);
      toast.error("Error saving data. Try again.");
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
          {/* Staff ID Input */}
          <div className={`${styles.inputContainer} ${styles.ic1}`}>
            <input
              placeholder="Staff ID"
              type="text"
              name="staff_id"
              value={formData.staff_id}
              onChange={handleChange}
              className={styles.input}
              required
              disabled={staffIdChecked} // Disable input after verification
            />
            <button
              type="button"
              className={styles.verifyButton}
              onClick={checkStaffId}
              disabled={loading || staffIdChecked}
            >
              {loading ? "Checking..." : "Verify"}
            </button>
          </div>

          {/* Show form only if staff ID is valid */}
          {isValidStaff && (
            <>
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
                  type="number"
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
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Form;
