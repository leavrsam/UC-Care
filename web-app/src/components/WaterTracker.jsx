import React, { useState } from 'react';
import { addEntry, getTodayTotal, removeLastEntry } from '../utils/storage';

const WaterTracker = () => {
    const targetOz = 64;
    const [refreshKey, setRefreshKey] = useState(0);

    const handleAdd = (amount) => {
        addEntry('water', { amount });
        setRefreshKey(prev => prev + 1);
    };

    const handleUndo = () => {
        removeLastEntry('water');
        setRefreshKey(prev => prev + 1);
    };

    const todayEntries = getTodayTotal('water');
    const todayAmount = todayEntries.reduce((acc, curr) => acc + curr.amount, 0);
    const percentage = Math.min(100, Math.round((todayAmount / targetOz) * 100));

    // Circular Progress Logic
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="fade-in" style={{ padding: '20px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '32px' }}>Water</h2>

            {/* 1. Circular Progress */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', position: 'relative' }}>
                <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                        cx="100" cy="100" r={radius}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="20"
                        fill="transparent"
                    />
                    <circle
                        cx="100" cy="100" r={radius}
                        stroke="var(--color-water)"
                        strokeWidth="20"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                    />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-water)' }}>{todayAmount}</div>
                    <div style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {targetOz} oz</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{percentage}% Complete</div>
                </div>
            </div>

            {/* 2. Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '40px' }}>
                <button style={btnActionStyle} onClick={() => handleAdd(1)}>
                    +1 oz
                </button>
                <button style={btnActionStyle} onClick={() => handleAdd(8)}>
                    +8 oz
                </button>
                <button style={{ ...btnActionStyle, background: 'var(--color-accent-orange)', color: '#fff' }} onClick={handleUndo}>
                    Undo
                </button>
            </div>

            {/* 3. History List */}
            <div className="glass-panel" style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 16px', color: 'var(--color-water)', fontSize: '1.1rem' }}>Today's Intake</h3>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                    {todayEntries.length} entries
                </div>

                {todayEntries.slice().reverse().map((entry, idx) => (
                    <div key={idx} style={{
                        display: 'flex', justifyContent: 'space-between',
                        padding: '12px 0',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        color: '#fff'
                    }}>
                        <span>{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span style={{ fontWeight: 'bold', color: 'var(--color-water)' }}>{entry.amount} oz</span>
                    </div>
                ))}
            </div>

        </div>
    );
};

const btnActionStyle = {
    background: 'var(--color-water)',
    color: '#000',
    border: 'none',
    padding: '16px 8px',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    transition: 'transform 0.1s'
};

export default WaterTracker;
