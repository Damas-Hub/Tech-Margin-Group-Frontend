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
      setShowModal(false);
    } catch (error) {
      toast.error("Error adding item");
    }
  };

  const requestItemHandler = (item: StoreItem) => {
    setRequestItem(item);
    setRequestQuantity(1);
  };

  const confirmRequest = async () => {
    if (!requestItem) return;
    if (requestQuantity > requestItem.quantity) {
      toast.error("Not enough stock available!");
      return;
    }
    try {
      const itemRef = doc(db, "store", requestItem.id);
      await updateDoc(itemRef, {
        quantity: requestItem.quantity - requestQuantity,
      });

      await addDoc(collection(db, "notifications"), {
        recipient: "Store Keeper",
        message: `${staffRole} requested ${requestQuantity} of ${requestItem.name}.`,
        timestamp: serverTimestamp(),
        read: false,
      });

      toast.success("Request sent successfully!");
      setRequestItem(null);
    } catch (error) {
      toast.error("Failed to request item");
    }
  };

  const editItemHandler = (item: StoreItem) => {
    setEditItem(item);
    setEditQuantity(0);
  };

  const confirmEdit = async () => {
    if (!editItem) return;
    if (editQuantity <= 0) {
      toast.error("Please enter a valid quantity to add.");
      return;
    }
    try {
      const itemRef = doc(db, "store", editItem.id);
      await updateDoc(itemRef, {
        quantity: editItem.quantity + editQuantity,
      });

      toast.success("Stock updated successfully!");
      setEditItem(null);
    } catch (error) {
      toast.error("Failed to update stock");
    }
  };

  const filteredItems = items
    .filter((item) =>
      Object.values(item).some((value) =>
        (typeof value === "string" ? value : String(value ?? ""))
          .toLowerCase()
          .includes((searchTerm ?? "").toLowerCase())
      )
    )
    .sort((a, b) => a.name.localeCompare(b.name));  
  return (
    <div className={styles.storeWrapper}>
      <ToastContainer position="top-right" autoClose={3000} />

      <button
        className={styles.addClientButton}
        onClick={() => setShowModal(true)}
      >
        Add Item
      </button>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
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
              <button
                className={styles.cancelButton}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className={styles.addButton} onClick={addItem}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

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
              <tr key={store.id}>
                <td>{index + 1}</td>
                <td>{store.name}</td>
                <td>{store.quantity}</td>
                <td>GH₵{Number(store.price).toFixed(2)}</td>
                <td>
                  <button
                    className={styles.addButton}
                    onClick={() => editItemHandler(store)}
                  >
                    Edit
                  </button>
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

      {editItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Edit {editItem.name} Stock</h2>
            <input
              type="number"
              min="1"
              value={editQuantity}
              onChange={(e) => setEditQuantity(Number(e.target.value))}
              className={styles.modalInput}
            />
            <div className={styles.buttonGroup}>
              <button
                className={styles.cancelButton}
                onClick={() => setEditItem(null)}
              >
                Cancel
              </button>
              <button className={styles.addButton} onClick={confirmEdit}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
