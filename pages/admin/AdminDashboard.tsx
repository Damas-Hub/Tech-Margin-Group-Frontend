import Image from "next/image";
import React, { useState } from "react";
import {
  Search,
  Bell,
  Menu,
  LogOut,
  MessageCircle,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import styles from "./AdminDashboard.module.css";
import Clients from "./Clients";
import Store from "./Store";
import Message from "./Message";
import Staffs from "./Staffs";
import Home from "./Home";
import RepairerClients from "./RepairerClients";
import NotificationModal from "@/componnets/NotificationModal";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("Home");
  const [searchTerm, setSearchTerm] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  const menuItems = [
    { label: "Home", icon: <Users className="w-7 h-7" />, component: <Home /> },
    {
      label: "Store",
      icon: <ShoppingBag className="w-7 h-7" />,
      component: <Store searchTerm={searchTerm} />,
    },
    {
      label: "Clients",
      icon: <Users className="w-7 h-7" />,
      component: <Clients searchTerm={searchTerm} />,
    },
    {
      label: "Messages",
      icon: <MessageCircle className="w-7 h-7" />,
      component: <Message />,
    },
    {
      label: "Staffs",
      icon: <Users className="w-7 h-7" />,
      component: <Staffs />,
    },
    {
      label: "RepairerClients",
      icon: <Users className="w-7 h-7" />,
      component: <RepairerClients searchTerm={searchTerm} />,
    },
  ];
  const userRole = "Admin";
  const handleLogout = () => {
    toast.success("Logged out successfully!", { duration: 3000 });
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <div className="flex h-screen">
      <Toaster />

      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${
          isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        <div className={styles.sidebarHeader}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={styles.menu}
          >
            <Menu className="w-8 h-8" />
          </button>
        </div>

        <div className={styles.sidebarContent}>
          <nav>
            {menuItems.map((item) => (
              <button
                key={item.label}
                className={`${styles.sidebarMenuItem} ${
                  activePage === item.label ? "bg-gray-300" : ""
                }`}
                onClick={() => setActivePage(item.label)}
              >
                {item.icon}
                <span
                  className={`${styles.sidebarMenuText} ${
                    !isSidebarOpen && "hidden"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </nav>
          <div className={styles.logout}>
            <button
              className={styles.sidebarMenuItem}
              onClick={() => setShowLogoutModal(true)}
            >
              <LogOut className="w-7 h-7" />
              <span
                className={`${styles.sidebarMenuText} ${
                  !isSidebarOpen && "hidden"
                }`}
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <div className="flex items-center justify-between p-4">
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-12 ml-auto">
              <NotificationModal
                staffRole={userRole}
                className="w-7 h-7 cursor-pointer text-red-600"
              />

              <Image
                src="https://cdn.vectorstock.com/i/1000v/31/40/mechanic-logo-vector-44593140.jpg"
                alt="Logo"
                width={35}
                height={35}
                className="w-12 h-12 rounded-full"
              />
            </div>
          </div>
        </header>

        {/* Render Active Page */}
        <main className={styles.contentArea}>
          <div className={styles.contentCard}>
            {menuItems.find((item) => item.label === activePage)?.component || (
              <h2 className="text-2xl font-semibold">Page Not Found</h2>
            )}
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to log out?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg"
                onClick={() => setShowLogoutModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
