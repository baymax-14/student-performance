import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm EduPredict AI. I can analyze student profiles, give career roadmaps, or answer questions about job readiness. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateSystemPrompt = () => {
    // RAG: Retrieve context from localStorage to ground the AI in the app's reality
    let contextData = "";
    try {
      const data = localStorage.getItem('studentDirectoryData');
      if (data) {
        const students = JSON.parse(data);
        const topStudents = students.slice(0, 5).map(s => `${s.name} (${s.branch}, CGPA: ${s.cgpa}, Skills: ${s.skills.join(', ')})`).join('\n');
        contextData = `
Here is a snapshot of some of our top students in the system (for context):
${topStudents}
Total students in database: ${students.length}`;
      }
    } catch (e) {
      console.warn("Could not load context for RAG");
    }

    return `You are EduPredict AI, an advanced career advisor and recruitment assistant built into the EduPredict Dashboard.
Your role is to help students get placed by providing roadmaps, analyzing their skills, and giving job readiness advice.
You evaluate students based on 4 main pillars: CGPA (out of 10), Internships, Projects, and Certifications.

${contextData}

Rules:
- Keep answers formatted nicely using Markdown (bullet points, bold text).
- Be extremely encouraging but realistic.
- If they ask for a roadmap, give them a concise step-by-step guide based on their target role or branch.
- Keep your responses under 200 words if possible, unless specifically asked for a detailed roadmap.`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_XAI_API_KEY;
      if (!apiKey) {
        throw new Error("API Key missing. Please check your .env.local file.");
      }

      const response = await fetch("https://api.xai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "grok-2-latest",
          messages: [
            { role: "system", content: generateSystemPrompt() },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            userMessage
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Grok API Error Response:", errText);
        let errData;
        try { errData = JSON.parse(errText); } catch(e) {}
        throw new Error(errData?.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Grok API Response Data:", data);

      if (!data.choices || !data.choices[0]) {
        throw new Error("Invalid response format from Grok: " + JSON.stringify(data));
      }

      const botReply = data.choices[0].message.content;

      setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);

    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to connect to EduPredict AI");
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Sorry, I encountered a network error while trying to think. Please check the API setup." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ height: '500px', maxHeight: '80vh' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-600 to-indigo-600 p-4 flex items-center justify-between shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/30 text-white">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm flex items-center gap-1">
                    EduPredict AI <Sparkles size={12} className="text-amber-300" />
                  </h3>
                  <p className="text-sky-100 text-xs opacity-90">Powered by xAI Grok</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === 'user' 
                        ? 'bg-sky-600 text-white rounded-br-sm' 
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    {/* Basic markdown parsing for bold and spacing */}
                    {msg.content.split('\n').map((line, i) => {
                      if (line.startsWith('* ') || line.startsWith('- ')) {
                         return <div key={i} className="ml-3 my-1 flex"><span className="mr-2">&bull;</span><span>{line.substring(2).replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')}</span></div>
                      }
                      
                      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
                      return <p key={i} dangerouslySetInnerHTML={{ __html: formatted || '<br/>' }} className={i > 0 ? "mt-1" : ""} />
                    })}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                    <Loader2 size={16} className="text-sky-500 animate-spin" />
                    <span className="text-xs text-slate-500 font-medium">EduPredict is analyzing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask for a roadmap or advice..."
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-sky-500 dark:focus:border-sky-500 rounded-full pl-4 pr-12 py-3 text-sm text-slate-900 dark:text-white focus:outline-none transition-all shadow-inner"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1.5 p-2 rounded-full bg-sky-600 hover:bg-sky-500 disabled:bg-slate-400 disabled:cursor-not-allowed text-white transition-colors"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-sky-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-sky-600/30 border-2 border-white dark:border-slate-800 z-50 relative group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageSquare size={24} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Tooltip bubble on hover */}
        {!isOpen && (
          <div className="absolute right-full mr-4 bg-slate-800 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
            Chat with AI
            {/* Tooltip arrow */}
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45" />
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default Chatbot;
