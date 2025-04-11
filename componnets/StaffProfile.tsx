import React from "react";
import styles from "./StaffProfile.module.css";

interface StaffProfileProps {
  profilePic?: string;
  name?: string;
  staffId?: string;
  role?: string;
  contactNumber?: string;
  backDetails?: string;
}

const roleDescriptions: Record<string, string> = {
  Secretary: "Responsible for handling administrative tasks and ensuring smooth operations.",
  Repairer: "Handles repairs and maintenance tasks with efficiency.",
  "Store Keeper": "Manages inventory, tools, and ensures stock availability for operations.",
  Admin: "Oversees the entire system and manages staff responsibilities.",
};

const StaffProfile: React.FC<StaffProfileProps> = ({
  profilePic = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
  name = "",
  staffId = "",
  role = "",
  contactNumber = "",
  backDetails,
}) => {
  const defaultBackDetails = role ? roleDescriptions[role] || "No details provided for this role." : "No role assigned yet.";

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.front}>
          <div className={styles.cardTop}></div>
          <img src={profilePic} alt="Profile" className={styles.profileImage} />
          <p className={styles.heading}>{role || "No Role"}</p>
          <p className={styles.follow}>{name || "Unnamed"}</p>
          <p className={styles.name}>Staff ID: {staffId || "N/A"}</p>
          <p className={styles.name}>Contact: {contactNumber || "N/A"}</p>
        </div>
        <div className={styles.back}>
          <p className={styles.heading}>Additional Info</p>
          <p className={styles.details}>{backDetails || defaultBackDetails}</p>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
