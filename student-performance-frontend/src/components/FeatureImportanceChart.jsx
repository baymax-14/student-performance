import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const FeatureImportanceChart = ({ importance }) => {
  const labels = Object.keys(importance);
  const values = Object.values(importance);

  const data = {
    labels: labels.map(label => 
      label.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())
    ),
    datasets: [
      {
        label: "Feature Importance",
        data: values,
        backgroundColor: "rgba(99, 102, 241, 0.7)",
        borderRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="mt-8">
      <h3 className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Feature Influence Chart</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default FeatureImportanceChart;
