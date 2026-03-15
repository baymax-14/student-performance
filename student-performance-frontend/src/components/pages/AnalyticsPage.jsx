import { BarChart3, TrendingUp, Users, Target } from 'lucide-react';

const AnalyticsPage = ({ history }) => {
  const totalPredictions = history.length;
  const avgConfidence = totalPredictions > 0
    ? (history.reduce((sum, h) => sum + h.confidence, 0) / totalPredictions * 100).toFixed(1)
    : 0;

  const good = history.filter(h => h.prediction === 2).length;
  const avg = history.filter(h => h.prediction === 1).length;
  const poor = history.filter(h => h.prediction === 0).length;

  const stats = [
    { label: 'Total Predictions', value: totalPredictions, icon: BarChart3, color: 'sky' },
    { label: 'Avg Confidence', value: `${avgConfidence}%`, icon: Target, color: 'emerald' },
    { label: 'Good Results', value: good, icon: TrendingUp, color: 'green' },
    { label: 'Needs Improvement', value: poor, icon: Users, color: 'rose' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Analytics</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Overview of prediction statistics and trends.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={`w-4 h-4 text-${stat.color}-500 dark:text-${stat.color}-400`} />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-5">Performance Distribution</h3>
        {totalPredictions === 0 ? (
          <p className="text-slate-500 text-sm">No predictions yet. Run some predictions from the Dashboard to see analytics.</p>
        ) : (
          <div className="space-y-4">
            {[
              { label: 'Good', count: good, color: 'bg-emerald-500' },
              { label: 'Average', count: avg, color: 'bg-amber-500' },
              { label: 'Poor', count: poor, color: 'bg-rose-500' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 w-20">{item.label}</span>
                <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-700`}
                    style={{ width: `${(item.count / totalPredictions) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-8 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
