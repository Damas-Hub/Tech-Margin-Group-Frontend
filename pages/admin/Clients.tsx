import { useState, useEffect } from "react";
import { db } from "../../src/firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Clients.module.css";

interface Client {
  id: string;
  name: string;
  itemBrought: string;
  phoneNumber: string;
  problem: string;
  date: string | Timestamp;
  status: string;
  searchTerm: string;
}

interface ClientFormProps {
  searchTerm: string;
}

const ClientForm: React.FC<ClientFormProps> = ({ searchTerm }) => {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    itemBrought: "",
    phoneNumber: "",
    problem: "",
    date: new Date().toISOString().split("T")[0],
    status: "Not Done",
  });

  useEffect(() => {
    const clientQuery = query(collection(db, "clients"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(clientQuery, (snapshot) => {
      const clientData: Client[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Client));
      setClients(clientData);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name || !formData.itemBrought || !formData.phoneNumber || !formData.problem || !formData.date) {
      toast.error("All fields are required!");
      return;
    }
    try {
      setLoading(true);
      await addDoc(collection(db, "clients"), {
        ...formData,
        date: Timestamp.fromDate(new Date(formData.date)),
      });
      toast.success("Client added successfully!");
      setFormData({
        name: "",
        itemBrought: "",
        phoneNumber: "",
        problem: "",
        date: new Date().toISOString().split("T")[0],
        status: "Not Done",
      });
    } catch (error) {
      console.error("Error saving data:", error);  
      toast.error("Error saving data. Try again.");
    }
     finally {
      setLoading(false);
    }
  };
  const filteredItems = clients.filter((item) =>
    Object.values(item).some((value) =>
      (typeof value === "string" ? value : String(value ?? ""))
        .toLowerCase()
        .includes((searchTerm ?? "").toLowerCase())
    )
  );
  
  
  return (
    <div className={styles.storeWrapper}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.formContainer}>
        <h2>Add Client Details</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" className={styles.input} placeholder="Customer Name" value={formData.name} onChange={handleChange} required />
          <input type="text" className={styles.input} name="itemBrought" placeholder="Item Brought" value={formData.itemBrought} onChange={handleChange} required />
          <input type="tel" name="phoneNumber" className={styles.input} placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
          <input type="text" name="problem" placeholder="Problem" className={styles.input} value={formData.problem} onChange={handleChange} required />
          <input type="date" name="date" className={styles.inputdate} value={formData.date} onChange={handleChange} required />
          <select name="status" value={formData.status} onChange={handleChange} className={styles.input}>
            <option value="Not Done">Not Done</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <button type="submit" disabled={loading} className={styles.addButton}>
            {loading ? "Saving..." : "Submit"}
          </button>
        </form>
      </div>
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
  {filteredItems.length > 0 ? (
    filteredItems.map((client) => (  
      <tr key={client.id}>
        <td>{client.name}</td>
        <td>{client.itemBrought}</td>
        <td>{client.phoneNumber}</td>
        <td>{client.problem}</td>
        <td>{client.date instanceof Timestamp ? client.date.toDate().toLocaleDateString() : client.date}</td>
        <td>{client.status}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={6} className={styles.noResults}>No Clients Available</td>
    </tr>
  )}
</tbody>

      </table>
    </div>
  );
};

export default ClientForm;
