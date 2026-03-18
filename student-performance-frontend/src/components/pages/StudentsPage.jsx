import { Search } from 'lucide-react';
import { useState } from 'react';

const StudentsPage = ({ history }) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  const students = history.map((item, idx) => ({
    id: history.length - idx,
    attendance: item.formData.attendance,
    internal: item.formData.internal_avg,
    studytime: item.formData.studytime,
    backlogs: item.formData.backlogs,
    performance: item.performance,
    prediction: item.prediction,
    confidence: (item.confidence * 100).toFixed(0),
  }));

  const sorted = [...students].sort((a, b) => {
    if (sortBy === 'latest') return 0;
    if (sortBy === 'attendance') return b.attendance - a.attendance;
    if (sortBy === 'confidence') return b.confidence - a.confidence;
    return 0;
  });

  const filtered = sorted.filter(s =>
    s.performance.toLowerCase().includes(search.toLowerCase()) ||
    String(s.attendance).includes(search)
  );

  const predColor = (pred) => {
    if (pred === 2) return 'text-emerald-600 dark:text-emerald-400';
    if (pred === 1) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Prediction History</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Browse all past predictions and outcomes.</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by performance or attendance..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
          />
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 appearance-none cursor-pointer"
        >
          <option value="latest">Sort: Latest First</option>
          <option value="attendance">Sort: Attendance</option>
          <option value="confidence">Sort: Confidence</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {students.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-sm">
            No student records yet. Run predictions from the Dashboard to populate this table.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3.5 font-semibold">#</th>
                <th className="px-5 py-3.5 font-semibold">Attendance</th>
                <th className="px-5 py-3.5 font-semibold">Internal Avg</th>
                <th className="px-5 py-3.5 font-semibold">Study Time</th>
                <th className="px-5 py-3.5 font-semibold">Backlogs</th>
                <th className="px-5 py-3.5 font-semibold">Prediction</th>
                <th className="px-5 py-3.5 font-semibold">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5 text-slate-400 dark:text-slate-500 font-mono text-xs">{s.id}</td>
                  <td className="px-5 py-3.5 text-slate-700 dark:text-slate-200">{s.attendance}%</td>
                  <td className="px-5 py-3.5 text-slate-700 dark:text-slate-200">{s.internal}</td>
                  <td className="px-5 py-3.5 text-slate-700 dark:text-slate-200">{s.studytime}h</td>
                  <td className="px-5 py-3.5 text-slate-700 dark:text-slate-200">{s.backlogs}</td>
                  <td className={`px-5 py-3.5 font-bold ${predColor(s.prediction)}`}>{s.performance.split(' ')[0]}</td>
                  <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 font-semibold">{s.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentsPage;
