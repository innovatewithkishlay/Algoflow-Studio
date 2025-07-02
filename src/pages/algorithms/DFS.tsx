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

const DFS: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [originalGraph, setOriginalGraph] = useState({
    nodes: [1, 2, 3, 4, 5],
    edges: [[1, 2], [1, 3], [2, 4], [2, 5], [3, 5]],
    start: 1
  });
  const [graph, setGraph] = useState({ ...originalGraph });
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
    const adjacencyList: { [key: number]: number[] } = {};
    nodes.forEach(node => { adjacencyList[node] = []; });
    edges.forEach(([from, to]) => {
      if (adjacencyList[from] && !adjacencyList[from].includes(to)) adjacencyList[from].push(to);
      if (adjacencyList[to] && !adjacencyList[to].includes(from)) adjacencyList[to].push(from);
    });
    steps.push({ current: -1, stack: [], visited: [], message: 'Starting DFS traversal...', graph: { ...graphData } });
    const visited = new Set<number>();
    const stack: number[] = [start];
    visited.add(start);
    steps.push({ current: start, stack: [...stack], visited: Array.from(visited), message: `Starting DFS from node ${start}`, graph: { ...graphData } });
    while (stack.length > 0) {
      const current = stack.pop()!;
      steps.push({ current, stack: [...stack], visited: Array.from(visited), message: `Processing node ${current}`, graph: { ...graphData } });
      for (const neighbor of (adjacencyList[current] || []).reverse()) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          stack.push(neighbor);
          steps.push({ current, stack: [...stack], visited: Array.from(visited), message: `Discovered neighbor ${neighbor} from node ${current}`, graph: { ...graphData } });
        }
      }
    }
    steps.push({ current: -1, stack: [], visited: Array.from(visited), message: 'DFS traversal completed!', graph: { ...graphData } });
    return steps;
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
    if (nodes.length > 0) setOriginalGraph({ nodes, edges, start });
  }, [inputNodes, inputEdges, startNode]);

  // Animation progression
  useEffect(() => {
    if (isPlaying && !isPaused && currentStep < dfsSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, isPaused, currentStep, dfsSteps.length, speed]);

  const startAnimation = () => {
    setIsPlaying(true);
    setIsPaused(false);
    if (currentStep >= dfsSteps.length - 1) setCurrentStep(0);
  };

  const pauseAnimation = () => setIsPaused(true);
  const stopAnimation = () => { setIsPlaying(false); setIsPaused(false); setCurrentStep(-1); };
  const stepForward = () => { if (currentStep < dfsSteps.length - 1) setCurrentStep(currentStep + 1); };
  const stepBackward = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

  const generateRandomGraph = () => {
    const nodeCount = Math.floor(Math.random() * 6) + 4;
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
    if (!step) return 'graph-node default';
    if (step.current === node) return 'graph-node current';
    if (step.visited.includes(node)) return 'graph-node visited';
    if (step.stack.includes(node)) return 'graph-node queued';
    return 'graph-node default';
  };

  const getCurrentMessage = () => (currentStep >= 0 && currentStep < dfsSteps.length) ? dfsSteps[currentStep].message : 'Click "Start" to begin the DFS visualization';
  const getCurrentStack = () => (currentStep >= 0 && currentStep < dfsSteps.length) ? dfsSteps[currentStep].stack : [];
  const getCurrentVisited = () => (currentStep >= 0 && currentStep < dfsSteps.length) ? dfsSteps[currentStep].visited : [];

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <style>{graphStyles}</style>
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900">Depth-First Search (DFS)</h1>
          <p className="text-zinc-700 text-lg mt-2">
            A fundamental graph traversal algorithm that explores as far as possible along each branch before backtracking
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm mt-4">
            <div className="flex items-center gap-2"><i className="bi bi-clock text-indigo-600"></i> <span>Time: O(V + E)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-graph-up text-green-600"></i> <span>Space: O(V)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-diagram-3 text-indigo-600"></i> <span>Graph Traversal</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-arrow-repeat text-indigo-600"></i> <span>Stack-Based</span></div>
          </div>
        </div>

        {/* Information Section */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3"><i className="bi bi-info-circle text-indigo-600"></i> How DFS Works</h4>
          <p className="text-zinc-700 leading-relaxed">
            Depth-First Search (DFS) is a graph traversal algorithm that explores as far as possible along each branch before backtracking. It uses a stack (either explicitly or via recursion) to remember the path. DFS is useful for pathfinding, cycle detection, and topological sorting.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <pre>{codeImplementations[activeLanguage as keyof typeof codeImplementations]}</pre>
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
            <li>Explores as deep as possible before backtracking</li>
            <li>Uses stack or recursion</li>
            <li>Can be used to find connected components</li>
            <li>Detects cycles in graphs</li>
            <li>Useful for topological sorting</li>
            <li>Works on both directed and undirected graphs</li>
          </ul>
        </div>

        {/* Algorithm Steps */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3"><i className="bi bi-list-ol text-indigo-600"></i> Step-by-Step Process</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Initialization:</h6>
              <ol className="list-decimal list-inside text-zinc-700 space-y-1">
                <li>Create an empty stack</li>
                <li>Mark start node as visited</li>
                <li>Add start node to stack</li>
                <li>Initialize visited set</li>
              </ol>
            </div>
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Traversal:</h6>
              <ol className="list-decimal list-inside text-zinc-700 space-y-1">
                <li>Pop a node from stack</li>
                <li>Process the current node</li>
                <li>Add unvisited neighbors to stack</li>
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
              disabled={currentStep >= dfsSteps.length - 1 && !isPaused}
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
            <button className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition" onClick={stepForward} disabled={currentStep >= dfsSteps.length - 1} title="Step Forward">
              <i className="bi bi-skip-forward-fill"></i>
            </button>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-zinc-500">Step {currentStep + 1} of {dfsSteps.length}</span>
            <div className="flex-1 h-2 bg-zinc-200 rounded overflow-hidden mx-2">
              <div
                className="h-2 bg-indigo-500"
                style={{ width: `${dfsSteps.length > 0 ? ((currentStep + 1) / dfsSteps.length) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="text-xs text-zinc-500">{dfsSteps.length > 0 ? Math.round(((currentStep + 1) / dfsSteps.length) * 100) : 0}%</span>
          </div>
          <div className="rounded bg-zinc-50 border border-zinc-200 px-4 py-3 mb-3">
            <i className="bi bi-chat-text text-indigo-600 mr-2"></i>
            <span className="font-semibold">Message:</span> {getCurrentMessage()}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div className="rounded bg-blue-50 border border-blue-200 px-4 py-3">
              <i className="bi bi-list-ul text-blue-600 mr-2"></i>
              <span className="font-semibold">Stack:</span> [{getCurrentStack().join(', ')}]
            </div>
            <div className="rounded bg-green-50 border border-green-200 px-4 py-3">
              <i className="bi bi-check-circle text-green-600 mr-2"></i>
              <span className="font-semibold">Visited:</span> [{getCurrentVisited().join(', ')}]
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Use the controls to step through the DFS algorithm. Watch how nodes are explored depth-first using a stack.
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
                <i className="bi bi-diagram-3 text-green-600"></i> Connected Components
              </h6>
              <p className="text-zinc-700 text-sm">Find all connected components in a graph</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-arrow-repeat text-green-600"></i> Topological Sorting
              </h6>
              <p className="text-zinc-700 text-sm">Order tasks with dependencies in DAGs</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-exclamation-triangle text-yellow-600"></i> Cycle Detection
              </h6>
              <p className="text-zinc-700 text-sm">Detect cycles in directed and undirected graphs</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-search text-green-600"></i> Path Finding
              </h6>
              <p className="text-zinc-700 text-sm">Find a path between two nodes</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-code text-indigo-600"></i> Solving Mazes
              </h6>
              <p className="text-zinc-700 text-sm">Explore all possible paths in a maze</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-tree text-green-600"></i> Tree Traversal
              </h6>
              <p className="text-zinc-700 text-sm">Preorder, inorder, and postorder traversals</p>
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
              <li>Memory efficient for deep graphs</li>
              <li>Simple to implement (stack-based)</li>
              <li>Excellent for backtracking problems</li>
              <li>Works for both directed and undirected graphs</li>
              <li>Perfect for topological sorting</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>May not find shortest path</li>
              <li>Can cause stack overflow on very deep graphs</li>
              <li>May explore unnecessary paths</li>
              <li>Requires stack data structure</li>
              <li>Not optimal for wide graphs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DFS;
