import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Github, 
  Linkedin, 
  Mail,
  X,
  Code,
  Award,
  BookOpen,
  Calendar
} from 'lucide-react';

const BRANCHES = ["CSE", "IT", "EXTC", "Mechanical", "Civil"];

const FIRST_NAMES = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Riya", "Aanya", "Ishita", "Diya", "Kavya", "Ananya", "Rahul", "Rohan", "Siddharth", "Karan", "Priya", "Neha", "Simran", "Pooja", "Vikram", "Suresh", "Ramesh", "Deepak", "Anjali", "Swati", "Shruti", "Tanvi", "Amit", "Sumit"];
const LAST_NAMES = ["Sharma", "Verma", "Patel", "Reddy", "Kumar", "Singh", "Gupta", "Das", "Shah", "Jain", "Agarwal", "Mishra", "Pandey", "Mehta", "Desai", "Joshi", "Chauhan", "Yadav", "Tiwari", "Bhat"];

const SKILLS_BY_BRANCH = {
  "CSE": ["React", "Node.js", "Python", "C++", "AWS", "Machine Learning", "MongoDB", "SQL", "Docker", "Java", "Kubernetes", "System Design"],
  "IT": ["Python", "Java", "Cloud Networking", "Cybersecurity", "React", "Angular", "SQL", "Linux", "DevOps", "Data Analysis", "API Design"],
  "EXTC": ["Embedded C", "IoT", "MATLAB", "Arduino", "Signal Processing", "VHDL", "Python", "Networking", "Microcontrollers", "VLSI"],
  "Mechanical": ["AutoCAD", "SolidWorks", "ANSYS", "Thermodynamics", "MATLAB", "Manufacturing", "Robotics", "Catia", "3D Printing", "Fluid Mechanics"],
  "Civil": ["AutoCAD", "STAAD Pro", "Revit", "Surveying", "Structural Analysis", "Project Management", "Construction Planning", "ETABS", "GIS"]
};

