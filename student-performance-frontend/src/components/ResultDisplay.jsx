import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation, useSpring } from 'framer-motion';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  BookOpen, 
  Target,
  Brain,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { cn } from '../lib/utils';

const MotionCard = motion(Card);

const AnimatedValue = ({ value, prefix = "", postfix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { damping: 30, stiffness: 100, mass: 1 });

  useEffect(() => {
    if (isInView) spring.set(value);
  }, [spring, isInView, value]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) ref.current.textContent = `${prefix}${Math.round(latest)}${postfix}`;
    });
    return () => unsubscribe();
  }, [prefix, postfix, spring]);

  return <span ref={ref} />;
};

const WeeklyChart = ({ data, width = 400, height = 200 }) => {
  const [selectedIndex, setSelectedIndex] = useState(data.length - 1);
  const padding = 40;
  const bottomPadding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding - bottomPadding;
  const barSpacing = chartWidth / data.length;
  const baseline = height - bottomPadding;
  const baselineOffset = 8;
  const maxValue = Math.max(...data.map((d) => d.value), 100);
  const availableHeight = chartHeight - 40;
  const getBarHeight = (value) => (value / maxValue) * availableHeight;

  const barVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
  };

  return (
    <div className="relative p-4">
      {data.map((point, index) => {
        const x = padding + index * barSpacing + barSpacing / 2;
        const isSelected = index === selectedIndex;
        if (!isSelected) return null;

        const barHeight = getBarHeight(point.value);
        const lineStartY = baseline - baselineOffset;
        const lineEndY = lineStartY - barHeight;

        const gradientTop = Math.max(padding, lineEndY - 40);
        const gradientBottom = baseline + 60;
        const gradientHeight = gradientBottom - gradientTop;

        return (
          <motion.div
            key={`gradient-${index}`}
            className="absolute"
            style={{
              left: `${x - 20 + 20}px`,
              top: `${gradientTop}px`,
              width: "40px",
              height: `${gradientHeight}px`,
              background: `linear-gradient(to top, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.1) 15%, rgba(255, 255, 255, 0.0))`,
              borderRadius: "20px",
              pointerEvents: "none",
              zIndex: 1,
              transformOrigin: "bottom",
            }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.3 }}
          />
        );
      })}

      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "relative", zIndex: 2 }}>
        {data.map((point, index) => {
          const x = padding + index * barSpacing + barSpacing / 2;
          const barHeight = getBarHeight(point.value);
          const lineStartY = baseline - baselineOffset;
          const lineEndY = lineStartY - barHeight;
          const isSelected = index === selectedIndex;

          return (
            <g key={`${point.day}-${index}`}>
              <rect
                x={x - 25} y={0} width={50} height={height}
                fill="transparent" style={{ cursor: "pointer" }}
                onClick={() => setSelectedIndex(index)}
              />
              <motion.line
                x1={x} y1={lineStartY} x2={x} y2={lineEndY}
                stroke="var(--color-muted-foreground)" strokeWidth={2} strokeLinecap="round"
                variants={barVariants} initial="initial" animate="animate"
                transition={{ delay: index * 0.1, duration: 0.6 }} style={{ pointerEvents: "none" }}
              />

              {isSelected ? (
                <>
                  <motion.rect
                    x={x - 25} y={lineEndY - 29} width={50} height={20} rx={10} ry={10} fill="var(--color-primary)"
                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }} style={{ pointerEvents: "none" }}
                  />
                  <motion.text
                    x={x} y={lineEndY - 15} textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--color-primary-foreground)"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.3 }} style={{ pointerEvents: "none" }}
                  >
                    {point.value}%
                  </motion.text>
                </>
              ) : (
                <motion.circle
                  cx={x} cy={lineEndY - 12} r={3} fill="var(--color-primary)"
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} style={{ pointerEvents: "none" }}
                />
              )}

              {isSelected && (
                <motion.circle
                  cx={x} cy={baseline + 20} r={12} fill="var(--color-primary)"
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} style={{ pointerEvents: "none" }}
                />
              )}

              <motion.text
                x={x} y={baseline + 21} textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight={isSelected ? "600" : "400"}
                fill={isSelected ? "var(--color-primary-foreground)" : "var(--color-muted-foreground)"}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 + 0.5 }}
                style={{ cursor: "pointer" }} onClick={() => setSelectedIndex(index)}
              >
                {point.day}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const SubjectCard = ({ subject }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.4 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  const getTrendIcon = () => {
    if (subject.trend === 'up') return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    if (subject.trend === 'down') return <TrendingDown className="w-4 h-4 text-rose-500" />;
    return <div className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (subject.trend === 'up') return 'text-emerald-500';
    if (subject.trend === 'down') return 'text-rose-500';
    return 'text-muted-foreground';
  };

  return (
    <MotionCard
      ref={cardRef} className="overflow-hidden border-slate-200 dark:border-slate-800"
      initial={{ opacity: 0, y: 20 }} animate={controls}
      variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
      whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <CardContent className="p-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground truncate mr-2" title={subject.name}>{subject.name}</h3>
          {getTrendIcon()}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded-md">
            <span className="text-sm text-muted-foreground">Input</span>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{subject.currentScore}{subject.unit}</span>
          </div>
          <div className="flex justify-between items-center p-1">
            <span className="text-sm text-slate-500">Impact</span>
            <span className={cn("text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full", 
              subject.trend === 'up' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
              subject.trend === 'down' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
              'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
            )}>
              {subject.impactInfo}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Model Weight</span>
              <span>{subject.confidence}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-sky-500"
                initial={{ width: 0 }} animate={{ width: `${subject.confidence}%` }} transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </MotionCard>
  );
};

