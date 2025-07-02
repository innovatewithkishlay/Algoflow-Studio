import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

// Add CSS styles for graph visualization
const graphStyles = `
  .graph-node {
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .graph-node.default {
    background-color: #e9ecef;
    border-color: #6c757d !important;
    color: #495057;
  }

  .graph-node.current {
    background-color: #ffc107;
    border-color: #ffc107 !important;
    color: #212529;
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(255, 193, 7, 0.3) !important;
  }

  .graph-node.visited {
    background-color: #28a745;
    border-color: #28a745 !important;
    color: white;
  }

  .graph-node.queued {
    background-color: #17a2b8;
    border-color: #17a2b8 !important;
    color: white;
    animation: pulse 1s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

interface DFSStep {
  current: number;
  stack: number[];
  visited: number[];
  message: string;
  graph: { nodes: number[]; edges: number[][]; start: number };
}

const DFS: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [originalGraph, setOriginalGraph] = useState<{ nodes: number[]; edges: number[][]; start: number }>({
    nodes: [1, 2, 3, 4, 5],
    edges: [[1, 2], [1, 3], [2, 4], [2, 5], [3, 5]],
    start: 1
  });
  const [graph, setGraph] = useState<{ nodes: number[]; edges: number[][]; start: number }>({
    nodes: [1, 2, 3, 4, 5],
    edges: [[1, 2], [1, 3], [2, 4], [2, 5], [3, 5]],
    start: 1
  });
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [dfsSteps, setDfsSteps] = useState<DFSStep[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [inputNodes, setInputNodes] = useState<string>('1,2,3,4,5');
  const [inputEdges, setInputEdges] = useState<string>('1-2,1-3,2-4,2-5,3-5');
  const [startNode, setStartNode] = useState<string>('1');
  const [speed] = useState<number>(1000);
  const [activeLanguage, setActiveLanguage] = useState<string>('javascript');

  // Generate DFS steps for the current graph
  const generateDFSSteps = (graphData: { nodes: number[]; edges: number[][]; start: number }): DFSStep[] => {
    const steps: DFSStep[] = [];
    const { nodes, edges, start } = graphData;

    // Create adjacency list
    const adjacencyList: { [key: number]: number[] } = {};
    nodes.forEach(node => {
      adjacencyList[node] = [];
    });

    edges.forEach(([from, to]) => {
      if (adjacencyList[from] && !adjacencyList[from].includes(to)) {
        adjacencyList[from].push(to);
      }
      if (adjacencyList[to] && !adjacencyList[to].includes(from)) {
        adjacencyList[to].push(from);
      }
    });

    steps.push({
      current: -1,
      stack: [],
      visited: [],
      message: 'Starting DFS traversal...',
      graph: { ...graphData }
    });

    const visited = new Set<number>();
    const stack: number[] = [start];
    visited.add(start);

    steps.push({
      current: start,
      stack: [...stack],
      visited: Array.from(visited),
      message: `Starting DFS from node ${start}`,
      graph: { ...graphData }
    });

    while (stack.length > 0) {
      const current = stack.pop()!;

      steps.push({
        current,
        stack: [...stack],
        visited: Array.from(visited),
        message: `Processing node ${current}`,
        graph: { ...graphData }
      });

      for (const neighbor of (adjacencyList[current] || []).reverse()) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          stack.push(neighbor);

          steps.push({
            current,
            stack: [...stack],
            visited: Array.from(visited),
            message: `Discovered neighbor ${neighbor} from node ${current}`,
            graph: { ...graphData }
          });
        }
      }
    }

    steps.push({
      current: -1,
      stack: [],
      visited: Array.from(visited),
      message: 'DFS traversal completed!',
      graph: { ...graphData }
    });

    return steps;
  };

  const codeImplementations = {
    javascript: `function dfs(graph, start) {
  const visited = new Set();
  const stack = [start];
  visited.add(start);

  while (stack.length > 0) {
    const current = stack.pop();
    console.log('Visiting:', current);

    for (const neighbor of graph[current] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        stack.push(neighbor);
      }
    }
  }
  return Array.from(visited);
}`,
    python: `def dfs(graph, start):
    visited = set()
    stack = [start]
    visited.add(start)

    while stack:
        current = stack.pop()
        print(f"Visiting: {current}")

        for neighbor in graph.get(current, []):
            if neighbor not in visited:
                visited.add(neighbor)
                stack.append(neighbor)

    return list(visited)`,
    cpp: `#include <stack>
