import React, { useState, useRef, useEffect } from 'react';

interface Edge {
  from: number;
  to: number;
  weight: number;
  id: number;
}

interface DijkstraStep {
  distances: number[];
  visited: boolean[];
  current: number | null;
  prev: (number | null)[];
  queue: number[];
  message: string;
  path: number[];
}

const codeImplementations = {
  javascript: `function dijkstra(n, edges, start) {
  const dist = Array(n).fill(Infinity);
  const prev = Array(n).fill(null);
  dist[start] = 0;
  const visited = Array(n).fill(false);
  for (let i = 0; i < n; i++) {
    let u = -1;
    for (let j = 0; j < n; j++)
      if (!visited[j] && (u === -1 || dist[j] < dist[u])) u = j;
    if (dist[u] === Infinity) break;
    visited[u] = true;
    for (const {to, weight, from} of edges)
      if (from === u && dist[u] + weight < dist[to]) {
        dist[to] = dist[u] + weight;
        prev[to] = u;
      }
  }
  return {dist, prev};
}`,

  python: `import heapq
def dijkstra(n, edges, start):
    dist = [float('inf')] * n
    prev = [None] * n
    dist[start] = 0
    heap = [(0, start)]
    graph = [[] for _ in range(n)]
    for u, v, w in edges:
        graph[u].append((v, w))
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]: continue
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                prev[v] = u
                heapq.heappush(heap, (dist[v], v))
    return dist, prev`,

  cpp: `#include <vector>
#include <queue>
using namespace std;
vector<int> dijkstra(int n, vector<vector<pair<int, int>>> &adj, int start) {
    vector<int> dist(n, INT_MAX), prev(n, -1);
    dist[start] = 0;
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    pq.push({0, start});
    while (!pq.empty()) {
        int u = pq.top().second, d = pq.top().first; pq.pop();
        if (d > dist[u]) continue;
        for (auto &[v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                prev[v] = u;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,

  java: `import java.util.*;
int[] dijkstra(int n, List<List<int[]>> adj, int start) {
    int[] dist = new int[n];
    int[] prev = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    Arrays.fill(prev, -1);
    dist[start] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
    pq.add(new int[]{0, start});
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int u = cur[1], d = cur[0];
        if (d > dist[u]) continue;
        for (int[] edge : adj.get(u)) {
            int v = edge[0], w = edge[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                prev[v] = u;
                pq.add(new int[]{dist[v], v});
            }
        }
    }
    return dist;
}`
};

const defaultEdges: Edge[] = [
  { from: 0, to: 1, weight: 2, id: 0 },
  { from: 0, to: 2, weight: 4, id: 1 },
  { from: 1, to: 2, weight: 1, id: 2 },
  { from: 1, to: 3, weight: 7, id: 3 },
  { from: 2, to: 4, weight: 3, id: 4 },
  { from: 3, to: 5, weight: 1, id: 5 },
  { from: 4, to: 3, weight: 2, id: 6 },
  { from: 4, to: 5, weight: 5, id: 7 },
];
const numVertices = 6;
const startVertex = 0;

const nodePositions = [
  { x: 100, y: 100 },
  { x: 300, y: 100 },
  { x: 100, y: 250 },
  { x: 300, y: 250 },
  { x: 200, y: 175 },
  { x: 400, y: 175 },
];

const Dijkstra: React.FC = () => {
  const [edges] = useState<Edge[]>(defaultEdges);
  const [sortSteps, setSortSteps] = useState<DijkstraStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speed] = useState<number>(1200);
  const intervalRef = useRef<number | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<string>('javascript');
  const [targetVertex] = useState<number>(5);

  // Generate steps for Dijkstra's Algorithm
  const generateDijkstraSteps = (
    edges: Edge[],
    n: number,
    start: number,
    target: number
  ): DijkstraStep[] => {
    const adj: [number, number][][] = Array.from({ length: n }, () => []);
    for (const e of edges) adj[e.from].push([e.to, e.weight]);

    const dist = Array(n).fill(Infinity);
    const prev: (number | null)[] = Array(n).fill(null);
    const visited = Array(n).fill(false);
    const steps: DijkstraStep[] = [];
    const queue: number[] = [];
    dist[start] = 0;
    queue.push(start);

    steps.push({
      distances: [...dist],
      visited: [...visited],
      current: null,
      prev: [...prev],
      queue: [...queue],
      message: `Starting Dijkstra's Algorithm from node ${start}.`,
      path: [],
    });

    while (queue.length > 0) {
      let u = -1;
      let minDist = Infinity;
      for (const node of queue) {
        if (!visited[node] && dist[node] < minDist) {
          minDist = dist[node];
          u = node;
        }
      }
      if (u === -1) break;
      visited[u] = true;
      steps.push({
        distances: [...dist],
        visited: [...visited],
        current: u,
        prev: [...prev],
        queue: [...queue],
        message: `Visiting node ${u}, updating neighbors.`,
        path: [],
      });
      for (const [v, w] of adj[u]) {
        if (!visited[v] && dist[u] + w < dist[v]) {
          dist[v] = dist[u] + w;
          prev[v] = u;
          queue.push(v);
          steps.push({
            distances: [...dist],
            visited: [...visited],
            current: v,
            prev: [...prev],
            queue: [...queue],
            message: `Updated distance of node ${v} to ${dist[v]} via node ${u}.`,
            path: [],
          });
        }
      }
      queue.splice(queue.indexOf(u), 1);
    }

    // Reconstruct path
    const path: number[] = [];
    let t: number | null = target;
    while (t !== null && prev[t] !== null) {
    path.unshift(t);
    t = prev[t];
    }
    if (t === start) path.unshift(start);


    steps.push({
      distances: [...dist],
      visited: [...visited],
      current: null,
      prev: [...prev],
      queue: [],
      message: `Dijkstra's Algorithm completed. Shortest path: ${path.join(' → ')}.`,
      path: [...path],
    });

    return steps;
  };

  // Initialize steps
  useEffect(() => {
    setSortSteps(generateDijkstraSteps(edges, numVertices, startVertex, targetVertex));
    setCurrentStep(-1);
    setIsPlaying(false);
    setIsPaused(false);
  }, [edges, targetVertex]);

  // Animation controls
  const startAnimation = () => {
    if (currentStep >= sortSteps.length - 1) setCurrentStep(-1);
    setIsPlaying(true);
    setIsPaused(false);
    const animate = () => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= sortSteps.length) {
          setIsPlaying(false);
          setIsPaused(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          return prev;
        }
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
  };

  const stepForward = () => {
    if (currentStep < sortSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (currentStep === 0) {
      setCurrentStep(-1);
    }
  };

  const getEdgeColor = (edge: Edge, step?: DijkstraStep) => {
    if (!step) return '#a1a1aa';
    if (
      step.path.length > 1 &&
      step.path.some(
        (v, i, arr) =>
          i > 0 &&
          ((edge.from === arr[i - 1] && edge.to === v) ||
            (edge.from === v && edge.to === arr[i - 1]))
      )
    )
      return '#22c55e';
    return '#a1a1aa';
  };

  const getNodeColor = (node: number, step?: DijkstraStep) => {
    if (!step) return '#e0e7ef';
    if (step.path.includes(node)) return '#22c55e';
    if (step.current === node) return '#facc15';
    if (step.visited[node]) return '#a7f3d0';
    return '#e0e7ef';
  };

  const getCurrentMessage = () => {
    if (currentStep >= 0 && currentStep < sortSteps.length) return sortSteps[currentStep].message;
    return "Click 'Start' to begin Dijkstra's Algorithm visualization.";
  };

  const step = currentStep >= 0 ? sortSteps[currentStep] : undefined;

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900">Dijkstra's Algorithm</h1>
          <p className="text-zinc-700 text-lg mt-2">
            An efficient algorithm to find the shortest path from a source node to all other nodes in a weighted graph with non-negative weights.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm mt-4">
            <div className="flex items-center gap-2"><i className="bi bi-diagram-3 text-indigo-600"></i> <span>Graph Algorithm</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-clock text-indigo-600"></i> <span>O((V + E) log V)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-gear text-indigo-600"></i> <span>Priority Queue</span></div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3"><i className="bi bi-info-circle text-indigo-600"></i> How Dijkstra's Algorithm Works</h4>
          <p className="text-zinc-700 leading-relaxed">
            Dijkstra’s Algorithm repeatedly selects the unvisited node with the smallest known distance, updates the distances to its neighbors, and marks it as visited. The process continues until all nodes are visited or the shortest path to the target is found.
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
            <li>Finds shortest path in weighted graphs</li>
            <li>Uses priority queue for efficiency</li>
            <li>Handles non-negative weights</li>
            <li>Widely used in GPS, networking, and more</li>
          </ul>
        </div>

        {/* Step-by-Step Process */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3"><i className="bi bi-list-ol text-indigo-600"></i> Step-by-Step Process</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Algorithm Steps:</h6>
              <ol className="list-decimal list-inside text-zinc-700 space-y-1">
                <li>Initialize all distances as infinity except the start node (0)</li>
                <li>Use a priority queue to select the node with the smallest distance</li>
                <li>For each neighbor, update its distance if a shorter path is found</li>
                <li>Repeat until all nodes are visited or the target is reached</li>
              </ol>
            </div>
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Visualization:</h6>
              <ol className="list-decimal list-inside text-zinc-700 space-y-1">
                <li>Current node is highlighted</li>
                <li>Visited nodes are colored</li>
                <li>Shortest path is shown in green</li>
                <li>Distance table updates at each step</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Interactive Section */}
        <div className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo & Visualization
          </h5>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block mb-1 text-zinc-700 font-medium">Graph Visualization:</label>
              <svg width={500} height={350} className="bg-slate-50 rounded shadow border" style={{ maxWidth: '100%' }}>
                {/* Edges */}
                {edges.map((edge) => {
                  const color = getEdgeColor(edge, step);
                  const { x: x1, y: y1 } = nodePositions[edge.from];
                  const { x: x2, y: y2 } = nodePositions[edge.to];
                  return (
                    <g key={edge.id}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={4} markerEnd="url(#arrowhead)" />
                      <text
                        x={(x1 + x2) / 2}
                        y={(y1 + y2) / 2 - 10}
                        textAnchor="middle"
                        fontSize={16}
                        fill="#64748b"
                        fontWeight={600}
                      >
                        {edge.weight}
                      </text>
                    </g>
                  );
                })}
                {/* Arrowhead marker */}
                <defs>
                  <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
                  </marker>
                </defs>
                {/* Nodes */}
                {nodePositions.map(({ x, y }, idx) => {
                  const fill = getNodeColor(idx, step);
                  return (
                    <g key={idx}>
                      <circle cx={x} cy={y} r={24} fill={fill} stroke="#334155" strokeWidth={3} />
                      <text x={x} y={y + 6} textAnchor="middle" fontSize={20} fill="#334155" fontWeight={700}>
                        {idx}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
              onClick={isPlaying && !isPaused ? pauseAnimation : startAnimation}
              disabled={currentStep >= sortSteps.length - 1 && !isPaused}
              title={isPlaying && !isPaused ? 'Pause' : 'Play'}
            >
              <i className={`bi ${isPlaying && !isPaused ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
              onClick={stopAnimation}
              title="Stop"
            >
              <i className="bi bi-stop-fill"></i>
            </button>
            <button
              className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
              onClick={stepBackward}
              disabled={currentStep <= -1}
              title="Step Back"
            >
              <i className="bi bi-skip-backward-fill"></i>
            </button>
            <button
              className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
              onClick={stepForward}
              disabled={currentStep >= sortSteps.length - 1}
              title="Step Forward"
            >
              <i className="bi bi-skip-forward-fill"></i>
            </button>
          </div>
          {/* Progress Bar */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-zinc-500">Step {currentStep + 1} of {sortSteps.length}</span>
            <div className="flex-1 h-2 bg-zinc-200 rounded overflow-hidden mx-2">
              <div
                className="h-2 bg-indigo-500"
                style={{ width: `${sortSteps.length > 0 ? ((currentStep + 1) / sortSteps.length) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="text-xs text-zinc-500">{sortSteps.length > 0 ? Math.round(((currentStep + 1) / sortSteps.length) * 100) : 0}%</span>
          </div>
          {/* Step message */}
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-2 rounded border-2 border-indigo-400 bg-indigo-50 px-4 py-2 text-indigo-700 font-semibold shadow">
              <i className="bi bi-chat-text"></i>
              {getCurrentMessage()}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Follow the highlighted path to see the shortest route from the start to the target node!
          </div>
        </div>

        {/* Distance Table */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
            <i className="bi bi-table"></i> Distance Table
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-2 border border-gray-300 text-left">Node</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Distance</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Previous</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Visited</th>
                </tr>
              </thead>
              <tbody>
                {step &&
                  step.distances.map((dist, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 border border-gray-300">{idx}</td>
                      <td className="px-4 py-2 border border-gray-300">
                        {dist === Infinity ? '∞' : dist}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {step.prev[idx] !== null ? step.prev[idx] : '-'}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {step.visited[idx] ? (
                          <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-block bg-yellow-100 text-yellow-800 rounded px-2 py-1 font-semibold">
                            No
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
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
                  <td className="px-4 py-2 border border-gray-300">All cases</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O((V + E) log V)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(V)</td>
                  <td className="px-4 py-2 border border-gray-300">V = vertices, E = edges</td>
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
                <i className="bi bi-cpu text-green-600"></i> GPS Navigation
              </h6>
              <p className="text-zinc-700 text-sm">Finding shortest driving routes</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-database text-green-600"></i> Network Routing
              </h6>
              <p className="text-zinc-700 text-sm">Optimizing data packet paths</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-code-square text-green-600"></i> Robotics
              </h6>
              <p className="text-zinc-700 text-sm">Pathfinding for autonomous robots</p>
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
              <li>Efficient for graphs with non-negative weights</li>
              <li>Finds shortest path from one node to all others</li>
              <li>Widely used in real-world applications</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Does not handle negative weights</li>
              <li>Less efficient for dense graphs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dijkstra;
