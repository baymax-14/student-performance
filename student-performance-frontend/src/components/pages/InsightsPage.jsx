import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation, useSpring } from 'framer-motion';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
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
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

const MotionCard = motion(Card);

const AnimatedValue = ({ 
  value, 
  prefix = "", 
  postfix = "" 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { damping: 30, stiffness: 100, mass: 1 });

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [spring, isInView, value]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(latest)}${postfix}`;
      }
    });
    return () => unsubscribe();
  }, [prefix, postfix, spring]);

  return <span ref={ref} />;
};

const WeeklyChart = ({ 
  data, 
  width = 400, 
  height = 200 
}) => {
  const [selectedIndex, setSelectedIndex] = useState(data.length - 1);

  const padding = 40;
  const bottomPadding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding - bottomPadding;
  const barSpacing = chartWidth / data.length;
  const baseline = height - bottomPadding;
  const baselineOffset = 8;

  const maxValue = Math.max(...data.map((d) => d.value));
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
              left: `${x - 20 + 16}px`,
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

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "relative", zIndex: 2 }}
      >
        {data.map((point, index) => {
          const x = padding + index * barSpacing + barSpacing / 2;
          const barHeight = getBarHeight(point.value);
          const lineStartY = baseline - baselineOffset;
          const lineEndY = lineStartY - barHeight;
          const isSelected = index === selectedIndex;

          return (
            <g key={`${point.day}-${index}`}>
              <rect
                x={x - 25}
                y={0}
                width={50}
                height={height}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedIndex(index)}
              />

              <motion.line
                x1={x}
                y1={lineStartY}
                x2={x}
                y2={lineEndY}
                stroke="var(--color-muted-foreground)"
                strokeWidth={2}
                strokeLinecap="round"
                variants={barVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1, duration: 0.6 }}
                style={{ pointerEvents: "none" }}
              />

              {isSelected ? (
                <>
                  <motion.rect
                    x={x - 25}
                    y={lineEndY - 29}
                    width={50}
                    height={20}
                    rx={10}
                    ry={10}
                    fill="var(--color-primary)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    style={{ pointerEvents: "none" }}
                  />
                  <motion.text
                    x={x}
                    y={lineEndY - 15}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill="var(--color-primary-foreground)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    style={{ pointerEvents: "none" }}
                  >
                    {point.value}%
                  </motion.text>
                </>
              ) : (
                <motion.circle
                  cx={x}
                  cy={lineEndY - 12}
                  r={3}
                  fill="var(--color-primary)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ pointerEvents: "none" }}
                />
              )}

              {isSelected && (
                <motion.circle
                  cx={x}
                  cy={baseline + 20}
                  r={12}
                  fill="var(--color-primary)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ pointerEvents: "none" }}
                />
              )}

              <motion.text
                x={x}
                y={baseline + 21}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fontWeight={isSelected ? "600" : "400"}
                fill={isSelected ? "var(--color-primary-foreground)" : "var(--color-muted-foreground)"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedIndex(index)}
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
    if (isInView) {
      controls.start("visible");
    }
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
      ref={cardRef}
      className="overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <CardContent className="p-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">{subject.name}</h3>
          {getTrendIcon()}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Current</span>
            <span className="text-lg font-bold text-foreground">{subject.currentScore}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Predicted</span>
            <span className={cn("text-lg font-bold", getTrendColor())}>
              {subject.predictedScore}%
            </span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Confidence</span>
              <span>{subject.confidence}%</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${subject.confidence}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </MotionCard>
  );
};

export default function InsightsPage({
  studentName = "Alex Johnson",
  overallPrediction = 87,
  subjects = [
    { name: "Mathematics", currentScore: 82, predictedScore: 88, trend: "up", confidence: 92 },
    { name: "Physics", currentScore: 78, predictedScore: 85, trend: "up", confidence: 88 },
    { name: "Chemistry", currentScore: 85, predictedScore: 87, trend: "up", confidence: 90 },
    { name: "English", currentScore: 90, predictedScore: 88, trend: "down", confidence: 85 },
    { name: "History", currentScore: 75, predictedScore: 80, trend: "up", confidence: 87 },
    { name: "Biology", currentScore: 88, predictedScore: 90, trend: "up", confidence: 91 },
  ],
  weeklyPerformance = [
    { day: "M", value: 75 },
    { day: "T", value: 82 },
    { day: "W", value: 78 },
    { day: "T", value: 85 },
    { day: "F", value: 88 },
    { day: "S", value: 84 },
    { day: "S", value: 87 },
  ],
  studyHours = 28,
  completedAssignments = 45,
  totalAssignments = 50,
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const completionRate = Math.round((completedAssignments / totalAssignments) * 100);

  return (
    <div className="bg-background">
      <motion.div
        className="max-w-7xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Student Results Insights
            </h2>
            <p className="text-muted-foreground text-sm">
              AI-powered academic performance forecast for {studentName}
            </p>
          </div>
          <Badge className="bg-primary text-primary-foreground w-fit">
            <Brain className="w-4 h-4 mr-2" />
            AI Analysis Active
          </Badge>
        </motion.div>

        <motion.div variants={itemVariants}>
          <MotionCard
            className="overflow-hidden border-slate-200 dark:border-slate-800"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <CardHeader className="bg-gradient-to-r from-sky-500/10 to-sky-500/5 dark:from-sky-500/20 dark:to-sky-500/10 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-sky-500/20 rounded-full">
                    <Award className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      Overall Predicted Score
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Based on current performance trends
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-primary">
                    <AnimatedValue value={overallPrediction} postfix="%" />
                  </div>
                  <Badge variant="outline" className="mt-2 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +5% from last month
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </MotionCard>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants}>
            <MotionCard
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-sky-500/20 rounded-lg">
                    <Clock className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h3 className="font-semibold text-foreground">Study Hours</h3>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  <AnimatedValue value={studyHours} />
                </div>
                <p className="text-sm text-muted-foreground">This week</p>
              </CardContent>
            </MotionCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <MotionCard
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-foreground">Assignments</h3>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {completedAssignments}/{totalAssignments}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${completionRate}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{completionRate}%</span>
                </div>
              </CardContent>
            </MotionCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <MotionCard
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-foreground">Target Score</h3>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">90%</div>
                <p className="text-sm text-muted-foreground">End of semester goal</p>
              </CardContent>
            </MotionCard>
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Weekly Performance Trend
              </h3>
            </CardHeader>
            <CardContent>
              <div className="mt-4 flex justify-center w-full overflow-x-auto">
                <WeeklyChart data={weeklyPerformance} width={600} height={250} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Subject Predictions</h3>
            <Button variant="outline" size="sm">
              View Details
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.name}
                variants={itemVariants}
                transition={{ delay: index * 0.1 }}
              >
                <SubjectCard subject={subject} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-amber-500/50 bg-amber-50 dark:bg-amber-500/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">AI Recommendations</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Focus more on English literature to maintain your current score</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Continue your excellent progress in Mathematics and Physics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Consider additional practice sessions for History to boost confidence</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
