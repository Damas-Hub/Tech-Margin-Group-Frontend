import React, { useEffect, useState } from "react";
import { db } from "../src/firebaseConfig"
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

interface Message {
  id: string;
  message: string;
  recipient: string;
  timestamp: any;
}

const MessageList: React.FC<{ recipient: string }> = ({ recipient }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!recipient) return;

    const q = query(
      collection(db, "messages"),
      where("recipient", "==", recipient),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];

      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [recipient]);

  return (
    <div>
      <h3>Messages for {recipient}</h3>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>
            <strong>{msg.message}</strong> - {new Date(msg.timestamp?.seconds * 1000).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
