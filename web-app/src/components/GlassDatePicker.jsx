import React, { useState, useEffect, useRef } from 'react';
import '../pages/StoolPage.css';

const GlassDatePicker = ({ value, onChange }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const dropdownRef = useRef(null);

    // Parse incoming value (YYYY-MM-DD) or default to today
    useEffect(() => {
        if (value) {
            // value is YYYY-MM-DD string
            const [y, m, d] = value.split('-').map(Number);
            setCurrentMonth(new Date(y, m - 1, 1));
        } else {
            setCurrentMonth(new Date());
        }
    }, []); // Only on mount to set initial view

    // Close dropdown when clicking outside
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

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const handleDateClick = (day) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1; // 1-based for string
        const monthStr = month.toString().padStart(2, '0');
        const dayStr = day.toString().padStart(2, '0');

        onChange(`${year}-${monthStr}-${dayStr}`);
        setShowDropdown(false);
    };

    const nextMonth = (e) => {
        e.stopPropagation();
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = (e) => {
        e.stopPropagation();
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    // Create grid array
    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    // Format display value
    const displayValue = value ? new Date(value + 'T00:00:00').toLocaleDateString() : '';

    return (
        <div className="glass-dropdown-container" ref={dropdownRef}>
            <div
                className="glass-input"
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
                <span>{displayValue || 'Select Date'}</span>
                <span style={{ opacity: 0.6 }}>📅</span>
            </div>

            {showDropdown && (
                <div className="glass-dropdown">
                    <div className="calendar-header">
                        <button className="calendar-nav-btn" onClick={prevMonth}>‹</button>
                        <span>{currentMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })}</span>
                        <button className="calendar-nav-btn" onClick={nextMonth}>›</button>
                    </div>

                    <div className="calendar-grid">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                            <div key={d} className="calendar-day-label">{d}</div>
                        ))}

                        {days.map((day, index) => {
                            if (day === null) return <div key={`empty-${index}`} className="calendar-day empty"></div>;

                            const isSelected = value &&
                                parseInt(value.split('-')[2]) === day &&
                                parseInt(value.split('-')[1]) === month + 1 &&
                                parseInt(value.split('-')[0]) === year;

                            return (
                                <div
                                    key={day}
                                    className={`calendar-day ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleDateClick(day)}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlassDatePicker;
