import { useState } from 'react'
import { Home, ShoppingBag, User, Settings, History } from 'lucide-react'
import styles from './navbar.module.css'

function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'catalog', icon: <Home size={22} />, label: 'Catalog' },
    { id: 'orders', icon: <History size={22} />, label: 'Orders' },
    { id: 'create-order', icon: <ShoppingBag size={22} />, label: 'New' },
    { id: 'profile', icon: <User size={22} />, label: 'Profile' },
    { id: 'settings', icon: <Settings size={22} />, label: 'Settings' },
  ]

  return (
    <nav className={styles.navbar}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`${styles.navButton} ${
            activeTab === tab.id ? styles.active : ''
          }`}
        >
          {tab.icon}
          <span className={styles.label}>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default Navbar