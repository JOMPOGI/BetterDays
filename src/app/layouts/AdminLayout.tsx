import { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';

import { CalendarDays, Users, Inbox, LogOut, Camera } from 'lucide-react';
import styles from './Layout.module.css';

export function AdminLayout() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    localStorage.removeItem('mock_admin_auth');
    navigate('/admin/login');
  };

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brand}>
            <Camera size={36} className={styles.brandLogo} />
            <span className={styles.brandText}>ADMIN</span>
          </div>
          
          <button 
            className={`${styles.hamburger} ${menuOpen ? styles.isOpen : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className={`${styles.sidebarBody} ${menuOpen ? styles.menuOpen : ''}`}>
          <nav className={styles.navMenu}>
            <NavLink 
              to="/admin/schedule" 
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
          >
            <CalendarDays size={20} />
            Schedule & Bookings
          </NavLink>
          
            <NavLink 
              to="/admin/clients" 
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <Users size={20} />
              Client Directory
            </NavLink>
          
            <NavLink 
              to="/admin/inquiries" 
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <Inbox size={20} />
              Inquiries
            </NavLink>
          </nav>

          <div className={styles.navFooter}>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <LogOut size={20} />
              LOG OUT
            </button>
          </div>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}
