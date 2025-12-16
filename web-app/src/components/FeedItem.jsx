import React from 'react';

const FeedItem = ({ type, data, timestamp }) => {
    const time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let color = 'var(--text-muted)';
    let icon = '•';
    let title = 'Entry';
    let details = '';

    if (type === 'water') {
        color = 'var(--color-water)';
        icon = '💧';
        title = 'Water';
        details = `${data.amount} oz`;
    } else if (type === 'pills') {
        color = 'var(--color-pill)';
        icon = '💊';
        title = data.name || 'Medication';
        details = `${data.dosage || ''}`;
    } else if (type === 'stool') {
        color = 'var(--color-stool)';
        icon = '💩';
        title = 'Stool';
        details = `Type ${data.bristol || '?'}`;
    } else if (type === 'emotions') {
        color = 'var(--color-mood)';
        const moodIcons = ['unknown', '😭', '😟', '😐', '🙂', '🤩'];
        icon = moodIcons[data.mood] || '😐';
        title = 'Mood';
        details = data.tags ? data.tags.join(', ') : '';
        if (!details && data.notes) details = 'Note added';
    }

    return (
        <div style={itemStyle}>
            <div style={{ marginRight: '16px', color: color, fontSize: '1.2rem' }}>
                {icon}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ color: color, fontWeight: '600', fontSize: '1rem' }}>{title}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{time}</div>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {details}
            </div>
        </div>
    );
};

const itemStyle = {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    border: '1px solid rgba(255,255,255,0.05)'
};

export default FeedItem;
