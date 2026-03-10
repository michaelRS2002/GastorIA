// Componente de Tabs/Pestañas

import { ReactNode } from 'react';
import '../styles/components.css';

export type TabId = 'registrar' | 'analisis' | 'transacciones';

interface Tab {
  id: TabId;
  label: string;
  icon: ReactNode;
}

interface TabsProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
}

// SVG Icons
const ReceiptIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"></path>
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
    <path d="M12 17.5v-11"></path>
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
    <path d="M18 17V9"></path>
    <path d="M13 17V5"></path>
    <path d="M8 17v-3"></path>
  </svg>
);

const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7h-9"></path>
    <path d="M14 17H5"></path>
    <circle cx="17" cy="17" r="3"></circle>
    <circle cx="7" cy="7" r="3"></circle>
  </svg>
);

const tabs: Tab[] = [
  { id: 'registrar', label: 'Registrar', icon: <ReceiptIcon /> },
  { id: 'analisis', label: 'Análisis', icon: <ChartIcon /> },
  { id: 'transacciones', label: 'Transacciones', icon: <ListIcon /> },
];

export const Tabs = ({ activeTab, onTabChange }: TabsProps) => {
  return (
    <div className="tabs-container">
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

interface TabPanelProps {
  children: ReactNode;
  tabId: TabId;
  activeTab: TabId;
}

export const TabPanel = ({ children, tabId, activeTab }: TabPanelProps) => {
  if (tabId !== activeTab) return null;
  
  return <div className="tab-panel">{children}</div>;
};
