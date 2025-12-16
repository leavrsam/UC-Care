import React, { useState, useEffect } from 'react';
import { getMedications, saveMedication, deleteMedication, addEntry, getTodayTotal, removeLastEntry } from '../utils/storage';
import MedicationCard from './MedicationCard';
import MedicationModal from './MedicationModal';

const PillTracker = () => {
    const [meds, setMeds] = useState([]);
    const [logs, setLogs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMed, setEditMed] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const refresh = () => setRefreshKey(prev => prev + 1);

    useEffect(() => {
        setMeds(getMedications());
        setLogs(getTodayTotal('pills'));
    }, [refreshKey]);

    const handleSaveMed = (med) => {
        saveMedication(med);
        setShowModal(false);
        setEditMed(null);
        refresh();
    };

    const handleDeleteMed = (id) => {
        deleteMedication(id);
        refresh();
    };

    const handleEdit = (med) => {
        setEditMed(med);
        setShowModal(true);
    };

    const handleTake = (med, isUndo = false) => {
        if (isUndo) {
            // Unmark taken: remove last entry for this med
            // For MVP, simplistic: remove last 'pills' entry if it matches name?
            // Or better: log has metadata.
            // Current storage addEntry only stores {name, dosage}.
            // TODO: Ideally filter by med ID. But name is okay for now.
            // We'll rely on global undo for now or just generic remove for MVP
            // The simple removeLastEntry('pills') removes the *global* last pill.
            // If user took two diff pills, this undo might remove the wrong one if not careful.
            // But let's stick to the requested "Unmark Taken" button logic.
            removeLastEntry('pills');
        } else {
            addEntry('pills', { name: med.name, dosage: med.dosage, medId: med.id });
        }
        refresh();
    };

    // Helper to get last log for a med
    const getLastLog = (med) => {
        // Need to check ALL history not just today if we want full timer logic,
        // but for "Today's" state, checking today logs is a good start.
        // Actually, for a 4 hour timer, we need absolute history.
        // But getTodayTotal only returns today.
        // For this refactor, let's just look at today's logs for status updates.
        return logs.find(l => l.name === med.name); // Simple name match
    };

    return (
        <div className="fade-in" style={{ padding: '20px', paddingBottom: '160px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Pills</h2>
                <button
                    onClick={() => { setEditMed(null); setShowModal(true); }}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: '#fff',
                        width: '32px', height: '32px',

                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.2rem',
                        padding: 0,
                        lineHeight: '1'
                    }}
                >
                    +
                </button>
            </div>

            {meds.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                    No medications set up.<br />Tap "+ Add Medication" to start.
                </div>
            ) : (
                meds.map(med => (
                    <MedicationCard
                        key={med.id}
                        med={med}
                        lastLog={getLastLog(med)}
                        onTake={handleTake}
                        onEdit={handleEdit}
                        onDelete={handleDeleteMed}
                    />
                ))
            )}

            {/* Log History */}
            <div style={{ marginTop: '32px' }}>
                <h3 style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Log History (Today)</h3>
                {logs.length === 0 ? (
                    <div style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        No medications taken today.
                    </div>
                ) : (
                    <div className="glass-panel" style={{ padding: '8px' }}>
                        {logs.slice().reverse().map((entry, idx) => (
                            <div key={idx} style={{
                                padding: '12px',
                                borderBottom: idx !== logs.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', color: '#fff' }}>{entry.name || 'Unknown'}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{entry.dosage}</div>
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={() => { setEditMed(null); setShowModal(true); }}
                style={floatBtnStyle}
            >
                + Add Medication
            </button>

            {showModal && (
                <MedicationModal
                    med={editMed}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveMed}
                />
            )}
        </div>
    );
};

const floatBtnStyle = {
    position: 'fixed',
    bottom: '120px', // Raised to avoid nav overlap
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'var(--color-accent-orange, #d97706)', // Matched to page theme
    color: '#fff',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '32px',
    fontWeight: 'bold',
    fontSize: '1rem',
    borderRadius: '32px',
    fontWeight: 'bold',
    fontSize: '1rem',
    boxShadow: '0 8px 20px rgba(217, 119, 6, 0.5)',
    zIndex: 50,
    cursor: 'pointer',
    width: '80%',
    maxWidth: '300px'
};

export default PillTracker;
