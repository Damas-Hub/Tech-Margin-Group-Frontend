import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./login";

export default function Index() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Login />
    </>
  );
}
