import React from 'react';
import PillTracker from '../components/PillTracker';

const PillsPage = () => {
    return (
        <div className="fade-in">
            <h2 style={{ marginBottom: '20px' }}>Medication Tracker</h2>
            <PillTracker />

            <div style={{ marginTop: '24px' }}>
                <h3 style={{ color: 'var(--text-secondary)' }}>Log History</h3>
                {/* Placeholder for detailed list */}
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginTop: '12px' }}>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>Detailed medication history list will appear here.</p>
                </div>
            </div>
        </div>
    );
};

export default PillsPage;
