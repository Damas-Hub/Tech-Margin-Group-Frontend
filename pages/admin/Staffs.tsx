import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./../../src/firebaseConfig";
import { AnimatePresence, motion } from "framer-motion";
import StaffProfile from "@/componnets/StaffProfile";
import StaffAccountForm from "@/componnets/StaffAccountForm";
import styles from "./Staffs.module.css";

interface StaffMember {
  profilePic: string;
  name: string;
  staffId: string;
  contactNumber: string;
  role: string;
  backDetails: string;
}

const Staffs = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const staffCollection = collection(db, "staffs");
        const snapshot = await getDocs(staffCollection);

        const staffs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            profilePic: data.profilePic || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
            name: data.fullName || "",
            staffId: data.staff_id || "",
            contactNumber: data.phoneNumber || "",
            role: data.role || "",
            backDetails: "", 
          };
        });

        setStaffMembers(staffs);
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };

    fetchStaffs();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          className={styles.addButton}
          onClick={() => setShowAddStaffModal(true)}
        >
          Add Staff
        </button>
      </div>

      {/* Grid of Staff Cards */}
      <div className={styles.grid}>
        {staffMembers.map((staff, index) => (
          <StaffProfile key={index} {...staff} />
        ))}
      </div>

      {/* Add Staff Modal */}
      <AnimatePresence>
        {showAddStaffModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.modalOverlay}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={styles.modalContent}
            >
              <StaffAccountForm onClose={() => setShowAddStaffModal(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Staffs;