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
import styles from "./AdminDashboard.module.css";
import Clients from "./Clients";
import Store from "./Store";
import Message from "./Message";
import Staffs from "./Staffs";
import Home from "./Home";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("Home");
  const [searchTerm, setSearchTerm] = useState("");

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
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={styles.memu}
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
            <button className={styles.sidebarMenuItem}>
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
              <Bell className="w-7 h-7 cursor-pointer text-red-600" />
              <img
                src="https://tinyurl.com/2ccmosk6"
                alt="Logo"
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
    </div>
  );
};

export default AdminDashboard;
