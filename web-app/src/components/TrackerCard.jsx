import React from 'react';

const TrackerCard = ({ title, color, glowColor, children }) => {
    return (
        <div
            className="glass-panel fade-in"
            style={{
                padding: '24px',
                marginBottom: '20px',
                borderLeft: `4px solid ${color}`,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: glowColor || color,
                    filter: 'blur(40px)',
                    opacity: 0.3,
                    pointerEvents: 'none'
                }}
            />
            <h2 style={{ margin: '0 0 16px', fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: color }}>●</span> {title}
            </h2>
            {children}
        </div>
    );
};

export default TrackerCard;
