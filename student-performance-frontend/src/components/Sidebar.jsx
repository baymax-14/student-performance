import React, { useState } from 'react';
import {
  Home,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronsRight,
  Sun,
  Moon,
  TrendingUp,
  Activity,
  Package,
  Bell,
  User,
  DollarSign,
  Database,
  Search,
  BookOpen,
  LogOut,
  BrainCircuit
} from 'lucide-react';

const Sidebar = ({ open, setOpen, selected, setSelected }) => {

  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
        open ? 'w-64' : 'w-16'
      } border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-sm`}
    >
      <TitleSection open={open} />

      <div className="space-y-1 mb-8">
        <Option Icon={Home} title="Dashboard" selected={selected} setSelected={setSelected} open={open} />
        <Option Icon={BarChart3} title="Analytics" selected={selected} setSelected={setSelected} open={open} />
        <Option Icon={Users} title="Students" selected={selected} setSelected={setSelected} open={open} />
        <Option Icon={Activity} title="Prediction History" selected={selected} setSelected={setSelected} open={open} />
        <Option Icon={TrendingUp} title="Performance" selected={selected} setSelected={setSelected} open={open} />
      </div>

      {open && (
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-1 mt-auto">
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Account
          </div>
          <Option Icon={Settings} title="Settings" selected={selected} setSelected={setSelected} open={open} />
          <Option Icon={HelpCircle} title="Help & Support" selected={selected} setSelected={setSelected} open={open} />
        </div>
      )}

      <ToggleClose open={open} setOpen={setOpen} />
    </nav>
  );
};

const Option = ({ Icon, title, selected, setSelected, open, notifs }) => {
  const isSelected = selected === title;
  
  return (
    <button
      onClick={() => setSelected(title)}
      className={`relative flex h-10 w-full items-center rounded-lg transition-all duration-200 font-medium ${
        isSelected 
          ? "bg-slate-100 dark:bg-slate-800/60 text-sky-700 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700" 
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent"
      }`}
    >
      {isSelected && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sky-600 dark:bg-sky-500 rounded-r-full"></div>
      )}
      <div className="grid h-full w-12 place-content-center">
        <Icon className="h-4 w-4" />
      </div>
      
      {open && (
        <span
          className={`text-sm font-medium transition-opacity duration-200 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {title}
        </span>
      )}

      {notifs && open && (
        <span className="absolute right-3 flex h-5 w-5 items-center justify-center rounded bg-rose-500 text-[10px] text-white font-bold shadow-sm">
          {notifs}
        </span>
      )}
    </button>
  );
};

const TitleSection = ({ open }) => {
  return (
    <div className="mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
      <div className="flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
        <div className="flex items-center gap-3">
          <Logo />
          {open && (
            <div className={`transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center gap-2">
                <div>
                  <span className="block text-sm font-bold text-slate-900 dark:text-white">
                    EduPredict
                  </span>
                  <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Pro Plan
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        {open && (
          <ChevronDown className="h-4 w-4 text-slate-400 dark:text-slate-500" />
        )}
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
      <svg
        width="20"
        height="auto"
        viewBox="0 0 50 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-white"
      >
        <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" />
        <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" />
      </svg>
    </div>
  );
};

const ToggleClose = ({ open, setOpen }) => {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="absolute bottom-0 left-0 right-0 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    >
      <div className="flex items-center p-3">
        <div className="grid size-10 place-content-center">
          <ChevronsRight
            className={`h-4 w-4 transition-transform duration-300 text-slate-500 dark:text-slate-400 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
        {open && (
          <span
            className={`text-sm font-medium text-slate-600 transition-opacity duration-200 ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Collapse
          </span>
        )}
      </div>
    </button>
  );
};

export default Sidebar;
