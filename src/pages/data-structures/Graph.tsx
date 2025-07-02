import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Graph: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [graphData, setGraphData] = useState<number[]>([1, 2, 3, 4, 5]);
  const [inputValue, setInputValue] = useState<string>('');

  const addNode = () => {
    if (inputValue.trim() && !isNaN(Number(inputValue))) {
      setGraphData([...graphData, Number(inputValue)]);
      setInputValue('');
    }
  };

  const clearGraph = () => {
    setGraphData([]);
  };

  const generateRandomGraph = () => {
    const newGraph = Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 1);
    setGraphData(newGraph);
  };

  // --- Visualization logic (array-style node display) ---
  const renderGraphVisualization = () => (
    <div
      className="p-3 rounded"
      style={{
        background: isDarkMode ? '#23272f' : '#f8f9fa',
        color: isDarkMode ? '#f8f9fa' : '#23272f',
        minHeight: 100,
        minWidth: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {graphData.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🕸️</div>
          <p>Graph is empty</p>
        </div>
      ) : (
        <div className="d-flex flex-row gap-3 justify-content-center align-items-center">
          {graphData.map((value, idx) => (
            <div key={idx} className="d-flex flex-column align-items-center" style={{ position: 'relative' }}>
              <div
                className="border border-2 border-primary bg-primary text-white p-2 rounded d-flex justify-content-center align-items-center"
                style={{ width: 48, height: 48, fontWeight: 600, fontSize: 20 }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="container-fluid py-4">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Graph</h1>
          <p className="page-subtitle">
            A non-linear data structure consisting of vertices connected by edges
          </p>
          <div className="page-meta">
            <div className="page-meta-item">
              <i className="bi bi-clock"></i>
              <span>Search: O(V+E)</span>
            </div>
            <div className="page-meta-item">
              <i className="bi bi-plus-circle"></i>
              <span>Add Edge: O(1)</span>
            </div>
            <div className="page-meta-item">
              <i className="bi bi-gear"></i>
              <span>Space: O(V²)</span>
            </div>
            <div className="page-meta-item">
              <i className="bi bi-diagram-3"></i>
              <span>Non-linear</span>
            </div>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="info-section fade-in-up mb-4">
        <h4><i className="bi bi-info-circle"></i> How Graph Works</h4>
        <p className="info-description">
          A Graph is a non-linear data structure consisting of a finite set of vertices (nodes)
          and edges that connect these vertices. Graphs are used to represent relationships
          between objects and are fundamental in modeling real-world problems.
        </p>
        <div className="code-example">
          <pre><code>{`class Graph {
  constructor() {
    this.vertices = new Map();
  }

  addVertex(vertex) {
    if (!this.vertices.has(vertex)) {
      this.vertices.set(vertex, []);
    }
  }

  addEdge(vertex1, vertex2) {
    if (this.vertices.has(vertex1) && this.vertices.has(vertex2)) {
      this.vertices.get(vertex1).push(vertex2);
      this.vertices.get(vertex2).push(vertex1); // Undirected
    }
  }

  getNeighbors(vertex) {
    return this.vertices.get(vertex) || [];
  }

  hasEdge(vertex1, vertex2) {
    const neighbors = this.vertices.get(vertex1);
    return neighbors ? neighbors.includes(vertex2) : false;
  }
}`}</code></pre>
        </div>
        <h4><i className="bi bi-list-check"></i> Key Concepts</h4>
        <ul className="features-list">
          <li><strong>Vertex/Node:</strong> Fundamental unit of the graph</li>
          <li><strong>Edge:</strong> Connection between two vertices</li>
          <li><strong>Directed Graph:</strong> Edges have direction</li>
          <li><strong>Undirected Graph:</strong> Edges have no direction</li>
          <li><strong>Weighted Graph:</strong> Edges have associated weights</li>
          <li><strong>Path:</strong> Sequence of vertices connected by edges</li>
          <li><strong>Cycle:</strong> Path that starts and ends at the same vertex</li>
        </ul>
      </div>

      {/* Memory Layout Section */}
      <div className="info-section mb-4">
        <h4><i className="bi bi-cpu"></i> Memory Layout</h4>
        <p className="info-description">
          Graphs are stored using structures like adjacency lists or matrices. The visualization below shows the current graph nodes as a flat array (for demo purposes).
        </p>
        {renderGraphVisualization()}
      </div>

      {/* Graph Representations */}
      <div className="info-section mb-4">
        <h4><i className="bi bi-code-slash"></i> Graph Representations</h4>
        <div className="row">
          <div className="col-md-6">
            <h6 className="text-highlight">Adjacency Matrix:</h6>
            <div className="code-example">
              <pre><code>{`// 2D array representation
const graph = [
  [0, 1, 1, 0],
  [1, 0, 1, 1],
  [1, 1, 0, 1],
  [0, 1, 1, 0]
];`}</code></pre>
            </div>
          </div>
          <div className="col-md-6">
            <h6 className="text-highlight">Adjacency List:</h6>
            <div className="code-example">
              <pre><code>{`// Map/object representation
const graph = {
  0: [1, 2],
  1: [0, 2, 3],
  2: [0, 1, 3],
  3: [1, 2]
};`}</code></pre>
            </div>
          </div>
        </div>
      </div>

      {/* Graph Types */}
      <div className="info-section mb-4">
        <h4><i className="bi bi-diagram-3"></i> Types of Graphs</h4>
        <div className="row">
          <div className="col-md-6">
            <h6 className="text-highlight">Undirected Graph:</h6>
            <p className="info-description">
              Edges have no direction, relationships are bidirectional.
            </p>
          </div>
          <div className="col-md-6">
            <h6 className="text-highlight">Directed Graph:</h6>
            <p className="info-description">
              Edges have direction, relationships are one-way.
            </p>
          </div>
          <div className="col-md-6">
            <h6 className="text-highlight">Weighted Graph:</h6>
            <p className="info-description">
              Edges have associated weights or costs.
            </p>
          </div>
          <div className="col-md-6">
            <h6 className="text-highlight">Unweighted Graph:</h6>
            <p className="info-description">
              All edges have equal weight or no weight.
            </p>
          </div>
          <div className="col-md-6">
            <h6 className="text-highlight">Connected Graph:</h6>
            <p className="info-description">
              There is a path between every pair of vertices.
            </p>
          </div>
          <div className="col-md-6">
            <h6 className="text-highlight">Disconnected Graph:</h6>
            <p className="info-description">
              Contains isolated vertices or components.
            </p>
          </div>
        </div>
      </div>

      {/* Graph Algorithms */}
      <div className="info-section mb-4">
        <h4><i className="bi bi-arrow-repeat"></i> Common Graph Algorithms</h4>
        <div className="row">
          <div className="col-md-6">
            <h6 className="text-highlight">Breadth-First Search (BFS):</h6>
            <p className="info-description">
              Explores all vertices at the current depth before moving to next level.
              Used for shortest path in unweighted graphs.
            </p>
          </div>
          <div className="col-md-6">
            <h6 className="text-highlight">Depth-First Search (DFS):</h6>
            <p className="info-description">
              Explores as far as possible along each branch before backtracking.
              Used for topological sorting and cycle detection.
            </p>
          </div>
          <div className="col-md-6">
            <h6 className="text-highlight">Dijkstra's Algorithm:</h6>
            <p className="info-description">
              Finds shortest path between vertices in weighted graphs.
              Uses priority queue for efficiency.
            </p>
          </div>
          <div className="col-md-6">
            <h6 className="text-highlight">Minimum Spanning Tree:</h6>
            <p className="info-description">
              Finds tree that connects all vertices with minimum total edge weight.
              Used in network design.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Section */}
      <div className="interactive-section mb-4">
        <h5><i className="bi bi-play-circle"></i> Interactive Demo & Visualization</h5>

        <div className="mb-3">
          <label className="form-label">Current Graph Nodes: <span className="badge-enhanced primary">{graphData.length}</span></label>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {renderGraphVisualization()}
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-8">
            <input
              type="number"
              className="form-control"
              placeholder="Enter a number to add as node"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addNode()}
            />
          </div>
          <div className="col-md-4">
            <button
              className="btn btn-success-enhanced btn-enhanced w-100"
              onClick={addNode}
              disabled={!inputValue.trim() || isNaN(Number(inputValue))}
            >
              <i className="bi bi-plus-circle"></i> Add Node
            </button>
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <button
              className="btn btn-danger btn-enhanced w-100"
              onClick={clearGraph}
              disabled={graphData.length === 0}
            >
              <i className="bi bi-trash"></i> Clear Graph
            </button>
          </div>
          <div className="col-md-6">
            <button
              className="btn btn-info-enhanced btn-enhanced w-100"
              onClick={generateRandomGraph}
            >
              <i className="bi bi-shuffle"></i> Random Graph
            </button>
          </div>
        </div>

        <div className="alert alert-info">
          <i className="bi bi-lightbulb"></i>
          <strong>Tip:</strong> Add nodes to see how the graph structure is built.
          The visualization will show the connections and relationships between nodes.
        </div>
      </div>

      {/* Complexity Analysis */}
      <div className="info-section mb-4">
        <h4><i className="bi bi-graph-up"></i> Time & Space Complexity</h4>
        <div className="table-responsive">
          <table className="table complexity-table">
            <thead>
              <tr>
                <th>Operation</th>
                <th>Time Complexity</th>
                <th>Space Complexity</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="complexity-badge best">Add Vertex</span></td>
                <td>O(1)</td>
                <td>O(1)</td>
                <td>Add a new vertex to the graph</td>
              </tr>
              <tr>
                <td><span className="complexity-badge best">Add Edge</span></td>
                <td>O(1)</td>
                <td>O(1)</td>
                <td>Add a new edge between vertices</td>
              </tr>
              <tr>
                <td><span className="complexity-badge average">BFS/DFS</span></td>
                <td>O(V+E)</td>
                <td>O(V)</td>
                <td>Traverse all vertices and edges</td>
              </tr>
              <tr>
                <td><span className="complexity-badge worst">Shortest Path</span></td>
                <td>O(V²)</td>
                <td>O(V)</td>
                <td>Find shortest path between vertices</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Use Cases */}
      <div className="info-section mb-4">
        <h4><i className="bi bi-lightning"></i> Use Cases & Applications</h4>
        <div className="use-cases-grid">
          <div className="use-case-item">
            <h6><i className="bi bi-geo-alt"></i> Social Networks</h6>
            <p>Modeling relationships between users</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-map"></i> Navigation Systems</h6>
            <p>Finding shortest routes between locations</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-hdd-network"></i> Computer Networks</h6>
            <p>Modeling network topology and routing</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-diagram-3"></i> Dependency Graphs</h6>
            <p>Managing software dependencies</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-graph-up"></i> Recommendation Systems</h6>
            <p>Building user-item relationship graphs</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-cpu"></i> Circuit Design</h6>
            <p>Modeling electronic circuits</p>
          </div>
        </div>
      </div>

      {/* Advantages and Disadvantages */}
      <div className="content-grid">
        <div className="info-section p-4 mb-4">
          <h4><i className="bi bi-plus-circle"></i> Advantages</h4>
          <ul className="features-list">
            <li>Flexible data relationships</li>
            <li>Natural problem modeling</li>
            <li>Powerful traversal algorithms</li>
            <li>Supports complex networks</li>
            <li>Wide range of applications</li>
          </ul>
        </div>
        <div className="info-section disadvantages-section p-4 mb-4">
          <h4><i className="bi bi-dash-circle"></i> Disadvantages</h4>
          <ul className="features-list">
            <li>Complex implementation</li>
            <li>Memory intensive</li>
            <li>Difficult to visualize</li>
            <li>No standard representation</li>
            <li>Performance varies with structure</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Graph;
