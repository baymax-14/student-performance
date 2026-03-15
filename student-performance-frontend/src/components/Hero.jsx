const Hero = () => {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px 40px", animation: "fadeUp 0.8s ease" }}>
      <h1 style={{ 
        fontSize: "3.5rem", 
        fontWeight: "800", 
        marginBottom: "15px",
        color: "#fff"
      }}>
        Student Performance AI
      </h1>
      <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)", marginBottom: "30px", maxWidth: "600px", margin: "0 auto 30px" }}>
        Identify at-risk students early and provide data-driven academic insights.
      </p>
      <button 
        onClick={() => document.getElementById('prediction-form-section').scrollIntoView({ behavior: 'smooth' })}
        className="submit-btn" 
        style={{ width: "auto", padding: "12px 30px", borderRadius: "30px", fontSize: "1rem" }}
      >
        Try Prediction
      </button>
    </div>
  );
};

export default Hero;
