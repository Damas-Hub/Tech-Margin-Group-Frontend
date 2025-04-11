import React, { useState, useEffect } from "react";
import { db } from "../../src/firebaseConfig";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Clients.module.css";
import { motion, AnimatePresence } from "framer-motion";

interface Client {
  id: string;
  name: string;
  itemBrought: string;
  phoneNumber: string;
  problem: string;
  date: string | Timestamp;
  status: string;
  searchTerm?: string;
}

const formatDate = (date: string | Timestamp): string => {
  if (date instanceof Timestamp) {
    return date.toDate().toLocaleDateString();
  }
  return date;
};

interface RepairerClientsProps {
  searchTerm: string;
}

const RepairerClients: React.FC<RepairerClientsProps> = ({ searchTerm }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
    hover: {
      scale: 1.01,
      backgroundColor: "rgba(86, 2, 31, 0.03)",
      transition: { type: "spring", stiffness: 300 },
    },
  };

  const selectVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "clients"), (snapshot) => {
      setTimeout(() => {
        // Simulate loading delay for better UX
        const clientData: Client[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "",
            itemBrought: data.itemBrought || "",
            phoneNumber: data.phoneNumber || "",
            problem: data.problem || "",
            date: formatDate(data.date),
            status: data.status || "Not Done",
          };
        });
        setClients(clientData);
        setLoading(false);
      }, 600);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (clientId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "clients", clientId), { status: newStatus });
      toast.success("Status updated successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Failed to update status.");
      } else {
        toast.error("An unexpected error occurred.");
      }
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
    <motion.div
      className={styles.storeWrapper}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <motion.h2
        className={styles.clientListTitle}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Repairer Client List
      </motion.h2>

      {loading ? (
        <motion.div
          className={styles.loadingContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.loadingSpinner}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <p>Loading clients...</p>
        </motion.div>
      ) : (
        <motion.table
          className={styles.storeTable}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Item Brought</th>
              <th>Phone</th>
              <th>Problem</th>
              <th>Date</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredItems.length > 0 ? (
                filteredItems.map((client, index) => (
                  <motion.tr
                    key={client.id}
                    variants={rowVariants}
                    whileHover="hover"
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.05 }}
                  >
                    <td>{client.name}</td>
                    <td>{client.itemBrought}</td>
                    <td>{client.phoneNumber}</td>
                    <td>{client.problem}</td>
                    <td>{formatDate(client.date)}</td>
                    <td
                      className={
                        client.status === "Resolved"
                          ? styles.resolved
                          : styles.notDone
                      }
                    >
                      {client.status}
                    </td>
                    <td>
                      <motion.select
                        value={client.status}
                        onChange={(e) =>
                          handleStatusChange(client.id, e.target.value)
                        }
                        className={styles.inputdate}
                        variants={selectVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <option value="Not Done">Not Done</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </motion.select>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <td colSpan={7} className={styles.noResults}>
                    No Clients Available
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </motion.table>
      )}
    </motion.div>
  );
};

export default RepairerClients;
