import React from 'react';

const TimeComplexityPage: React.FC = () => {
  return (
    <div className="container py-5">
      <div className="text-center">
        <h1 className="fw-bold mb-4 text-primary">Time Complexity Analysis & Visualization</h1>
        <p className="lead text-dark mb-5">
          Explore the time and space complexity of various data structures and algorithms with interactive visualizations and charts.
        </p>
        <div className="coming-soon-section p-5 bg-gradient-primary text-white rounded shadow-lg">
          <h2 className="display-4 fw-bold mb-3 text-white">Coming Soon</h2>
          <p className="text-white-75 fs-5 mb-4">
            This section will feature interactive charts and explanations for Big O, Omega, and Theta notations, and compare the efficiency of different algorithms visually.
          </p>
          <div className="features-preview mb-4">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="feature-item p-3 bg-white bg-opacity-10 rounded">
                  <i className="bi bi-graph-up display-6 text-warning mb-2"></i>
                  <h5 className="text-white">Big O Notation</h5>
                  <p className="text-white-75 small">Understand worst-case complexity analysis</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="feature-item p-3 bg-white bg-opacity-10 rounded">
                  <i className="bi bi-bar-chart display-6 text-info mb-2"></i>
                  <h5 className="text-white">Comparison Charts</h5>
                  <p className="text-white-75 small">Visual comparison of algorithm efficiency</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="feature-item p-3 bg-white bg-opacity-10 rounded">
                  <i className="bi bi-cpu display-6 text-success mb-2"></i>
                  <h5 className="text-white">Performance Analysis</h5>
                  <p className="text-white-75 small">Real-time performance metrics</p>
                </div>
              </div>
            </div>
          </div>
          <i className="bi bi-hourglass-split display-1 text-warning opacity-75"></i>
        </div>
      </div>
    </div>
  );
};

export default TimeComplexityPage;