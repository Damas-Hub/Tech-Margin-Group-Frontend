import Login from "@/componnets/Login";
import dynamic from "next/dynamic";
import AdminDashboard from "./admin/AdminDashboard";
import Form from "@/componnets/Form";

// Disable SSR for ForgotPassword
const ForgotPassword = dynamic(() => import("../pages/forgot-password"), { ssr: false });

export default function Index() {
  return (
    <>
      <Login />
      {/* <ForgotPassword /> */}
      {/* <AdminDashboard /> */}
      {/* <Form /> */}
    </>
  );
}
