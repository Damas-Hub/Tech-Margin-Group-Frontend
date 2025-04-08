import React, { useState, useEffect } from "react";
import { db } from "../../src/firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../admin/Store.module.css";
import { motion, AnimatePresence } from "framer-motion";

interface StoreItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
}

interface StoreProps {
  searchTerm: string;
  staffRole: string;
}

const Store: React.FC<StoreProps> = ({ searchTerm, staffRole }) => {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", price: "" });
  const [showModal, setShowModal] = useState(false);
  const [requestItem, setRequestItem] = useState<StoreItem | null>(null);
  const [requestQuantity, setRequestQuantity] = useState<number>(1);
  const [editItem, setEditItem] = useState<StoreItem | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "store"), (snapshot) => {
      setTimeout(() => {
        setItems(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as StoreItem))
        );
        setLoading(false);
      }, 500);
    });
    return () => unsubscribe();
  }, []);

  // ... (keep all your existing handler functions)

  const filteredItems = items.filter((item) =>
    Object.values(item).some((value) =>
      (typeof value === "string" ? value : String(value ?? ""))
        .toLowerCase()
        .includes((searchTerm ?? "").toLowerCase())
    )
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    },
    exit: { opacity: 0, scale: 0.9 }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
    },
    tap: { scale: 0.98 }
  };

  async function confirmEdit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    if (!editItem) return;

    try {
      const itemRef = doc(db, "store", editItem.id);
      await updateDoc(itemRef, {
        quantity: editQuantity,
        updatedAt: serverTimestamp(),
      });

      toast.success(`${editItem.name} stock updated successfully!`);
      setEditItem(null);
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item stock. Please try again.");
    }
  }

  function requestItemHandler(store: StoreItem): void {
    if (store.quantity > 0) {
      setRequestItem(store);
      setRequestQuantity(1); 
    } else {
      toast.error("This item is out of stock.");
    }
  }

  async function confirmRequest(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    if (!requestItem || requestQuantity < 1 || requestQuantity > requestItem.quantity) {
      toast.error("Invalid request quantity.");
      return;
    }

    try {
      const itemRef = doc(db, "store", requestItem.id);
      await updateDoc(itemRef, {
        quantity: requestItem.quantity - requestQuantity,
        updatedAt: serverTimestamp(),
      });

      toast.success(`Successfully requested ${requestQuantity} of ${requestItem.name}.`);
      setRequestItem(null);
    } catch (error) {
      console.error("Error processing request:", error);
      toast.error("Failed to process request. Please try again.");
    }
  }

  return (
    <motion.div 
      className={styles.storeWrapper}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <ToastContainer position="top-right" autoClose={3000} />

      {loading ? (
        <motion.div 
          className={styles.loadingContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className={styles.loadingSpinner}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <p>Loading items...</p>
        </motion.div>
      ) : (
        <table className={styles.storeTable}>
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((store: StoreItem, index: number) => (
                <motion.tr
                  key={store.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01, backgroundColor: "rgba(86, 2, 31, 0.03)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <td>{index + 1}</td>
                  <td>{store.name}</td>
                  <td>{store.quantity}</td>
                  <td>GH₵{Number(store.price).toFixed(2)}</td>
                  <td>
                    <motion.button
                      className={styles.addButton}
                      onClick={() => requestItemHandler(store)}
                      disabled={store.quantity === 0}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 + 0.3 }}
                    >
                      Request Item
                    </motion.button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <td colSpan={5} className={styles.noResults}>
                  No items found
                </td>
              </motion.tr>
            )}
          </tbody>
        </table>
      )}

      <AnimatePresence>
        {requestItem && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setRequestItem(null)}
          >
            <motion.div
              className={styles.modalContent}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Request {requestItem.name}</h2>
              <p>Available: {requestItem.quantity}</p>
              <input
                type="number"
                min="1"
                max={requestItem.quantity}
                value={requestQuantity}
                onChange={(e) => setRequestQuantity(Number(e.target.value))}
                className={styles.modalInput}
              />
              <div className={styles.buttonGroup}>
                <motion.button
                  className={styles.cancelButton}
                  onClick={() => setRequestItem(null)}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Cancel
                </motion.button>
                <motion.button
                  className={styles.addButton}
                  onClick={confirmRequest}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Confirm
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editItem && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditItem(null)}
          >
            <motion.div
              className={styles.modalContent}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Edit {editItem.name} Stock</h2>
              <input
                type="number"
                min="1"
                value={editQuantity}
                onChange={(e) => setEditQuantity(Number(e.target.value))}
                className={styles.modalInput}
              />
              <div className={styles.buttonGroup}>
                <motion.button
                  className={styles.cancelButton}
                  onClick={() => setEditItem(null)}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Cancel
                </motion.button>
                <motion.button
                  className={styles.addButton}
                  onClick={confirmEdit}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Update
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Store;