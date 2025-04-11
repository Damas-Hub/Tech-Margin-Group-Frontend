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
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Clients.module.css";
import Spinner from "@/componnets/Spinner";

interface Client {
  id: string;
  name: string;
  itemBrought: string;
  phoneNumber: string;
  problem: string;
  date: string | Timestamp;
  status: string;
}

interface ClientFormProps {
  searchTerm: string;
}

const ClientForm: React.FC<ClientFormProps> = ({ searchTerm }) => {
  const [loading, setLoading] = useState(false);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [delayedLoading, setDelayedLoading] = useState<boolean>(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    itemBrought: "",
    phoneNumber: "",
    problem: "",
    date: new Date().toISOString().split("T")[0],
    status: "Not Done",
  });
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setDelayedLoading(true); // This will show the spinner after the delay
    }, 500); // Delay for 300ms

    return () => clearTimeout(loadingTimeout); // Clean up timeout on unmount
  }, []);

  useEffect(() => {
    const clientQuery = query(
      collection(db, "clients"),
      orderBy("date", "desc")
    );
    const unsubscribe = onSnapshot(clientQuery, (snapshot) => {
      const clientData: Client[] = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Client)
      );
      setClients(clientData);
      setClientsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !formData.name ||
      !formData.itemBrought ||
      !formData.phoneNumber ||
      !formData.problem ||
      !formData.date
    ) {
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
      setShowModal(false);
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = clients
    .filter((item) =>
      Object.values(item).some((value) =>
        (typeof value === "string" ? value : String(value ?? ""))
          .toLowerCase()
          .includes((searchTerm ?? "").toLowerCase())
      )
    )
    .sort((a, b) => a.name.localeCompare(b.name)); // Alphabetical sorting A-Z

  return (
    <div className={styles.storeWrapper}>
      <ToastContainer position="top-right" autoClose={3000} />

      <button
        className={styles.addClientButton}
        onClick={() => setShowModal(true)}
      >
        Add Client
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Add Client Details</h2>
              <form onSubmit={handleSubmit} className={styles.modalForm}>
                <input
                  type="text"
                  name="name"
                  className={styles.modalInput}
                  placeholder="Customer Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  className={styles.modalInput}
                  name="itemBrought"
                  placeholder="Item Brought"
                  value={formData.itemBrought}
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  className={styles.modalInput}
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="problem"
                  placeholder="Problem"
                  className={styles.modalInput}
                  value={formData.problem}
                  onChange={handleChange}
                  required
                />

                <input
                  type="date"
                  name="date"
                  className={styles.modalInput}
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={styles.modalInput}
                >
                  <option value="Not Done">Not Done</option>
                 {/*  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option> */}
                </select>
                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.addButton}
                  >
                    {loading ? "Saving..." : "Add Client"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className={styles.clientListTitle}>Client List</h2>

      {clientsLoading && delayedLoading ? (
        <div className={styles.loaderContainer}>
          <Spinner size="50px" color="#e74c3c" />
        </div>
      ) : (
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
            <AnimatePresence>
              {filteredItems.length > 0 ? (
                filteredItems.map((client) => (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td>{client.name}</td>
                    <td>{client.itemBrought}</td>
                    <td>{client.phoneNumber}</td>
                    <td>{client.problem}</td>
                    <td>
                      {client.date instanceof Timestamp
                        ? client.date.toDate().toLocaleDateString()
                        : client.date}
                    </td>
                    <td>{client.status}</td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={styles.noResults}>
                    No Clients Found
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClientForm;
