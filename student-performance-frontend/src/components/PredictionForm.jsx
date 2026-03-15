import { useState } from 'react'

const PredictionForm = ({ onPredict, isLoading }) => {
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
    onPredict(formData)
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
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors duration-300">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Student Profiler</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="input-group">
          <label htmlFor="attendance" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Attendance (%)</label>
          <input
            type="number"
            id="attendance"
            name="attendance"
            min="0"
            max="100"
            value={formData.attendance}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 disabled:opacity-50"
          />
        </div>

        <div className="input-group">
          <label htmlFor="internal_avg" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Internal Average (0-20)</label>
          <input
            type="number"
            id="internal_avg"
            name="internal_avg"
            min="0"
            max="20"
            step="0.1"
            value={formData.internal_avg}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 disabled:opacity-50"
          />
        </div>

        <div className="input-group">
          <label htmlFor="studytime" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Study Time</label>
          <select
            id="studytime"
            name="studytime"
            value={formData.studytime}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 disabled:opacity-50 appearance-none cursor-pointer"
          >
            <option value="1">1: &lt;2 hours</option>
            <option value="2">2: 2 to 5 hours</option>
            <option value="3">3: 5 to 10 hours</option>
            <option value="4">4: &gt;10 hours</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="backlogs" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Past Failures (0-3)</label>
          <input
            type="number"
            id="backlogs"
            name="backlogs"
            min="0"
            max="3"
            value={formData.backlogs}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 disabled:opacity-50"
          />
        </div>

        <div className="input-group">
          <label htmlFor="schoolsup" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Extra Ed Support</label>
          <select 
            id="schoolsup" 
            name="schoolsup" 
            value={formData.schoolsup} 
            onChange={handleChange}
            disabled={isLoading}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 disabled:opacity-50 appearance-none cursor-pointer"
          >
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="activities" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Extracurriculars</label>
          <select 
            id="activities" 
            name="activities" 
            value={formData.activities} 
            onChange={handleChange}
            disabled={isLoading}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 disabled:opacity-50 appearance-none cursor-pointer"
          >
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="higher" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Wants Higher Ed</label>
          <select 
            id="higher" 
            name="higher" 
            value={formData.higher} 
            onChange={handleChange}
            disabled={isLoading}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 disabled:opacity-50 appearance-none cursor-pointer"
          >
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
        <button 
          type="button" 
          onClick={handleReset}
          disabled={isLoading}
          className="flex-1 py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-50 shadow-sm"
        >
          Reset Form
        </button>

        <button 
          type="button" 
          onClick={handleSampleData}
          disabled={isLoading}
          className="flex-1 py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-50 shadow-sm"
        >
          Auto-fill Data
        </button>

        <button 
          type="submit" 
          disabled={isLoading} 
          className="flex-[2] py-2.5 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="loader scale-75"></span> Analyzing Student Profile...
            </>
          ) : 'Predict Academic Performance'}
        </button>
      </div>
    </form>
  )
}

export default PredictionForm
