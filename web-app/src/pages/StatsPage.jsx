import React from 'react';
import StatsView from '../components/StatsView';

const StatsPage = () => {
    return (
        <div className="fade-in">
            <h2 style={{ marginBottom: '20px' }}>Charts</h2>
            <StatsView />
        </div>
    );
};

export default StatsPage;
