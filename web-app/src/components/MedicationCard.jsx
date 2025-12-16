import React from 'react';

const MedicationCard = ({ med, onTake, onEdit, onDelete, lastLog }) => {
    // Logic to calculate status
    let status = 'Due now';
    let nextDoseTime = null;
    let statusColor = 'var(--text-muted)'; // Default grey
    let isTakenRecently = false;

    // Check if taken recently (e.g. within last 30 mins)
    if (lastLog) {
        const logTime = new Date(lastLog.timestamp);
        const now = new Date();
        if ((now - logTime) < 30 * 60 * 1000) { // 30 mins
            isTakenRecently = true;
            const timeStr = logTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
            status = `Taken at ${timeStr} ✓`;
            statusColor = 'var(--color-success, #4ade80)';
        }
    }

    if (!isTakenRecently) {
        if (med.type === 'fixed') {
            // Find next fixed time
            // Simplified: just showing next configured time for now, can be improved
            // Sort times?
            // For prototype, just show "Due now" if not taken, or calculated next time
            // This logic can be complex, keeping simple for v1 as per screenshot visual
            status = 'Due now';
            statusColor = 'var(--text-primary)';
        } else {
            // Timer based
            // If logs exist, calc next time
            if (lastLog) {
                const logTime = new Date(lastLog.timestamp);
                const next = new Date(logTime.getTime() + med.intervalMinutes * 60000);
                nextDoseTime = next;

                if (new Date() > next) {
                    status = 'Due now';
                    statusColor = 'var(--color-accent-orange, #fb923c)';
                } else {
                    status = `Next dose: ${next.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
                    statusColor = 'var(--text-secondary)';
                }
            } else {
                // Never taken
                status = 'Due now';
                statusColor = 'var(--text-primary)';
            }
        }
    }

    return (
        <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>{med.name}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{med.dosage}</div>
                </div>
                {isTakenRecently && (
                    <div style={{
                        background: 'rgba(74, 222, 128, 0.2)',
                        color: '#4ade80',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                    }}>
                        Just Taken ✓
                    </div>
                )}
            </div>

            <div style={{ marginBottom: '16px', color: statusColor, fontSize: '0.95rem', fontWeight: 500 }}>
                {status}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
                {!isTakenRecently ? (
                    <button style={btnPrimaryStyle} onClick={() => onTake(med)}>
                        Mark as Taken
                    </button>
                ) : (
                    <button style={btnUndoStyle} onClick={() => onTake(med, true)}>
                        Unmark Taken
                    </button>
                )}

                <button style={btnIconStyle} onClick={() => onEdit(med)}>Edit</button>
                <button style={btnIconStyle} onClick={() => onDelete(med.id)}>🗑️</button>
            </div>
        </div>
    );
};

const cardStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '16px',
    position: 'relative',
    borderLeft: '4px solid var(--color-pill)'
};

const btnPrimaryStyle = {
    flex: 1,
    background: 'var(--color-accent-orange, #d97706)', // Matching screenshot gold/orange
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.9rem'
};

const btnUndoStyle = {
    flex: 1,
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid var(--color-accent-orange, #d97706)',
    borderRadius: '8px',
    padding: '12px',
    color: 'var(--color-accent-orange, #d97706)',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.9rem'
};

const btnIconStyle = {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: '8px',
    padding: '0 12px', // Icon size
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.9rem',
    minWidth: '40px'
};

export default MedicationCard;
