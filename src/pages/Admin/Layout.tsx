import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../../components/ThemeToggle';
import styles from './Layout.module.css';
export function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem('mock_admin_auth');
    navigate('/admin/login');
  };

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <h2>BETTER DAYS STUDIOS</h2>
          <span>Admin</span>
        </div>

        <nav className={styles.nav}>
          <NavLink 
            to="/admin" 
            end
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            Overview
          </NavLink>
          <NavLink 
            to="/admin/calendar" 
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            Calendar
          </NavLink>
          <NavLink 
            to="/admin/clients" 
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            Clients
          </NavLink>
          <NavLink 
            to="/admin/portfolio" 
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            Portfolio
          </NavLink>
        </nav>

        <div className={styles.bottomNav}>
          <div className={styles.themeToggleWrapper}>
            <ThemeToggle />
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}
