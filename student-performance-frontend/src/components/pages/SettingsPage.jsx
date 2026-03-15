import { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';

const SettingsPage = ({ isDark, setIsDark }) => {
  const [apiUrl, setApiUrl] = useState('http://localhost:5000');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Settings</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Configure application preferences.</p>

      <div className="max-w-2xl space-y-6">
        {/* Theme */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Dark Mode</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Toggle between light and dark theme</p>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${isDark ? 'bg-sky-600' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${isDark ? 'left-6' : 'left-1'}`}></div>
            </button>
          </div>
        </div>

        {/* API Configuration */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">API Configuration</h3>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Prediction API URL</label>
            <input
              type="text"
              value={apiUrl}
              onChange={e => setApiUrl(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">The base URL for the Flask prediction API.</p>
          </div>
        </div>

        {/* About */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">About</h3>
          <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <p><span className="text-slate-800 dark:text-slate-300 font-semibold">App:</span> EduPredict Dashboard v1.0</p>
            <p><span className="text-slate-800 dark:text-slate-300 font-semibold">Stack:</span> React + Flask + Random Forest</p>
            <p><span className="text-slate-800 dark:text-slate-300 font-semibold">Model:</span> Random Forest Classifier (81% accuracy)</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
          <button
            onClick={() => setApiUrl('http://localhost:5000')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-semibold text-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
