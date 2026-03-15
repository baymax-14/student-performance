const ModelInfo = () => {
  return (
    <div className="mt-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm text-slate-600 dark:text-slate-400 text-sm">
      <h4 className="mb-4 text-slate-800 dark:text-slate-200 uppercase tracking-widest text-xs font-bold border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-slate-400 dark:text-slate-500" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        Model Architecture
      </h4>
      <div className="flex flex-col gap-3">
        <p className="flex justify-between items-center"><span className="font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Algorithm</span> <span className="font-semibold text-slate-800 dark:text-slate-200">Random Forest Classifier</span></p>
        <p className="flex justify-between items-center"><span className="font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Base Dataset</span> <span className="font-semibold text-slate-800 dark:text-slate-200">UCI Student (Adapted)</span></p>
        <p className="flex justify-between items-center"><span className="font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Global Accuracy</span> <span className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 px-2 py-0.5 rounded text-xs">81%</span></p>
        <p className="flex justify-between items-center"><span className="font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Primary Metric</span> <span className="font-semibold text-slate-800 dark:text-slate-200">F1 Score</span></p>
      </div>
    </div>
  );
};

export default ModelInfo;
