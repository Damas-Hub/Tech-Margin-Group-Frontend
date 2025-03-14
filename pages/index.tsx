import Login from "@/componnets/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast

// Disable SSR for ForgotPassword

export default function Index() {
  return (
    <>
      {/* Ensure ToastContainer is always available for toast messages */}
      <ToastContainer position="top-right" autoClose={3000} />

      <Login />

      {/* Uncomment components when needed */}
      {/* <ForgotPassword /> */}
      {/* <AdminDashboard /> */}
      {/* <Form /> */}
    </>
  );
}
