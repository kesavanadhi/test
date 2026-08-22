import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Sidebar } from '../components/common/Sidebar';
import { Topbar } from '../components/common/Topbar';
import { useAuth } from '../context/AuthContext';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col selection:bg-defence-500 selection:text-white">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const CadetLayout: React.FC = () => {
  const { cadetUser } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!cadetUser) {
    return <Navigate to="/cadet/login" replace />;
  }

  return (
    <div className="min-h-screen bg-navy-950 flex selection:bg-defence-500 selection:text-white">
      <Sidebar
        role="cadet"
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar role="cadet" setMobileOpen={setMobileOpen} />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const AdminLayout: React.FC = () => {
  const { isAdminAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-navy-950 flex selection:bg-gold-500 selection:text-navy-950">
      <Sidebar
        role="admin"
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar role="admin" setMobileOpen={setMobileOpen} />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};