import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';

const WelcomePage: React.FC = () => {
  return (
    <div className="welcome-page">
      {/* Hero Section */}
      <section className="hero-section py-5 bg-gradient-primary text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Master Data Structures & Algorithms
              </h1>
              <p className="lead mb-4">
                Learn complex concepts through interactive visualizations.
                Understand how algorithms work step-by-step with real-time animations.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link
                  to="/data-structures"
                  className="btn btn-light btn-lg px-4 text-decoration-none">
                  <i className="bi bi-collection me-2"></i>
                  Explore Data Structures
                </Link>
                <Link
                  to="/algorithms"
                  className="btn btn-outline-light btn-lg px-4 text-decoration-none">
                  <i className="bi bi-gear me-2"></i>
                  Learn Algorithms
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="hero-visualization">
                <i className="bi bi-diagram-3 display-1 text-light opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Why Choose DSA Visualizer?</h2>
            <p className="lead text-muted">
              Interactive learning experience designed to make complex concepts easy to understand
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <Card
                title="Interactive Visualizations"
                subtitle="Step-by-step animations"
                icon="bi-play-circle"
                variant="primary">
                <p className="text-muted">
                  Watch algorithms execute in real-time with detailed step-by-step visualizations
                  that help you understand the logic behind each operation.
                </p>
              </Card>
            </div>

            <div className="col-md-4">
              <Card
                title="Hands-on Learning"
                subtitle="Practice with examples"
                icon="bi-code-slash"
                variant="success">
                <p className="text-muted">
                  Experiment with different inputs and see how algorithms behave.
                  Modify parameters and observe the changes in real-time.
                </p>
              </Card>
            </div>

            <div className="col-md-4">
              <Card
                title="Comprehensive Coverage"
                subtitle="From basics to advanced"
                icon="bi-book"
                variant="info">
                <p className="text-muted">
                  Cover essential data structures and algorithms including arrays,
                  linked lists, trees, graphs, sorting, and searching algorithms.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Cards Section */}
      <section className="py-5 bg-gradient-primary text-white start-learning-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3 text-white">Start Learning</h2>
            <p className="lead text-white-75">
              Choose your learning path and begin your journey
            </p>
          </div>

          <div className="row g-4">
            <div className="col-lg-6">
              <Card
                title="Data Structures"
                subtitle="Foundation of programming"
                icon="bi-collection"
                variant="light"
                className="hover-lift">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      <small className="text-dark">Arrays & Lists</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      <small className="text-dark">Stacks & Queues</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      <small className="text-dark">Trees & Graphs</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      <small className="text-dark">Hash Tables</small>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <Link to="/data-structures" className="btn btn-primary w-100 text-decoration-none">
                    Explore Data Structures
                  </Link>
                </div>
              </Card>
            </div>

            <div className="col-lg-6">
              <Card
                title="Algorithms"
                subtitle="Problem-solving techniques"
                icon="bi-gear"
                variant="light"
                className="hover-lift">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      <small className="text-dark">Searching</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      <small className="text-dark">Sorting</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      <small className="text-dark">Graph Traversal</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      <small className="text-dark">Dynamic Programming</small>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <Link to="/algorithms" className="btn btn-success w-100 text-decoration-none">
                    Learn Algorithms
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WelcomePage;