const AIInsights = ({ result }) => {
  if (!result || !result.feature_importance) return null;

  // sort features by importance
  const sorted = Object.entries(result.feature_importance)
    .sort((a, b) => b[1] - a[1]);

  const top = sorted.slice(0, 3).map(([key]) => key);

  const messages = {
    attendance: "High attendance strongly improves predicted performance.",
    internal_avg: "Internal marks have the biggest influence on final results.",
    studytime: "Consistent study time increases success probability.",
    backlogs: "Past failures negatively affect predicted performance.",
    schoolsup: "Educational support slightly improves performance prediction.",
    activities: "Extracurricular participation shows positive influence.",
    higher: "Students planning higher education tend to perform better."
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h3 style={{ marginBottom: "10px", color: "var(--text-secondary)", fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>AI Insights</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {top.map(feature => (
          <li key={feature} style={{ marginBottom: "6px" }}>
            ✓ {messages[feature]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AIInsights;
