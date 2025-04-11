import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./../../src/firebaseConfig";
import { AnimatePresence, motion } from "framer-motion";
import StaffProfile from "@/componnets/StaffProfile";
import StaffAccountForm from "@/componnets/StaffAccountForm";

const Staffs = () => {
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
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
            backDetails: "", // Optional: you can customize per role if needed
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
    <div
      style={{
        position: "relative",
        padding: "20px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          style={{
            marginLeft: "auto",
            padding: "10px 20px",
            backgroundColor: "#56021f",
            whiteSpace: "nowrap",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => setShowAddStaffModal(true)}
        >
          Add Staff
        </button>
      </div>

      {/* Grid of Staff Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          justifyContent: "center",
          marginTop: "50px",
        }}
      >
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
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
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
