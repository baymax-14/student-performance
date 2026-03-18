import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Github,
  Linkedin,
  Mail,
  X,
  Plus,
  Code,
  Award,
  BookOpen,
  Check,
  Target,
  AlertCircle,
  CheckCircle2,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

const getCgpaColor = (cgpa) => {
  if (cgpa >= 9.0) return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20";
  if (cgpa >= 7.5) return "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20";
  if (cgpa >= 6.5) return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20";
  return "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/20";
};

const StudentModal = ({ student, onClose, onUpdateStudent }) => {
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [newCertValue, setNewCertValue] = useState("");
  const [showPredictor, setShowPredictor] = useState(false);

  const handleClose = () => {
    setShowPredictor(false);
    onClose();
  };

  const handleAddCert = () => {
    if (!newCertValue.trim()) return;
    const updatedStudent = {
      ...student,
      certifications: [...(student.certifications || []), newCertValue.trim()],
    };
    onUpdateStudent(updatedStudent);
    setNewCertValue("");
    setIsAddingCert(false);
  };

  // AI Predictor score calculation
  const certsCount = student.certifications?.length || 0;
  const internCount = student.internships || 0;
  const projCount = student.projects || 0;
  const cgpa = student.cgpa || 0;

  const certScore = (Math.min(certsCount, 5) / 5) * 30;
  const internScore = (Math.min(internCount, 1) / 1) * 25;
  const projScore = (Math.min(projCount, 2) / 2) * 20;
  const cgpaScore = cgpa >= 7.5 ? 25 : (cgpa / 7.5) * 25;
  const totalScore = Math.round(certScore + internScore + projScore + cgpaScore);

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;
  const isReady = totalScore >= 80;

  const improvements = [];
  if (certsCount < 5) improvements.push(`Complete ${5 - certsCount} more certification(s)`);
  if (internCount < 1) improvements.push("Secure at least 1 internship");
  if (projCount < 2) improvements.push(`Build ${2 - projCount} more project(s)`);
  if (cgpa < 7.5) improvements.push(`Improve CGPA to > 7.5`);

  return (
    <AnimatePresence>
      {student && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-slate-50 dark:bg-slate-950 p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    {student.name}
                    <button
                      onClick={() => {
                        const newStatus = !student.isBookmarked;
                        onUpdateStudent({ ...student, isBookmarked: newStatus });
                        if (newStatus) toast.success(`${student.name} bookmarked!`);
                        else toast.error(`${student.name} removed from bookmarks.`);
                      }}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center"
                      title={student.isBookmarked ? "Remove Bookmark" : "Bookmark"}
                    >
                      <Star className={`w-6 h-6 transition-all ${student.isBookmarked ? 'fill-amber-400 text-amber-400 drop-shadow-sm' : 'text-slate-300 dark:text-slate-600'}`} />
                    </button>
                  </h2>
                  <p className="text-sm font-mono text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                    {student.enrollment} • {student.branch}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto w-full space-y-8">
              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "CGPA", value: <span className={`text-2xl font-bold ${getCgpaColor(student.cgpa).split(" ")[0]}`}>{student.cgpa}</span> },
                  { label: "Projects", value: student.projects },
                  { label: "Internships", value: student.internships },
                  { label: "Attendance", value: `${student.attendance}%` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Skills */}
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                      <Code className="w-4 h-4 text-sky-500" /> Technical Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {student.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 text-xs font-medium rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-500/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        <Award className="w-4 h-4 text-amber-500" /> Certifications
                      </h4>
                      {!isAddingCert && (
                        <button
                          onClick={() => setIsAddingCert(true)}
                          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 px-2 py-1 rounded-md hover:bg-sky-100 dark:hover:bg-sky-500/20 transition-colors"
                        >
                          <Plus className="w-3 h-3" /> Add
                        </button>
                      )}
                    </div>
                    <ul className="space-y-2 mb-3">
                      {(student.certifications || []).map(cert => (
                        <li key={cert} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <span className="text-amber-500 mt-0.5">✦</span> {cert}
                        </li>
                      ))}
                      {(!student.certifications || student.certifications.length === 0) && !isAddingCert && (
                        <li className="text-sm text-slate-400 italic">No certifications listed</li>
                      )}
                    </ul>

                    <AnimatePresence>
                      {isAddingCert && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-2 mt-2"
                        >
                          <input
                            autoFocus
                            type="text"
                            value={newCertValue}
                            onChange={e => setNewCertValue(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddCert()}
                            placeholder="e.g. AWS Cloud Practitioner"
                            className="flex-1 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 outline-none focus:ring-2 focus:ring-sky-500"
                          />
                          <button onClick={handleAddCert} disabled={!newCertValue.trim()} className="p-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white rounded-lg transition-colors">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => { setIsAddingCert(false); setNewCertValue(""); }} className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Key Highlights */}
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                      <BookOpen className="w-4 h-4 text-emerald-500" /> Key Highlights
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-6">
                      {student.cgpa >= 8.5 && <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> Top 10% in batch</li>}
                      {student.internships > 0 && <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> Has industry internship experience</li>}
                      {student.projects >= 3 && <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> Strong project portfolio</li>}
                      <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> Pre-assessed via EduPredict ML module</li>
                    </ul>

                    {!showPredictor && (
                      <button
                        onClick={() => setShowPredictor(true)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-all shadow-md mt-4"
                      >
                        <Target className="w-4 h-4" /> Predict Job Readiness
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Column — Contact & Links */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                    <Mail className="w-4 h-4 text-indigo-500" /> Contact &amp; Links
                  </h4>
                  <div className="space-y-3">
                    <a href={`mailto:${student.email}`} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-md group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                        <Mail className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Email Address</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{student.email}</p>
                      </div>
                    </a>

                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-md group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                        <MapPin className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Location</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">Amravati, India</p>
                      </div>
                    </a>

                    <div className="flex gap-3">
                      <a href="#" className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm font-medium">
                        <Linkedin className="w-4 h-4" /> LinkedIn
                      </a>
                      <a href="#" className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm font-medium">
                        <Github className="w-4 h-4" /> GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Predictor */}
              {showPredictor && (
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                    <Target className="w-5 h-5 text-indigo-500" /> AI Job Recruitment Predictor
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700/50 flex flex-col sm:flex-row gap-6 items-center">
                    {/* Donut Ring */}
                    <div className="relative flex items-center justify-center shrink-0">
                      <svg width="100" height="100" className="transform -rotate-90">
                        <circle cx="50" cy="50" r={radius} className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="8" fill="none" />
                        <motion.circle
                          cx="50" cy="50" r={radius}
                          className={isReady ? "stroke-emerald-500" : "stroke-amber-500"}
                          strokeWidth="8" fill="none" strokeLinecap="round"
                          initial={{ strokeDashoffset: circumference }}
                          animate={{ strokeDashoffset }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          style={{ strokeDasharray: circumference }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{totalScore}%</span>
                      </div>
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      {isReady ? (
                        <div className="space-y-2">
                          <h5 className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" /> Highly Recommended for Recruitment!
                          </h5>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            You meet or exceed the core criteria that top recruiters are looking for. You are good to go!
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <h5 className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" /> Improvement Needed
                          </h5>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            You are on the right track, but recruiters typically look for the following minimums:
                          </p>
                          <ul className="space-y-1">
                            {improvements.map((imp, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                <span className="text-amber-500">→</span> {imp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StudentModal;
