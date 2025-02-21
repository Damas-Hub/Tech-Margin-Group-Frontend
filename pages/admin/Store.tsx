import React from "react";
import styles from "./Store.module.css";

interface StoreProps {
  searchTerm: string; // ✅ Accept searchTerm as a prop
}

const Store: React.FC<StoreProps> = ({ searchTerm }) => {
  const items = [
    { serialNo: 1, name: "Laptop", quantity: 5, price: "$800" },
    { serialNo: 2, name: "Smartphone", quantity: 10, price: "$600" },
    { serialNo: 3, name: "Tablet", quantity: 7, price: "$300" },
    { serialNo: 4, name: "Headphones", quantity: 15, price: "$150" },
    { serialNo: 5, name: "Camera", quantity: 3, price: "$500" },
    { serialNo: 6, name: "Smartwatch", quantity: 8, price: "$200" },
    { serialNo: 7, name: "Monitor", quantity: 4, price: "$250" },
    { serialNo: 8, name: "Printer", quantity: 2, price: "$100" },
    { serialNo: 9, name: "Speaker", quantity: 6, price: "$120" },
    { serialNo: 10, name: "Router", quantity: 5, price: "$80" },
  ];

  // ✅ Filter items based on searchTerm
  const filteredItems = items.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className={styles.storeWrapper}>
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
            filteredItems.map((item) => (
              <tr key={item.serialNo}>
                <td>{item.serialNo}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>
                  <button className={styles.addButton}>Request Item</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className={styles.noResults}>
                No matching items found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Store;
