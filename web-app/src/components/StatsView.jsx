import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getStorageData } from '../utils/storage';

const StatsView = () => {
    const data = useMemo(() => {
        const storage = getStorageData();
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toDateString();
        });

        return last7Days.map(dateStr => {
            // Filter stool logs for this day
            const dayStools = (storage.stool || []).filter(s => new Date(s.timestamp).toDateString() === dateStr);
            // Filter water logs
            const dayWater = (storage.water || []).filter(s => new Date(s.timestamp).toDateString() === dateStr);
            const totalWater = dayWater.reduce((acc, curr) => acc + curr.amount, 0);

            const dayName = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });

            return {
                day: dayName,
                stoolCount: dayStools.length,
                waterLiters: (totalWater / 1000).toFixed(1)
            };
        });
    }, []);

    return (
        <div className="fade-in">
            {/* Stool Frequency Chart */}
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 20px', color: 'var(--text-secondary)' }}>Stool Frequency (7 Days)</h3>
                <div style={{ height: '200px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis
                                dataKey="day"
                                stroke="var(--text-muted)"
                                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--bg-card)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px'
                                }}
                                itemStyle={{ color: '#fff' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="stoolCount" radius={[6, 6, 0, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.stoolCount > 3 ? '#ef4444' : 'var(--color-stool)'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Water Intake Chart */}
            <div className="glass-panel" style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 20px', color: 'var(--text-secondary)' }}>Water Intake (Liters)</h3>
                <div style={{ height: '200px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis
                                dataKey="day"
                                stroke="var(--text-muted)"
                                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--bg-card)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px'
                                }}
                                itemStyle={{ color: '#fff' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="waterLiters" fill="var(--color-water)" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default StatsView;
