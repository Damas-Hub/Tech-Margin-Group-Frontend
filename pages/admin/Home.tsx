import React, { useState, useEffect } from "react";
import LiveData from "../../componnets/LiveData";
import { db } from "../../src/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";

// Icons
import client from "../../public/assets/client.png";
import staff from "../../public/assets/staff.png";
import item from "../../public/assets/item.png";
import request from "../../public/assets/request.png";
import pending from "../../public/assets/item.png";
import progress from "../../public/assets/item.png";
import resolved from "../../public/assets/item.png";

interface HomeProps {
  staffRole: string;
}

const Home: React.FC<HomeProps> = ({ staffRole }) => {
  const [clientCount, setClientCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [statusCounts, setStatusCounts] = useState({
    notDone: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    const unsubscribeClients = onSnapshot(
      collection(db, "clients"),
      (snapshot) => {
        setClientCount(snapshot.size);

        let notDone = 0,
          inProgress = 0,
          resolved = 0;
        snapshot.forEach((doc) => {
          const status = doc.data().status;
          if (status === "Not Done") notDone++;
          else if (status === "In Progress") inProgress++;
          else if (status === "Resolved") resolved++;
        });

        setStatusCounts({ notDone, inProgress, resolved });
      }
    );

    const unsubscribeItems = onSnapshot(collection(db, "store"), (snapshot) => {
      setItemCount(snapshot.size);
    });

    const unsubscribeStaff = onSnapshot(
      collection(db, "staffs"),
      (snapshot) => {
        setStaffCount(snapshot.size);
      }
    );

    const unsubscribeRequests = onSnapshot(
      collection(db, "requestedItems"),
      (snapshot) => {
        const pending = snapshot.docs.filter(
          (doc) => doc.data().status === "pending"
        ).length;
        setPendingRequests(pending);
      }
    );

    // Notification count based on staffRole
    let unsubscribeMessages: () => void;
    if (staffRole) {
      const q = query(
        collection(db, "messages"),
        where("recipient", "==", staffRole)
      );
      unsubscribeMessages = onSnapshot(q, (snapshot) => {
        let unread = 0;
        let read = 0;

        snapshot.forEach((doc) => {
          const msg = doc.data();
          if (msg.read) read++;
          else unread++;
        });
      });
    }

    return () => {
      unsubscribeClients();
      unsubscribeItems();
      unsubscribeStaff();
      unsubscribeRequests();
      if (unsubscribeMessages) unsubscribeMessages();
    };
  }, [staffRole]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <LiveData
        icon={<img src={client.src} alt="Clients" className="w-15 h-15" />}
        number={clientCount}
        text="Clients Total"
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
      <LiveData
        icon={<img src={request.src} alt="Requests" className="w-15 h-15" />}
        number={pendingRequests}
        text="Pending Item Requests"
      />

      {/* Task Status */}
      <LiveData
        icon={<img src={pending.src} alt="Not Done" className="w-15 h-15" />}
        number={statusCounts.notDone}
        text="Task Not Done"
      />
      <LiveData
        icon={
          <img src={progress.src} alt="In Progress" className="w-15 h-15" />
        }
        number={statusCounts.inProgress}
        text="Task In Progress"
      />
      <LiveData
        icon={<img src={resolved.src} alt="Resolved" className="w-15 h-15" />}
        number={statusCounts.resolved}
        text="Task Resolved"
      />
    </div>
  );
};

export default Home;
function setUnreadCount(unread: number) {
  throw new Error("Function not implemented.");
}
