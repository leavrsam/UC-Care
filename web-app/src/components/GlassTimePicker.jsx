import React, { useState, useEffect, useRef } from 'react';
import '../pages/StoolPage.css';

const InfiniteTimeColumn = ({ options, value, onChange }) => {
    const listRef = useRef(null);
    const itemHeight = 40; // Height of each option in px

    // We create a "buffered" list
    const REPEAT_COUNT = 30;
    const items = [];
    for (let i = 0; i < REPEAT_COUNT; i++) {
        items.push(...options);
    }

    // Initial scroll position
    useEffect(() => {
        if (listRef.current) {
            const index = options.indexOf(value);
            // Scroll to the middle set
            const middleSet = Math.floor(REPEAT_COUNT / 2);
            const targetIndex = (middleSet * options.length) + index;
            // Center the item: scrollTop = index * itemHeight (since padding centers the first item at 0 scroll)
            listRef.current.scrollTop = targetIndex * itemHeight;
        }
    }, [options]); // Run once on mount/options change. 

    return (
        <div className="time-column" ref={listRef}>
            {items.map((item, i) => (
                <div
                    key={i}
                    className={`time-option ${item === value ? 'selected' : ''}`}
                    onClick={() => {
                        onChange(item);
                        // Smooth scroll to near this item
                        listRef.current.scrollTo({ top: i * itemHeight, behavior: 'smooth' });
                    }}
                >
                    {String(item).padStart(2, '0')}
                </div>
            ))}
        </div>
    );
};

const GlassTimePicker = ({ value, onChange }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Initial values
    const [selectedHour, setSelectedHour] = useState(12);
    const [selectedMinute, setSelectedMinute] = useState(0);
    const [isPm, setIsPm] = useState(false);

    // Parse value (HH:MM 24h)
    useEffect(() => {
        if (value) {
            const [h, m] = value.split(':').map(Number);
            let hour12 = h % 12 || 12;
            setSelectedHour(hour12);
            setSelectedMinute(m);
            setIsPm(h >= 12);
        } else {
            const now = new Date();
            let h = now.getHours();
            let m = now.getMinutes();
            let hour12 = h % 12 || 12;
            setSelectedHour(hour12);
            setSelectedMinute(m);
            setIsPm(h >= 12);
        }
    }, [value, showDropdown]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const updateTime = (h, m, pm) => {
        let hour24 = pm ? (h % 12) + 12 : h % 12;
        if (h === 12 && !pm) hour24 = 0;
        if (h === 12 && pm) hour24 = 12;

        const timeStr = `${hour24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        onChange(timeStr);
    };

    const handleHourChange = (h) => {
        setSelectedHour(h);
        updateTime(h, selectedMinute, isPm);
    };

    const handleMinuteChange = (m) => {
        setSelectedMinute(m);
        updateTime(selectedHour, m, isPm);
    };

    const handleAmPmChange = (pm) => {
        setIsPm(pm);
        updateTime(selectedHour, selectedMinute, pm);
    };

    const displayValue = value ? new Date(`2000-01-01T${value}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    return (
        <div className="glass-dropdown-container" ref={dropdownRef}>
            <div
                className="glass-input"
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
                <span>{displayValue || 'Select Time'}</span>
                <span style={{ opacity: 0.6 }}>🕒</span>
            </div>

            {showDropdown && (
                <div className="glass-dropdown" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="time-columns">
                        <div className="time-highlight-bar" style={{ top: '50%', width: '66%', left: 0 }}></div>

                        <InfiniteTimeColumn
                            options={Array.from({ length: 12 }, (_, i) => i + 1)}
                            value={selectedHour}
                            onChange={handleHourChange}
                        />

                        <InfiniteTimeColumn
                            options={Array.from({ length: 60 }, (_, i) => i)}
                            value={selectedMinute}
                            onChange={handleMinuteChange}
                        />

                        {/* Static AM/PM Toggle */}
                        <div className="time-column" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                            <div
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    background: !isPm ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    color: !isPm ? '#fff' : 'var(--text-muted)',
                                    fontWeight: !isPm ? 'bold' : 'normal',
                                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                                }}
                                onClick={() => handleAmPmChange(false)}
                            >
                                AM
                            </div>
                            <div
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    background: isPm ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    color: isPm ? '#fff' : 'var(--text-muted)',
                                    fontWeight: isPm ? 'bold' : 'normal'
                                }}
                                onClick={() => handleAmPmChange(true)}
                            >
                                PM
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlassTimePicker;
