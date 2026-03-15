const Footer = () => {
  return (
    <footer className="text-center py-10 mt-16 border-t border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
      <div className="mb-4">
        <h4 className="text-gray-700 dark:text-gray-300 text-base font-medium mb-1">Student Performance AI</h4>
        <p>Machine Learning Project</p>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <p>Technology Stack: React + Flask + Random Forest</p>
      </div>
      <p>© 2026 EduPredict</p>
    </footer>
  );
};

export default Footer;
