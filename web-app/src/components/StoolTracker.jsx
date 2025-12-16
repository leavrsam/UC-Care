import React, { useState, useEffect } from 'react';
import { addEntry, getTodayTotal, getStorageData, deleteEntry, updateEntry } from '../utils/storage';
import GlassDatePicker from './GlassDatePicker';
import GlassTimePicker from './GlassTimePicker';
import '../pages/StoolPage.css';

import stool1 from '../assets/stool/Stool_1.png';
import stool2 from '../assets/stool/Stool_2.png';
import stool3 from '../assets/stool/Stool_3.png';
import stool4 from '../assets/stool/Stool_4.png';
import stool5 from '../assets/stool/Stool_5.png';
import stool6 from '../assets/stool/Stool_6.png';
import stool7 from '../assets/stool/Stool_7.png';

const StoolTracker = () => {
    const [entries, setEntries] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(getInitialFormData());

    useEffect(() => {
        loadData();
    }, []);

    // Add/remove modal-open class to body to hide nav bar
    useEffect(() => {
        if (showModal) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [showModal]);

    const loadData = () => {
        const data = getStorageData();
        setEntries(data.stool || []);
    };

    function getInitialFormData() {
        return {
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), // Use 24h format for input type="time"
            bristol: 4,
            color: 'Brown',
            size: 'Average',
            duration: '3-10 min',
            symptoms: [],
            conditions: [], // Blood, Mucus, etc.
            diet: [],
            notes: ''
        };
    }

    const handleSave = () => {
        // Combine date and time
        const combinedTimestamp = new Date(`${formData.date}T${formData.time}`);

        if (editingId) {
            updateEntry('stool', editingId, { ...formData, timestamp: combinedTimestamp.toISOString() });
        } else {
            addEntry('stool', { ...formData, timestamp: combinedTimestamp.toISOString(), type: 'detailed' });
        }
        loadData();
        setShowModal(false);
        setEditingId(null);
        setFormData(getInitialFormData());
    };

    const handleEdit = (entry) => {
        const entryDate = new Date(entry.timestamp);
        setFormData({
            date: entryDate.toISOString().split('T')[0],
            time: entry.time || entryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            bristol: entry.bristol || 4,
            color: entry.color || 'Brown',
            size: entry.size || 'Average',
            duration: entry.duration || '3-10 min',
            symptoms: entry.symptoms || [],
            conditions: entry.conditions || [],
            diet: entry.diet || [],
            notes: entry.notes || ''
        });
        setEditingId(entry.id);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            deleteEntry('stool', id);
            loadData();
        }
    };

    const toggleSelection = (field, value) => {
        setFormData(prev => {
            const list = prev[field] || [];
            if (list.includes(value)) {
                return { ...prev, [field]: list.filter(item => item !== value) };
            } else {
                return { ...prev, [field]: [...list, value] };
            }
        });
    };

    const todayCount = entries.filter(e => new Date(e.timestamp).toDateString() === new Date().toDateString()).length;

    return (
        <div className="stool-page">
            {/* Summary Card */}
            <div className="stool-summary-card">
                <p className="stool-summary-text" style={{ color: '#8D6E63' }}>Today: {todayCount} bowel movements</p>
            </div>

            {/* List of Entries */}
            <div className="stool-history">
                {entries.map(entry => (
                    <div key={entry.id} className="stool-log-card">
                        <div className="stool-log-header">
                            <span className="stool-type-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <img src={getBristolIcon(entry.bristol)} alt="" style={{ width: '24px', height: '24px' }} />
                                Type {entry.bristol}
                            </span>
                            <span className="stool-time">{new Date(entry.timestamp).toLocaleDateString()} at {entry.time}</span>
                        </div>

                        <div className="stool-details">
                            <div>Color: {entry.color}</div>
                            <div>Quantity: {entry.size}</div>
                            <div>Time spent: {entry.duration}</div>

                            {(entry.symptoms?.length > 0 || entry.conditions?.length > 0) && (
                                <div style={{ marginTop: '8px' }}>
                                    <strong>Symptoms:</strong><br />
                                    {entry.symptoms?.map(s => <span key={s} className="symptom-tag">⚠️ {s}</span>)}
                                    {entry.conditions?.map(c => <span key={c} className="symptom-tag">🚩 {c}</span>)}
                                </div>
                            )}
                        </div>

                        <div className="stool-actions" style={{ display: 'grid', gridTemplateColumns: '40px 1fr 40px', gap: '12px', alignItems: 'center', marginTop: '16px' }}>
                            <div></div>
                            <button className="btn-edit" onClick={() => handleEdit(entry)} style={{ width: '100%', background: '#8D6E63', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px', fontWeight: '600', cursor: 'pointer' }}>Edit</button>
                            <button className="btn-delete" onClick={() => handleDelete(entry.id)} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: '#ff4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.2rem', padding: 0 }}>🗑️</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* FAB */}
            {!showModal && (
                <button className="add-fab" onClick={() => {
                    setEditingId(null);
                    setFormData(getInitialFormData());
                    setShowModal(true);
                }} style={{ background: '#8D6E63' }}>
                    +
                </button>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
                            <h3 className="modal-title">Log Bowel Movement</h3>
                            <div style={{ width: '24px' }}></div>
                        </div>

                        <div className="modal-body">
                            <div className="date-time-container">
                                <div className="input-group">
                                    <label className="section-label">Date</label>
                                    <GlassDatePicker
                                        value={formData.date}
                                        onChange={newDate => setFormData({ ...formData, date: newDate })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="section-label">Time</label>
                                    <GlassTimePicker
                                        value={formData.time}
                                        onChange={newTime => setFormData({ ...formData, time: newTime })}
                                    />
                                </div>
                            </div>

                            <div className="form-section">
                                <label className="section-label">Shape (Bristol Stool Chart)</label>
                                <div className="bristol-grid">
                                    {[1, 2, 3, 4, 5, 6, 7].map(num => (
                                        <div
                                            key={num}
                                            className={`bristol-option ${formData.bristol === num ? 'selected' : ''}`}
                                            onClick={() => setFormData({ ...formData, bristol: num })}
                                        >
                                            <div className="stool-icon">
                                                <img src={getBristolIcon(num)} alt={`Type ${num}`} loading="lazy" />
                                            </div>
                                            <div className="color-label">{num}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-section">
                                <label className="section-label">Color</label>
                                <div className="color-grid">
                                    {[
                                        { name: 'Brown', hex: '#8D6E63' },
                                        { name: 'Dark Brown', hex: '#4E342E' },
                                        { name: 'Green', hex: '#66BB6A' },
                                        { name: 'Black', hex: '#212121' },
                                        { name: 'Yellow', hex: '#FDD835' },
                                        { name: 'Grey', hex: '#9E9E9E' },
                                        { name: 'Red', hex: '#E53935' },
                                        { name: 'Tan', hex: '#D7CCC8' },
                                    ].map(c => (
                                        <div
                                            key={c.name}
                                            className={`color-option ${formData.color === c.name ? 'selected' : ''}`}
                                            onClick={() => setFormData({ ...formData, color: c.name })}
                                        >
                                            <div className="color-circle" style={{ backgroundColor: c.hex }}></div>
                                            <span className="color-label">{c.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-section">
                                <label className="section-label">Quantity</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                    {[
                                        { label: 'Small', size: '1rem' },
                                        { label: 'Average', size: '1.5rem' },
                                        { label: 'Large', size: '2rem' }
                                    ].map(s => (
                                        <button
                                            key={s.label}
                                            className={`option-btn ${formData.size === s.label ? 'selected' : ''}`}
                                            onClick={() => setFormData({ ...formData, size: s.label })}
                                            style={{ flexDirection: 'column', gap: '4px', height: 'auto', padding: '12px' }}
                                        >
                                            <span style={{ fontSize: s.size, lineHeight: 1 }}>💩</span>
                                            <span>{s.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-section">
                                <label className="section-label">Diet Eaten Today (Optional)</label>
                                <div className="symptom-grid">
                                    {[
                                        { name: 'Fibrous', icon: '🥬' },
                                        { name: 'Fatty', icon: '🧀' },
                                        { name: 'Sugary', icon: '🍬' },
                                        { name: 'High Protein', icon: '🥩' },
                                        { name: 'High Carb', icon: '🍞' }
                                    ].map(item => (
                                        <div
                                            key={item.name}
                                            className={`symptom-chip ${formData.diet?.includes(item.name) ? 'selected' : ''}`}
                                            onClick={() => toggleSelection('diet', item.name)}
                                        >
                                            <div className="emoji-wrapper">{item.icon}</div>
                                            <span className="symptom-label">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-section">
                                <label className="section-label">Conditions</label>
                                <div className="symptom-grid">
                                    {[
                                        { name: 'Blood', icon: '🩸' },
                                        { name: 'Mucus', icon: '💧' },
                                        { name: 'Smelly', icon: '🤢' },
                                        { name: 'Sticky', icon: '🍯' },
                                        { name: 'Stringy', icon: '🧶' },
                                        { name: 'Undigested', icon: '🌽' }
                                    ].map(item => (
                                        <div
                                            key={item.name}
                                            className={`symptom-chip ${formData.conditions?.includes(item.name) ? 'selected' : ''}`}
                                            onClick={() => toggleSelection('conditions', item.name)}
                                        >
                                            <div className="emoji-wrapper">{item.icon}</div>
                                            <span className="symptom-label">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-section">
                                <label className="section-label">Symptoms</label>
                                <div className="symptom-grid">
                                    {[
                                        { name: 'Abdominal Pain', icon: '😣' },
                                        { name: 'Bloating', icon: '🎈' },
                                        { name: 'Burning', icon: '🔥' },
                                        { name: 'Cramp', icon: '😖' },
                                        { name: 'Rectal Pain', icon: '⚡' },
                                        { name: 'Urgent', icon: '🏃' }
                                    ].map(item => (
                                        <div
                                            key={item.name}
                                            className={`symptom-chip ${formData.symptoms?.includes(item.name) ? 'selected' : ''}`}
                                            onClick={() => toggleSelection('symptoms', item.name)}
                                        >
                                            <div className="emoji-wrapper">{item.icon}</div>
                                            <span className="symptom-label">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-section">
                                <label className="section-label">Notes (Optional)</label>
                                <textarea
                                    className="glass-input"
                                    placeholder="Additional notes..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    style={{ width: '100%', height: '80px', paddingTop: '12px', resize: 'none' }}
                                />
                            </div>

                            <div className="form-section">
                                <label className="section-label">Time Spent</label>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {['< 1 min', '1-3 min', '3-10 min', '10+ min'].map(s => (
                                        <button
                                            key={s}
                                            className={`option-btn ${formData.duration === s ? 'selected' : ''}`}
                                            onClick={() => setFormData({ ...formData, duration: s })}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn-save" onClick={handleSave}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Start simple with emojis for Bristol chart visualization
const getBristolIcon = (type) => {
    switch (type) {
        case 1: return stool1;
        case 2: return stool2;
        case 3: return stool3;
        case 4: return stool4;
        case 5: return stool5;
        case 6: return stool6;
        case 7: return stool7;
        default: return stool4;
    }
}

export default StoolTracker;
