import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { dataStructures } from '../config/data-structures';

const DataStructuresPage: React.FC = () => {
  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex align-items-center mb-4">
            <i className="bi bi-collection fs-2 me-3 text-primary"></i>
            <div>
              <h1 className="h2 mb-1">Data Structures</h1>
              <p className="text-muted mb-0">
                Explore various data structures and understand their properties, operations, and use cases.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {dataStructures.map((ds) => (
          <div key={ds.id} className="col-lg-6 col-xl-4">
            <Card
              title={ds.name}
              subtitle={`${ds.category} • ${ds.difficulty}`}
              icon={ds.icon}
              variant={ds.component ? 'primary' : 'secondary'}
              onClick={ds.component ? () => {} : undefined}
              disabled={!ds.component}
              className="h-100 d-flex flex-column">
              <div className="flex-grow-1">
                <p className="text-muted mb-3">{ds.description}</p>

                <div className="mb-3">
                  <h6 className="fw-bold mb-2">Features:</h6>
                  <div className="row g-2">
                    {ds.features.slice(0, 2).map((feature, index) => (
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
                    <div className="col-3">
                      <small className="text-muted">Access</small>
                      <div className="fw-bold">{ds.timeComplexity.access}</div>
                    </div>
                    <div className="col-3">
                      <small className="text-muted">Search</small>
                      <div className="fw-bold">{ds.timeComplexity.search}</div>
                    </div>
                    <div className="col-3">
                      <small className="text-muted">Insert</small>
                      <div className="fw-bold">{ds.timeComplexity.insertion}</div>
                    </div>
                    <div className="col-3">
                      <small className="text-muted">Delete</small>
                      <div className="fw-bold">{ds.timeComplexity.deletion}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="badge bg-info">Space: {ds.spaceComplexity}</span>
                  {ds.component ? (
                    <Link
                      to={`/data-structures/${ds.id}`}
                      className="btn btn-primary btn-sm">
                      <i className="bi bi-play-circle me-1"></i>
                      Visualize
                    </Link>
                  ) : (
                    <span className="badge bg-secondary">Coming Soon</span>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataStructuresPage;