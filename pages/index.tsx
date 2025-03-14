import Login from "@/componnets/Login";
import dynamic from "next/dynamic";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ForgotPassword = dynamic(() => import("../pages/forgot-password"), { ssr: false });


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
