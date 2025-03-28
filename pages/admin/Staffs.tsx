import Form from "@/componnets/Form";
import StaffProfile from "@/componnets/StaffProfile";
import StaffAccountForm from "@/componnets/StaffAccountForm"; // Import the form
import React, { useState } from "react";

const Staffs = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

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
    <div
      style={{
        position: "relative",
        padding: "20px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      {/* Buttons for editing profile and adding staff */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <button
          onClick={() => setShowEditModal(true)}
          style={{
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
        <button
          onClick={() => setShowAddStaffModal(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add Staff
        </button>
      </div>

      {/* Staff List */}
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

      {/* Edit Profile Modal */}
      {showEditModal && (
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
            zIndex: 1000,
          }}
        >
          <div>
            <Form onClose={() => setShowEditModal(false)} />
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddStaffModal && (
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
            zIndex: 1000,
          }}
        >
          <div>
            <StaffAccountForm onClose={() => setShowAddStaffModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Staffs;
