import React, { useState, useEffect } from "react";
import { db } from "../../src/firebaseConfig";
import {
  collection,
  updateDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import styles from "../admin/Store.module.css";
import Spinner from "@/componnets/Spinner";

interface RequestedItem {
  id: string;
  name: string;
  quantityRequested: number;
  status: string; // "pending", "approved", "rejected"
  storeId: string; // ID of the corresponding store item
}

const RequestedItems: React.FC = () => {
  const [requestedItems, setRequestedItems] = useState<RequestedItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "requestedItems"),
      (snapshot) => {
        setRequestedItems(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as RequestedItem)
          )
        );
      }
    );

    return () => unsubscribe();
  }, []);

  const handleApprove = async (item: RequestedItem) => {
    if (item.status === "approved") return;

    setLoading(true);

    try {
      const requestedItemRef = doc(db, "requestedItems", item.id);
      await updateDoc(requestedItemRef, {
        status: "approved",
        updatedAt: serverTimestamp(),
      });

      const storeItemRef = doc(db, "store", item.storeId);
      const storeItem = await getDoc(storeItemRef);

      if (storeItem.exists()) {
        const updatedQuantity =
          storeItem.data()?.quantity - item.quantityRequested;
        await updateDoc(storeItemRef, { quantity: updatedQuantity });

        toast.success(`${item.name} request approved!`);
      } else {
        toast.error("Store item not found.");
      }
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (item: RequestedItem) => {
    if (item.status === "rejected") return;

    setLoading(true);

    try {
      const requestedItemRef = doc(db, "requestedItems", item.id);
      await updateDoc(requestedItemRef, {
        status: "rejected",
        updatedAt: serverTimestamp(),
      });

      const storeItemRef = doc(db, "store", item.storeId);
      const storeItem = await getDoc(storeItemRef);

      if (storeItem.exists()) {
        const updatedQuantity =
          storeItem.data()?.quantity + item.quantityRequested;
        await updateDoc(storeItemRef, { quantity: updatedQuantity });

        toast.success(
          `${item.name} request rejected, quantity added back to stock!`
        );
      } else {
        toast.error("Store item not found.");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Sort items by status: pending first, then approved, then rejected
  const sortedRequestedItems = [...requestedItems].sort((a, b) => {
    const statusOrder: Record<RequestedItem["status"], number> = {
      pending: 1,
      approved: 2,
      rejected: 3,
    };
    return (
      statusOrder[a.status as RequestedItem["status"]] -
      statusOrder[b.status as RequestedItem["status"]]
    );
  });

  return (
    <div className={styles.storeWrapper}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 style={{ color: "black" }}>Add Client Details</h2>

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
            {sortedRequestedItems.map((item) => (
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
                    <div className={styles.actionButtons}>
                      <motion.button
                        className={styles.addButt}
                        onClick={() => handleApprove(item)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Approve
                      </motion.button>
                      <motion.button
                        className={styles.addButt}
                        onClick={() => handleReject(item)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Reject
                      </motion.button>
                    </div>
                  ) : (
                    loading && (
                      <Spinner size="40" color="gray" aria-label="loading" />
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
