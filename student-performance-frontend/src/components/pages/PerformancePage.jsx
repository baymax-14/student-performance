import { Activity, Cpu, Database, Gauge } from 'lucide-react';

const PerformancePage = () => {
  const modelDetails = [
    { label: 'Algorithm', value: 'Random Forest Classifier', icon: Cpu },
    { label: 'Dataset', value: 'UCI Student Performance (Adapted)', icon: Database },
    { label: 'Accuracy', value: '81%', icon: Gauge },
    { label: 'Primary Metric', value: 'F1 Score (Macro)', icon: Activity },
  ];

  const features = [
    { name: 'Internal Average', importance: 0.67, desc: 'Average marks in internal assessments' },
    { name: 'Attendance', importance: 0.12, desc: 'Class attendance percentage' },
    { name: 'Study Time', importance: 0.08, desc: 'Weekly study hours category' },
    { name: 'Backlogs', importance: 0.05, desc: 'Number of past failures/backlogs' },
    { name: 'School Support', importance: 0.04, desc: 'Extra educational support from school' },
    { name: 'Higher Education', importance: 0.03, desc: 'Plans to pursue higher education' },
    { name: 'Activities', importance: 0.01, desc: 'Participation in extracurriculars' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Model Performance</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Detailed breakdown of the prediction model architecture and metrics.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {modelDetails.map(item => (
          <div key={item.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <item.icon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{item.label}</span>
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-6">Feature Importance Breakdown</h3>
        <div className="space-y-5">
          {features.map(f => (
            <div key={f.name}>
              <div className="flex justify-between items-center mb-1.5">
                <div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{f.name}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">— {f.desc}</span>
                </div>
                <span className="text-sm font-bold text-sky-600 dark:text-sky-400">{(f.importance * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full transition-all duration-700"
                  style={{ width: `${f.importance * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;
