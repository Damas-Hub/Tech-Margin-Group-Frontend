import React from "react";
import styles from "./StaffProfile.module.css";

interface StaffProfileProps {
  profilePic: string;
  name: string;
  staffId: string;
  role: string;
  contactNumber: string;
}

const StaffProfile: React.FC<StaffProfileProps> = ({
  profilePic,
  name,
  staffId,
  role,
  contactNumber,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.front}>
          <div className={styles.cardTop}></div>
          <img src={profilePic} alt="Profile" className={styles.profileImage} />
          <p className={styles.heading}>{role}</p>
          <p className={styles.follow}>{name}</p>
          <p className={styles.follow}>Staff ID: {staffId}</p>
          <p className={styles.follow}>Contact: {contactNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
