import React, { useState, useEffect } from "react";
import LiveData from "../../componnets/LiveData";
import { MessageCircle, Users } from "lucide-react";
import { db } from "../../src/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

const Home = () => {
  const [clientCount, setClientCount] = useState(0);

  useEffect(() => {
    // Fetch real-time client count from Firestore
    const unsubscribe = onSnapshot(collection(db, "clients"), (snapshot) => {
      setClientCount(snapshot.size); // Get number of documents
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <LiveData
        icon={<Users className="w-8 h-8 text-blue-600" />}
        number={clientCount}
        text="Clients Today"
      />
      <LiveData icon={<Users className="w-8 h-8 text-green-600" />} number={5} text="Staffs" />
      <LiveData icon={<MessageCircle className="w-8 h-8 text-red-600" />} number={10} text="Messages" />
    </div>
  );
};

export default Home;
