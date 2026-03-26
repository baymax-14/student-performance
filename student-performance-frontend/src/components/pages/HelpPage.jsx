import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Lightbulb, HelpCircle, MessageCircle, BarChart3, Users, Bot, Settings, Shield, Zap, Target, Layout } from 'lucide-react';

const faqs = [
  {
    q: 'How does the prediction model work?',
    a: 'EduPredict uses a Random Forest Classifier trained on real student performance data. It analyzes 7 key features — attendance percentage, internal assessment marks, weekly study time, number of past backlogs, school support, extracurricular participation, and higher education plans — to predict whether a student will achieve Good, Average, or Poor performance.',
    icon: Lightbulb,
  },
  {
    q: 'How accurate are the predictions?',
    a: 'The model achieves approximately 81% accuracy on test data, evaluated using the F1 Score (Macro) as the primary metric. Each prediction also comes with a confidence score that indicates how certain the model is about that specific result. Higher confidence means the model has seen many similar profiles in its training data.',
    icon: Target,
  },
  {
    q: 'What does each input feature mean?',
    a: 'Attendance: Class attendance percentage (0–100%). Internal Average: Average internal assessment marks (0–20). Study Time: Weekly study hours (1 = less than 2h, 2 = 2–5h, 3 = 5–10h, 4 = more than 10h). Past Failures: Number of previous backlogs (0–3). School Support, Extracurricular Activities, and Higher Education Plans are Yes/No toggles.',
    icon: BookOpen,
  },
  {
    q: 'What is the EduPredict AI Chatbot?',
    a: 'The floating chat button in the bottom-right corner opens EduPredict AI — a career advisor powered by Groq (LLaMA 3.3 70B). It is context-aware of student data in the system and can analyze student profiles, provide personalized career roadmaps, and give job readiness advice based on CGPA, internships, projects, and certifications.',
    icon: Bot,
  },
  {
    q: 'How do I use the Dashboard?',
    a: 'The Dashboard is your main workspace. Fill in the prediction form with a student\'s academic details and click "Predict" to get an instant performance prediction. Results include the predicted category (Good/Average/Poor), a confidence score, and a feature importance breakdown chart. Your last 20 predictions are saved automatically in Prediction History.',
    icon: Layout,
  },
  {
    q: 'What can I find in Analytics?',
    a: 'The Analytics page visualizes trends across your prediction history. It shows performance distribution charts and patterns in your past predictions, helping you identify common factors that contribute to good or poor student outcomes.',
    icon: BarChart3,
  },
  {
    q: 'How does the Students Directory work?',
    a: 'The Students Directory is a searchable, sortable database of student profiles. Each profile includes the student\'s name, branch, CGPA, skills, and other academic details. You can search by name or branch, sort by different criteria, and click on individual students to view detailed profiles. This data also feeds into the AI chatbot for context-aware advice.',
    icon: Users,
  },
  {
    q: 'Can I switch between light and dark mode?',
    a: 'Yes! You can toggle dark/light mode in three ways: (1) Click the sun/moon icon in the top header bar. (2) Go to Settings → Appearance and use the Dark Mode toggle. (3) The theme preference is also available on the login screen before you sign in.',
    icon: Settings,
  },
  {
    q: 'Can I use this for real student evaluation?',
    a: 'EduPredict is designed as a demonstration and research project. While the predictions are data-driven and can provide useful insights, they should not be used as the sole basis for academic decisions. Always combine AI predictions with human judgment, contextual knowledge, and other assessment methods.',
    icon: Shield,
  },
  {
    q: 'What technology stack powers EduPredict?',
    a: 'Frontend: React 18 with Tailwind CSS v4 and Vite for fast builds. Backend: Python Flask REST API deployed on Render. Machine Learning: scikit-learn Random Forest Classifier with joblib for model serialization. Charts: Chart.js with react-chartjs-2. AI Chatbot: Groq API with LLaMA 3.3 70B model. Animations: Framer Motion.',
    icon: Zap,
  },
];

const quickLinks = [
  { label: 'Dashboard', desc: 'Make predictions and view results', page: 'Dashboard' },
  { label: 'Analytics', desc: 'Visualize prediction trends', page: 'Analytics' },
  { label: 'Students', desc: 'Browse the student directory', page: 'Students' },
  { label: 'Settings', desc: 'Configure theme and API', page: 'Settings' },
];

const HelpPage = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Help & Support</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Everything you need to know about using the EduPredict dashboard.</p>

      {/* Quick Start Guide */}
      <div className="max-w-3xl mb-8">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">Quick Start Guide</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map((link, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-sky-300 dark:hover:border-sky-500/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{link.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{link.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-3xl mb-8">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`bg-white dark:bg-slate-900 border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? 'border-sky-300 dark:border-sky-500/30' : 'border-slate-200 dark:border-slate-800'}`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${isOpen ? 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                    <faq.icon className="w-4 h-4" />
                  </div>
                  <span className={`flex-1 text-sm font-semibold ${isOpen ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pl-16">
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Keyboard Tips */}
      <div className="max-w-3xl mb-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">Tips & Shortcuts</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono px-2 py-1 rounded">Enter</span>
              <span className="text-slate-600 dark:text-slate-400">Send a message in the AI Chatbot</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono px-2 py-1 rounded">Sidebar</span>
              <span className="text-slate-600 dark:text-slate-400">Collapse the sidebar using the chevron button at the bottom for more screen space</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono px-2 py-1 rounded">AI Chat</span>
              <span className="text-slate-600 dark:text-slate-400">Click the expand icon to maximize the chatbot window for longer conversations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Still need help?</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Contact the team for additional support, feature requests, or bug reports.</p>
        <p className="text-sm text-sky-600 dark:text-sky-400 font-semibold">support@edupredict.example.com</p>
      </div>
    </div>
  );
};

export default HelpPage;
