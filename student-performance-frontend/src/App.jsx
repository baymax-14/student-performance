import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PredictionForm from './components/PredictionForm'
import ResultDisplay from './components/ResultDisplay'
import PredictionHistory from './components/PredictionHistory'
import ModelInfo from './components/ModelInfo'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import InsightsPage from './components/pages/InsightsPage'
import LoginPage from './components/pages/LoginPage'
import AnalyticsPage from './components/pages/AnalyticsPage'
import StudentsPage from './components/pages/StudentsPage'
import PerformancePage from './components/pages/PerformancePage'
import SettingsPage from './components/pages/SettingsPage'
import HelpPage from './components/pages/HelpPage'
import StudentsDirectoryPage from './components/pages/StudentsDirectoryPage'
import Chatbot from './components/Chatbot'
import { Sun, Moon, Bell, User, LogOut, X, Menu } from 'lucide-react'
import { Toaster } from 'react-hot-toast'

function App() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('predictionHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [error, setError] = useState(null)

  useEffect(() => {
    localStorage.setItem('predictionHistory', JSON.stringify(history));
  }, [history]);
  
  const [isDark, setIsDark] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePage, setActivePage] = useState('Dashboard')

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  // Header dropdown state
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const notifRef = useRef(null)
  const userRef = useRef(null)

  // Dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogin = ({ email }) => {
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    setShowUserMenu(false);
    setActivePage('Dashboard');
  };

  const handlePredict = async (formData) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('https://student-performance-ve59.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to fetch prediction from server')

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      const newResult = {
        prediction: data.prediction,
        performance: data.performance,
        confidence: data.confidence,
        feature_importance: data.feature_importance,
        formData: formData
      }
      
      setResult(newResult)
      setHistory(prev => [newResult, ...prev].slice(0, 20))
    } catch (err) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  // --- Login Gate ---
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} isDark={isDark} setIsDark={setIsDark} />;
  }

  // --- Page Renderer ---
  const renderPage = () => {
    switch (activePage) {
      case 'Insights':
        return <InsightsPage />;
      case 'Analytics':
        return <AnalyticsPage history={history} />;
      case 'Prediction History':
        return <StudentsPage history={history} />;
      case 'Students':
        return <StudentsDirectoryPage />;
      case 'Performance':
        return <PerformancePage />;
      case 'Settings':
        return <SettingsPage isDark={isDark} setIsDark={setIsDark} />;
      case 'Help & Support':
        return <HelpPage />;
      case 'Dashboard':
      default:
        if (result) {
          return (
            <div className="animate-in fade-in zoom-in duration-500 w-full">
              <ResultDisplay result={result} onReset={() => setResult(null)} />
            </div>
          );
        }

        return (
          <>
            <div id="prediction-form-section" className={`w-full ${history.length > 0 ? 'dashboard-grid' : 'flex flex-col items-center'}`}>
              <div className={`${history.length > 0 ? 'input-column' : 'w-full max-w-2xl'} flex flex-col gap-6`}>
                <PredictionForm onPredict={handlePredict} isLoading={loading} />
                {!history.length && <ModelInfo />}
              </div>
              {history.length > 0 && (
                <div className="results-column">
                  {error && (
                    <div className="error-message">
                      <p>{error}</p>
                    </div>
                  )}
                  <PredictionHistory history={history} />
                </div>
              )}
            </div>
            {error && !history.length && (
              <div className="error-message max-w-2xl mx-auto mt-4">
                <p>{error}</p>
              </div>
            )}
            <Footer />
          </>
        );
    }
  };

  return (
    <div className={`flex min-h-screen w-full transition-colors duration-500 ${isDark ? 'dark bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-900'}`}>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: isDark ? '#1e293b' : '#fff',
            color: isDark ? '#f8fafc' : '#0f172a',
            border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
          }
        }} 
      />
      <div className="flex w-full relative">

        {/* Mobile hamburger button - visible only on small screens */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg"
        >
          <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        </button>

        {/* Sidebar backdrop overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className={`
          z-40 shadow-lg border-r
          ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-[1px_0_10px_rgba(0,0,0,0.05)]'}
          md:relative md:block
          fixed inset-y-0 left-0 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} selected={activePage} setSelected={(page) => {
            setActivePage(page);
            // Auto-close sidebar on mobile after selecting a page
            if (window.innerWidth < 768) setSidebarOpen(false);
          }} />
        </div>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full p-6 md:p-10 z-10">
          {/* Top Header */}
          <div className={`flex items-center justify-between mb-10 pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <div>
              <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>EduPredict Dashboard</h1>
              <p className={`mt-1 font-medium text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Predictive modeling & academic analytics</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
                  className={`relative p-2 rounded-lg border transition-all duration-200 ${
                    isDark ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-sky-400 hover:border-sky-500 hover:bg-sky-500/10' : 'bg-white border-slate-200 text-slate-600 hover:text-sky-600 hover:border-sky-200 hover:bg-sky-50'
                  }`}
                >
                  <Bell className="h-4 w-4" />
                  {history.length > 0 && (
                    <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border-2 ${isDark ? 'border-slate-900' : 'border-white'}`}></span>
                  )}
                </button>

                {showNotifications && (
                  <div className={`absolute right-0 mt-2 w-80 rounded-xl border shadow-2xl z-50 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                      <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Notifications</span>
                      <button onClick={() => setShowNotifications(false)}><X className="w-4 h-4 text-slate-400" /></button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {history.length === 0 ? (
                        <p className="p-4 text-sm text-slate-500 text-center">No notifications yet.</p>
                      ) : (
                        history.slice(0, 5).map((h, i) => (
                          <div key={i} className={`px-4 py-3 border-b last:border-0 ${isDark ? 'border-slate-800 hover:bg-slate-800/50' : 'border-slate-50 hover:bg-slate-50'} transition-colors`}>
                            <p className={`text-sm font-semibold ${h.prediction === 2 ? 'text-emerald-400' : h.prediction === 1 ? 'text-amber-400' : 'text-rose-400'}`}>
                              {h.performance}
                            </p>
                            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              Attendance: {h.formData.attendance}% · Confidence: {(h.confidence * 100).toFixed(0)}%
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Dark Mode Toggle */}
              <button 
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg border transition-all duration-200 ${
                isDark ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-sky-400 hover:border-sky-500 hover:bg-sky-500/10' : 'bg-white border-slate-200 text-slate-600 hover:text-sky-600 hover:border-sky-200 hover:bg-sky-50'
              }`}>
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* User Profile */}
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
                  className="p-2 rounded-lg bg-sky-600 text-white shadow-sm hover:bg-sky-500 hover:-translate-y-0.5 transition-all duration-200 border border-sky-500"
                >
                  <User className="h-4 w-4" />
                </button>

                {showUserMenu && (
                  <div className={`absolute right-0 mt-2 w-56 rounded-xl border shadow-2xl z-50 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                      <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Signed in as</p>
                      <p className={`text-xs mt-0.5 truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{userEmail}</p>
                    </div>
                    <div className="p-1.5">
                      <button
                        onClick={() => setActivePage('Settings')}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        
          {/* Page Content with Animated Transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage + (result ? '-result' : '')}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      
      {/* Global Floating AI Chatbot */}
      <Chatbot />
    </div>
  )
}

export default App
