import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

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

const BFS: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [originalGraph, setOriginalGraph] = useState({
    nodes: [1, 2, 3, 4, 5],
    edges: [[1, 2], [1, 3], [2, 4], [2, 5], [3, 5]],
    start: 1
  });
  const [graph, setGraph] = useState({ ...originalGraph });
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [bfsSteps, setBfsSteps] = useState<BFSStep[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [inputNodes, setInputNodes] = useState('1,2,3,4,5');
  const [inputEdges, setInputEdges] = useState('1-2,1-3,2-4,2-5,3-5');
  const [startNode, setStartNode] = useState('1');
  const [speed] = useState<number>(1000);
  const [activeLanguage, setActiveLanguage] = useState('javascript');
  const intervalRef = useRef<number | null>(null);

  // BFS logic
  const generateBFSSteps = (graphData: { nodes: number[]; edges: number[][]; start: number }): BFSStep[] => {
    const steps: BFSStep[] = [];
    const { nodes, edges, start } = graphData;
    const adjacencyList: { [key: number]: number[] } = {};
    nodes.forEach(node => { adjacencyList[node] = []; });
    edges.forEach(([from, to]) => {
      if (adjacencyList[from] && !adjacencyList[from].includes(to)) adjacencyList[from].push(to);
      if (adjacencyList[to] && !adjacencyList[to].includes(from)) adjacencyList[to].push(from);
    });
    steps.push({ current: -1, queue: [], visited: [], message: 'Starting BFS traversal...', graph: { ...graphData } });
    const visited = new Set<number>();
    const queue: number[] = [start];
    visited.add(start);
    steps.push({ current: start, queue: [...queue], visited: Array.from(visited), message: `Starting BFS from node ${start}`, graph: { ...graphData } });
    while (queue.length > 0) {
      const current = queue.shift()!;
      steps.push({ current, queue: [...queue], visited: Array.from(visited), message: `Processing node ${current}`, graph: { ...graphData } });
      for (const neighbor of adjacencyList[current] || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          steps.push({ current, queue: [...queue], visited: Array.from(visited), message: `Discovered neighbor ${neighbor} from node ${current}`, graph: { ...graphData } });
        }
      }
    }
    steps.push({ current: -1, queue: [], visited: Array.from(visited), message: 'BFS traversal completed!', graph: { ...graphData } });
    return steps;
  };

  useEffect(() => {
    if (originalGraph.nodes.length > 0) {
      const steps = generateBFSSteps(originalGraph);
      setBfsSteps(steps);
      setCurrentStep(-1);
      setIsPlaying(false);
      setIsPaused(false);
      setGraph({ ...originalGraph });
    }
    // eslint-disable-next-line
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
    // eslint-disable-next-line
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
    const nodeCount = Math.floor(Math.random() * 4) + 4;
    const nodes = Array.from({ length: nodeCount }, (_, i) => i + 1);
    const edges: number[][] = [];
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
    if (!step) return 'graph-node default';
    if (step.current === node) return 'graph-node current';
    if (step.visited.includes(node)) return 'graph-node visited';
    if (step.queue.includes(node)) return 'graph-node queued';
    return 'graph-node default';
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
    <div className="min-h-screen bg-white py-8 px-4">
      <style>{graphStyles}</style>
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900">Breadth-First Search (BFS)</h1>
          <p className="text-zinc-700 text-lg mt-2">
            A classic graph traversal algorithm that explores all neighbors at the present depth before moving to nodes at the next depth level
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm mt-4">
            <div className="flex items-center gap-2"><i className="bi bi-clock text-indigo-600"></i> <span>Time: O(V + E)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-graph-up text-green-600"></i> <span>Space: O(V)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-diagram-3 text-indigo-600"></i> <span>Graph Traversal</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-arrow-repeat text-indigo-600"></i> <span>Queue-Based</span></div>
          </div>
        </div>

        {/* Information Section */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3"><i className="bi bi-info-circle text-indigo-600"></i> How BFS Works</h4>
          <p className="text-zinc-700 leading-relaxed">
            Breadth-First Search (BFS) is a graph traversal algorithm that explores all neighbors at the present depth before moving to nodes at the next depth level. It uses a queue to keep track of the next node to visit. BFS is useful for finding the shortest path in unweighted graphs and for level-order traversal.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <pre>
{codeImplementations[activeLanguage as keyof typeof codeImplementations]}
            </pre>
          </div>
          <div className="flex gap-2 mb-2">
            {Object.keys(codeImplementations).map(lang => (
              <button
                key={lang}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${activeLanguage === lang ? 'bg-indigo-600 text-white' : 'bg-zinc-200 text-zinc-700'}`}
                onClick={() => setActiveLanguage(lang)}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3"><i className="bi bi-list-check text-indigo-600"></i> Key Features</h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>Explores all neighbors at current depth before going deeper</li>
            <li>Uses a queue for traversal</li>
            <li>Finds shortest path in unweighted graphs</li>
            <li>Useful for level-order traversal</li>
            <li>Works on both directed and undirected graphs</li>
            <li>Can be used to find connected components</li>
          </ul>
        </div>

        {/* Algorithm Steps */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3"><i className="bi bi-list-ol text-indigo-600"></i> Step-by-Step Process</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Initialization:</h6>
              <ol className="list-decimal list-inside text-zinc-700 space-y-1">
                <li>Create an empty queue</li>
                <li>Mark start node as visited</li>
                <li>Add start node to queue</li>
                <li>Initialize visited set</li>
              </ol>
            </div>
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Traversal:</h6>
              <ol className="list-decimal list-inside text-zinc-700 space-y-1">
                <li>Dequeue a node from queue</li>
                <li>Process the current node</li>
                <li>Add unvisited neighbors to queue</li>
                <li>Mark neighbors as visited</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Interactive Section */}
        <div className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo & Visualization
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-1 text-zinc-700 font-medium">Graph Nodes:</label>
              <input
                type="text"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={inputNodes}
                onChange={(e) => setInputNodes(e.target.value)}
                placeholder="1,2,3,4,5"
                disabled={isPlaying}
              />
            </div>
            <div>
              <label className="block mb-1 text-zinc-700 font-medium">Graph Edges:</label>
              <input
                type="text"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={inputEdges}
                onChange={(e) => setInputEdges(e.target.value)}
                placeholder="1-2,1-3,2-4"
                disabled={isPlaying}
              />
            </div>
            <div>
              <label className="block mb-1 text-zinc-700 font-medium">Start Node:</label>
              <input
                type="text"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                placeholder="1"
                disabled={isPlaying}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <button className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition" onClick={generateRandomGraph} disabled={isPlaying}>
              <i className="bi bi-shuffle"></i> Generate Random Graph
            </button>
            <button className="bg-zinc-300 text-zinc-700 px-4 py-2 rounded shadow hover:bg-zinc-400 transition" onClick={resetGraph} disabled={isPlaying}>
              <i className="bi bi-arrow-clockwise"></i> Reset Graph
            </button>
          </div>
          <div className="mb-3">
            <label className="block mb-1 text-zinc-700 font-medium">Current Graph:</label>
            <div
              className="p-3 rounded relative mb-3"
              style={{
                background: isDarkMode ? '#23272f' : '#f8f9fa',
                color: isDarkMode ? '#f8f9fa' : '#23272f',
                minHeight: 300,
                minWidth: 300,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Edges */}
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
              {/* Nodes */}
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
          <div className="flex flex-wrap gap-2 mb-3 justify-center">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
              onClick={isPlaying && !isPaused ? pauseAnimation : startAnimation}
              disabled={currentStep >= bfsSteps.length - 1 && !isPaused}
              title={isPlaying && !isPaused ? 'Pause' : 'Play'}
            >
              <i className={`bi ${isPlaying && !isPaused ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
            </button>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition" onClick={stopAnimation} title="Stop">
              <i className="bi bi-stop-fill"></i>
            </button>
            <button className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition" onClick={stepBackward} disabled={currentStep <= -1} title="Step Back">
              <i className="bi bi-skip-backward-fill"></i>
            </button>
            <button className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition" onClick={stepForward} disabled={currentStep >= bfsSteps.length - 1} title="Step Forward">
              <i className="bi bi-skip-forward-fill"></i>
            </button>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-zinc-500">Step {currentStep + 1} of {bfsSteps.length}</span>
            <div className="flex-1 h-2 bg-zinc-200 rounded overflow-hidden mx-2">
              <div
                className="h-2 bg-indigo-500"
                style={{ width: `${bfsSteps.length > 0 ? ((currentStep + 1) / bfsSteps.length) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="text-xs text-zinc-500">{bfsSteps.length > 0 ? Math.round(((currentStep + 1) / bfsSteps.length) * 100) : 0}%</span>
          </div>
          <div className="rounded bg-zinc-50 border border-zinc-200 px-4 py-3 mb-3">
            <i className="bi bi-chat-text text-indigo-600 mr-2"></i>
            <span className="font-semibold">Message:</span> {getCurrentMessage()}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div className="rounded bg-blue-50 border border-blue-200 px-4 py-3">
              <i className="bi bi-list-ul text-blue-600 mr-2"></i>
              <span className="font-semibold">Queue:</span> [{getCurrentQueue().join(', ')}]
            </div>
            <div className="rounded bg-green-50 border border-green-200 px-4 py-3">
              <i className="bi bi-check-circle text-green-600 mr-2"></i>
              <span className="font-semibold">Visited:</span> [{getCurrentVisited().join(', ')}]
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Use the controls to step through the BFS algorithm. Watch how nodes are explored level by level using a queue.
          </div>
        </div>

        {/* Complexity Analysis */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
            <i className="bi bi-graph-up"></i> Time & Space Complexity
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-2 border border-gray-300 text-left">Case</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Time Complexity</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Space Complexity</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">All</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(V + E)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(V)</td>
                  <td className="px-4 py-2 border border-gray-300">Visits every vertex and edge once</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
            <i className="bi bi-lightning"></i> Use Cases & Applications
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-geo-alt text-green-600"></i> Shortest Path
              </h6>
              <p className="text-zinc-700 text-sm">Find the shortest path in unweighted graphs</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-diagram-3 text-green-600"></i> Connected Components
              </h6>
              <p className="text-zinc-700 text-sm">Find all connected components in a graph</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-arrow-repeat text-green-600"></i> Level-Order Traversal
              </h6>
              <p className="text-zinc-700 text-sm">Traverse trees and graphs level by level</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-exclamation-triangle text-yellow-600"></i> Cycle Detection
              </h6>
              <p className="text-zinc-700 text-sm">Detect cycles in undirected graphs</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-search text-green-600"></i> Path Finding
              </h6>
              <p className="text-zinc-700 text-sm">Find a path between two nodes</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-code text-indigo-600"></i> Web Crawling
              </h6>
              <p className="text-zinc-700 text-sm">Explore all reachable web pages from a source</p>
            </div>
          </div>
        </div>

        {/* Advantages and Disadvantages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
              <i className="bi bi-plus-circle"></i> Advantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Finds shortest path in unweighted graphs</li>
              <li>Simple to implement (queue-based)</li>
              <li>Efficient for sparse graphs</li>
              <li>Works for both directed and undirected graphs</li>
              <li>Useful for many graph problems</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Memory intensive for wide graphs</li>
              <li>Not optimal for deep graphs</li>
              <li>May explore unnecessary nodes</li>
              <li>Requires queue data structure</li>
              <li>Not suitable for weighted graphs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BFS;
