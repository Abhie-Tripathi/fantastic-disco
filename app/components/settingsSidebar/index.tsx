// components/SideNav.js
import Link from 'next/link';
import styles from './settingsSidebar.module.css'
const SideNav = () => {
  return (
    <nav className={styles.sidenav}>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        {/* Add other navigation links */}
      </ul>
    </nav>
  );
};

export default SideNav;
