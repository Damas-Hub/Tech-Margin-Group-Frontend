import React, { useState, useEffect } from "react";
import { db } from "../../src/firebaseConfig";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Store.module.css";

interface StoreItem {
  id?: string;
  name: string;
  quantity: number;
  price: string;
}

interface StoreProps {
  searchTerm: string;
}

const Store: React.FC<StoreProps> = ({ searchTerm }) => {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", price: "" });
  const [showModal, setShowModal] = useState(false); // Modal state

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "store"), (snapshot) => {
      setItems(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as StoreItem))
      );
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const addItem = async () => {
    if (!newItem.name || !newItem.quantity || !newItem.price) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await addDoc(collection(db, "store"), {
        name: newItem.name,
        quantity: Number(newItem.quantity),
        price: newItem.price,
      });
      toast.success("Item added successfully");
      setNewItem({ name: "", quantity: "", price: "" });
      setShowModal(false); // Close modal after adding
    } catch (error) {
      toast.error("Error adding item");
    }
  };

  const filteredItems = items.filter((item) =>
    Object.values(item).some((value) =>
      (typeof value === "string" ? value : String(value ?? ""))
        .toLowerCase()
        .includes((searchTerm ?? "").toLowerCase())
    )
  );

  return (
    <div className={styles.storeWrapper}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Add Client Button */}
      <button className={styles.addClientButton} onClick={() => setShowModal(true)}>
        Add Item
      </button>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Add Item</h2>
            <input
              type="text"
              name="name"
              placeholder="Client Name"
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
              <button className={styles.cancelButton} onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className={styles.addButton} onClick={addItem}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Store Table */}
      <table className={styles.storeTable}>
        <thead>
          <tr>
            <th>Serial No.</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length > 0 ? (
            filteredItems.map((store: StoreItem, index: number) => (
              <tr key={store.id}>
                <td>{index + 1}</td>
                <td>{store.name}</td>
                <td>{store.quantity}</td>
                <td>GH₵{Number(store.price).toFixed(2)}</td>
                <td>
                  <button className={styles.addButton}>Request Item</button>
                </td>
              </tr>
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
    </div>
  );
};

export default Store;
