import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Loader2, Sparkles, Zap } from "lucide-react"

const loadingMessages = [
  "Initiating quantum handshake...",
  "Materializing your universe...",
  "Syncing neural pathways...",
  "Calibrating reality matrix...",
  "Unlocking dimensions...",
]

const opacity = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
}

const slideUp = {
  initial: {
    y: 0,
  },
  exit: {
    y: "-100%",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
}

const progressBar = {
  initial: {
    width: "0%",
  },
  animate: {
    width: "100%",
    transition: { duration: 4.2, ease: "easeInOut" },
  },
}

export default function LoadingScreen({ onComplete }) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (messageIndex < loadingMessages.length - 1) {
      const timer = setTimeout(() => {
        setMessageIndex(messageIndex + 1)
      }, 700)
      return () => clearTimeout(timer)
    } else {
      const completeTimer = setTimeout(() => {
        setIsComplete(true)
        setTimeout(() => {
          setIsExiting(true)
          setTimeout(() => {
            if (onComplete) onComplete()
          }, 800)
        }, 700)
      }, 700)
      return () => clearTimeout(completeTimer)
    }
  }, [messageIndex, onComplete])

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate={isExiting ? "exit" : "initial"}
      className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 z-[99999]"
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* Background animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(14, 165, 233, 0.1)' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(14, 165, 233, 0.1)' }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>
      <div className="relative w-full max-w-md px-8">
        <motion.div
          variants={opacity}
          initial="initial"
          animate="enter"
          className="flex flex-col items-center space-y-8"
        >
          {/* Logo/Brand Area with Orbital Animation */}
          <div className="relative">
            {/* Outer orbit rings */}
            {!isComplete && (
              <>
                <motion.div
                  className="absolute inset-0 w-32 h-32 -translate-x-6 -translate-y-6"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-full h-full rounded-full border-2 border-primary/20 border-dashed" style={{ borderColor: 'rgba(14, 165, 233, 0.2)' }} />
                </motion.div>
                <motion.div
                  className="absolute inset-0 w-24 h-24 -translate-x-2 -translate-y-2"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-full h-full rounded-full border-2 border-primary/30" style={{ borderColor: 'rgba(14, 165, 233, 0.3)' }} />
                </motion.div>
              </>
            )}
            
            {/* Center logo with pulse effect */}
            <motion.div
              className="w-20 h-20 rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{ 
                background: 'linear-gradient(to bottom right, rgba(14, 165, 233, 0.2), rgba(14, 165, 233, 0.05))',
                border: '2px solid rgba(14, 165, 233, 0.3)'
              }}
              animate={!isComplete ? {
                boxShadow: [
                  "0 0 0 0 rgba(14, 165, 233, 0.4)",
                  "0 0 0 20px rgba(14, 165, 233, 0)",
                  "0 0 0 0 rgba(14, 165, 233, 0)"
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Gradient background animation */}
              <motion.div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to bottom right, rgba(14, 165, 233, 0.3), transparent)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              {isComplete ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="z-10"
                >
                  <CheckCircle2 className="w-10 h-10 text-sky-500" />
                </motion.div>
              ) : (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="z-10"
                >
                  <Loader2 className="w-10 h-10 text-sky-500" />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Loading Message */}
          <div className="text-center space-y-3 min-h-[60px]">
            <motion.h2
              key={messageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xl font-semibold dark:text-white text-slate-900"
            >
              {isComplete ? "Ready!" : loadingMessages[messageIndex]}
            </motion.h2>
            <p className="text-sm dark:text-slate-400 text-slate-500">
              {isComplete
                ? "Taking you to your dashboard"
                : "Please wait while we set things up"}
            </p>
          </div>

          {/* Progress Bar with Glow Effect */}
          <div className="w-full space-y-3">
            <div className="relative h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                variants={progressBar}
                initial="initial"
                animate="animate"
                className="h-full bg-gradient-to-r from-sky-400 via-sky-500 to-sky-400 rounded-full relative"
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
            <div className="flex justify-between text-xs dark:text-slate-400 text-slate-500 font-medium">
              <span className="tracking-wide">LOADING</span>
              <motion.span
                key={messageIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="tabular-nums"
              >
                {Math.min(((messageIndex + 1) / loadingMessages.length) * 100, 100).toFixed(0)}%
              </motion.span>
            </div>
          </div>

          {/* Floating Particles */}
          {!isComplete && (
            <div className="relative w-full h-16 flex items-center justify-center">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full blur-[1px]"
                  style={{ backgroundColor: 'rgba(14, 165, 233, 0.6)' }}
                  animate={{
                    y: [-20, 20, -20],
                    x: [Math.sin(i) * 30, Math.cos(i) * 30, Math.sin(i) * 30],
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
