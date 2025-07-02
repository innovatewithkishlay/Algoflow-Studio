import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { algorithms } from '../config/algorithms';

const AlgorithmsPage: React.FC = () => {
  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex align-items-center mb-4">
            <i className="bi bi-gear fs-2 me-3 text-success"></i>
            <div>
              <h1 className="h2 mb-1">Algorithms</h1>
              <p className="text-muted mb-0">
                Learn different algorithms through step-by-step visualizations and interactive examples.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {algorithms.map((algo) => (
          <div key={algo.id} className="col-lg-6 col-xl-4">
            <Card
              title={algo.name}
              subtitle={`${algo.category} • ${algo.difficulty}`}
              icon={algo.icon}
              variant={algo.component ? 'success' : 'secondary'}
              onClick={algo.component ? () => {} : undefined}
              disabled={!algo.component}
              className="h-100">
              <p className="text-muted mb-3">{algo.description}</p>

              <div className="mb-3">
                <h6 className="fw-bold mb-2">Features:</h6>
                <div className="row g-2">
                  {algo.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        <small>{feature}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <h6 className="fw-bold mb-2">Time Complexity:</h6>
                <div className="row g-2 text-center">
                  <div className="col-4">
                    <small className="text-muted">Best</small>
                    <div className="fw-bold text-success">{algo.timeComplexity.best}</div>
                  </div>
                  <div className="col-4">
                    <small className="text-muted">Average</small>
                    <div className="fw-bold text-warning">{algo.timeComplexity.average}</div>
                  </div>
                  <div className="col-4">
                    <small className="text-muted">Worst</small>
                    <div className="fw-bold text-danger">{algo.timeComplexity.worst}</div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <h6 className="fw-bold mb-2">Advantages:</h6>
                <ul className="list-unstyled small">
                  {algo.advantages.slice(0, 2).map((advantage, index) => (
                    <li key={index} className="mb-1">
                      <i className="bi bi-plus-circle text-success me-2"></i>
                      {advantage}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <span className="badge bg-info">Space: {algo.spaceComplexity}</span>
                {algo.component ? (
                  <Link
                    to={`/algorithms/${algo.id}`}
                    className="btn btn-success btn-sm">
                    <i className="bi bi-play-circle me-1"></i>
                    Visualize
                  </Link>
                ) : (
                  <span className="badge bg-secondary">Coming Soon</span>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlgorithmsPage;