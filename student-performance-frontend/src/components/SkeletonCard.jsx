import React from 'react';

const SkeletonCard = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col animate-pulse">
    {/* Header row */}
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-2 flex-1">
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
      </div>
      <div className="h-7 w-12 bg-slate-100 dark:bg-slate-800 rounded-md" />
    </div>

    {/* CGPA badge */}
    <div className="mb-4">
      <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-md" />
    </div>

    {/* Branch row */}
    <div className="space-y-3 mt-auto">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-3 w-28 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
      </div>

      {/* Skills pills */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
        <div className="flex gap-1.5">
          <div className="h-5 w-14 bg-slate-100 dark:bg-slate-800 rounded-full" />
          <div className="h-5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" />
          <div className="h-5 w-12 bg-slate-100 dark:bg-slate-800 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

export default SkeletonCard;