#include <unordered_set>
#include <vector>

vector<int> dfs(vector<vector<int>>& graph, int start) {
    unordered_set<int> visited;
    stack<int> s;
    vector<int> result;

    s.push(start);
    visited.insert(start);

    while (!s.empty()) {
        int current = s.top();
        s.pop();
        result.push_back(current);

        for (int neighbor : graph[current]) {
            if (visited.find(neighbor) == visited.end()) {
                visited.insert(neighbor);
                s.push(neighbor);
            }
        }
    }
    return result;
}`,
    java: `import java.util.*;

public class DFS {
    public static List<Integer> dfs(Map<Integer, List<Integer>> graph, int start) {
        Set<Integer> visited = new HashSet<>();
        Stack<Integer> stack = new Stack<>();
        List<Integer> result = new ArrayList<>();

        stack.push(start);
        visited.add(start);

        while (!stack.isEmpty()) {
            int current = stack.pop();
            result.add(current);

            for (int neighbor : graph.getOrDefault(current, new ArrayList<>())) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    stack.push(neighbor);
                }
            }
        }
        return result;
    }
}`
  };

  // Initialize DFS steps when original graph changes
  useEffect(() => {
    if (originalGraph.nodes.length > 0) {
      const steps = generateDFSSteps(originalGraph);
      setDfsSteps(steps);
      setCurrentStep(-1);
      setIsPlaying(false);
      setIsPaused(false);
      setGraph({ ...originalGraph });
    }
  }, [originalGraph]);

  useEffect(() => {
    const nodes = inputNodes.split(',').map(Number).filter(n => !isNaN(n));
    const edges = inputEdges.split(',').map(edge => {
      const [from, to] = edge.split('-').map(Number);
      return [from, to].filter(n => !isNaN(n));
    }).filter(edge => edge.length === 2) as number[][];
    const start = parseInt(startNode) || 1;

    if (nodes.length > 0) {
      setOriginalGraph({ nodes, edges, start });
    }
  }, [inputNodes, inputEdges, startNode]);

  // Add this useEffect for animation progression
  useEffect(() => {
    if (isPlaying && !isPaused && currentStep < dfsSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, isPaused, currentStep, dfsSteps.length, speed]);

  useEffect(() => {
    // Debug log for state
    console.log('DFS Debug:', { currentStep, dfsSteps });
  }, [currentStep, dfsSteps]);

  const startAnimation = () => {
    setIsPlaying(true);
    setIsPaused(false);
    if (currentStep >= dfsSteps.length - 1) {
      setCurrentStep(0);
    }
  };

  const pauseAnimation = () => {
    setIsPaused(true);
  };

  const stopAnimation = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentStep(-1);
  };

  const stepForward = () => {
    if (currentStep < dfsSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateRandomGraph = () => {
    const nodeCount = Math.floor(Math.random() * 6) + 4; // 4-9 nodes
    const nodes = Array.from({ length: nodeCount }, (_, i) => i + 1);
    const edges: number[][] = [];

    // Generate random edges
    for (let i = 0; i < nodeCount * 1.5; i++) {
      const from = Math.floor(Math.random() * nodeCount) + 1;
      const to = Math.floor(Math.random() * nodeCount) + 1;
      if (from !== to && !edges.some(([f, t]) => (f === from && t === to) || (f === to && t === from))) {
        edges.push([from, to]);
      }
    }

    const newGraph = { nodes, edges, start: 1 };
    setOriginalGraph(newGraph);
    setGraph(newGraph);
    setInputNodes(nodes.join(','));
    setInputEdges(edges.map(([f, t]) => `${f}-${t}`).join(','));
    setStartNode('1');
  };

  const resetGraph = () => {
    setGraph(originalGraph);
    setInputNodes(originalGraph.nodes.join(','));
    setInputEdges(originalGraph.edges.map(([f, t]) => `${f}-${t}`).join(','));
    setStartNode(originalGraph.start.toString());
  };

  const getNodeClass = (node: number) => {
    const step = dfsSteps[currentStep];
    if (!step) return 'border border-2 border-primary bg-primary text-white p-2 rounded d-flex justify-content-center align-items-center';
    if (step.current === node) return 'graph-node current';
    if (step.visited.includes(node)) return 'graph-node visited';
    if (step.stack.includes(node)) return 'graph-node queued';
    return 'border border-2 border-primary bg-primary text-white p-2 rounded d-flex justify-content-center align-items-center';
  };

  const getCurrentMessage = () => {
    if (currentStep >= 0 && currentStep < dfsSteps.length) return dfsSteps[currentStep].message;
    return 'Click "Start" to begin the DFS visualization';
  };

  const getCurrentStack = () => {
    return currentStep >= 0 && currentStep < dfsSteps.length ? dfsSteps[currentStep].stack : [];
  };

  const getCurrentVisited = () => {
    return currentStep >= 0 && currentStep < dfsSteps.length ? dfsSteps[currentStep].visited : [];
  };

  return (
    <div className="container-fluid py-3">
      {/* Inject graph visualization styles */}
      <style>{graphStyles}</style>

      {/* Page Header */}
      <div className="page-header mb-4">
        <div className="page-header-content">
          <h1 className="page-title">Depth-First Search (DFS)</h1>
          <p className="page-subtitle">A fundamental graph traversal algorithm that explores as far as possible along each branch before backtracking</p>
          <div className="page-meta">
            <div className="page-meta-item"><i className="bi bi-clock"></i><span>Time: O(V + E)</span></div>
            <div className="page-meta-item"><i className="bi bi-graph-up"></i><span>Space: O(V)</span></div>
            <div className="page-meta-item"><i className="bi bi-diagram-3"></i><span>Graph Traversal</span></div>
            <div className="page-meta-item"><i className="bi bi-arrow-repeat"></i><span>Stack-Based</span></div>
          </div>
        </div>
      </div>

        {/* Information Section */}
      <div className="info-section fade-in-up mb-4">
          <h4><i className="bi bi-info-circle"></i> How DFS Works</h4>
        <p className="info-description">Depth-First Search (DFS) is a graph traversal algorithm that explores as far as possible along each branch before backtracking. It uses a stack (either explicitly or via recursion) to remember the path. DFS is useful for pathfinding, cycle detection, and topological sorting.</p>

          <div className="code-example">
          <div className="language-tabs mb-3">
            <div className="nav nav-tabs" role="tablist">
              {Object.keys(codeImplementations).map((lang) => (
                <button key={lang} className={`nav-link ${activeLanguage === lang ? 'active' : ''}`} onClick={() => setActiveLanguage(lang)} type="button" role="tab">
                  {lang === 'javascript' && <><i className="bi bi-code-slash"></i> JavaScript</>}
                  {lang === 'python' && <><i className="bi bi-code-square"></i> Python</>}
                  {lang === 'cpp' && <><i className="bi bi-braces"></i> C/C++</>}
                  {lang === 'java' && <><i className="bi bi-cup-hot"></i> Java</>}
                </button>
              ))}
            </div>
            <div className="tab-content">
              <div className="tab-pane fade show active">
                <pre><code>{codeImplementations[activeLanguage as keyof typeof codeImplementations]}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <h4 className="mt-4"><i className="bi bi-list-check"></i> Key Features</h4>
          <ul className="features-list">
            <li>Explores as deep as possible before backtracking</li>
            <li>Uses stack or recursion</li>
            <li>Can be used to find connected components</li>
            <li>Detects cycles in graphs</li>
            <li>Useful for topological sorting</li>
            <li>Works on both directed and undirected graphs</li>
          </ul>
        </div>

              {/* Algorithm Steps */}
      <div className="info-section mb-4">
        <h4><i className="bi bi-list-ol"></i> Step-by-Step Process</h4>
        <div className="row">
          <div className="col-md-6">
            <h6 className="text-highlight">Initialization:</h6>
            <ol className="features-list">
              <li>Create an empty stack</li>
              <li>Mark start node as visited</li>
              <li>Add start node to stack</li>
              <li>Initialize visited set</li>
            </ol>
          </div>
          <div className="col-md-6">
            <h6 className="text-highlight">Traversal:</h6>
            <ol className="features-list">
              <li>Pop a node from stack</li>
              <li>Process the current node</li>
              <li>Add unvisited neighbors to stack</li>
              <li>Mark neighbors as visited</li>
            </ol>
          </div>
        </div>
      </div>

        {/* Interactive Section */}
      <div className="interactive-section slide-in-right mb-4">
        <h5><i className="bi bi-play-circle"></i> Interactive Demo & Visualization</h5>

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <label className="form-label">Graph Nodes:</label>
            <input
              type="text"
              className="form-control"
              value={inputNodes}
              onChange={(e) => setInputNodes(e.target.value)}
              placeholder="1,2,3,4,5"
              disabled={isPlaying}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Graph Edges:</label>
            <input
              type="text"
              className="form-control"
              value={inputEdges}
              onChange={(e) => setInputEdges(e.target.value)}
              placeholder="1-2,1-3,2-4"
              disabled={isPlaying}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Start Node:</label>
            <input
              type="text"
              className="form-control"
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
              placeholder="1"
              disabled={isPlaying}
            />
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <button className="btn btn-info-enhanced btn-enhanced w-100" onClick={generateRandomGraph} disabled={isPlaying}>
              <i className="bi bi-shuffle"></i> Generate Random Graph
            </button>
          </div>
          <div className="col-md-6">
            <button className="btn btn-secondary btn-enhanced w-100" onClick={resetGraph} disabled={isPlaying}>
              <i className="bi bi-arrow-clockwise"></i> Reset Graph
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Current Graph:</label>
          <div
            className="p-3 rounded graph-visualization-container mb-3"
            style={{
              background: isDarkMode ? '#23272f' : '#f8f9fa',
              color: isDarkMode ? '#f8f9fa' : '#23272f',
              minHeight: 300,
              minWidth: 300,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Render edges first (so they appear behind nodes) */}
            <svg style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}>
              {graph.edges.map((edge, index) => {
                const [from, to] = edge;
                const fromNode = graph.nodes.indexOf(from);
                const toNode = graph.nodes.indexOf(to);

                // Calculate positions based on node count
                const nodeCount = graph.nodes.length;
                const radius = 120;
                const centerX = 150;
                const centerY = 150;

                const fromAngle = (fromNode * 2 * Math.PI) / nodeCount - Math.PI / 2;
                const toAngle = (toNode * 2 * Math.PI) / nodeCount - Math.PI / 2;

                const fromX = centerX + radius * Math.cos(fromAngle);
                const fromY = centerY + radius * Math.sin(fromAngle);
                const toX = centerX + radius * Math.cos(toAngle);
                const toY = centerY + radius * Math.sin(toAngle);

                return (
                  <line
                    key={`edge-${index}`}
                    x1={fromX}
                    y1={fromY}
                    x2={toX}
                    y2={toY}
                    stroke="#6c757d"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                );
              })}
            </svg>

            {/* Render nodes */}
            {graph.nodes.map((node, index) => {
              const nodeCount = graph.nodes.length;
              const radius = 120;
              const centerX = 150;
              const centerY = 150;
              const angle = (index * 2 * Math.PI) / nodeCount - Math.PI / 2;
              const x = centerX + radius * Math.cos(angle);
              const y = centerY + radius * Math.sin(angle);

              return (
                <div
                  key={node}
                  className={getNodeClass(node)}
                  style={{
                    position: 'absolute',
                    left: `${x - 20}px`,
                    top: `${y - 20}px`,
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    border: '3px solid',
                    transition: 'all 0.3s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  {node}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-3">
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            <button
              className="btn btn-success-enhanced btn-enhanced"
              onClick={isPlaying && !isPaused ? pauseAnimation : startAnimation}
              disabled={currentStep >= dfsSteps.length - 1 && !isPaused}
              title={isPlaying && !isPaused ? 'Pause' : 'Play'}
            >
              <i className={`bi ${isPlaying && !isPaused ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
            </button>
            <button className="btn btn-warning btn-enhanced" onClick={stopAnimation} title="Stop">
              <i className="bi bi-stop-fill"></i>
            </button>
            <button className="btn btn-info-enhanced btn-enhanced" onClick={stepBackward} disabled={currentStep <= -1} title="Step Back">
              <i className="bi bi-skip-backward-fill"></i>
            </button>
            <button className="btn btn-info-enhanced btn-enhanced" onClick={stepForward} disabled={currentStep >= dfsSteps.length - 1} title="Step Forward">
              <i className="bi bi-skip-forward-fill"></i>
            </button>
          </div>
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <span className="small text-muted">Step {currentStep + 1} of {dfsSteps.length}</span>
            <div className="progress flex-grow-1 mx-2" style={{ height: '8px' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${dfsSteps.length > 0 ? ((currentStep + 1) / dfsSteps.length) * 100 : 0}%` }}
                aria-valuenow={currentStep + 1}
                aria-valuemin={0}
                aria-valuemax={dfsSteps.length}
              ></div>
            </div>
            <span className="small text-muted">{dfsSteps.length > 0 ? Math.round(((currentStep + 1) / dfsSteps.length) * 100) : 0}%</span>
          </div>
        </div>

        <div className="current-step-info mb-3">
          <div className="alert alert-light">
            <i className="bi bi-chat-text"></i> <strong>Message:</strong> {getCurrentMessage()}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <div className="alert alert-info">
              <i className="bi bi-list-ul"></i> <strong>Stack:</strong> [{getCurrentStack().join(', ')}]
            </div>
          </div>
          <div className="col-md-6">
            <div className="alert alert-success">
              <i className="bi bi-check-circle"></i> <strong>Visited:</strong> [{getCurrentVisited().join(', ')}]
            </div>
          </div>
        </div>

        <div className="alert alert-info">
          <i className="bi bi-lightbulb"></i> <strong>Tip:</strong> Use the controls to step through the DFS algorithm. Watch how nodes are explored depth-first using a stack.
      </div>
      </div>

      {/* Complexity Analysis */}
      <div className="info-section mb-4">
        <h4><i className="bi bi-graph-up"></i> Time & Space Complexity</h4>
        <div className="table-responsive">
          <table className="table complexity-table">
            <thead>
              <tr>
                <th>Case</th>
                <th>Time Complexity</th>
                <th>Space Complexity</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="complexity-badge best">All</span></td>
                <td>O(V + E)</td>
                <td>O(V)</td>
                <td>Visits every vertex and edge once</td>
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
            <h6><i className="bi bi-diagram-3"></i> Connected Components</h6>
            <p>Find all connected components in a graph</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-arrow-repeat"></i> Topological Sorting</h6>
            <p>Order tasks with dependencies in DAGs</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-exclamation-triangle"></i> Cycle Detection</h6>
            <p>Detect cycles in directed and undirected graphs</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-search"></i> Path Finding</h6>
            <p>Find a path between two nodes</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-code"></i> Solving Mazes</h6>
            <p>Explore all possible paths in a maze</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-tree"></i> Tree Traversal</h6>
            <p>Preorder, inorder, and postorder traversals</p>
          </div>
        </div>
      </div>

      {/* Advantages and Disadvantages */}
      <div className="content-grid mb-4">
        <div className="info-section">
          <h4><i className="bi bi-plus-circle"></i> Advantages</h4>
          <ul className="features-list">
            <li>Memory efficient for deep graphs</li>
            <li>Simple to implement (stack-based)</li>
            <li>Excellent for backtracking problems</li>
            <li>Works for both directed and undirected graphs</li>
            <li>Perfect for topological sorting</li>
          </ul>
        </div>
        <div className="info-section disadvantages-section">
          <h4><i className="bi bi-dash-circle"></i> Disadvantages</h4>
          <ul className="features-list">
            <li>May not find shortest path</li>
            <li>Can cause stack overflow on very deep graphs</li>
            <li>May explore unnecessary paths</li>
            <li>Requires stack data structure</li>
            <li>Not optimal for wide graphs</li>
          </ul>
        </div>
      </div>


    </div>
  );
};

export default DFS;