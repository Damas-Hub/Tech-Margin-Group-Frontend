import Login from "@/componnets/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  


export default function Index() {
  return (
    <>
      {/* Ensure ToastContainer is always available for toast messages */}
      <ToastContainer position="top-right" autoClose={3000} />

      <Login />

      
    </>
  );
}
