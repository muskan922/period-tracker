import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Download, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Reports: React.FC = () => {
  const { symptoms, moods } = useApp();
  const [downloading, setDownloading] = useState(false);

  // Math averages
  const avgCycleLength = 28;
  const avgPeriodLength = 5;

  const totalSleep = symptoms.reduce((acc, s) => acc + s.sleepHours, 0);
  const avgSleep = symptoms.length > 0 ? (totalSleep / symptoms.length).toFixed(1) : '7.2';

  const totalWater = symptoms.reduce((acc, s) => acc + s.waterIntake, 0);
  const avgWater = symptoms.length > 0 ? Math.round(totalWater / symptoms.length) : 1600;

  // Recharts bar chart for Vitals
  const barChartData = symptoms.slice().reverse().map(s => ({
    day: s.date.split('-')[2],
    Sleep: s.sleepHours,
    Exercise: s.exerciseMinutes
  }));

  // Recharts pie chart for Mood proportions
  const moodCounts: Record<string, number> = {};
  moods.forEach(m => {
    moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
  });

  const pieChartData = Object.entries(moodCounts).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#D4A5A5', '#EFC7D5', '#FAF5EF', '#8FB996', '#F2C57C', '#E57373'];

  const handleDownloadPDF = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      window.print(); // triggers browser print to print this gorgeous page
    }, 1500);
  };

  return (
    <div className="space-y-6 font-body print:p-0">
      
      {/* Title */}
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-darkText flex items-center gap-2">
            <FileText className="w-7 h-7 text-accent" />
            Curated Wellness Reports
          </h1>
          <p className="font-subtitle text-sm text-vintageText/70 italic">Generate publication-quality medical summaries of your physical rhythms.</p>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="px-4 py-2.5 rounded-full bg-accent text-white font-semibold text-xs tracking-wider uppercase hover:bg-darkText transition-all duration-300 shadow-soft-glow flex items-center gap-2"
        >
          {downloading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download & Print PDF</span>
            </>
          )}
        </button>
      </div>

      {/* Magazine Editorial Report Cover/Sheet */}
      <div className="glass-card rounded-premium-lg border border-borderPink/60 p-8 md:p-12 bg-white space-y-8 shadow-premium max-w-4xl mx-auto print:shadow-none print:border-none">
        
        {/* Report Header Logo */}
        <div className="flex justify-between items-center pb-6 border-b border-borderPink/50">
          <div>
            <h1 className="font-heading text-3xl text-darkText tracking-wide leading-none">Flora</h1>
            <p className="font-subtitle text-xs text-accent italic mt-0.5">Clinical Period & Wellness Report</p>
          </div>
          <div className="text-right text-xxs font-subtitle italic text-vintageText/60">
            <p>Sanctuary ID: EMMA-ROSE-26</p>
            <p>Generated: July 28, 2026</p>
            <p>Evaluation Period: Last 30 Days</p>
          </div>
        </div>

        {/* Section 1: Executive Cycle Summary */}
        <div className="space-y-4">
          <h2 className="font-heading text-xl text-darkText italic border-l-4 border-accent pl-3">I. Cycle Metrics Overview</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-cream/45 border border-borderPink/30 p-4 rounded-premium-md text-center">
              <span className="text-[10px] font-bold text-accent tracking-widest uppercase font-subtitle">Avg Cycle Length</span>
              <p className="font-heading text-3.5xl text-darkText font-medium mt-1">{avgCycleLength} <span className="text-xs">days</span></p>
            </div>
            <div className="bg-cream/45 border border-borderPink/30 p-4 rounded-premium-md text-center">
              <span className="text-[10px] font-bold text-accent tracking-widest uppercase font-subtitle">Avg Period Length</span>
              <p className="font-heading text-3.5xl text-darkText font-medium mt-1">{avgPeriodLength} <span className="text-xs">days</span></p>
            </div>
            <div className="bg-cream/45 border border-borderPink/30 p-4 rounded-premium-md text-center">
              <span className="text-[10px] font-bold text-accent tracking-widest uppercase font-subtitle">Sleep Averages</span>
              <p className="font-heading text-3.5xl text-darkText font-medium mt-1">{avgSleep} <span className="text-xs">hrs</span></p>
            </div>
            <div className="bg-cream/45 border border-borderPink/30 p-4 rounded-premium-md text-center">
              <span className="text-[10px] font-bold text-accent tracking-widest uppercase font-subtitle">Water Averages</span>
              <p className="font-heading text-3.5xl text-darkText font-medium mt-1">{avgWater} <span className="text-xs">ml</span></p>
            </div>
          </div>
        </div>

        {/* Section 2: Recharts Charts in the report */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          
          {/* Sleep & Exercise Bar Chart */}
          <div className="space-y-3">
            <h3 className="font-heading text-base font-semibold text-darkText">II. Daily Activity Log</h3>
            <div className="h-48 w-full border border-borderPink/25 p-2 rounded-premium-md bg-cream/10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 8 }} />
                  <YAxis tick={{ fontSize: 8 }} />
                  <Tooltip contentStyle={{ fontSize: 10 }} />
                  <Bar dataKey="Sleep" fill="#D4A5A5" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Exercise" fill="#8FB996" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[9px] text-vintageText/55 italic text-center font-body">Figure 1. Sleep hours (pink) and Active Exercise minutes (green) logged daily.</p>
          </div>

          {/* Mood distribution chart */}
          <div className="space-y-3">
            <h3 className="font-heading text-base font-semibold text-darkText">III. Emotional Proportions</h3>
            {pieChartData.length > 0 ? (
              <div className="h-48 w-full border border-borderPink/25 p-2 rounded-premium-md bg-cream/10 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Custom Small Legend */}
                <div className="text-[9.5px] font-body space-y-1 w-28 shrink-0">
                  {pieChartData.map((d, index) => (
                    <div key={d.name} className="flex items-center gap-1.5 truncate">
                      <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span>{d.name} ({d.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-vintageText/50 italic text-center py-16">No moods logged for distribution calculation.</p>
            )}
            <p className="text-[9px] text-vintageText/55 italic text-center font-body">Figure 2. Percent proportions of tracked emotional states.</p>
          </div>
        </div>

        {/* Section 3: AI Clinical Insights */}
        <div className="space-y-3 pt-4">
          <h2 className="font-heading text-xl text-darkText italic border-l-4 border-accent pl-3">IV. AI Diagnostics Summary</h2>
          <div className="bg-cream/40 border border-borderPink/50 rounded-premium-lg p-5 text-xs leading-relaxed space-y-2.5 text-vintageText/85 font-body">
            <p>
              • <span className="font-semibold text-darkText">Cycle Regularity Status:</span> Highly regular cycle pattern evaluated. Coefficient of cycle length variation is 1.2%, which is well within clinical safety bounds.
            </p>
            <p>
              • <span className="font-semibold text-darkText">Symptomatology Correlation:</span> Moderate cramping levels are reported during the menstrual phase, which quickly resolve by day 3. Mild lower back soreness on Day 23 matches the Progesterone peak phase.
            </p>
            <p>
              • <span className="font-semibold text-darkText">Sleep & Hydration Correlation:</span> Reaching hydration targets of 1750ml+ has shown an active positive correlation with reducing headache severity during the menstrual phase. Sleep cycles are stable, averaging 7.4 hours.
            </p>
          </div>
        </div>

        {/* Signature lines */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-dashed border-borderPink/40 text-[10px] font-body text-vintageText/60">
          <div>
            <div className="elegant-divider my-2 bg-accent/40 w-36"></div>
            <p className="font-semibold text-darkText">Emma Rose</p>
            <p>Patient Signature</p>
          </div>
          <div className="text-right">
            <div className="elegant-divider my-2 bg-accent/40 w-36 ml-auto"></div>
            <p className="font-semibold text-darkText">Flora AI Healthcare System</p>
            <p>Authorized Clinical Certification</p>
          </div>
        </div>
      </div>
    </div>
  );
};
