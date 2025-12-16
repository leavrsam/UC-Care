import React, { useMemo, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
    ScatterChart, Scatter
} from 'recharts';
import { getStorageData } from '../utils/storage';

import stool1 from '../assets/stool/Stool_1.png';
import stool2 from '../assets/stool/Stool_2.png';
import stool3 from '../assets/stool/Stool_3.png';
import stool4 from '../assets/stool/Stool_4.png';
import stool5 from '../assets/stool/Stool_5.png';
import stool6 from '../assets/stool/Stool_6.png';
import stool7 from '../assets/stool/Stool_7.png';

const getBristolImg = (type) => {
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
};

const FILTER_OPTIONS = ['Today', 'Week', 'Month', 'All'];

const StatsView = () => {
    const [view, setView] = useState('Week');
    const [showIcons, setShowIcons] = useState(false);

    // Process Data - shared between both charts
    const { barData, scatterData, xLabels, waterData, pillData } = useMemo(() => {
        const storage = getStorageData();
        const stools = storage.stool || [];
        const water = storage.water || [];
        const pills = storage.pills || [];
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        let startDate = null;

        if (view === 'Today') {
            startDate = startOfDay;
        } else if (view === 'Week') {
            const d = new Date(startOfDay);
            d.setDate(d.getDate() - 6);
            startDate = d;
        } else if (view === 'Month') {
            const d = new Date(startOfDay);
            d.setDate(d.getDate() - 29);
            startDate = d;
        } else {
            // All time - limit to last 60 days to prevent freeze
            const d = new Date(startOfDay);
            d.setDate(d.getDate() - 59);
            startDate = d;
        }

        const filteredStools = stools.filter(s => new Date(s.timestamp) >= startDate);
        const filteredWater = water.filter(s => new Date(s.timestamp) >= startDate);
        const filteredPills = pills.filter(s => new Date(s.timestamp) >= startDate);

        // --- Generate X-Axis Labels (shared by both charts) ---
        const xLabels = [];
        const labelToIndex = new Map();

        if (view === 'Today') {
            // Hourly buckets
            for (let i = 0; i < 24; i++) {
                const label = `${i}:00`;
                xLabels.push(label);
                labelToIndex.set(i, xLabels.length - 1);
            }
        } else {
            // Daily buckets
            for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
                const label = d.toLocaleDateString('en-US', { day: 'numeric', weekday: 'short' });
                const key = d.toDateString();
                xLabels.push(label);
                labelToIndex.set(key, xLabels.length - 1);
            }
        }

        // --- Bar Chart Data ---
        const barData = xLabels.map(label => ({ label, count: 0 }));
        const waterData = xLabels.map(label => ({ label, amount: 0 }));
        const pillData = xLabels.map(label => ({ label, count: 0 }));

        filteredStools.forEach(s => {
            const d = new Date(s.timestamp);
            let idx;
            if (view === 'Today') {
                idx = labelToIndex.get(d.getHours());
            } else {
                idx = labelToIndex.get(d.toDateString());
            }
            if (idx !== undefined && barData[idx]) {
                barData[idx].count++;
            }
        });

        filteredWater.forEach(s => {
            const d = new Date(s.timestamp);
            let idx;
            if (view === 'Today') {
                idx = labelToIndex.get(d.getHours());
            } else {
                idx = labelToIndex.get(d.toDateString());
            }
            if (idx !== undefined && waterData[idx]) {
                // Assuming amount is in ml or arbitrary unit. Simple sum.
                waterData[idx].amount += (parseFloat(s.amount) || 0);
            }
        });

        filteredPills.forEach(s => {
            const d = new Date(s.timestamp);
            let idx;
            if (view === 'Today') {
                idx = labelToIndex.get(d.getHours());
            } else {
                idx = labelToIndex.get(d.toDateString());
            }
            if (idx !== undefined && pillData[idx]) {
                pillData[idx].count++;
            }
        });

        // --- Scatter Data (uses same X-axis labels via index) ---
        const scatterData = filteredStools.map(s => {
            const d = new Date(s.timestamp);
            const timeVal = d.getHours() + d.getMinutes() / 60;

            let xIndex;
            if (view === 'Today') {
                xIndex = labelToIndex.get(d.getHours());
            } else {
                xIndex = labelToIndex.get(d.toDateString());
            }

            if (view === 'Today') {
                return {
                    x: xIndex,
                    y: s.bristol || 4,
                    bristol: s.bristol || 4,
                    label: xLabels[xIndex],
                    timeStr: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
            } else {
                return {
                    x: xIndex,
                    y: timeVal,
                    bristol: s.bristol || 4,
                    label: xLabels[xIndex],
                    dateStr: d.toLocaleDateString()
                };
            }
        }).filter(p => p.x !== undefined);

        return { barData, scatterData, xLabels, waterData, pillData };

    }, [view]);

    const CustomShape = (props) => {
        const { cx, cy, payload } = props;
        if (showIcons && payload.bristol) {
            return (
                <image
                    x={cx - 12}
                    y={cy - 12}
                    width={24}
                    height={24}
                    href={getBristolImg(payload.bristol)}
                    opacity={0.9}
                />
            );
        }
        return <circle cx={cx} cy={cy} r={6} fill="#4ade80" stroke="none" fillOpacity={0.8} />;
    };

    const formatTimeY = (tick) => {
        if (tick === 0 || tick === 24) return '12A';
        if (tick === 12) return '12P';
        if (tick < 12) return `${tick}A`;
        return `${tick - 12}P`;
    };

    const getAxisInterval = () => {
        if (view === 'Today') return 2; // Show every 3rd hour
        if (view === 'Month') return 4; // Show every 5th day
        if (view === 'All') return 9; // Show every 10th day
        return 0; // Week: Show all
    };

    return (
        <div className="fade-in">
            {/* Header / Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div className="view-toggles" style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '4px' }}>
                    {FILTER_OPTIONS.map(opt => (
                        <button
                            key={opt}
                            onClick={() => setView(opt)}
                            style={{
                                background: view === opt ? 'rgba(100, 150, 50, 0.8)' : 'transparent',
                                color: view === opt ? '#fff' : 'var(--text-muted)',
                                border: 'none',
                                padding: '6px 16px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                <div className="icon-toggle" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Icons</span>
                    <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '40px', height: '24px' }}>
                        <input
                            type="checkbox"
                            checked={showIcons}
                            onChange={(e) => setShowIcons(e.target.checked)}
                            style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span className="slider" style={{
                            position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: showIcons ? 'var(--color-stool)' : '#ccc', borderRadius: '34px',
                            transition: '.4s'
                        }}>
                            <span style={{
                                position: 'absolute', height: '16px', width: '16px', left: '4px', bottom: '4px',
                                backgroundColor: 'white', borderRadius: '50%', transition: '.4s',
                                transform: showIcons ? 'translateX(16px)' : 'translateX(0)'
                            }}></span>
                        </span>
                    </label>
                </div>
            </div>

            {/* Daily Plop Count */}
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
                <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Daily Plop Count</h3>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Shows the trends in plop count over time
                    </p>
                </div>
                <div style={{ height: '200px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                            <XAxis
                                dataKey="label"
                                stroke="var(--text-muted)"
                                tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                                tickLine={false} axisLine={false}
                                interval={getAxisInterval()}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                itemStyle={{ color: '#fff' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                {barData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={'#9333ea'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Plop Time of Day Chart */}
            <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Plop Time of Day Chart</h3>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Visualize the frequency of plops and identify peak times
                    </p>
                </div>
                <div style={{ height: '250px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                            <XAxis
                                type="number"
                                dataKey="x"
                                name="Date"
                                domain={[0, xLabels.length - 1]}
                                ticks={xLabels.map((_, i) => i)}
                                tickFormatter={(idx) => xLabels[idx] || ''}
                                stroke="var(--text-muted)"
                                tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                                tickLine={false} axisLine={false}
                                interval={getAxisInterval()}
                            />
                            <YAxis
                                type="number"
                                dataKey="y"
                                name={view === 'Today' ? "Type" : "Time"}
                                unit=""
                                domain={view === 'Today' ? [0, 8] : [0, 24]}
                                ticks={view === 'Today' ? [1, 2, 3, 4, 5, 6, 7] : [0, 4, 8, 12, 16, 20, 24]}
                                tickFormatter={(tick) => {
                                    if (view === 'Today') return `Type ${tick}`;
                                    return formatTimeY(tick);
                                }}
                                stroke="var(--text-muted)"
                                tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                                tickLine={false} axisLine={false}
                            />
                            <Tooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const d = payload[0].payload;
                                        if (view === 'Today') {
                                            return (
                                                <div style={{ background: 'var(--bg-card)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{d.timeStr}</p>
                                                    <p style={{ margin: 0 }}>Type: {d.bristol}</p>
                                                </div>
                                            );
                                        }
                                        const h = Math.floor(d.y);
                                        const m = Math.round((d.y - h) * 60);
                                        const timeStr = `${h}:${m.toString().padStart(2, '0')}`;
                                        return (
                                            <div style={{ background: 'var(--bg-card)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                <p style={{ margin: 0, fontWeight: 'bold' }}>{d.label} at {timeStr}</p>
                                                <p style={{ margin: 0 }}>Type: {d.bristol}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Scatter data={scatterData} shape={<CustomShape />} />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Water Logged Chart */}
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
                <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Water Intake</h3>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Total volume logged over time
                    </p>
                </div>
                <div style={{ height: '200px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={waterData}>
                            <XAxis
                                dataKey="label"
                                stroke="var(--text-muted)"
                                tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                                tickLine={false} axisLine={false}
                                interval={getAxisInterval()}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                itemStyle={{ color: '#fff' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                                {waterData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={'#3b82f6'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pills Taken Chart */}
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
                <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Pills Taken</h3>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Medication doses tracked
                    </p>
                </div>
                <div style={{ height: '200px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={pillData}>
                            <XAxis
                                dataKey="label"
                                stroke="var(--text-muted)"
                                tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                                tickLine={false} axisLine={false}
                                interval={getAxisInterval()}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                itemStyle={{ color: '#fff' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                {pillData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={'#ec4899'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default StatsView;
