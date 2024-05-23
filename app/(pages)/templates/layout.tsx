'use client'
import React from 'react'
import styles from './layout.style.module.css'
import { usePathname } from "next/navigation";
import Link from 'next/link';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const pathName = usePathname();
    return (
        <div className={styles.layout}>
            <div className={styles.navbar}>
                <Link href={"/templates/library"} className={`${styles.navItem} ${pathName === "/templates/library" ? styles.activeLink : ""}`}>Designs</Link>
                <Link href={"/templates/brandkit"} className={`${styles.navItem} ${pathName === "/templates/brandkit" ? styles.activeLink : ""}`}>Brand Kit</Link>
                <Link href={"/templates/palette"} className={`${styles.navItem} ${pathName === "/templates/palette" ? styles.activeLink : ""}`}>Color Palette</Link>
                
            </div>
            {children}
        </div>
    )
}

export default Layout