import { Outlet, useNavigate } from 'react-router-dom';
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
      <header className={styles.navbar}>
        <div className={styles.brand} onClick={() => navigate('/admin')}>
          <h2>BETTER DAYS STUDIOS</h2>
          <span>Admin</span>
        </div>

        <div className={styles.navActions}>
          <div className={styles.themeToggleWrapper}>
            <ThemeToggle />
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Log Out
          </button>
        </div>
      </header>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}
