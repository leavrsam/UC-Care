import React from 'react';
import WaterTracker from '../components/WaterTracker';

const WaterPage = () => {
    return (
        <div className="fade-in">
            <h2 style={{ marginBottom: '20px' }}>Hydration Tracker</h2>
            <WaterTracker />
        </div>
    );
};

export default WaterPage;
