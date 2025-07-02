import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { dataStructures } from '../config/data-structures';

const DataStructuresPage: React.FC = () => {
  return (
    <div className="container py-4">
      <header className="mb-4 d-flex align-items-center gap-3">
        <i className="bi bi-collection fs-2 text-primary"></i>
        <div>
          <h1 className="h3 mb-1">Data Structures</h1>
          <p className="text-secondary mb-0">
            Explore various data structures and understand their properties, operations, and use cases.
          </p>
        </div>
      </header>

      <div className="row g-4">
        {dataStructures.map((ds) => (
          <div key={ds.id} className="col-12 col-md-6 col-xl-4">
            <Card
              title={ds.name}
              subtitle={`${ds.category} • ${ds.difficulty}`}
              icon={ds.icon}
              variant={ds.component ? 'primary' : 'secondary'}
              disabled={!ds.component}
              className="h-100 d-flex flex-column"
            >
              <p className="text-secondary flex-grow-1">{ds.description}</p>

              <div className="mb-3">
                <h6 className="fw-semibold">Features</h6>
                <ul className="list-unstyled small mb-0">
                  {ds.features.slice(0, 2).map((feature, index) => (
                    <li key={index} className="d-flex align-items-center gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-3">
                <h6 className="fw-semibold">Time Complexity</h6>
                <div className="d-flex justify-content-between small text-center">
                  <div>
                    <div className="text-muted">Access</div>
                    <div className="fw-semibold">{ds.timeComplexity.access}</div>
                  </div>
                  <div>
                    <div className="text-muted">Search</div>
                    <div className="fw-semibold">{ds.timeComplexity.search}</div>
                  </div>
                  <div>
                    <div className="text-muted">Insert</div>
                    <div className="fw-semibold">{ds.timeComplexity.insertion}</div>
                  </div>
                  <div>
                    <div className="text-muted">Delete</div>
                    <div className="fw-semibold">{ds.timeComplexity.deletion}</div>
                  </div>
                </div>
              </div>

              <div className="mt-auto d-flex justify-content-between align-items-center">
                <span className="badge bg-info">Space: {ds.spaceComplexity}</span>
                {ds.component ? (
                  <Link to={`/data-structures/${ds.id}`} className="btn btn-sm btn-primary">
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

export default DataStructuresPage;
