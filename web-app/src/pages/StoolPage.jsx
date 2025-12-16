import React from 'react';
import StoolTracker from '../components/StoolTracker';

const StoolPage = () => {
    return (
        <div className="fade-in">
            <h2 style={{ marginBottom: '20px' }}>Gut Health</h2>
            <StoolTracker />
        </div>
    );
};

export default StoolPage;
