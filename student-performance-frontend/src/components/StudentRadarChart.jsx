import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { useEffect, useState } from "react";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const StudentRadarChart = ({ formData }) => {
  if (!formData) return null;

  // Detect dark mode from the html element
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
  const labelColor = isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(15, 23, 42, 0.7)";

  const data = {
    labels: [
      "Attendance",
      "Study Time",
      "Internal Marks",
      "Extracurriculars",
      "Past Failures"
    ],
    datasets: [
      {
        label: "Student Profile",
        data: [
          formData.attendance,
          formData.studytime * 25,
          formData.internal_avg,
          formData.activities === "yes" ? 100 : 0,
          Math.max(0, 100 - formData.backlogs * 25)
        ],
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(16, 185, 129, 1)",
        pointBorderColor: isDark ? "#fff" : "#0f172a",
        pointHoverBackgroundColor: isDark ? "#fff" : "#0f172a",
        pointHoverBorderColor: "rgba(16, 185, 129, 1)",
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      r: {
        angleLines: { color: gridColor },
        grid: { color: gridColor },
        pointLabels: { color: labelColor, font: { size: 12 } },
        ticks: { display: false, min: 0, max: 100 }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <div className="mt-8 p-5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50">
      <h3 className="text-center mb-5 text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-widest">
        Performance Profile
      </h3>
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <Radar data={data} options={options} />
      </div>
    </div>
  );
};

export default StudentRadarChart;
