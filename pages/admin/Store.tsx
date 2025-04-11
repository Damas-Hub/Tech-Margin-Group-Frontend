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
import styles from "./Store.module.css";
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
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "store"), (snapshot) => {
      // Simulate slower loading for better UX (remove in production if too slow)
      setTimeout(() => {
        setItems(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as StoreItem)
          )
        );
        setLoading(false);
      }, 800); // 800ms delay
    });
    return () => unsubscribe();
  }, []);

  // ... (keep all your existing handler functions)

  const filteredItems = items
    .filter((item) =>
      Object.values(item).some((value) =>
        (typeof value === "string" ? value : String(value ?? ""))
          .toLowerCase()
          .includes((searchTerm ?? "").toLowerCase())
      )
    )
    .sort((a, b) => a.name.localeCompare(b.name)); // Alphabetical sorting A-Z

  const modalVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  // Button animation
  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" },
    tap: { scale: 0.98 },
  };

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  }

  async function addItem(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> {
    event.preventDefault();
    if (!newItem.name || !newItem.quantity || !newItem.price) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "store"), {
        name: newItem.name,
        quantity: Number(newItem.quantity),
        price: newItem.price,
        timestamp: serverTimestamp(),
      });
      toast.success("Item added successfully!");
      setNewItem({ name: "", quantity: "", price: "" });
      setShowModal(false);
    } catch (error) {
      console.error("Error adding item: ", error);
      toast.error("Failed to add item. Please try again.");
    }
  }

  function requestItemHandler(store: StoreItem): void {
    setRequestItem(store);
    setRequestQuantity(1); // Reset the request quantity to 1 when opening the modal
  }

  function editItemHandler(store: StoreItem): void {
    setEditItem(store);
    setEditQuantity(store.quantity); // Pre-fill the quantity with the current value
  }

  async function confirmRequest(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> {
    if (
      !requestItem ||
      requestQuantity < 1 ||
      requestQuantity > requestItem.quantity
    ) {
      toast.error("Invalid request quantity.");
      return;
    }

    try {
      // Decrease the store quantity
      const itemRef = doc(db, "store", requestItem.id);
      await updateDoc(itemRef, {
        quantity: requestItem.quantity - requestQuantity,
        updatedAt: serverTimestamp(),
      });

      // Add store id when requesting an item
      await addDoc(collection(db, "requestedItems"), {
        name: requestItem.name,
        quantityRequested: requestQuantity,
        status: "pending",
        storeId: requestItem.id, // Store the store item's id
        createdAt: serverTimestamp(),
      });

      toast.success(
        `Successfully requested ${requestQuantity} of ${requestItem.name}.`
      );
      setRequestItem(null);
    } catch (error) {
      console.error("Error processing request:", error);
      toast.error("Failed to process request. Please try again.");
    }
  }

  async function confirmEdit(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> {
    event.preventDefault();
    if (!editItem || editQuantity < 1) {
      toast.error("Invalid quantity.");
      return;
    }

    try {
      const itemRef = doc(db, "store", editItem.id);
      await updateDoc(itemRef, {
        quantity: editQuantity,
      });
      toast.success(`Successfully updated ${editItem.name} stock.`);
      setEditItem(null); // Close the modal
    } catch (error) {
      console.error("Error updating item: ", error);
      toast.error("Failed to update item. Please try again.");
    }
  }

  return (
    <div className={styles.storeWrapper}>
      <ToastContainer position="top-right" autoClose={3000} />

      <motion.button
        className={styles.addClientButton}
        onClick={() => setShowModal(true)}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Add Item
      </motion.button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className={styles.modalContent}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Add Item</h2>
              <input
                type="text"
                name="name"
                placeholder="Item Name"
                value={newItem.name}
                onChange={handleChange}
                className={styles.modalInput}
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={newItem.quantity}
                onChange={handleChange}
                className={styles.modalInput}
              />
              <input
                type="text"
                name="price"
                placeholder="Price"
                value={newItem.price}
                onChange={handleChange}
                className={styles.modalInput}
              />
              <div className={styles.buttonGroup}>
                <motion.button
                  className={styles.cancelButton}
                  onClick={() => setShowModal(false)}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Cancel
                </motion.button>
                <motion.button
                  className={styles.addButton}
                  onClick={addItem}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Add
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading store items...</p>
        </div>
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
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
                    >
                      Request Item
                    </motion.button>
                    <motion.button
                      className={styles.addButtonnn}
                      onClick={() => editItemHandler(store)}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Edit
                    </motion.button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.noResults}>
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Add similar AnimatePresence and motion.div for requestItem and editItem modals */}
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
              transition={{ type: "spring", damping: 25 }}
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
              transition={{ type: "spring", damping: 25 }}
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
    </div>
  );
};

export default Store;
