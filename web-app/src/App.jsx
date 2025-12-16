import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import PillsPage from './pages/PillsPage';
import WaterPage from './pages/WaterPage';
import StoolPage from './pages/StoolPage';
import StatsPage from './pages/StatsPage';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <HomePage onNavigate={setActiveTab} />;
      case 'pills': return <PillsPage />;
      case 'water': return <WaterPage />;
      case 'stool': return <StoolPage />;
      case 'stats': return <StatsPage />;
      default: return <HomePage onNavigate={setActiveTab} />;
    }
  };

  return (
    <div>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px'
      }}>
        <h1
          onClick={() => setActiveTab('home')}
          style={{
            margin: 0,
            fontSize: '1.8rem',
            fontWeight: '800',
            background: 'linear-gradient(to right, #fff, #aaa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer',
            letterSpacing: '-1px'
          }}>
          Issy Care
        </h1>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          👤
        </div>
      </header>

      {renderPage()}

      <nav style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(12px)',
        borderRadius: '32px',
        padding: '8px 16px',
        display: 'flex',
        gap: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        zIndex: 100,
        border: '1px solid rgba(255,255,255,0.1)',
        width: 'auto',
        maxWidth: '90%'
      }}>
        <NavButton icon="🏠" label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavButton icon="💊" label="Pills" active={activeTab === 'pills'} onClick={() => setActiveTab('pills')} />
        <NavButton icon="💧" label="Water" active={activeTab === 'water'} onClick={() => setActiveTab('water')} />
        <NavButton icon="🚽" label="Stool" active={activeTab === 'stool'} onClick={() => setActiveTab('stool')} />
        <NavButton icon="📈" label="Charts" active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} />
      </nav>
    </div>
  );
}

const NavButton = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: active ? 'rgba(255,255,255,0.1)' : 'none',
      border: 'none',
      color: active ? '#fff' : 'var(--text-muted)',
      borderRadius: '16px',
      padding: '8px 12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      minWidth: '50px'
    }}
  >
    <span style={{ fontSize: '1.4rem' }}>{icon}</span>
    <span style={{ fontSize: '0.65rem', fontWeight: '600' }}>{label}</span>
  </button>
);

export default App;
