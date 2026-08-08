import { useState } from 'react';
import { Building2, Package, Users, Mail, Settings2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast/ToastContext';
import styles from './Settings.module.css';

export function Settings() {
  const [activeTab, setActiveTab] = useState('Studio Profile');
  const { addToast } = useToast();

  const tabs = [
    { name: 'Studio Profile', icon: <Building2 size={18} /> },
    { name: 'Packages & Pricing', icon: <Package size={18} /> },
    { name: 'Team Members', icon: <Users size={18} /> },
    { name: 'Email Templates', icon: <Mail size={18} /> },
    { name: 'System Config', icon: <Settings2 size={18} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Studio Profile':
        return (
          <div className={styles.tabContent}>
            <div className={styles.contentHeader}>
              <h2 className={styles.contentTitle}>Studio Profile</h2>
              <p className={styles.contentDesc}>Manage your public branding, address, and default contact info.</p>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Studio Name</label>
              <input type="text" className={styles.formInput} defaultValue="Better Days Studios" />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Contact Email</label>
              <input type="email" className={styles.formInput} defaultValue="hello@betterdays.studio" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Studio Address (For Contracts)</label>
              <textarea className={styles.formTextarea} defaultValue="123 Creative Hub, Manila, Philippines" />
            </div>

            <button className={styles.saveBtn} onClick={() => addToast('Settings saved!', 'success')}>Save Profile Settings</button>
          </div>
        );
      default:
        return (
          <div className={styles.tabContent}>
            <div className={styles.contentHeader}>
              <h2 className={styles.contentTitle}>{activeTab}</h2>
              <p className={styles.contentDesc}>This configuration panel is currently under development.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Settings</h1>
          <p>Configure studio defaults, packages, team access, and email templates</p>
        </div>
      </div>

      <div className={styles.settingsLayout}>
        <div className={styles.settingsSidebar}>
          {tabs.map(tab => (
            <button
              key={tab.name}
              className={`${styles.sidebarTab} ${activeTab === tab.name ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        <div className={styles.settingsContent}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
