import React, { useState, useRef, useEffect } from 'react';
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

interface BFSStep {
  current: number;
  queue: number[];
  visited: number[];
  message: string;
  graph: { nodes: number[]; edges: number[][]; start: number };
}

const BFS: React.FC = () => {
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
  const [bfsSteps, setBfsSteps] = useState<BFSStep[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [inputNodes, setInputNodes] = useState<string>('1,2,3,4,5');
  const [inputEdges, setInputEdges] = useState<string>('1-2,1-3,2-4,2-5,3-5');
  const [startNode, setStartNode] = useState<string>('1');
  const [speed] = useState<number>(1000);
  const [activeLanguage, setActiveLanguage] = useState<string>('javascript');
  const intervalRef = useRef<number | null>(null);

  // Generate BFS steps for the current graph
  const generateBFSSteps = (graphData: { nodes: number[]; edges: number[][]; start: number }): BFSStep[] => {
    const steps: BFSStep[] = [];
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
      queue: [],
      visited: [],
      message: 'Starting BFS traversal...',
      graph: { ...graphData }
    });

    const visited = new Set<number>();
    const queue: number[] = [start];
    visited.add(start);

    steps.push({
      current: start,
      queue: [...queue],
      visited: Array.from(visited),
      message: `Starting BFS from node ${start}`,
      graph: { ...graphData }
    });

    while (queue.length > 0) {
      const current = queue.shift()!;

      steps.push({
        current,
        queue: [...queue],
        visited: Array.from(visited),
        message: `Processing node ${current}`,
        graph: { ...graphData }
      });

      for (const neighbor of adjacencyList[current] || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);

          steps.push({
            current,
            queue: [...queue],
            visited: Array.from(visited),
            message: `Discovered neighbor ${neighbor} from node ${current}`,
            graph: { ...graphData }
          });
        }
      }
    }

    steps.push({
      current: -1,
      queue: [],
      visited: Array.from(visited),
      message: 'BFS traversal completed!',
      graph: { ...graphData }
    });

    return steps;
  };

  const codeImplementations = {
    javascript: `function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  visited.add(start);

  while (queue.length > 0) {
    const current = queue.shift();
    console.log('Visiting:', current);

    for (const neighbor of graph[current] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return Array.from(visited);
}`,
    python: `from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)

    while queue:
        current = queue.popleft()
        print(f"Visiting: {current}")

        for neighbor in graph.get(current, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return list(visited)`,
    cpp: `#include <queue>
#include <unordered_set>
#include <vector>

vector<int> bfs(vector<vector<int>>& graph, int start) {
    unordered_set<int> visited;
    queue<int> q;
    vector<int> result;

    q.push(start);
    visited.insert(start);

    while (!q.empty()) {
        int current = q.front();
        q.pop();
        result.push_back(current);

        for (int neighbor : graph[current]) {
            if (visited.find(neighbor) == visited.end()) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }
    return result;
}`,
    go: `func bfs(graph map[int][]int, start int) []int {
    visited := make(map[int]bool)
    queue := []int{start}
    visited[start] = true
    result := []int{}

    for len(queue) > 0 {
        current := queue[0]
        queue = queue[1:]
        result = append(result, current)

        for _, neighbor := range graph[current] {
            if !visited[neighbor] {
                visited[neighbor] = true
                queue = append(queue, neighbor)
            }
        }
    }
    return result
}`,
    rust: `use std::collections::{HashMap, VecDeque};

fn bfs(graph: &HashMap<i32, Vec<i32>>, start: i32) -> Vec<i32> {
    let mut visited = HashMap::new();
    let mut queue = VecDeque::new();
    let mut result = Vec::new();

    queue.push_back(start);
    visited.insert(start, true);

    while let Some(current) = queue.pop_front() {
        result.push(current);

        if let Some(neighbors) = graph.get(&current) {
            for &neighbor in neighbors {
                if !visited.contains_key(&neighbor) {
                    visited.insert(neighbor, true);
                    queue.push_back(neighbor);
                }
            }
        }
    }
    result
}`
  };

  // Initialize BFS steps when original graph changes
  useEffect(() => {
    if (originalGraph.nodes.length > 0) {
      const steps = generateBFSSteps(originalGraph);
      setBfsSteps(steps);
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

  // Animation controls
  const startAnimation = () => {
    if (currentStep >= bfsSteps.length - 1) setCurrentStep(-1);
    setIsPlaying(true);
    setIsPaused(false);
    const animate = () => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= bfsSteps.length) {
          setIsPlaying(false);
          setIsPaused(false);
          return prev;
        }
        setGraph(bfsSteps[next].graph);
        return next;
      });
    };
    intervalRef.current = window.setInterval(animate, speed);
  };

  const pauseAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPaused(true);
  };

  const stopAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentStep(-1);
    setGraph({ ...originalGraph });
  };

  const stepForward = () => {
    if (currentStep < bfsSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setGraph(bfsSteps[nextStep].graph);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setGraph(bfsSteps[prevStep].graph);
    } else if (currentStep === 0) {
      setCurrentStep(-1);
      setGraph({ ...originalGraph });
    }
  };

  const generateRandomGraph = () => {
    const nodeCount = Math.floor(Math.random() * 4) + 4; // 4-7 nodes
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
    setInputNodes(nodes.join(','));
    setInputEdges(edges.map(([f, t]) => `${f}-${t}`).join(','));
    setStartNode('1');
    stopAnimation();
  };

  const resetGraph = () => {
    const defaultGraph = {
      nodes: [1, 2, 3, 4, 5],
      edges: [[1, 2], [1, 3], [2, 4], [2, 5], [3, 5]],
      start: 1
    };
    setOriginalGraph(defaultGraph);
    setInputNodes('1,2,3,4,5');
    setInputEdges('1-2,1-3,2-4,2-5,3-5');
    setStartNode('1');
  };

  const getNodeClass = (node: number) => {
    const step = bfsSteps[currentStep];
    if (!step) return 'border border-2 border-primary bg-primary text-white p-2 rounded d-flex justify-content-center align-items-center';
    if (step.current === node) return 'graph-node current';
    if (step.visited.includes(node)) return 'graph-node visited';
    if (step.queue.includes(node)) return 'graph-node queued';
    return 'border border-2 border-primary bg-primary text-white p-2 rounded d-flex justify-content-center align-items-center';
  };

  const getCurrentMessage = () => {
    if (currentStep >= 0 && currentStep < bfsSteps.length) return bfsSteps[currentStep].message;
    return 'Click "Start" to begin the BFS visualization';
  };

  const getCurrentQueue = () => {
    if (currentStep >= 0 && currentStep < bfsSteps.length) return bfsSteps[currentStep].queue;
    return [];
  };

  const getCurrentVisited = () => {
    if (currentStep >= 0 && currentStep < bfsSteps.length) return bfsSteps[currentStep].visited;
    return [];
  };

  return (
    <div className="container-fluid py-3">
      {/* Inject graph visualization styles */}
      <style>{graphStyles}</style>

      {/* Page Header */}
      <div className="page-header mb-4">
        <div className="page-header-content">
          <h1 className="page-title">Breadth-First Search (BFS)</h1>
          <p className="page-subtitle">A classic graph traversal algorithm that explores all neighbors at the present depth before moving to nodes at the next depth level</p>
          <div className="page-meta">
            <div className="page-meta-item"><i className="bi bi-clock"></i><span>Time: O(V + E)</span></div>
            <div className="page-meta-item"><i className="bi bi-graph-up"></i><span>Space: O(V)</span></div>
            <div className="page-meta-item"><i className="bi bi-diagram-3"></i><span>Graph Traversal</span></div>
            <div className="page-meta-item"><i className="bi bi-arrow-repeat"></i><span>Queue-Based</span></div>
          </div>
        </div>
      </div>

        {/* Information Section */}
      <div className="info-section fade-in-up mb-4">
          <h4><i className="bi bi-info-circle"></i> How BFS Works</h4>
        <p className="info-description">Breadth-First Search (BFS) is a graph traversal algorithm that explores all neighbors at the present depth before moving to nodes at the next depth level. It uses a queue to keep track of the next node to visit. BFS is useful for finding the shortest path in unweighted graphs and for level-order traversal.</p>

          <div className="code-example">
          <div className="language-tabs mb-3">
            <div className="nav nav-tabs" role="tablist">
              {Object.keys(codeImplementations).map((lang) => (
                <button key={lang} className={`nav-link ${activeLanguage === lang ? 'active' : ''}`} onClick={() => setActiveLanguage(lang)} type="button" role="tab">
                  {lang === 'javascript' && <><i className="bi bi-code-slash"></i> JavaScript</>}
                  {lang === 'python' && <><i className="bi bi-code-square"></i> Python</>}
                  {lang === 'cpp' && <><i className="bi bi-braces"></i> C/C++</>}
                  {lang === 'go' && <><i className="bi bi-gear"></i> Go</>}
                  {lang === 'rust' && <><i className="bi bi-shield-check"></i> Rust</>}
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
            <li>Explores all neighbors at current depth before going deeper</li>
            <li>Uses a queue for traversal</li>
            <li>Finds shortest path in unweighted graphs</li>
            <li>Useful for level-order traversal</li>
            <li>Works on both directed and undirected graphs</li>
            <li>Can be used to find connected components</li>
          </ul>
        </div>


      {/* Algorithm Steps */}
      <div className="info-section mb-4">
        <h4><i className="bi bi-list-ol"></i> Step-by-Step Process</h4>
        <div className="row">
          <div className="col-md-6">
            <h6 className="text-highlight">Initialization:</h6>
            <ol className="features-list">
              <li>Create an empty queue</li>
              <li>Mark start node as visited</li>
              <li>Add start node to queue</li>
              <li>Initialize visited set</li>
            </ol>
          </div>
          <div className="col-md-6">
            <h6 className="text-highlight">Traversal:</h6>
            <ol className="features-list">
              <li>Dequeue a node from queue</li>
              <li>Process the current node</li>
              <li>Add unvisited neighbors to queue</li>
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
              disabled={currentStep >= bfsSteps.length - 1 && !isPaused}
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
            <button className="btn btn-info-enhanced btn-enhanced" onClick={stepForward} disabled={currentStep >= bfsSteps.length - 1} title="Step Forward">
              <i className="bi bi-skip-forward-fill"></i>
            </button>
          </div>
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <span className="small text-muted">Step {currentStep + 1} of {bfsSteps.length}</span>
            <div className="progress flex-grow-1 mx-2" style={{ height: '8px' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${bfsSteps.length > 0 ? ((currentStep + 1) / bfsSteps.length) * 100 : 0}%` }}
                aria-valuenow={currentStep + 1}
                aria-valuemin={0}
                aria-valuemax={bfsSteps.length}
              ></div>
            </div>
            <span className="small text-muted">{bfsSteps.length > 0 ? Math.round(((currentStep + 1) / bfsSteps.length) * 100) : 0}%</span>
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
              <i className="bi bi-list-ul"></i> <strong>Queue:</strong> [{getCurrentQueue().join(', ')}]
            </div>
          </div>
          <div className="col-md-6">
            <div className="alert alert-success">
              <i className="bi bi-check-circle"></i> <strong>Visited:</strong> [{getCurrentVisited().join(', ')}]
            </div>
          </div>
        </div>

        <div className="alert alert-info">
          <i className="bi bi-lightbulb"></i> <strong>Tip:</strong> Use the controls to step through the BFS algorithm. Watch how nodes are explored level by level using a queue.
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
            <h6><i className="bi bi-geo-alt"></i> Shortest Path</h6>
            <p>Find the shortest path in unweighted graphs</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-diagram-3"></i> Connected Components</h6>
            <p>Find all connected components in a graph</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-arrow-repeat"></i> Level-Order Traversal</h6>
            <p>Traverse trees and graphs level by level</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-exclamation-triangle"></i> Cycle Detection</h6>
            <p>Detect cycles in undirected graphs</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-search"></i> Path Finding</h6>
            <p>Find a path between two nodes</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-code"></i> Web Crawling</h6>
            <p>Explore all reachable web pages from a source</p>
          </div>
        </div>
      </div>

      {/* Advantages and Disadvantages */}
      <div className="content-grid mb-4">
        <div className="info-section">
          <h4><i className="bi bi-plus-circle"></i> Advantages</h4>
          <ul className="features-list">
            <li>Finds shortest path in unweighted graphs</li>
            <li>Simple to implement (queue-based)</li>
            <li>Efficient for sparse graphs</li>
            <li>Works for both directed and undirected graphs</li>
            <li>Useful for many graph problems</li>
          </ul>
        </div>
        <div className="info-section disadvantages-section">
          <h4><i className="bi bi-dash-circle"></i> Disadvantages</h4>
          <ul className="features-list">
            <li>Memory intensive for wide graphs</li>
            <li>Not optimal for deep graphs</li>
            <li>May explore unnecessary nodes</li>
            <li>Requires queue data structure</li>
            <li>Not suitable for weighted graphs</li>
          </ul>
        </div>
      </div>

    </div>
  );
};

export default BFS;