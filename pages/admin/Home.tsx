import React, { useState, useEffect } from "react";
import LiveData from "../../componnets/LiveData";
import { MessageCircle, Users, Package, Briefcase } from "lucide-react"; // Added Briefcase icon
import { db } from "../../src/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

const Home = () => {
  const [clientCount, setClientCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0); // State for staff count

  useEffect(() => {
    // Fetch real-time client count
    const unsubscribeClients = onSnapshot(collection(db, "clients"), (snapshot) => {
      setClientCount(snapshot.size);
    });

    // Fetch real-time store item count
    const unsubscribeItems = onSnapshot(collection(db, "store"), (snapshot) => {
      setItemCount(snapshot.size);
    });

    // Fetch real-time staff count
    const unsubscribeStaff = onSnapshot(collection(db, "staffs"), (snapshot) => {
      setStaffCount(snapshot.size);
    });

    return () => {
      unsubscribeClients();
      unsubscribeItems();
      unsubscribeStaff();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <LiveData
        icon={<Users className="w-8 h-8 text-blue-600" />}
        number={clientCount}
        text="Clients Today"
      />
      <LiveData
        icon={<Briefcase className="w-8 h-8 text-green-600" />}  
        number={staffCount}
        text="Staffs"
      />
      <LiveData
        icon={<Package className="w-8 h-8 text-red-600" />}
        number={itemCount}
        text="Items In Store"
      />
    </div>
  );
};

export default Home;
