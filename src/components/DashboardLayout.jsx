// DashboardLayout — wraps authenticated pages with sidebar, navbar, footer, emergency FAB
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';
import EmergencyButton from './EmergencyButton';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="app-content">
          <Outlet />
        </main>
        <Footer />
      </div>
      <BottomNav />
      <EmergencyButton />
    </div>
  );
}
