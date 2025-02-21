import React from "react";
import styles from "./Store.module.css";

const storeItems = [
  { id: 1, name: "Laptop", quantity: 5, price: "$800" },
  { id: 2, name: "Smartphone", quantity: 10, price: "$600" },
  { id: 3, name: "Tablet", quantity: 7, price: "$300" },
  { id: 4, name: "Headphones", quantity: 15, price: "$150" },
  { id: 5, name: "Camera", quantity: 3, price: "$500" },
  { id: 6, name: "Smartwatch", quantity: 8, price: "$200" },
  { id: 7, name: "Monitor", quantity: 4, price: "$250" },
  { id: 8, name: "Printer", quantity: 2, price: "$100" },
  { id: 9, name: "Speaker", quantity: 6, price: "$120" },
  { id: 10, name: "Router", quantity: 5, price: "$80" },
  { id: 1, name: "Laptop", quantity: 5, price: "$800" },
  { id: 2, name: "Smartphone", quantity: 10, price: "$600" },
  { id: 3, name: "Tablet", quantity: 7, price: "$300" },
  { id: 4, name: "Headphones", quantity: 15, price: "$150" },
  { id: 5, name: "Camera", quantity: 3, price: "$500" },
  { id: 6, name: "Smartwatch", quantity: 8, price: "$200" },
  { id: 7, name: "Monitor", quantity: 4, price: "$250" },
  { id: 8, name: "Printer", quantity: 2, price: "$100" },
  { id: 9, name: "Speaker", quantity: 6, price: "$120" },
  { id: 10, name: "Router", quantity: 5, price: "$80" },
];

const Store = () => {
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
          {storeItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.price}</td>
              <td>
                <button className={styles.addButton}>Request Item</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Store;
