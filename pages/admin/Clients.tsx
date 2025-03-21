import React, { useState, useEffect } from "react";
import { db } from "../../src/firebaseConfig";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Clients.module.css";

// Define the Client interface
interface Client {
  id: string;
  name: string;
  itemBrought: string;
  phoneNumber: string;
  problem: string;
  date: string;
  status: string;
}

const ClientForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);   
  const [formData, setFormData] = useState<Omit<Client, "id">>({
    name: "",
    itemBrought: "",
    phoneNumber: "",
    problem: "",
    date: new Date().toISOString().split("T")[0],
    status: "Not Done",
  });

  // Fetch clients from Firestore on component mount
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "clients"), (snapshot) => {
      const clientData: Client[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Client, "id">;  
        return {
          id: doc.id,  
          ...data,  
        };
      });
      setClients(clientData);
    });

    return () => unsubscribe();  
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const items: Client[] = [];  
  const searchTerm = "";  

  const filteredItems = items.filter((item) =>
    Object.values(item).some((value) =>
      value
        ? value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        : false
    )
  );
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, itemBrought, phoneNumber, problem, date } = formData;

    if (!name || !itemBrought || !phoneNumber || !problem || !date) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "clients"), formData);
      toast.success("Client details added successfully!");
      setFormData({
        name: "",
        itemBrought: "",
        phoneNumber: "",
        problem: "",
        date: new Date().toISOString().split("T")[0],
        status: "Not Done",
      });
    } catch (error: any) {
      console.error("Error adding client details:", error.message);
      toast.error("Error saving data. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.storeWrapper}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.storeTable}>
        <h2>Add Client Details</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="itemBrought"
            placeholder="Item Brought"
            value={formData.itemBrought}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="problem"
            placeholder="Problem"
            value={formData.problem}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Not Done" className={styles.notDone}>
              Not Done
            </option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved" className={styles.resolved}>
              Resolved
            </option>
          </select>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles.addButton}
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* Display Client List Below */}
      <h2 className={styles.clientListTitle}>Client List</h2>
      <table className={styles.storeTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Item Brought</th>
            <th>Phone</th>
            <th>Problem</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {clients.length > 0 ? (
            clients.map((client) => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.itemBrought}</td>
                <td>{client.phoneNumber}</td>
                <td>{client.problem}</td>
                <td>{client.date}</td>
                <td
                  className={
                    client.status === "Resolved"
                      ? styles.resolved
                      : styles.notDone
                  }
                >
                  {client.status}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className={styles.noResults}>
                No Clients Added Yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClientForm;
