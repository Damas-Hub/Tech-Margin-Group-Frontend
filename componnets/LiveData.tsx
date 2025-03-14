import React from "react";
import styles from "./LiveData.module.css";

interface LiveDataProps {
  icon: React.ReactNode;
  number: number;
  text: string;
}

const LiveData: React.FC<LiveDataProps> = ({ icon, number, text }) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.number}>{number}</div>
      <div className={styles.text}>{text}</div>
    </div>
  );
};

export default LiveData;
