import React from 'react';
import PillTracker from '../components/PillTracker';

const PillsPage = () => {
    return (
        <div className="fade-in">
            <h2 style={{ marginBottom: '20px' }}>Medication Tracker</h2>
            <PillTracker />

            <div style={{ marginTop: '24px' }}>
            </div>
        </div>
    );
};

export default PillsPage;
