import { ThemeToggle } from './ThemeToggle';
import styles from './Navbar.module.css';

export function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          {/* Logo placeholder - will integrate the animated SVG here */}
          <span className={styles.logoText}>B+D</span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
