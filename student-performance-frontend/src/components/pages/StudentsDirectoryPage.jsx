import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StudentModal from '../StudentModal';
import SkeletonCard from '../SkeletonCard';
import {
  Search,
  GraduationCap,
  Github,
  Plus,
  Code,
  Award,
  BookOpen,
  Calendar,
  Check,
  X,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

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

const CERTS_BY_BRANCH = {
  "CSE": ["AWS Cloud Practitioner", "Google Cloud Associate", "Meta Front-End Developer", "IBM AI Engineering", "HackerRank Problem Solving (Gold)"],
  "IT": ["CompTIA Security+", "Cisco CCNA", "AWS Solutions Architect", "Google Data Analytics", "Microsoft Azure Fundamentals"],
  "EXTC": ["IoT Architect Certification", "NVIDIA Deep Learning Institute", "Cisco CCNP", "LabVIEW Certified Associate"],
  "Mechanical": ["SolidWorks Professional (CSWP)", "AutoCAD Certified User", "Six Sigma Green Belt", "Autodesk Inventor Certified"],
  "Civil": ["Autodesk Civil 3D Certified", "LEED Green Associate", "Primavera P6 Certification", "STAAD Pro Professional"]
};

// Generate exactly 70 students per branch
const generateStudents = () => {
  const students = [];
  let idCounter = 1;

  BRANCHES.forEach(branch => {
    let code = "XX";
    if (branch === "CSE") code = "CS";
    else if (branch === "IT") code = "IT";
    else if (branch === "EXTC") code = "EX";
    else if (branch === "Mechanical") code = "ME";
    else if (branch === "Civil") code = "CE";
    
    for (let i = 0; i < 70; i++) {
      const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      const yearVal = ["20", "21", "22", "23"][Math.floor(Math.random() * 4)];
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

      const branchCerts = CERTS_BY_BRANCH[branch];
      // Randomly select 0-2 certifications
      const shuffledCerts = [...branchCerts].sort(() => 0.5 - Math.random());
      const studentCerts = shuffledCerts.slice(0, Math.floor(Math.random() * 3));

      students.push({
        id: idCounter++,
        name: `${firstName} ${lastName}`,
        enrollment: `${yearVal}BT${code}${randomNum}`,
        branch: branch,
        cgpa: parseFloat(cgpa),
        attendance: Math.floor(Math.random() * 30 + 70), // 70 to 100
        projects: Math.floor(Math.random() * 5 + 1), // 1 to 5
        internships: Math.floor(Math.random() * 3), // 0 to 2
        skills: studentSkills,
        certifications: studentCerts,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum.toString().substring(0,2)}@edu.in`,
        location: "Amravati"
      });
    }
  });

  // Always include Keshav Raypure at the top, guaranteed to be first
  const keshav = {
    id: 999999,
    name: "Keshav Raypure",
    enrollment: "23BTIT1025",
    branch: "IT",
    cgpa: 9.25,
    attendance: 95,
    projects: 5,
    internships: 2,
    skills: ["React", "Node.js", "Python", "AWS", "Machine Learning", "System Design"],
    certifications: ["AWS Solutions Architect", "Meta Front-End Developer"],
    email: "keshav.raypure@edu.in",
    location: "Amravati"
  };

  // Shuffle the rest so all branches aren't clumped together
  students.sort(() => Math.random() - 0.5);
  
  // Put Keshav at index 0
  students.unshift(keshav);
  
  return students;
};

const getInitialDirectory = () => {
  try {
    const saved = localStorage.getItem('studentDirectoryData');
    if (saved && saved !== "undefined") {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Cleared corrupted studentDirectoryData");
    localStorage.removeItem('studentDirectoryData');
  }

  // If there are legacy custom profiles, migrate them over
  let legacyList = [];
  try {
    const legacyCustom = localStorage.getItem('customStudentProfiles');
    if (legacyCustom && legacyCustom !== "undefined") {
      legacyList = JSON.parse(legacyCustom);
    }
  } catch (e) {
    console.warn("Cleared corrupted legacy profiles");
    localStorage.removeItem('customStudentProfiles');
  }
  
  const generated = generateStudents();
  // Filter out generated ones if their IDs clash
  const legacyMap = new Map((legacyList || []).map(s => [s.id, s]));
  const finalGenerated = generated.filter(s => !legacyMap.has(s.id));
  
  const combined = [...(legacyList || []), ...finalGenerated];
  localStorage.setItem('studentDirectoryData', JSON.stringify(combined));
  return combined;
};

const StudentsDirectoryPage = () => {
  const [activeBranch, setActiveBranch] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [visibleCount, setVisibleCount] = useState(24);
  
  const [allStudents, setAllStudents] = useState(getInitialDirectory);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Brief skeleton delay for smooth perceived loading
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('studentDirectoryData', JSON.stringify(allStudents));
  }, [allStudents]);

  // Called by StudentModal when the student is updated (e.g. cert added or bookmarked)
  const handleUpdateStudent = (updatedStudent) => {
    setSelectedStudent(updatedStudent);
    setAllStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const filteredStudents = useMemo(() => {
    let result = (allStudents || []).filter(student => {
      const name = student.name || "";
      const enrollment = student.enrollment || "";
      const skills = student.skills || [];
      const matchesBranch = activeBranch === "All" ? true : (activeBranch === "Bookmarked" ? student.isBookmarked : student.branch === activeBranch);
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            enrollment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesBranch && matchesSearch;
    });

    if (sortBy === "alphabet") {
      result = result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "cgpa") {
      result = result.sort((a, b) => b.cgpa - a.cgpa);
    }

    return result;
  }, [allStudents, activeBranch, searchQuery, sortBy]);

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
          
          <div className="flex flex-col sm:flex-row gap-4 mb-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name, skills, etc..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 dark:bg-black/20 border border-white/20 text-white placeholder-sky-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm transition-all"
              />
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 bg-white text-sky-600 hover:bg-sky-50 px-5 py-3 rounded-xl font-bold shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" /> Add Profile
            </button>
          </div>
        </div>

        <div className="relative z-10 hidden lg:flex flex-col gap-2">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-sky-100 uppercase tracking-wider font-semibold">Total Profiles</p>
              <p className="text-2xl font-bold">{allStudents.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <button
          onClick={() => { setActiveBranch("All"); setVisibleCount(24); }}
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
            onClick={() => { setActiveBranch(branch); setVisibleCount(24); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeBranch === branch 
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {branch} <span className="ml-1 opacity-60 text-xs">({allStudents.filter(s => s.branch === branch).length})</span>
          </button>
        ))}
          <button
            onClick={() => { setActiveBranch("Bookmarked"); setVisibleCount(24); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeBranch === "Bookmarked" 
                ? "bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-100 shadow-sm border border-amber-200 dark:border-amber-800" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${activeBranch === "Bookmarked" ? 'fill-amber-500 text-amber-500' : ''}`} />
            Bookmarked <span className="ml-1 opacity-60 text-xs">({allStudents.filter(s => s.isBookmarked).length})</span>
          </button>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
          <span className="text-sm text-slate-500 font-medium px-2">Sort by:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 py-1.5 px-3 focus:ring-2 focus:ring-sky-500 outline-none cursor-pointer"
          >
            <option value="default">Default</option>
            <option value="alphabet">Alphabet (A-Z)</option>
            <option value="cgpa">CGPA (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
        <AnimatePresence>
          {filteredStudents.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No students found matching your search.</p>
            </div>
          ) : (
            filteredStudents.slice(0, visibleCount).map(student => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={student.id}
                onClick={() => {
                  setSelectedStudent(student);
                  // Ensure predictor resets internally or in modal handler
                }}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-lg dark:hover:shadow-slate-900/50 hover:border-sky-300 dark:hover:border-sky-700 transition-all cursor-pointer flex flex-col"
              >
                {/* Bookmark Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newStatus = !student.isBookmarked;
                    handleUpdateStudent({ ...student, isBookmarked: newStatus });
                    if (newStatus) {
                      toast.success(`${student.name} bookmarked!`);
                    } else {
                      toast.error(`${student.name} removed from bookmarks.`);
                    }
                  }}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
                >
                  <Star className={`w-4 h-4 transition-colors ${student.isBookmarked ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                </button>

                <div className="flex justify-between items-start mb-4 pr-8">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{student.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono uppercase tracking-wider">{student.enrollment}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className={`inline-flex px-2.5 py-1 rounded-md border text-xs font-bold ${getCgpaColor(student.cgpa)}`}>
                    {student.cgpa} CGPA
                  </div>
                </div>

                <div className="mt-auto space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <GraduationCap className="w-4 h-4 opacity-70" />
                    <span>{student.branch} Engineering</span>
                  </div>
                  
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {(student.skills || []).slice(0, 3).map(skill => (
                        <span key={skill} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {skill}
                        </span>
                      ))}
                      {(student.skills || []).length > 3 && (
                        <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                          +{(student.skills || []).length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        )}
      </div>

      {/* Pagination Load More */}
      {visibleCount < filteredStudents.length && (
        <div className="mt-12 flex justify-center">
          <button 
            onClick={() => setVisibleCount(prev => prev + 24)}
            className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl shadow-sm hover:shadow-md hover:border-sky-300 dark:hover:border-sky-700 transition-all"
          >
            Load More Students ({filteredStudents.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {/* Student Profile Modal */}
      {selectedStudent && (
        <StudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onUpdateStudent={handleUpdateStudent}
        />
      )}

      {/* Add Profile Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="bg-slate-50 dark:bg-slate-950 p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Your Profile</h2>
                  <p className="text-sm text-slate-500">Showcase your skills and certifications to recruiters.</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form 
                className="p-6 overflow-y-auto max-h-[70vh] space-y-4 text-sm"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.target);
                  const skillsRaw = fd.get("skills");
                  const certsRaw = fd.get("certifications");
                  
                  const newProfile = {
                    id: Date.now(),
                    name: fd.get("name"),
                    enrollment: fd.get("enrollment"),
                    branch: fd.get("branch"),
                    cgpa: parseFloat(fd.get("cgpa")),
                    attendance: parseInt(fd.get("attendance") || 85),
                    projects: parseInt(fd.get("projects") || 0),
                    internships: parseInt(fd.get("internships") || 0),
                    email: fd.get("email"),
                    location: fd.get("location") || "Amravati",
                    isBookmarked: false,
                    skills: skillsRaw ? skillsRaw.split(',').map(s=>s.trim()).filter(Boolean) : [],
                    certifications: certsRaw ? certsRaw.split(',').map(s=>s.trim()).filter(Boolean) : []
                  };
                  
                  setAllStudents([newProfile, ...allStudents]);
                  setShowAddModal(false);
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Name</label>
                    <input required name="name" type="text" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500" placeholder="e.g. John Doe" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Enrollment No.</label>
                    <input required name="enrollment" type="text" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500" placeholder="e.g. 2023CS1234" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Branch</label>
                    <select name="branch" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500">
                      {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">CGPA (0 - 10)</label>
                    <input required name="cgpa" type="number" step="0.1" min="0" max="10" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500" placeholder="e.g. 8.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                  <input required name="email" type="email" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500" placeholder="e.g. john@edu.in" />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Code className="w-4 h-4 text-sky-500" />
                    Skills <span className="text-slate-400 font-normal">(Comma separated)</span>
                  </label>
                  <input name="skills" type="text" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500" placeholder="e.g. React, Python, Data Analysis" />
                </div>

                <div className="space-y-1 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    Certifications <span className="text-slate-400 font-normal">(Comma separated)</span>
                  </label>
                  <input name="certifications" type="text" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500" placeholder="e.g. AWS Cloud Practitioner, CCNA" />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs text-center block">Attendance %</label>
                    <input name="attendance" type="number" min="0" max="100" defaultValue={85} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-center outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs text-center block">Projects</label>
                    <input name="projects" type="number" min="0" defaultValue={1} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-center outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs text-center block">Internships</label>
                    <input name="internships" type="number" min="0" defaultValue={0} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-center outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                </div>

                <button type="submit" className="w-full py-3 mt-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-lg shadow-sky-500/30 transition-all">
                  Publish My Profile
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentsDirectoryPage;
