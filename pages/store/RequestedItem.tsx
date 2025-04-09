import React, { useState, useEffect } from "react";
import { db } from "../../src/firebaseConfig";
import { collection, updateDoc, doc, serverTimestamp, onSnapshot, getDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion"; // Import Framer Motion for animations
import styles from "../admin/Store.module.css";
import Spinner from "@/componnets/Spinner";

interface RequestedItem {
  id: string;
  name: string;
  quantityRequested: number;
  status: string;  // "pending", "approved", "rejected"
  storeId: string; // ID of the corresponding store item
}

const RequestedItems: React.FC = () => {
  const [requestedItems, setRequestedItems] = useState<RequestedItem[]>([]);
  const [loading, setLoading] = useState(false); // For loader state

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "requestedItems"), (snapshot) => {
      setRequestedItems(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as RequestedItem))
      );
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (item: RequestedItem) => {
    if (item.status === "approved") return;

    setLoading(true); // Show loader when starting the approve action

    try {
      const requestedItemRef = doc(db, "requestedItems", item.id);
      await updateDoc(requestedItemRef, { status: "approved", updatedAt: serverTimestamp() });

      const storeItemRef = doc(db, "store", item.storeId);
      const storeItem = await getDoc(storeItemRef);

      if (storeItem.exists()) {
        const updatedQuantity = storeItem.data()?.quantity - item.quantityRequested;
        await updateDoc(storeItemRef, { quantity: updatedQuantity });

        toast.success(`${item.name} request approved!`);
      } else {
        toast.error("Store item not found.");
      }
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request. Please try again.");
    } finally {
      setLoading(false); // Hide loader after action completes
    }
  };

  const handleReject = async (item: RequestedItem) => {
    if (item.status === "rejected") return;

    setLoading(true); // Show loader when starting the reject action

    try {
      const requestedItemRef = doc(db, "requestedItems", item.id);
      await updateDoc(requestedItemRef, { status: "rejected", updatedAt: serverTimestamp() });

      const storeItemRef = doc(db, "store", item.storeId);
      const storeItem = await getDoc(storeItemRef);

      if (storeItem.exists()) {
        const updatedQuantity = storeItem.data()?.quantity + item.quantityRequested;
        await updateDoc(storeItemRef, { quantity: updatedQuantity });

        toast.success(`${item.name} request rejected, quantity added back to stock!`);
      } else {
        toast.error("Store item not found.");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request. Please try again.");
    } finally {
      setLoading(false); // Hide loader after action completes
    }
  };

  return (
    <div className={styles.requestedItemsContainer}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Requested Items</h2>
      {requestedItems.length === 0 ? (
        <p>No requests yet</p>
      ) : (
        <table className={styles.storeTable}>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity Requested</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requestedItems.map((item) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <td>{item.name}</td>
                <td>{item.quantityRequested}</td>
                <td>{item.status}</td>
                <td>
                  {item.status === "pending" && !loading ? (
                    <>
                      <motion.button
                        className={styles.addButton}
                        onClick={() => handleApprove(item)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Approve
                      </motion.button>
                      <motion.button
                        className={styles.addButton}
                        onClick={() => handleReject(item)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Reject
                      </motion.button>
                    </>
                  ) : (
                    loading && (
                      <Spinner
                        size="40"
                        color="gray"
                        aria-label="loading"
                      />
                    )
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RequestedItems;