export default function ResultDisplay({ result, onReset }) {
  if (!result || !result.formData) return null;
  const { prediction, confidence, performance, formData, feature_importance } = result;
  
  // prediction is a class label: 0 = Poor, 1 = Average, 2 = Good
  // Map to a meaningful score percentage
  const predictionToScore = { 0: 35, 1: 65, 2: 90 };
  const score = predictionToScore[prediction] ?? 50;
  const confPercent = Math.round(confidence * 100);
  
  // Subjects / Features mapping — activities is 1/0 (number), not "yes"/"no"
  const isActive = formData.activities === 1 || formData.activities === '1' || formData.activities === 'yes';

  const features = [
    { 
      name: "Attendance Rate", 
      currentScore: formData.attendance, 
      unit: "%",
      impactInfo: formData.attendance >= 75 ? "POSITIVE" : "NEGATIVE",
      trend: formData.attendance >= 75 ? "up" : "down", 
      confidence: Math.round((feature_importance?.attendance || 0.25) * 100) 
    },
    { 
      name: "Study Hours", 
      currentScore: formData.studytime, 
      unit: " hr",
      impactInfo: formData.studytime >= 3 ? "POSITIVE" : "NEGATIVE",
      trend: formData.studytime >= 3 ? "up" : "down", 
      confidence: Math.round((feature_importance?.studytime || 0.20) * 100) 
    },
    { 
      name: "Internal Assessment", 
      currentScore: formData.internal_avg, 
      unit: "%",
      impactInfo: formData.internal_avg >= 60 ? "POSITIVE" : "NEGATIVE",
      trend: formData.internal_avg >= 60 ? "up" : "down", 
      confidence: Math.round((feature_importance?.internal_avg || 0.35) * 100) 
    },
    { 
      name: "Extracurriculars", 
      currentScore: isActive ? "Active" : "None", 
      unit: "",
      impactInfo: isActive ? "POSITIVE" : "NEUTRAL",
      trend: isActive ? "up" : "stable", 
      confidence: Math.round((feature_importance?.activities || 0.05) * 100) 
    },
    { 
      name: "Past Backlogs", 
      currentScore: formData.backlogs, 
      unit: " found",
      impactInfo: formData.backlogs > 0 ? "NEGATIVE" : "POSITIVE",
      trend: formData.backlogs > 0 ? "down" : "up", 
      confidence: Math.round((feature_importance?.backlogs || 0.15) * 100) 
    }
  ];

  // Projected trajectory — simulate a realistic weekly trend leading to the score
  const jitter = (base, range) => Math.min(100, Math.max(5, base + Math.round((Math.random() - 0.5) * range)));
  const mockWeeklyPerformance = [
    { day: "M", value: jitter(score - 12, 8) },
    { day: "T", value: jitter(score - 6, 6) },
    { day: "W", value: jitter(score - 9, 8) },
    { day: "T", value: jitter(score - 3, 6) },
    { day: "F", value: score },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="bg-background">
      <motion.div className="max-w-7xl mx-auto space-y-6" variants={containerVariants} initial="hidden" animate="visible">
        
        {/* Header Ribbon */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-100 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Performance Forecast Ready
            </h1>
            <p className="text-muted-foreground text-sm">
              AI analysis complete for {formData.name}
            </p>
          </div>
          <div className="flex gap-3">
            <Badge className="bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 border-sky-500/20 py-1.5 px-3">
              <Brain className="w-4 h-4 mr-2" />
              RF Model: {confPercent}% Conf.
            </Badge>
            <Button onClick={onReset} variant="outline" className="shadow-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Prediction
            </Button>
          </div>
        </motion.div>

        {/* Big Score Card */}
        <motion.div variants={itemVariants}>
          <MotionCard className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm" whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <CardHeader className="bg-gradient-to-r from-sky-500/10 to-sky-500/5 dark:from-sky-500/20 dark:to-sky-500/10 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-sky-500/20 rounded-full">
                    <Award className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      Predicted Final Score
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      Status: <span className={
                        performance === 'Excellent' ? 'text-emerald-500' :
                        performance === 'Good' ? 'text-sky-500' :
                        performance === 'Average' ? 'text-amber-500' : 'text-rose-500'
                      }>{performance}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold text-slate-800 dark:text-white">
                    <AnimatedValue value={score} postfix="%" />
                  </div>
                </div>
              </div>
            </CardHeader>
          </MotionCard>
        </motion.div>

        {/* 3 Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants}>
            <MotionCard whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-sky-500/20 rounded-lg">
                    <Clock className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h3 className="font-semibold text-foreground">Study Hours</h3>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  <AnimatedValue value={formData.studytime} />
                </div>
                <p className="text-sm text-muted-foreground">Hours dedicated weekly</p>
              </CardContent>
            </MotionCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <MotionCard whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-foreground">Attendance</h3>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  <AnimatedValue value={formData.attendance} postfix="%" />
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-emerald-500" initial={{ width: 0 }} animate={{ width: `${formData.attendance}%` }} transition={{ duration: 1, delay: 0.5 }} />
                  </div>
                </div>
              </CardContent>
            </MotionCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <MotionCard whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-foreground">Internal Avg</h3>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  <AnimatedValue value={formData.internal_avg} postfix="%" />
                </div>
                <p className="text-sm text-muted-foreground">Based on recent tests</p>
              </CardContent>
            </MotionCard>
          </motion.div>
        </div>

        {/* Main Charts & Subjects */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="xl:col-span-2">
            <Card className="h-full">
              <CardHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-slate-500" />
                  Projected Trajectory
                </h3>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex justify-center w-full overflow-x-auto">
                  <WeeklyChart data={mockWeeklyPerformance} width={550} height={260} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="xl:col-span-1">
            <Card className="h-full border-amber-500/50 bg-amber-50 dark:bg-amber-500/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                  </div>
                  <div className="flex-1 mt-1">
                    <h3 className="font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider text-sm">Actionable AI Advice</h3>
                  </div>
                </div>
                <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                  {formData.attendance < 75 && (
                    <div className="bg-white/50 dark:bg-slate-900/50 p-3 rounded-lg border border-amber-200 dark:border-amber-500/20">
                      <strong>Boost Attendance:</strong> Your attendance is at {formData.attendance}%. Getting this above 80% is the highest-leverage action you can take to improve your final score.
                    </div>
                  )}
                  {formData.studytime < 3 && (
                    <div className="bg-white/50 dark:bg-slate-900/50 p-3 rounded-lg border border-amber-200 dark:border-amber-500/20">
                      <strong>Increase Study Hours:</strong> {formData.studytime} hours/week is below average. Aim for 4-5 hours to significantly raise confidence in your final exam.
                    </div>
                  )}
                  {formData.backlogs > 0 && (
                    <div className="bg-white/50 dark:bg-slate-900/50 p-3 rounded-lg border border-rose-200 dark:border-rose-500/20">
                      <strong>Address Past Backlogs:</strong> Prioritize clearing your {formData.backlogs} backlog{formData.backlogs > 1 ? 's' : ''} quickly as they negatively weigh on the ML model's prediction.
                    </div>
                  )}
                  {score > 80 && (
                    <div className="bg-white/50 dark:bg-slate-900/50 p-3 rounded-lg border border-emerald-200 dark:border-emerald-500/20">
                      <strong>Keep It Up:</strong> Your internal marks and habits show a strong positive trend. Maintain consistency until the finals!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Feature Breakdown Grid */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mt-4 mb-4">
            <h3 className="text-lg font-semibold text-foreground">Input Assessment Impact</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {features.map((subject, index) => (
              <motion.div key={subject.name} variants={itemVariants} transition={{ delay: index * 0.1 }}>
                <SubjectCard subject={subject} />
              </motion.div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
