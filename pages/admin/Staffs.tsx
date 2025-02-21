import Form from "@/componnets/Form";
import StaffAccountForm from "@/componnets/StaffAccountForm";
import StaffProfile from "@/componnets/StaffProfile";
import React, { useState } from "react";

const Staffs = () => {
  const [showModal, setShowModal] = useState(false);

  const staffMembers = [
    {
      profilePic:
        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
      name: "John Doe",
      staffId: "ST12345",
      role: "Secretary",
      contactNumber: "+1234567890",
      backDetails:
        "This staff member is responsible for handling administrative tasks and ensuring smooth operations.",
    },
    {
      profilePic:
        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
      name: "Jane Smith",
      staffId: "RP67890",
      role: "Repairer",
      contactNumber: "+9876543210",
      backDetails:
        "This staff member is responsible for vehicle repairs and maintenance.",
    },
    {
      profilePic:
        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
      name: "Michael Brown",
      staffId: "SK11223",
      role: "Store Keeper",
      contactNumber: "+1029384756",
      backDetails:
        "This staff member manages inventory and ensures stock availability.",
    },
  ];

  return (
    <div style={{ position: "relative", padding: "20px", maxWidth: "", margin: "0 auto" }}>
      <button
        onClick={() => setShowModal(true)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Edit Profile
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          justifyContent: "center",
          marginTop: "50px",
        }}
      >
        {staffMembers.map((staff, index) => (
          <StaffProfile key={index} {...staff} />
        ))}
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
           
          >
            {<StaffAccountForm onClose={() => setShowModal(false)} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Staffs;
