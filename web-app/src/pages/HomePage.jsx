import React, { useState, useMemo } from 'react';
import { getStorageData } from '../utils/storage';
import FeedItem from '../components/FeedItem';

const HomePage = ({ onNavigate }) => {
    const [timeFilter, setTimeFilter] = useState('Today'); // Today, Week, Month, All
    const [categoryFilter, setCategoryFilter] = useState('All'); // All, Water, Pills, Stool

    // Data Fetching
    const [allData, setAllData] = useState([]);

    // Data Fetching - Fetch on mount to ensure fresh data
    React.useEffect(() => {
        const storage = getStorageData();
        const pills = (storage.pills || []).map(d => ({ ...d, type: 'pills' }));
        const water = (storage.water || []).map(d => ({ ...d, type: 'water' }));
        const stool = (storage.stool || []).map(d => ({ ...d, type: 'stool' }));

        // Merge and sort desc
        const sorted = [...pills, ...water, ...stool].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setAllData(sorted);
    }, []);

    // Today's Stats
    const todayStr = new Date().toDateString();
    const todayPills = allData.filter(d => d.type === 'pills' && new Date(d.timestamp).toDateString() === todayStr);
    const todayWater = allData.filter(d => d.type === 'water' && new Date(d.timestamp).toDateString() === todayStr);
    const todayStool = allData.filter(d => d.type === 'stool' && new Date(d.timestamp).toDateString() === todayStr);

    const waterTotal = todayWater.reduce((acc, curr) => acc + curr.amount, 0);

    // Filter Logic Breakdown
    const filteredFeed = allData.filter(item => {
        // 1. Time Filter
        const itemDate = new Date(item.timestamp);
        if (timeFilter === 'Today' && itemDate.toDateString() !== todayStr) return false;
        // (Simplified Week/Month logic for prototype - treated as "All" for now or strict 'Today')

        // 2. Category Filter
        if (categoryFilter !== 'All' && item.type !== categoryFilter.toLowerCase()) return false;

        return true;
    });

    // Export Logic
    const handleExport = () => {
        if (filteredFeed.length === 0) {
            alert('No data to export!');
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        let headers = [];
        let rows = [];

        // Define Headers based on Category
        if (categoryFilter === 'Stool') {
            headers = ['Date', 'Time', 'Type', 'Bristol', 'Color', 'Notes'];
        } else if (categoryFilter === 'Water') {
            headers = ['Date', 'Time', 'Type', 'Amount (oz)'];
        } else if (categoryFilter === 'Pills') {
            headers = ['Date', 'Time', 'Type', 'Details'];
        } else {
            // All / Mixed
            headers = ['Date', 'Time', 'Type', 'Details'];
        }

        csvContent += headers.join(",") + "\n";

        // Generate Rows
        filteredFeed.forEach(item => {
            const d = new Date(item.timestamp);
            const dateStr = d.toLocaleDateString();
            const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            let row = [];

            if (categoryFilter === 'Stool') {
                row = [
                    dateStr,
                    timeStr,
                    'Stool',
                    item.bristol || '',
                    item.color || '',
                    `"${(item.notes || '').replace(/"/g, '""')}"` // Escape quotes
                ];
            } else if (categoryFilter === 'Water') {
                row = [
                    dateStr,
                    timeStr,
                    'Water',
                    item.amount || 0
                ];
            } else if (categoryFilter === 'Pills') {
                let details = `"${(item.medications || []).map(m => `${m.name} (${m.dosage})`).join(', ')}"`;
                row = [
                    dateStr,
                    timeStr,
                    'Pills',
                    details
                ];
            } else {
                // All - Generic
                let details = '';
                if (item.type === 'stool') details = `Bristol: ${item.bristol}`;
                if (item.type === 'water') details = `${item.amount} oz`;
                if (item.type === 'pills') details = (item.medications || []).map(m => m.name).join(', ');

                row = [
                    dateStr,
                    timeStr,
                    item.type,
                    `"${details.replace(/"/g, '""')}"`
                ];
            }
            csvContent += row.join(",") + "\n";
        });

        // Trigger Download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `export_${categoryFilter.toLowerCase()}_${timeFilter.toLowerCase()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="fade-in" style={{ paddingBottom: '20px' }}>

            {/* 0. EXPORT BUTTON ROW */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <button
                    onClick={handleExport}
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'var(--color-pill)',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                    Export CSV 📥
                </button>
            </div>

            {/* 1. TOP SUMMARY ROW (screenshot style) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '24px' }}>
                {/* Water Card */}
                <div style={summaryCardStyle} onClick={() => onNavigate('water')}>
                    <div style={{ color: 'var(--color-water)', fontSize: '0.9rem', marginBottom: '8px' }}>Water</div>
                    {/* Simple Circle Sim */}
                    <div style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        border: '4px solid rgba(255,255,255,0.1)',
                        borderTopColor: 'var(--color-water)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-water)' }}>{waterTotal}</div>
                            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>oz</div>
                        </div>
                    </div>
                </div>

                {/* Pills Card */}
                <div style={summaryCardStyle} onClick={() => onNavigate('pills')}>
                    <div style={{ color: 'var(--color-pill)', fontSize: '0.9rem', marginBottom: '8px' }}>Pills</div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Taken</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-pill)' }}>{todayPills.length}</div>
                    </div>
                </div>

                {/* Stool Card */}
                <div style={summaryCardStyle} onClick={() => onNavigate('stool')}>
                    <div style={{ color: 'var(--color-stool)', fontSize: '0.9rem', marginBottom: '8px' }}>Stool</div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-stool)' }}>{todayStool.length}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.2 }}>movements today</div>
                    </div>
                </div>
            </div>

            {/* 2. TIME FILTERS */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px', display: 'flex', marginBottom: '24px' }}>
                {['Today', 'Week', 'Month', 'All'].map(filter => (
                    <button
                        key={filter}
                        onClick={() => setTimeFilter(filter)}
                        style={{
                            flex: 1,
                            background: timeFilter === filter ? 'rgba(255,255,255,0.1)' : 'transparent',
                            border: 'none',
                            color: timeFilter === filter ? '#fff' : 'var(--text-muted)',
                            padding: '8px',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            cursor: 'pointer'
                        }}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* 3. CATEGORY TABS (Underline style) */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '16px' }}>
                <TabButton active={categoryFilter === 'All'} onClick={() => setCategoryFilter('All')} label="All" />
                <TabButton active={categoryFilter === 'Water'} onClick={() => setCategoryFilter('Water')} label="Water" icon="💧" />
                <TabButton active={categoryFilter === 'Pills'} onClick={() => setCategoryFilter('Pills')} label="Pills" icon="💊" />
                <TabButton active={categoryFilter === 'Stool'} onClick={() => setCategoryFilter('Stool')} label="Stool" icon="💩" />
            </div>

            {/* 4. ACTIVITY FEED */}
            <div style={{ minHeight: '200px' }}>
                {filteredFeed.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                        No entries found.
                    </div>
                ) : (
                    filteredFeed.map(item => (
                        <FeedItem key={item.id} type={item.type} data={item} timestamp={item.timestamp} />
                    ))
                )}
            </div>

        </div>
    );
};

const TabButton = ({ active, onClick, label, icon }) => (
    <button
        onClick={onClick}
        style={{
            flex: 1,
            background: 'none',
            border: 'none',
            borderBottom: active ? '2px solid var(--color-pill)' : '2px solid transparent',
            color: active ? '#fff' : 'var(--text-muted)',
            padding: '12px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
        }}
    >
        {icon && <span>{icon}</span>}
        {label}
    </button>
);

const summaryCardStyle = {
    background: 'var(--bg-card)',
    borderRadius: '16px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(255,255,255,0.05)',
    cursor: 'pointer'
};

export default HomePage;
