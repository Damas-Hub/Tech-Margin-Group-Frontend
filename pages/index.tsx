import Login from "@/componnets/Login";
import dynamic from "next/dynamic";
import AdminDashboard from "./admin/AdminDashboard";
import Form from "@/componnets/Form";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast

// Disable SSR for ForgotPassword
const ForgotPassword = dynamic(() => import("../pages/forgot-password"), { ssr: false });

export default function Index() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {/* <Login /> */}
      {/* <ForgotPassword /> */}
      <AdminDashboard />
      {/* <Form /> */}
    </>
  );
}
