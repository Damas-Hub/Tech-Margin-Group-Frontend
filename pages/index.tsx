import Login from "@/componnets/Login";
import dynamic from "next/dynamic";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";  



export default function Index() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Login />
      
    
    </>
  );
}
