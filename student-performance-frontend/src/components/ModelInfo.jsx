import { motion } from 'framer-motion'
import { Info, Cpu, Database, Target, BarChart3 } from 'lucide-react'

const rows = [
  { icon: Cpu, label: "Algorithm", value: "Random Forest Classifier" },
  { icon: Database, label: "Base Dataset", value: "UCI Student (Adapted)" },
  { icon: Target, label: "Global Accuracy", value: "81%", highlight: true },
  { icon: BarChart3, label: "Primary Metric", value: "F1 Score" },
]

const ModelInfo = () => {
  return (
    <motion.div 
      className="rounded-2xl border border-slate-200/80 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 text-slate-600 dark:text-slate-400 text-sm overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-gradient-to-br from-sky-400/10 to-indigo-400/10 rounded-full blur-2xl pointer-events-none" />
      
      <h4 className="mb-4 text-slate-800 dark:text-slate-200 uppercase tracking-widest text-xs font-bold border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
        <div className="p-1.5 bg-slate-500/10 dark:bg-slate-400/10 rounded-md">
          <Info className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
        </div>
        Model Architecture
      </h4>
      <div className="flex flex-col gap-3 relative">
        {rows.map((row, i) => (
          <motion.div 
            key={row.label}
            className="flex justify-between items-center group"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
          >
            <span className="font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider flex items-center gap-2">
              <row.icon className="w-3.5 h-3.5 opacity-50" />
              {row.label}
            </span>
            {row.highlight ? (
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 px-2.5 py-1 rounded-lg text-xs">
                {row.value}
              </span>
            ) : (
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{row.value}</span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ModelInfo;
