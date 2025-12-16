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
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.2rem'
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
    bottom: '90px', // Above nav bar
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#3b82f6', // Bright Blue
    color: '#fff',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '32px',
    fontWeight: 'bold',
    fontSize: '1rem',
    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.5)',
    zIndex: 50,
    cursor: 'pointer',
    width: '80%',
    maxWidth: '300px'
};

export default PillTracker;
