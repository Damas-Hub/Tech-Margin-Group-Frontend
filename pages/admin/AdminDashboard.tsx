import React, { useState } from "react";
import {
  Search,
  Package,
  Users,
  MessageCircle,
  ShoppingBag,
  LogOut,
  Menu,
} from "lucide-react";
import styles from "./AdminDashboard.module.css";
import Clients from "./Clients";
import Store from "./Store";
import Message from "./Message";
import Staffs from "./Staffs";
import Home from "./Home";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("Home"); // Default page

  const menuItems = [
    {
      label: "Home",
      icon: <Users className="w-5 h-5" />,
      component: <Home/>,
    },
    {
      label: "Store",
      icon: <ShoppingBag className="w-5 h-5" />,
      component: <Store />,
    },
    {
      label: "Clients",
      icon: <Users className="w-5 h-5" />,
      component: <Clients />,
    },
    {
      label: "Messages",
      icon: <MessageCircle className="w-5 h-5" />,
      component: <Message />,
    },
    {
      label: "Staffs",
      icon: <Users className="w-5 h-5" />,
      component: <Staffs />,
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${
          isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        <div className={styles.sidebarHeader}>
          <h1
            className={`${styles.sidebarTitle} ${!isSidebarOpen && "hidden"}`}
          >
          
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={styles.menuIcon}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

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

        {/* Logout */}
        <div className={styles.logout}>
        <button
          className={styles.sidebarMenuItem}
          style={{ marginTop: "auto" }}
        >
          <LogOut className="w-5 h-5" />
          <span
            className={`${styles.sidebarMenuText} ${
              !isSidebarOpen && "hidden"
            }`}
          >
            Logout
          </span>
        </button>
      </div></div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div className="flex items-center justify-between p-4">
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search..."
                className={styles.searchInput}
              />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className={styles.contentArea}>
          <div className={styles.contentCard}>
            {menuItems.find((item) => item.label === activePage)?.component || (
              <h2 className="text-2xl font-semibold">Page Not Found</h2>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
