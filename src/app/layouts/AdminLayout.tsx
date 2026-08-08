import { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';

import { CalendarDays, Users, LayoutDashboard, CreditCard, Settings, XCircle, LogOut, Inbox } from 'lucide-react';
import styles from './AdminLayout.module.css';

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
            <span className={styles.brandText}>Better Days</span>
            <span className={styles.brandText} style={{ fontSize: '0.7rem', opacity: 0.6, letterSpacing: '0.2em' }}>STUDIOS</span>
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
              to="/admin/home" 
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <LayoutDashboard size={20} />
              Home
            </NavLink>

            <NavLink 
              to="/admin/schedule" 
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <CalendarDays size={20} />
              Calendar
            </NavLink>
          
            <NavLink 
              to="/admin/projects" 
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <Users size={20} />
              Projects
            </NavLink>


            <NavLink 
              to="/admin/payments" 
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <CreditCard size={20} />
              Payments
            </NavLink>

            <NavLink 
              to="/admin/settings" 
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <Settings size={20} />
              Settings
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
