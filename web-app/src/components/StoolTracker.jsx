import React, { useState } from 'react';
import TrackerCard from './TrackerCard';
import { addEntry, getTodayTotal } from '../utils/storage';

const StoolTracker = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [formData, setFormData] = useState({
        bristol: 4,
        blood: 'None',
        urgency: 'Low',
        notes: ''
    });

    const handleSave = () => {
        addEntry('stool', { ...formData, type: 'detailed' });
        setShowForm(false);
        setFormData({ bristol: 4, blood: 'None', urgency: 'Low', notes: '' });
        setRefreshKey(prev => prev + 1);
    };

    const todayCount = getTodayTotal('stool').length;

    return (
        <TrackerCard
            title="Gut Health"
            color="var(--color-stool)"
            glowColor="var(--color-stool-glow)"
        >
            {!showForm ? (
                <div style={{ textAlign: 'center' }}>
                    <button style={btnActionStyle} onClick={() => setShowForm(true)}>
                        + Log Stool
                    </button>
                    <div style={{ marginTop: '16px', color: 'var(--color-stool)' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{todayCount}</span> entries today
                    </div>
                </div>
            ) : (
                <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Bristol Scale */}
                    <div>
                        <label style={labelStyle}>Bristol Scale ({formData.bristol})</label>
                        <input
                            type="range" min="1" max="7"
                            value={formData.bristol}
                            onChange={(e) => setFormData({ ...formData, bristol: parseInt(e.target.value) })}
                            style={{ width: '100%', accentColor: 'var(--color-stool)' }}
                        />
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Hard (1)</span>
                            <span>Normal (4)</span>
                            <span>Liquid (7)</span>
                        </div>
                    </div>

                    {/* Blood & Urgency */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={labelStyle}>Blood</label>
                            <select
                                style={inputStyle}
                                value={formData.blood}
                                onChange={(e) => setFormData({ ...formData, blood: e.target.value })}
                            >
                                <option>None</option>
                                <option>Trace</option>
                                <option>Visible</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Urgency</label>
                            <select
                                style={inputStyle}
                                value={formData.urgency}
                                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            style={{ ...btnActionStyle, background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                            onClick={() => setShowForm(false)}
                        >
                            Cancel
                        </button>
                        <button style={btnActionStyle} onClick={handleSave}>
                            Save Entry
                        </button>
                    </div>
                </div>
            )}
        </TrackerCard>
    );
};

const btnActionStyle = {
    background: 'var(--color-stool)',
    color: '#000',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '24px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1
};

const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)'
};

const inputStyle = {
    width: '100%',
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    padding: '8px',
    borderRadius: '8px'
};

export default StoolTracker;