// Generate exactly 70 students per branch
const generateStudents = () => {
  const students = [];
  let idCounter = 1;
  const yearPrefixes = ["2020", "2021", "2022", "2023"];

  BRANCHES.forEach(branch => {
    const code = branch.substring(0, 2).toUpperCase();
    for (let i = 0; i < 70; i++) {
      const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      const year = yearPrefixes[Math.floor(Math.random() * yearPrefixes.length)];
      const randomNum = Math.floor(Math.random() * 9000 + 1000);
      
      // Determine base stats based on a normal-ish distribution
      const isTopTier = Math.random() > 0.8; 
      const cgpaBase = isTopTier ? 8.5 : 6.0;
      const cgpaRange = isTopTier ? 1.5 : 2.5;
      const cgpa = (Math.random() * cgpaRange + cgpaBase).toFixed(2);
      
      const branchSkills = SKILLS_BY_BRANCH[branch];
      // Randomly select 3-6 skills from branch pool
      const shuffledSkills = [...branchSkills].sort(() => 0.5 - Math.random());
      const studentSkills = shuffledSkills.slice(0, Math.floor(Math.random() * 4) + 3);

      students.push({
        id: idCounter++,
        name: `${firstName} ${lastName}`,
        enrollment: `${year}${code}${randomNum}`,
        branch: branch,
        cgpa: parseFloat(cgpa),
        attendance: Math.floor(Math.random() * 30 + 70), // 70 to 100
        projects: Math.floor(Math.random() * 5 + 1), // 1 to 5
        internships: Math.floor(Math.random() * 3), // 0 to 2
        skills: studentSkills,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum.toString().substring(0,2)}@edu.in`,
        location: ["Mumbai", "Pune", "Bangalore", "Delhi", "Hyderabad"][Math.floor(Math.random() * 5)]
      });
    }
  });

  // Shuffle the final array so all branches aren't clumped together
  return students.sort(() => Math.random() - 0.5);
};

const DUMMY_STUDENTS = generateStudents();

const StudentsDirectoryPage = () => {
  const [activeBranch, setActiveBranch] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = useMemo(() => {
    return DUMMY_STUDENTS.filter(student => {
      const matchesBranch = activeBranch === "All" || student.branch === activeBranch;
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            student.enrollment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            student.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesBranch && matchesSearch;
    });
  }, [activeBranch, searchQuery]);

  // For recruiter visual cue on CGPA
  const getCgpaColor = (cgpa) => {
    if (cgpa >= 9.0) return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20";
    if (cgpa >= 7.5) return "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20";
    if (cgpa >= 6.5) return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20";
    return "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/20";
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 pb-20">
      {/* Header */}
      <div className="mb-8 p-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 dark:from-indigo-900 dark:to-sky-800 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <GraduationCap className="w-64 h-64 -translate-y-12 translate-x-12 transform" />
        </div>
        
        <div className="relative z-10 w-full max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Students Hub</h1>
          <p className="text-sky-100 mb-6">Explore detailed academic profiles for recruitment and placement insights.</p>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, enrollment ID, or skills (e.g. React, Python)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 dark:bg-black/20 border border-white/20 text-white placeholder-sky-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm transition-all"
            />
          </div>
        </div>

        <div className="relative z-10 hidden lg:flex flex-col gap-2">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-sky-100 uppercase tracking-wider font-semibold">Total Profiles</p>
              <p className="text-2xl font-bold">{DUMMY_STUDENTS.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters (Tabs) */}
      <div className="flex flex-wrap items-center gap-2 mb-8 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <button
          onClick={() => setActiveBranch("All")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeBranch === "All" 
              ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm" 
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          All Branches
        </button>
        {BRANCHES.map(branch => (
          <button
            key={branch}
            onClick={() => setActiveBranch(branch)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeBranch === branch 
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {branch} <span className="ml-1 opacity-60 text-xs">({DUMMY_STUDENTS.filter(s => s.branch === branch).length})</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {filteredStudents.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No students found matching your search.</p>
            </div>
          ) : (
            filteredStudents.map(student => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-lg dark:hover:shadow-slate-900/50 hover:border-sky-300 dark:hover:border-sky-700 transition-all cursor-pointer flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{student.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono uppercase tracking-wider">{student.enrollment}</p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-md border text-xs font-bold ${getCgpaColor(student.cgpa)}`}>
                    {student.cgpa}
                  </div>
                </div>

                <div className="mt-auto space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <GraduationCap className="w-4 h-4 opacity-70" />
                    <span>{student.branch} Engineering</span>
                  </div>
                  
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {student.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {skill}
                        </span>
                      ))}
                      {student.skills.length > 3 && (
                        <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                          +{student.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Recruiter Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelectedStudent(null)}
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="bg-slate-50 dark:bg-slate-950 p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedStudent.name}</h2>
                    <p className="text-sm font-mono text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">{selectedStudent.enrollment} • {selectedStudent.branch}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="p-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto w-full space-y-8">
                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">CGPA</p>
                    <p className={`text-2xl font-bold ${getCgpaColor(selectedStudent.cgpa).split(" ")[0]}`}>{selectedStudent.cgpa}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Projects</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{selectedStudent.projects}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Internships</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{selectedStudent.internships}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Attendance</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{selectedStudent.attendance}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                        <Code className="w-4 h-4 text-sky-500" />
                        Technical Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedStudent.skills.map(skill => (
                          <span key={skill} className="px-3 py-1 text-xs font-medium rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-500/20">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                        <Award className="w-4 h-4 text-emerald-500" />
                        Key Highlights
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        {selectedStudent.cgpa >= 8.5 && <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> Top 10% in batch</li>}
                        {selectedStudent.internships > 0 && <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> Has industry internship experience</li>}
                        {selectedStudent.projects >= 3 && <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> Strong project portfolio</li>}
                        <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> Pre-assessed via EduPredict ML module</li>
                      </ul>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                      <Mail className="w-4 h-4 text-indigo-500" />
                      Contact & Links
                    </h4>
                    <div className="space-y-3">
                      <a href={`mailto:${selectedStudent.email}`} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-md group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                          <Mail className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Email Address</p>
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{selectedStudent.email}</p>
                        </div>
                      </a>
                      <a href="#" className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-md group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                          <MapPin className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Location</p>
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{selectedStudent.location}, India</p>
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
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentsDirectoryPage;
