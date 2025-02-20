import React from "react";
import styles from "./StaffProfile.module.css";

interface StaffProfileProps {
  profilePic: string;
  name: string;
  staffId: string;
  role: string;
  contactNumber: string;
  backDetails: string;
}

const StaffProfile: React.FC<StaffProfileProps> = ({
  profilePic,
  name,
  staffId,
  role,
  contactNumber,
  backDetails,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.front}>
          <div className={styles.cardTop}></div>
          <img src={profilePic} alt="Profile" className={styles.profileImage} />
          <p className={styles.heading}>{role}</p>
          <p className={styles.follow}>{name}</p>
          <p className={styles.name}>Staff ID: {staffId}</p>
          <p className={styles.name}>Contact: {contactNumber}</p>
        </div>
        <div className={styles.back}>
          <p className={styles.heading}>Additional Info</p>
          <p className={styles.details}>{backDetails}</p>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
