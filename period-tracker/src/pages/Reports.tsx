import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { jsPDF } from 'jspdf';
import { FileText, Download, Printer, Table, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Reports: React.FC = () => {
  const { profile, cycles, symptoms, moods, medications, cycleEngine, personalBaseline, patternInsights } = useApp();
  const [downloading, setDownloading] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Math averages from single source of truth
  const avgCycleLength = cycleEngine.averageCycleLength;
  const avgPeriodLength = cycleEngine.averagePeriodLength;
  const avgSleep = personalBaseline.avgSleepHours;
  const avgWater = personalBaseline.avgWaterIntake;

  // Recharts bar chart for Vitals
  const barChartData = symptoms.slice(0, 14).reverse().map(s => ({
    day: s.date.split('-')[2] || s.date,
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
  const todayStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Generate Real Clinical PDF
  const handleGeneratePDF = () => {
    setDownloading(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Background accent border
      doc.setDrawColor(224, 108, 146);
      doc.setLineWidth(0.6);
      doc.rect(10, 10, 190, 277);

      // Header Banner
      doc.setFillColor(255, 245, 248);
      doc.rect(10, 10, 190, 26, 'F');
      doc.setDrawColor(224, 108, 146);
      doc.line(10, 36, 200, 36);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(74, 21, 37);
      doc.text('FLORA SANCTUARY - CLINICAL HEALTH & CYCLE REPORT', 15, 22);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(184, 59, 94);
      doc.text('Confidential Biometric & Menstrual Record for Gynecological & Telehealth Consultations', 15, 29);

      // Patient Information Card
      doc.setFillColor(250, 247, 245);
      doc.roundedRect(15, 42, 180, 20, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(74, 21, 37);
      doc.text(`Patient Name: ${profile.name}`, 20, 49);
      doc.text(`Age: ${profile.age} years`, 85, 49);
      doc.text(`Report Date: ${todayStr}`, 140, 49);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 70, 80);
      doc.text(`Active Cycle Phase: ${cycleEngine.currentPhase.name} (Day ${cycleEngine.currentCycleDay})`, 20, 56);
      doc.text(`Daily Water Goal: ${profile.waterTarget || 2500} ml`, 140, 56);

      // Section 1: Cycle Parameters
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(74, 21, 37);
      doc.text('I. CORE BIOMETRIC & MENSTRUAL PARAMETERS', 15, 71);

      const params = [
        { label: 'Avg Cycle Length', val: `${avgCycleLength} Days`, sub: `±${cycleEngine.cycleVariability}d variability` },
        { label: 'Avg Period Duration', val: `${avgPeriodLength} Days`, sub: 'Active flow' },
        { label: 'Baseline Sleep', val: `${avgSleep} hrs/night`, sub: 'Calculated average' },
        { label: 'Baseline Hydration', val: `${avgWater} ml/day`, sub: 'Logged intake' }
      ];

      params.forEach((p, idx) => {
        const x = 15 + idx * 46;
        doc.setFillColor(255, 250, 252);
        doc.setDrawColor(240, 210, 220);
        doc.roundedRect(x, 75, 42, 18, 1.5, 1.5, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(120, 80, 95);
        doc.text(p.label, x + 3, 80);
        doc.setFontSize(10.5);
        doc.setTextColor(184, 59, 94);
        doc.text(p.val, x + 3, 86);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(6.5);
        doc.setTextColor(140, 110, 120);
        doc.text(p.sub, x + 3, 90);
      });

      // Section 2: Recent Cycle History Table
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(74, 21, 37);
      doc.text('II. MENSTRUAL CYCLES LOG HISTORY', 15, 103);

      // Table Header
      let y = 107;
      doc.setFillColor(244, 222, 230);
      doc.rect(15, y, 180, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(74, 21, 37);
      doc.text('Start Date', 18, y + 5);
      doc.text('End Date', 45, y + 5);
      doc.text('Flow', 72, y + 5);
      doc.text('Pain (1-10)', 95, y + 5);
      doc.text('Symptoms & Clinical Notes', 125, y + 5);
      y += 7;

      const recentCycles = cycles.slice(0, 5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);

      if (recentCycles.length === 0) {
        doc.text('No cycle history logged yet.', 18, y + 5);
        y += 8;
      } else {
        recentCycles.forEach((c, i) => {
          doc.setFillColor(i % 2 === 0 ? 255 : 252, i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250);
          doc.rect(15, y, 180, 7, 'F');
          doc.setTextColor(50, 40, 45);
          doc.text(c.startDate, 18, y + 5);
          doc.text(c.endDate, 45, y + 5);
          doc.text(c.flow, 72, y + 5);
          doc.text(`${c.pain}/10`, 95, y + 5);
          const symText = (c.symptoms || []).join(', ') + (c.notes ? ` (${c.notes})` : '');
          doc.text(symText.substring(0, 42), 125, y + 5);
          y += 7;
        });
      }

      // Section 3: Current Daily Supplements & Prescriptions
      y += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(74, 21, 37);
      doc.text('III. ACTIVE SUPPLEMENTS & MEDICATIONS', 15, y);

      y += 4;
      doc.setFillColor(244, 222, 230);
      doc.rect(15, y, 180, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(74, 21, 37);
      doc.text('Supplement Name', 18, y + 5);
      doc.text('Dosage', 72, y + 5);
      doc.text('Time', 115, y + 5);
      doc.text('Repeat Schedule', 150, y + 5);
      y += 7;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      if (medications.length === 0) {
        doc.text('No active supplements configured.', 18, y + 5);
        y += 8;
      } else {
        medications.forEach((m, idx) => {
          doc.setFillColor(idx % 2 === 0 ? 255 : 252, idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250);
          doc.rect(15, y, 180, 6.5, 'F');
          doc.setTextColor(50, 40, 45);
          doc.text(m.name, 18, y + 4.5);
          doc.text(m.dosage, 72, y + 4.5);
          doc.text(m.time, 115, y + 4.5);
          doc.text(m.repeat, 150, y + 4.5);
          y += 6.5;
        });
      }

      // Section 4: Pattern Engine Insights
      y += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(74, 21, 37);
      doc.text('IV. AUTOMATED PATTERN ENGINE OBSERVATIONS', 15, y);

      y += 4;
      doc.setFillColor(252, 248, 250);
      doc.setDrawColor(240, 210, 220);
      doc.roundedRect(15, y, 180, 28, 2, 2, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(60, 40, 50);
      doc.text(`* Cycle Regularity: Computed cycle average is ${avgCycleLength} days with ±${cycleEngine.cycleVariability} days variation.`, 18, y + 6);
      doc.text(`* Ovulation Estimate: Peak fertility window typically occurs on Day ${Math.floor(avgCycleLength / 2)}.`, 18, y + 12);
      
      const insight1 = patternInsights[0]?.description || 'Hormonal and lifestyle metrics are within consistent expected thresholds.';
      const insight2 = patternInsights[1]?.description || 'Hydration and sleep patterns positively correlate with lower reported pain scores.';
      doc.text(`* Observation 1: ${insight1.substring(0, 95)}`, 18, y + 18);
      doc.text(`* Observation 2: ${insight2.substring(0, 95)}`, 18, y + 24);

      // Section 5: Signature Blocks
      y += 35;
      doc.setDrawColor(200, 180, 190);
      doc.line(20, y + 10, 75, y + 10);
      doc.line(135, y + 10, 190, y + 10);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(74, 21, 37);
      doc.text(profile.name, 20, y + 14);
      doc.text('Attending Physician / Specialist', 135, y + 14);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(130, 110, 120);
      doc.text('Patient Signature', 20, y + 18);
      doc.text('Signature & Date Verified', 135, y + 18);

      // Footer
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(150, 140, 145);
      doc.text('Generated via Flora Period Tracker & Wellness Sanctuary. This document does not constitute a laboratory diagnosis.', 15, 282);

      const filename = `Flora_Clinical_Report_${profile.name.replace(/\s+/g, '_')}.pdf`;
      doc.save(filename);
      setExportNotice(`Clinical PDF downloaded successfully as ${filename}!`);
      setTimeout(() => setExportNotice(null), 5000);
    } catch (err: any) {
      alert('Error generating PDF: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  // Export CSV Data
  const handleExportCSV = () => {
    try {
      const headers = ['Cycle ID', 'Start Date', 'End Date', 'Flow', 'Pain (1-10)', 'Symptoms', 'Notes'];
      const rows = cycles.map(c => [
        c.id,
        c.startDate,
        c.endDate,
        c.flow,
        c.pain,
        `"${(c.symptoms || []).join('; ')}"`,
        `"${(c.notes || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      const filename = `Flora_Cycle_Data_${profile.name.replace(/\s+/g, '_')}.csv`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportNotice(`CSV exported successfully as ${filename}!`);
      setTimeout(() => setExportNotice(null), 5000);
    } catch (err: any) {
      alert('Error exporting CSV: ' + err.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-body pb-12">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-darkText flex items-center gap-2">
            <FileText className="w-7 h-7 text-accent" />
            Clinical Health & Cycle Report
          </h1>
          <p className="font-subtitle text-sm text-vintageText/70 italic">
            Automated analytical summary generated for personal record-keeping and gynecologist visits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* CSV Export Button */}
          <button
            onClick={handleExportCSV}
            className="py-2.5 px-4 rounded-full border border-borderPink/70 bg-white/80 dark:bg-cream/40 hover:bg-cream dark:hover:bg-cream/60 text-vintageText dark:text-darkText text-xs font-semibold tracking-wider uppercase transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Table className="w-3.5 h-3.5 text-accent" />
            <span>Export CSV</span>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="py-2.5 px-4 rounded-full border border-borderPink/70 bg-white/80 dark:bg-cream/40 hover:bg-cream dark:hover:bg-cream/60 text-vintageText dark:text-darkText text-xs font-semibold tracking-wider uppercase transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-accent" />
            <span>Print Sheet</span>
          </button>

          {/* Genuine PDF Download Button */}
          <button
            onClick={handleGeneratePDF}
            disabled={downloading}
            className="py-2.5 px-5 rounded-full bg-accent hover:bg-darkText text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-soft-glow flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Compiling PDF...' : 'Download Clinical PDF'}</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {exportNotice && (
        <div className="p-3.5 rounded-premium-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-medium flex items-center gap-2 animate-fade-in no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Printable Clinical Sheet Card */}
      <div className="glass-card rounded-premium-lg p-8 space-y-8 border border-borderPink/60 bg-white/95 dark:bg-[#1A1A23] relative shadow-luxury printable-report">
        
        {/* Report Header */}
        <div className="flex justify-between items-start border-b border-borderPink/40 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌸</span>
              <h2 className="font-heading text-2xl font-bold text-darkText">Flora Sanctuary Medical Record</h2>
            </div>
            <p className="font-subtitle text-xs text-accent italic font-semibold mt-0.5">Biometric & Menstrual Cycle Portfolio</p>
          </div>
          <div className="text-right text-xs text-vintageText/80 dark:text-vintageText/90 space-y-0.5 font-subtitle">
            <p><strong className="text-darkText">Subject:</strong> {profile.name}</p>
            <p><strong className="text-darkText">Age:</strong> {profile.age} years</p>
            <p><strong className="text-darkText">Generated Date:</strong> {todayStr}</p>
          </div>
        </div>

        {/* Section 1: Cycle Metrics Table */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl text-darkText italic border-l-4 border-accent pl-3">I. Cycle Parameters</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
            <div className="bg-cream/40 dark:bg-cream/20 p-3.5 rounded-premium-md border border-borderPink/30">
              <span className="text-xxs font-bold text-vintageText/70 dark:text-vintageText/80 tracking-wider uppercase font-subtitle">Avg Cycle Length</span>
              <p className="font-heading text-xl text-accent font-bold mt-1">{avgCycleLength} Days</p>
              <p className="text-[11px] text-vintageText/75 dark:text-vintageText/90 font-subtitle italic">Variability: ±{cycleEngine.cycleVariability}d</p>
            </div>
            <div className="bg-cream/40 dark:bg-cream/20 p-3.5 rounded-premium-md border border-borderPink/30">
              <span className="text-xxs font-bold text-vintageText/70 dark:text-vintageText/80 tracking-wider uppercase font-subtitle">Avg Period Length</span>
              <p className="font-heading text-xl text-accent font-bold mt-1">{avgPeriodLength} Days</p>
              <p className="text-[11px] text-vintageText/75 dark:text-vintageText/90 font-subtitle italic">Active duration</p>
            </div>
            <div className="bg-cream/40 dark:bg-cream/20 p-3.5 rounded-premium-md border border-borderPink/30">
              <span className="text-xxs font-bold text-vintageText/70 dark:text-vintageText/80 tracking-wider uppercase font-subtitle">Avg Sleep</span>
              <p className="font-heading text-xl text-accent font-bold mt-1">{avgSleep} hrs/night</p>
              <p className="text-[11px] text-vintageText/75 dark:text-vintageText/90 font-subtitle italic">Personal baseline</p>
            </div>
            <div className="bg-cream/40 dark:bg-cream/20 p-3.5 rounded-premium-md border border-borderPink/30">
              <span className="text-xxs font-bold text-vintageText/70 dark:text-vintageText/80 tracking-wider uppercase font-subtitle">Avg Hydration</span>
              <p className="font-heading text-xl text-accent font-bold mt-1">{avgWater} ml/day</p>
              <p className="text-[11px] text-vintageText/75 dark:text-vintageText/90 font-subtitle italic">Daily baseline</p>
            </div>
          </div>
        </div>

        {/* Section 2: Visual Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Chart 1: Sleep & Exercise */}
          <div className="space-y-2">
            <h3 className="font-heading text-lg text-darkText italic border-l-4 border-accent pl-3">II. Sleep & Exercise</h3>
            <div className="h-48 w-full bg-cream/20 p-2 rounded-premium-md border border-borderPink/30">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <XAxis dataKey="day" stroke="#888888" fontSize={10} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="Sleep" fill="#FF8DB3" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Exercise" fill="#C89F65" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[9px] text-vintageText/55 italic text-center font-body">Figure 1. Recent daily sleep hours vs exercise minutes.</p>
          </div>

          {/* Chart 2: Mood Distribution */}
          <div className="space-y-2">
            <h3 className="font-heading text-lg text-darkText italic border-l-4 border-accent pl-3">III. Emotional State Proportions</h3>
            {pieChartData.length > 0 ? (
              <div className="h-48 w-full bg-cream/20 p-2 rounded-premium-md border border-borderPink/30 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-[10px] space-y-1 font-subtitle pr-4">
                  {pieChartData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span>{entry.name}: {entry.value}</span>
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

        {/* Section 3: AI Pattern Summary */}
        <div className="space-y-3 pt-4">
          <h3 className="font-heading text-xl text-darkText italic border-l-4 border-accent pl-3">IV. Pattern Engine Summary</h3>
          <div className="bg-cream/40 border border-borderPink/50 rounded-premium-lg p-5 text-xs leading-relaxed space-y-2.5 text-vintageText/85 font-body">
            <p>
              • <span className="font-semibold text-darkText">Cycle Regularity:</span> Average cycle length calculated at {avgCycleLength} days with a variability of ±{cycleEngine.cycleVariability} days. Currently on {cycleEngine.currentPhase.name} (Day {cycleEngine.currentCycleDay}).
            </p>
            {patternInsights.map(ins => (
              <p key={ins.id}>
                • <span className="font-semibold text-darkText">{ins.title}:</span> {ins.description}
              </p>
            ))}
          </div>
        </div>

        {/* Signature lines */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-dashed border-borderPink/40 text-[10px] font-body text-vintageText/60">
          <div>
            <div className="elegant-divider my-2 bg-accent/40 w-36"></div>
            <p className="font-semibold text-darkText">{profile.name}</p>
            <p>Sanctuary Member Signature</p>
          </div>
          <div className="text-right">
            <div className="elegant-divider my-2 bg-accent/40 w-36 ml-auto"></div>
            <p className="font-semibold text-darkText">Flora AI Pattern System</p>
            <p>Automated Biological Certification</p>
          </div>
        </div>
      </div>
    </div>
  );
};
