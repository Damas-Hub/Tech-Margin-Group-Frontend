import React from "react";
import styles from "./Clients.module.css";

interface ClientProps {
  searchTerm?: string; 
}

const Clients: React.FC<ClientProps> = ({ searchTerm = "" }) => { 
  const currentDate = new Date().toISOString().split("T")[0];

  const items = [
    { name: "Ama Kofi", itemBrought: "Laptop", phoneNumber: "0543737222", problem: "Hard drive", status: "Resolved" },
    { name: "John Doe", itemBrought: "System Unit", phoneNumber: "0543734222", problem: "Motherboard", status: "Not Done" },
    { name: "Ama Kofi", itemBrought: "Laptop", phoneNumber: "0543737222", problem: "Hard drive", status: "Not Done" },
    { name: "John Doe", itemBrought: "System Unit", phoneNumber: "0543734222", problem: "Motherboard", status: "Not Done" },
  ];

  

  const filteredItems = items.filter((item) =>
    Object.values(item).some((value) =>
      value ? value.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false
    )
  );

  return (
    <div className={styles.storeWrapper}>
      <table className={styles.storeTable}>
        <thead>
          <tr>
            <th>Serial No.</th>
            <th>Customer Name</th>
            <th>Item Brought</th>
            <th>Phone Number</th>
            <th>Problem</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.itemBrought}</td>
                <td>{item.phoneNumber}</td>
                <td>{item.problem}</td>
                <td>{currentDate}</td>
                <td className={item.status === "Resolved" ? styles.resolved : styles.notDone}>
                  {item.status}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className={styles.noResults}>
                No matching customers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Clients;
