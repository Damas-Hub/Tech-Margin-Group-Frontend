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

// Define the Client interface
interface Client {
  id: string;
  name: string;
  itemBrought: string;
  phoneNumber: string;
  problem: string;
  date: string | Timestamp;
  status: string;
  searchTerm?: string; // <-- Make it optional
}


// Function to safely format Firestore Timestamp to a readable date
const formatDate = (date: string | Timestamp): string => {
  if (date instanceof Timestamp) {
    return date.toDate().toLocaleDateString(); // Convert Firestore Timestamp to string
  }
  return date; // If it's already a string, return as is
};

interface RepairerClientsProps {
  searchTerm: string;
}

const RepairerClients: React.FC<RepairerClientsProps> = ({ searchTerm }) => {
  const [clients, setClients] = useState<Client[]>([]);

  // Fetch clients from Firestore on component mount
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "clients"), (snapshot) => {
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
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (clientId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "clients", clientId), { status: newStatus });
      toast.success("Status updated successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error updating status:", error.message);
        toast.error("Failed to update status.");
      } else {
        console.error("An unknown error occurred", error);
        toast.error("An unexpected error occurred.");
      }
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
      <h2 className={styles.clientListTitle}>Repairer Client List</h2>
      <table className={styles.storeTable}>
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
        {filteredItems.length > 0 ? (
              filteredItems.map((client) =>  (
              <tr key={client.id}>
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
                  <select
                    value={client.status}
                    onChange={(e) =>
                      handleStatusChange(client.id, e.target.value)
                    }
                    className={styles.input}
                  >
                    <option value="Not Done">Not Done</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className={styles.noResults}>
                No Clients Available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RepairerClients;
