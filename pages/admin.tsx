import React, { useState } from 'react';
import { Search, Package, Users, FileText, MessageCircle, ShoppingBag, LogOut, Menu } from 'lucide-react';
import styles from "./Admin.module.css";

const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { label: 'Dashboard', icon: <Users className="w-5 h-5" /> },
    { label: 'Store', icon: <ShoppingBag className="w-5 h-5" /> },
    { label: 'Clients', icon: <Users className="w-5 h-5" /> },
    { label: 'Messages', icon: <MessageCircle className="w-5 h-5" /> },
    { label: 'Staffs', icon: <Users className="w-5 h-5" /> },
    { label: 'Request Item', icon: <Package className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <div className={styles.sidebarHeader}>
          <h1 className={`${styles.sidebarTitle} ${!isSidebarOpen && 'hidden'}`}>
            TMG 
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={styles.sidebarMenuItem}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <nav>
          {menuItems.map((item, idx) => (
            <button key={idx} className={styles.sidebarMenuItem}>
              {item.icon}
              <span className={`${styles.sidebarMenuText} ${!isSidebarOpen && 'hidden'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button className={styles.sidebarMenuItem} style={{ marginTop: 'auto' }}>
          <LogOut className="w-5 h-5" />
          <span className={`${styles.sidebarMenuText} ${!isSidebarOpen && 'hidden'}`}>
            Logout
          </span>
        </button>
      </div>

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
            {/* Your main content will go here */}
            <h2 className="text-2xl font-semibold mb-4">Welcome to Mechanic Management System</h2>
            <p className="text-gray-600">Select an option from the sidebar to get started.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
