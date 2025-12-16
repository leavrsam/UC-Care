import React, { useState } from 'react';
import { addEntry, getTodayTotal, removeLastEntry } from '../utils/storage';

const EmotionTracker = () => {
    const [selectedMood, setSelectedMood] = useState(4); // Default to Neutral (4)
    const [selectedTags, setSelectedTags] = useState([]);
    const [notes, setNotes] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    const moods = [
        { level: 1, label: 'Very Bad', icon: '😭', color: '#ef4444' },
        { level: 2, label: 'Bad', icon: '😟', color: '#f97316' },
        { level: 3, label: 'Poor', icon: '😕', color: '#fbbf24' },
        { level: 4, label: 'Neutral', icon: '😐', color: '#eab308' },
        { level: 5, label: 'Okay', icon: '🙂', color: '#84cc16' },
        { level: 6, label: 'Good', icon: '😃', color: '#22c55e' },
        { level: 7, label: 'Very Good', icon: '🤩', color: '#15803d' }
    ];

    const commonTags = [
        'Anxious', 'Tired', 'Pain', 'Nausea', 'Energetic',
        'Happy', 'Stressed', 'Calm', 'Headache', 'Bloated'
    ];
    const [customTags, setCustomTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [isAddingTag, setIsAddingTag] = useState(false);

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleAddCustomTag = () => {
        if (newTag.trim() && !commonTags.includes(newTag) && !customTags.includes(newTag)) {
            setCustomTags([...customTags, newTag]);
            setSelectedTags([...selectedTags, newTag]);
            setNewTag('');
            setIsAddingTag(false);
        }
    };

    const handleLog = () => {
        addEntry('emotions', {
            mood: selectedMood,
            tags: selectedTags,
            notes: notes
        });
        // Reset form
        // Reset form
        setSelectedMood(4);
        setSelectedTags([]);
        setNotes('');
        setRefreshKey(prev => prev + 1);
    };

    const handleUndo = () => {
        removeLastEntry('emotions');
        setRefreshKey(prev => prev + 1);
    };

    const todayEntries = getTodayTotal('emotions');

    return (
        <div className="fade-in" style={{ padding: '20px', paddingBottom: '160px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>Mood & Symptoms</h2>

            {/* 1. Mood Selector */}
            <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', textAlign: 'center' }}>
                <div style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>How are you feeling?</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '100%', margin: '0 8px' }}>
                    {moods.map((m) => (
                        <div key={m.level}
                            onClick={() => setSelectedMood(m.level)}
                            style={{
                                cursor: 'pointer',
                                transform: selectedMood === m.level ? 'scale(1.2)' : 'scale(1)',
                                opacity: selectedMood === m.level ? 1 : 0.5,
                                transition: 'all 0.2s'
                            }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{m.icon}</div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: selectedMood === m.level ? m.color : 'var(--text-muted)' }}>{m.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Tags */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '12px', color: 'var(--text-secondary)' }}>Tags</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {commonTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            style={{
                                background: selectedTags.includes(tag) ? 'var(--color-pill)' : 'rgba(255,255,255,0.05)',
                                color: selectedTags.includes(tag) ? '#fff' : 'var(--text-muted)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '20px',
                                padding: '8px 16px',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tag}
                        </button>
                    ))}
                    {customTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            style={{
                                background: selectedTags.includes(tag) ? 'var(--color-pill)' : 'rgba(255,255,255,0.05)',
                                color: selectedTags.includes(tag) ? '#fff' : 'var(--text-muted)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '20px',
                                padding: '8px 16px',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tag}
                        </button>
                    ))}
                    {isAddingTag ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                autoFocus
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTag()}
                                onBlur={() => { if (!newTag) setIsAddingTag(false); }}
                                placeholder="Tag..."
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid var(--color-pill)',
                                    borderRadius: '20px',
                                    padding: '8px 16px',
                                    color: '#fff',
                                    fontSize: '0.85rem',
                                    width: '100px',
                                    outline: 'none'
                                }}
                            />
                            <button onClick={handleAddCustomTag} style={{ background: 'var(--color-pill)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', color: '#fff', cursor: 'pointer' }}>✓</button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAddingTag(true)}
                            style={{
                                background: 'transparent',
                                color: 'var(--color-pill)',
                                border: '1px dashed var(--color-pill)',
                                borderRadius: '20px',
                                padding: '8px 16px',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            + Add Tag
                        </button>
                    )}
                </div>
            </div>

            {/* 3. Notes */}
            <div style={{ marginBottom: '24px' }}>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add a note... (optional)"
                    style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        padding: '16px',
                        color: '#fff',
                        fontSize: '1rem',
                        minHeight: '80px',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                    }}
                />
            </div>

            {/* 4. Action Button */}
            <button
                onClick={handleLog}
                style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #a78bfa, #ec4899)',
                    color: '#fff',
                    border: 'none',
                    padding: '16px',
                    borderRadius: '16px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(236, 72, 153, 0.4)',
                    marginBottom: '32px'
                }}
            >
                Log Entry
            </button>

            {/* 5. Recent History */}
            <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Today's Log</h3>
                    <button onClick={handleUndo} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>Undo Last</button>
                </div>

                {todayEntries.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>No entries today.</div>
                ) : (
                    todayEntries.slice().reverse().map((entry, idx) => {
                        const moodObj = moods.find(m => m.level === entry.mood) || moods[3];
                        return (
                            <div key={idx} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '1.5rem' }}>{moodObj.icon}</span>
                                        <span style={{ fontWeight: 'bold', color: moodObj.color }}>{moodObj.label}</span>
                                    </div>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                {(entry.tags && entry.tags.length > 0) && (
                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '4px' }}>
                                        {entry.tags.map(t => (
                                            <span key={t} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>#{t}</span>
                                        ))}
                                    </div>
                                )}
                                {entry.notes && (
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>"{entry.notes}"</div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default EmotionTracker;
