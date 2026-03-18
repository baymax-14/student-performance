import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  GraduationCap, 
  Clock, 
  BookOpen, 
  AlertTriangle, 
  HeartHandshake, 
  Trophy, 
  Sparkles,
  RotateCcw,
  Wand2,
  ArrowRight
} from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

const InputField = ({ icon: Icon, label, children, color }) => (
  <motion.div variants={item} className="group">
    <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2.5 group-focus-within:text-sky-600 dark:group-focus-within:text-sky-400 transition-colors">
      <div className={`p-1.5 rounded-md ${color} transition-colors`}>
        <Icon className="w-3.5 h-3.5 text-white" />
      </div>
      {label}
    </label>
    {children}
  </motion.div>
)

const inputBase = "w-full bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all duration-200 disabled:opacity-40 hover:border-slate-300 dark:hover:border-slate-600 backdrop-blur-sm text-sm font-medium"

const selectBase = `${inputBase} appearance-none cursor-pointer`

const PredictionForm = ({ onPredict, isLoading }) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    attendance: 80,
    internal_avg: 15,
    studytime: 2,
    backlogs: 0,
    schoolsup: 0,
    activities: 1,
    higher: 1
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: Number(value)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
    } else {
      onPredict(formData)
    }
  }

  const handleSampleData = () => {
    setFormData({
      attendance: 85,
      internal_avg: 16,
      studytime: 3,
      backlogs: 0,
      schoolsup: 0,
      activities: 1,
      higher: 1
    })
  }

  const handleReset = () => {
    setStep(1)
    setFormData({
      attendance: 80,
      internal_avg: 15,
      studytime: 2,
      backlogs: 0,
      schoolsup: 0,
      activities: 1,
      higher: 1
    })
  }

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="relative rounded-2xl border border-slate-200/80 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 transition-colors duration-300 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Decorative gradient orb */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-sky-400/20 to-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-tr from-emerald-400/10 to-sky-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Progress */}
      <motion.div 
        className="mb-8 relative"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl shadow-lg shadow-sky-500/25">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Student Profiler</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Step {step} of 2 - {step === 1 ? "Academic Stats" : "Study Habits & Support"}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-sky-500 to-indigo-500"
            initial={{ width: "50%" }}
            animate={{ width: step === 1 ? "50%" : "100%" }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Fields Container (Step 1) */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 relative"
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
          >
            <InputField icon={BookOpen} label="Attendance (%)" color="bg-emerald-500">
              <input type="number" name="attendance" min="0" max="100" value={formData.attendance} onChange={handleChange} required disabled={isLoading} className={inputBase} />
            </InputField>

            <InputField icon={Trophy} label="Internal Average (0-20)" color="bg-indigo-500">
              <input type="number" name="internal_avg" min="0" max="20" step="0.1" value={formData.internal_avg} onChange={handleChange} required disabled={isLoading} className={inputBase} />
            </InputField>

            <InputField icon={AlertTriangle} label="Past Failures (0-3)" color="bg-rose-500">
              <input type="number" name="backlogs" min="0" max="3" value={formData.backlogs} onChange={handleChange} required disabled={isLoading} className={inputBase} />
            </InputField>
          </motion.div>
        )}

        {/* Fields Container (Step 2) */}
        {step === 2 && (
          <motion.div 
            key="step2"
            className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 relative"
            variants={container}
            initial={{ opacity: 0, x: 20 }}
            animate="show"
            exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
          >
            <InputField icon={Clock} label="Study Time" color="bg-sky-500">
              <select name="studytime" value={formData.studytime} onChange={handleChange} required disabled={isLoading} className={selectBase}>
                <option value="1">1: &lt;2 hours</option>
                <option value="2">2: 2 to 5 hours</option>
                <option value="3">3: 5 to 10 hours</option>
                <option value="4">4: &gt;10 hours</option>
              </select>
            </InputField>

            <InputField icon={HeartHandshake} label="Extra Ed Support" color="bg-amber-500">
              <select name="schoolsup" value={formData.schoolsup} onChange={handleChange} disabled={isLoading} className={selectBase}>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </InputField>

            <InputField icon={Sparkles} label="Extracurriculars" color="bg-purple-500">
              <select name="activities" value={formData.activities} onChange={handleChange} disabled={isLoading} className={selectBase}>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </InputField>

            <InputField icon={GraduationCap} label="Wants Higher Ed" color="bg-cyan-500">
              <select name="higher" value={formData.higher} onChange={handleChange} disabled={isLoading} className={selectBase}>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </InputField>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {step === 1 ? (
          <>
            <motion.button 
              type="button" 
              onClick={handleReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white transition-all text-sm flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </motion.button>

            <motion.button 
              type="button" 
              onClick={handleSampleData}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white transition-all text-sm flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <Wand2 className="w-4 h-4" />
              Auto-fill
            </motion.button>

            <motion.button 
              type="submit" 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-[2] py-3 px-6 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2 text-sm"
            >
              Continue to Step 2
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </>
        ) : (
          <>
            <motion.button 
              type="button" 
              onClick={() => setStep(1)}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white transition-all disabled:opacity-40 text-sm flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              Back
            </motion.button>

            <motion.button 
              type="submit" 
              disabled={isLoading} 
              whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(14, 165, 233, 0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="flex-[2] py-3 px-6 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-sky-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm relative overflow-hidden group"
            >
              {isLoading ? (
                <>
                  <span className="loader scale-75"></span> Analyzing Data...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Predict Performance
                </>
              )}
            </motion.button>
          </>
        )}
      </motion.div>
    </motion.form>
  )
}

export default PredictionForm
