import React from 'react';
import { TrendingUp, Award } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import type { DailySymptomLog } from '../context/AppContext';

interface Hydration7DayChartProps {
  symptoms: DailySymptomLog[];
  targetMl: number;
}

export const Hydration7DayChart: React.FC<Hydration7DayChartProps> = ({ symptoms, targetMl }) => {
  const targetL = targetMl / 1000;

  // Prepare last 7 days data
  const last7DaysData = React.useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const foundLog = symptoms.find(s => s.date === dateStr);
      const waterMl = foundLog ? foundLog.waterIntake : 0;
      const waterL = parseFloat((waterMl / 1000).toFixed(2));
      const pct = Math.min(100, Math.round((waterMl / targetMl) * 100));

      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      data.push({
        date: dateStr,
        day: dayName,
        waterL,
        waterMl,
        pct
      });
    }
    return data;
  }, [symptoms, targetMl]);

  const avgMl = Math.round(
    last7DaysData.reduce((acc, curr) => acc + curr.waterMl, 0) / 7
  );
  const avgL = (avgMl / 1000).toFixed(2);
  const daysAchievedInWeek = last7DaysData.filter(d => d.waterMl >= targetMl).length;

  return (
    <div className="glass-card rounded-premium-xl p-6 space-y-4 border border-borderPink/60 bg-white/90">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent uppercase tracking-wider mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            7-Day History Visual
          </div>
          <h3 className="font-heading text-xl font-bold text-darkText flex items-center gap-2">
            Weekly Hydration History 📊
          </h3>
          <p className="text-xs text-vintageText">
            Daily water intake for the past 7 days compared against your target ({targetL.toFixed(1)} L).
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-secondary/70 border border-borderPink/60 text-darkText font-semibold">
            7-Day Avg: <strong>{avgL} L</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            Goals Met: <strong>{daysAchievedInWeek} / 7 days</strong>
          </div>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="h-52 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={last7DaysData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#2C1820' }} />
            <YAxis tick={{ fontSize: 11, fill: '#2C1820' }} domain={[0, Math.max(3.5, targetL + 0.5)]} />
            <Tooltip
              formatter={(value: any) => [`${value} Liters`, 'Water Consumed']}
              labelFormatter={(label, items) => {
                if (items && items.length > 0) {
                  return `${label} (${items[0].payload.date})`;
                }
                return label;
              }}
              contentStyle={{ borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 12px rgba(224, 108, 146, 0.15)', borderColor: '#F2D9E6', backgroundColor: '#FFFDF8', color: '#2C1820' }}
            />
            <ReferenceLine
              y={targetL}
              stroke="#E06C92"
              strokeDasharray="4 4"
              label={{ value: `Goal (${targetL.toFixed(1)}L)`, fill: '#E06C92', fontSize: 11, position: 'insideTopRight' }}
            />
            <Bar dataKey="waterL" radius={[6, 6, 0, 0]}>
              {last7DaysData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.waterL >= targetL
                      ? '#8FB996'
                      : entry.waterL >= targetL * 0.7
                      ? '#E06C92'
                      : entry.waterL > 0
                      ? '#F2C57C'
                      : '#F2D9E6'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Breakdown */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-borderPink/40 text-xs text-vintageText">
        <div className="flex items-center gap-4 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8FB996]"></span> Goal Reached (100%+)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E06C92]"></span> Good (70-99%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F2C57C]"></span> Partial (40-69%)
          </span>
        </div>
        <span className="italic">Data updates automatically from your water log</span>
      </div>
    </div>
  );
};
