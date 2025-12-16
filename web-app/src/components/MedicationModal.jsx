import React, { useState, useEffect } from 'react';

const MedicationModal = ({ med, onClose, onSave }) => {
    const [name, setName] = useState(med ? med.name : '');
    const [dosage, setDosage] = useState(med ? med.dosage : '');
    const [mode, setMode] = useState(med ? med.type : 'timer'); // 'timer' or 'fixed'

    // Timer State
    const [interval, setInterval] = useState(med ? med.intervalMinutes / 60 : 4); // hours

    // Fixed Times State
    const [fixedTimes, setFixedTimes] = useState(med && med.times ? med.times : ['09:00']);

    const handleSave = () => {
        if (!name) return;

        const newMed = {
            id: med ? med.id : Date.now().toString(),
            name,
            dosage,
            type: mode,
            intervalMinutes: mode === 'timer' ? interval * 60 : null,
            times: mode === 'fixed' ? fixedTimes : null
        };
        onSave(newMed);
    };

    const addTime = () => setFixedTimes([...fixedTimes, '12:00']);
    const updateTime = (idx, val) => {
        const newTimes = [...fixedTimes];
        newTimes[idx] = val;
        setFixedTimes(newTimes);
    };
    const removeTime = (idx) => {
        setFixedTimes(fixedTimes.filter((_, i) => i !== idx));
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2 style={{ marginBottom: '20px', color: '#000' }}>{med ? 'Edit Medication' : 'Add Medication'}</h2>

                {/* Name & Dosage */}
                <input
                    style={inputStyle}
                    placeholder="Medication name (e.g., Prednisone)"
                    value={name} onChange={e => setName(e.target.value)}
                />
                <input
                    style={inputStyle}
                    placeholder="Dosage (e.g., 30mg)"
                    value={dosage} onChange={e => setDosage(e.target.value)}
                />

                {/* Mode Toggle */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <button
                        style={mode === 'timer' ? activeToggleStyle : toggleStyle}
                        onClick={() => setMode('timer')}
                    >
                        Timer
                    </button>
                    <button
                        style={mode === 'fixed' ? activeToggleStyle : toggleStyle}
                        onClick={() => setMode('fixed')}
                    >
                        Fixed Times
                    </button>
                </div>

                {/* Mode Specific Inputs */}
                {mode === 'timer' ? (
                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Every:</label>
                        <select style={selectStyle} value={interval} onChange={e => setInterval(Number(e.target.value))}>
                            <option value={2}>2 hours</option>
                            <option value={4}>4 hours</option>
                            <option value={6}>6 hours</option>
                            <option value={8}>8 hours</option>
                            <option value={12}>12 hours</option>
                            <option value={24}>24 hours</option>
                        </select>
                    </div>
                ) : (
                    <div style={{ marginBottom: '20px' }}>
                        <button style={secondaryBtnStyle} onClick={addTime}>+ Add Time</button>
                        <div style={{ marginTop: '12px', maxHeight: '100px', overflowY: 'auto' }}>
                            {fixedTimes.map((time, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => updateTime(idx, e.target.value)}
                                        style={timeInputStyle}
                                    />
                                    <button onClick={() => removeTime(idx)} style={removeBtnStyle}>×</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                    <button style={cancelBtnStyle} onClick={onClose}>Cancel</button>
                    <button style={saveBtnStyle} onClick={handleSave}>Save</button>
                </div>

            </div>
        </div>
    );
};

const overlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000
};

const modalStyle = {
    background: '#e5e7eb', // Light grey as per screenshot modal
    padding: '24px',
    borderRadius: '24px',
    width: '90%',
    maxWidth: '400px',
    color: '#000',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
};

const inputStyle = {
    width: '100%', padding: '12px', marginBottom: '12px',
    borderRadius: '12px', border: '1px solid #ccc',
    fontSize: '1rem', background: '#fff'
};

const labelStyle = { fontWeight: '600', marginBottom: '8px', display: 'block' };

const toggleStyle = { flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc', background: 'transparent', cursor: 'pointer' };
const activeToggleStyle = { ...toggleStyle, background: '#3b82f6', color: '#fff', borderColor: '#3b82f6' };

const selectStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ccc', fontSize: '1rem' };
const timeInputStyle = { flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' };

const saveBtnStyle = { flex: 1, padding: '14px', borderRadius: '12px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' };
const cancelBtnStyle = { flex: 1, padding: '14px', borderRadius: '12px', background: '#ccc', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' };
const secondaryBtnStyle = { width: '100%', padding: '8px', borderRadius: '8px', background: '#dbeafe', color: '#3b82f6', border: 'none', fontWeight: '600', cursor: 'pointer' };
const removeBtnStyle = { background: 'none', border: 'none', color: 'red', fontSize: '1.5rem', cursor: 'pointer' };

export default MedicationModal;
