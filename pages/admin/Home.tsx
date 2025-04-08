import React, { useState, useEffect } from "react";
import LiveData from "../../componnets/LiveData";
import { db } from "../../src/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

// Import your custom icons from assets
import client from "../../public/assets/client.png";
import staff from "../../public/assets/staff.png"; // adjust path as needed
import item from "../../public/assets/item.png"; // adjust path as needed

const Home = () => {
  const [clientCount, setClientCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);

  useEffect(() => {
    // Fetch real-time client count
    const unsubscribeClients = onSnapshot(
      collection(db, "clients"),
      (snapshot) => {
        setClientCount(snapshot.size);
      }
    );

    // Fetch real-time store item count
    const unsubscribeItems = onSnapshot(collection(db, "store"), (snapshot) => {
      setItemCount(snapshot.size);
    });

    // Fetch real-time staff count
    const unsubscribeStaff = onSnapshot(
      collection(db, "staffs"),
      (snapshot) => {
        setStaffCount(snapshot.size);
      }
    );

    return () => {
      unsubscribeClients();
      unsubscribeItems();
      unsubscribeStaff();
    };
  }, []);

  return (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <LiveData
    icon={<img src={client.src} alt="Clients" className="w-15 h-15" />} 
    number={clientCount}
    text="Clients Today"
  />
  <LiveData
    icon={<img src={staff.src} alt="Staff" className="w-15 h-15" />}    
    number={staffCount}
    text="Staffs"
  />
  <LiveData
    icon={<img src={item.src} alt="Items" className="w-15 h-15" />}      
    number={itemCount}
    text="Items In Store"
  />
</div>
  );
};

export default Home;
