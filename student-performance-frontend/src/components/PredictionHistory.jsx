const PredictionHistory = ({ history }) => {
  if (!history || history.length === 0) return null;

  return (
    <div className="mt-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
        <span className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
        </span>
        Prediction History
      </h3>
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800/80">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800/80">
            <tr>
              <th className="px-4 py-3 font-medium rounded-tl-lg">Attendance</th>
              <th className="px-4 py-3 font-medium">Internal</th>
              <th className="px-4 py-3 font-medium">Study Time</th>
              <th className="px-4 py-3 font-medium rounded-tr-lg">Result</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => {
              // Add color coding to result
              let resultColor = "#fca5a5"; // default poor
              if (item.prediction === 2) resultColor = "#6ee7b7"; // good
              if (item.prediction === 1) resultColor = "#fcd34d"; // avg

              return (
                <tr key={index} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors last:border-0">
                  <td className="px-4 py-3.5">{item.formData.attendance}%</td>
                  <td className="px-4 py-3.5">{item.formData.internal_avg}</td>
                  <td className="px-4 py-3.5">{item.formData.studytime}h</td>
                  <td className="px-4 py-3.5 font-bold tracking-wide" style={{ color: resultColor }}>
                    {item.performance.split(" ")[0]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PredictionHistory;
