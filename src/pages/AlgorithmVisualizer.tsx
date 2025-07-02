import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { algorithms } from '../config/algorithms';

const AlgorithmVisualizer: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const algorithm = algorithms.find(algo => algo.id === id);

  if (!algorithm) {
    return (
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-5">
                <i className="bi bi-exclamation-triangle display-1 text-warning mb-4"></i>
                <h2 className="mb-3">Algorithm Not Found</h2>
                <p className="lead text-muted mb-4">
                  The requested algorithm could not be found.
                </p>
                <Link to="/algorithms" className="btn btn-enhanced btn-primary-enhanced">
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Algorithms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!algorithm.component) {
    return (
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-5">
                <i className="bi bi-tools display-1 text-muted mb-4"></i>
                <h2 className="mb-3">{algorithm.name}</h2>
                <p className="lead text-muted mb-4">
                  This algorithm visualization is coming soon!
                </p>
                <p className="text-muted mb-4">
                  We're working hard to bring you interactive visualizations for this concept.
                  Stay tuned for updates!
                </p>
                <Link to="/algorithms" className="btn btn-enhanced btn-primary-enhanced">
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Algorithms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const Component = algorithm.component;

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex align-items-center mb-4">
            <Link to="/algorithms" className="btn btn-outline-secondary me-3 hover-lift">
              <i className="bi bi-arrow-left"></i>
            </Link>
            <i className={`bi ${algorithm.icon} fs-2 me-3 text-success`}></i>
            <div>
              <h1 className="h2 mb-1">{algorithm.name}</h1>
              <p className="text-muted mb-0">
                {algorithm.category} • {algorithm.difficulty}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <Component />
        </div>
      </div>
    </div>
  );
};

export default AlgorithmVisualizer;