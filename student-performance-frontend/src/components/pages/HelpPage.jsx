import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Lightbulb, HelpCircle, MessageCircle } from 'lucide-react';

const faqs = [
  {
    q: 'How does the prediction model work?',
    a: 'The model uses a Random Forest Classifier trained on student performance data. It analyzes 7 key features (attendance, internal marks, study time, backlogs, school support, extracurriculars, and higher education plans) to predict whether a student will achieve Good, Average, or Poor performance.',
    icon: Lightbulb,
  },
  {
    q: 'How accurate are the predictions?',
    a: 'The model achieves approximately 81% accuracy on test data with an F1 Score (Macro) as the primary evaluation metric. The confidence score shown with each prediction indicates how certain the model is about its output.',
    icon: HelpCircle,
  },
  {
    q: 'What does each input feature mean?',
    a: 'Attendance: Class attendance percentage (0-100%). Internal Average: Average internal assessment marks (0-20). Study Time: Weekly study hours (1=<2h, 2=2-5h, 3=5-10h, 4=>10h). Past Failures: Number of previous backlogs (0-3). Other fields are Yes/No toggles for support, activities, and higher education plans.',
    icon: BookOpen,
  },
  {
    q: 'Can I use this for real student evaluation?',
    a: 'This tool is designed as a demonstration/research project. While the predictions are data-driven, they should not be used as the sole basis for academic decisions. Always combine AI predictions with human judgment and other assessment methods.',
    icon: MessageCircle,
  },
  {
    q: 'What technology stack is used?',
    a: 'Frontend: React with Tailwind CSS v4 and Vite. Backend: Python Flask API. Machine Learning: scikit-learn Random Forest Classifier with joblib for model serialization. Charts: Chart.js with react-chartjs-2.',
    icon: BookOpen,
  },
];

const HelpPage = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Help & Support</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Frequently asked questions about using the EduPredict dashboard.</p>

      <div className="max-w-3xl space-y-3">
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

      <div className="mt-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-3xl">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Still need help?</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Contact the team for additional support or bug reports.</p>
        <p className="text-sm text-sky-600 dark:text-sky-400 font-semibold">support@edupredict.example.com</p>
      </div>
    </div>
  );
};

export default HelpPage;
