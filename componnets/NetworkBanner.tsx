import React from "react";
import useNetworkStatus from "../src/hooks/useNetworkStatus";
import styles from "./NetworkBanner.module.css";

const NetworkBanner = () => {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className={styles.banner}>
      🚫 No Internet Connection. Some features may not work.
    </div>
  );
};

export default NetworkBanner;
