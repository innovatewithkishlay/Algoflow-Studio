import React, { useState, useRef, useEffect } from 'react';

interface Edge {
  u: number;
  v: number;
  weight: number;
  id: number;
}

interface KruskalStep {
  edge: Edge | null;
  mstEdges: number[];
  currentEdgeIndex: number;
  message: string;
  unionFind: number[];
  consideredEdges: number[];
  cycle: boolean;
}

const codeImplementations = {
  javascript: `function kruskal(n, edges) {
  edges.sort((a, b) => a.weight - b.weight);
  const parent = Array(n).fill(0).map((_, i) => i);
  function find(x) { return parent[x] === x ? x : parent[x] = find(parent[x]); }
  let mst = [];
  for (const {u, v, weight} of edges) {
    if (find(u) !== find(v)) {
      mst.push({u, v, weight});
      parent[find(u)] = find(v);
    }
  }
  return mst;
}`
};

const defaultEdges: Edge[] = [
  { u: 0, v: 1, weight: 4, id: 0 },
  { u: 0, v: 2, weight: 4, id: 1 },
  { u: 1, v: 2, weight: 2, id: 2 },
  { u: 1, v: 3, weight: 5, id: 3 },
  { u: 2, v: 3, weight: 5, id: 4 },
  { u: 2, v: 4, weight: 11, id: 5 },
  { u: 3, v: 4, weight: 2, id: 6 },
];

const numVertices = 5;

const Kruskal: React.FC = () => {
  const [edges, setEdges] = useState<Edge[]>(defaultEdges);
  const [sortSteps, setSortSteps] = useState<KruskalStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speed] = useState<number>(1200);
  const intervalRef = useRef<number | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<string>('javascript');

  // Kruskal's Algorithm Step Generation
  const generateKruskalSteps = (edges: Edge[], n: number): KruskalStep[] => {
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    const parent = Array(n).fill(0).map((_, i) => i);
    const mst: number[] = [];
    const consideredEdges: number[] = [];
    const steps: KruskalStep[] = [];

    function find(x: number): number {
      if (parent[x] !== x) parent[x] = find(parent[x]);
      return parent[x];
    }

    steps.push({
      edge: null,
      mstEdges: [],
      currentEdgeIndex: -1,
      message: 'Starting Kruskal’s Algorithm...',
      unionFind: [...parent],
      consideredEdges: [],
      cycle: false,
    });

    for (let i = 0; i < sortedEdges.length; i++) {
      const edge = sortedEdges[i];
      consideredEdges.push(edge.id);
      const uRoot = find(edge.u);
      const vRoot = find(edge.v);
      let cycle = false;
      let message = `Considering edge (${edge.u} - ${edge.v}) with weight ${edge.weight}.`;
      if (uRoot !== vRoot) {
        parent[uRoot] = vRoot;
        mst.push(edge.id);
        message += ` Added to MST.`;
      } else {
        cycle = true;
        message += ` Skipped (would form a cycle).`;
      }
      steps.push({
        edge,
        mstEdges: [...mst],
        currentEdgeIndex: i,
        message,
        unionFind: [...parent],
        consideredEdges: [...consideredEdges],
        cycle,
      });
    }

    steps.push({
      edge: null,
      mstEdges: [...mst],
      currentEdgeIndex: sortedEdges.length,
      message: 'Kruskal’s Algorithm completed. Minimum Spanning Tree constructed.',
      unionFind: [...parent],
      consideredEdges: [...consideredEdges],
      cycle: false,
    });

    return steps;
  };

  // Initialize steps
  useEffect(() => {
    setSortSteps(generateKruskalSteps(edges, numVertices));
    setCurrentStep(-1);
    setIsPlaying(false);
    setIsPaused(false);
  }, [edges]);

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

  // Node positions for simple SVG graph
  const nodePositions = [
    { x: 100, y: 100 },
    { x: 300, y: 100 },
    { x: 200, y: 200 },
    { x: 100, y: 300 },
    { x: 300, y: 300 },
  ];

  // Edge coloring for visualization (safe for undefined step)
  const getEdgeColor = (edge: Edge, step?: KruskalStep) => {
    if (!step) return '#a1a1aa'; // fallback gray
    if (step.mstEdges && step.mstEdges.includes(edge.id)) return '#22c55e'; // green
    if (step.consideredEdges && step.consideredEdges.includes(edge.id))
      return step.edge?.id === edge.id && step.cycle ? '#ef4444' : '#facc15'; // red if cycle, yellow if considered
    return '#a1a1aa'; // gray
  };

  // Node coloring for union-find
  const getNodeColor = (node: number, step?: KruskalStep) => {
    if (!step) return '#e0e7ef';
    const group = step.unionFind ? step.unionFind[node] : node;
    const palette = ['#bae6fd', '#bbf7d0', '#fef9c3', '#fca5a5', '#ddd6fe', '#fdba74', '#a7f3d0', '#fbcfe8', '#fcd34d'];
    return palette[group % palette.length];
  };

  const getCurrentMessage = () => {
    if (currentStep >= 0 && currentStep < sortSteps.length) return sortSteps[currentStep].message;
    return 'Click "Start" to begin Kruskal’s Algorithm visualization.';
  };

  const step = currentStep >= 0 ? sortSteps[currentStep] : undefined;

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900">Kruskal's Algorithm</h1>
          <p className="text-zinc-700 text-lg mt-2">
            A greedy algorithm to find the Minimum Spanning Tree (MST) by selecting edges in ascending order of weight without forming cycles.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm mt-4">
            <div className="flex items-center gap-2"><i className="bi bi-diagram-3 text-indigo-600"></i> <span>Graph Algorithm</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-clock text-indigo-600"></i> <span>O(E log E)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-gear text-indigo-600"></i> <span>Union-Find</span></div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3"><i className="bi bi-info-circle text-indigo-600"></i> How Kruskal's Algorithm Works</h4>
          <p className="text-zinc-700 leading-relaxed">
            Kruskal’s Algorithm sorts all edges by weight and adds them one by one to the spanning tree, skipping any edge that would form a cycle. Cycle detection is performed using the Union-Find (Disjoint Set) data structure.
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
            <li>Greedy approach for MST</li>
            <li>Sorts all edges by weight</li>
            <li>Uses Union-Find for cycle detection</li>
            <li>Efficient for sparse graphs</li>
          </ul>
        </div>

        {/* Step-by-Step Process */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3"><i className="bi bi-list-ol text-indigo-600"></i> Step-by-Step Process</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Algorithm Steps:</h6>
              <ol className="list-decimal list-inside text-zinc-700 space-y-1">
                <li>Sort all edges by weight</li>
                <li>Initialize each node as its own set</li>
                <li>For each edge (u, v):</li>
                <ul className="ml-6 list-disc">
                  <li>If u and v are in different sets, add edge to MST and union their sets</li>
                  <li>If u and v are in the same set, skip edge (would form cycle)</li>
                </ul>
                <li>Repeat until MST has (V-1) edges</li>
              </ol>
            </div>
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Union-Find Visualization:</h6>
              <ol className="list-decimal list-inside text-zinc-700 space-y-1">
                <li>Each node starts in its own group</li>
                <li>When two nodes are connected, their groups merge</li>
                <li>Group colors change as sets merge</li>
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
              <svg width={400} height={400} className="bg-slate-50 rounded shadow border" style={{ maxWidth: '100%' }}>
                {/* Edges */}
                {edges.map((edge, idx) => {
                  const color = getEdgeColor(edge, step);
                  const { x: x1, y: y1 } = nodePositions[edge.u];
                  const { x: x2, y: y2 } = nodePositions[edge.v];
                  return (
                    <g key={edge.id}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={4} />
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
            <strong>Tip:</strong> Watch how edges are added and how the union-find structure merges components!
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
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(E log E)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(V)</td>
                  <td className="px-4 py-2 border border-gray-300">E = edges, V = vertices</td>
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
                <i className="bi bi-cpu text-green-600"></i> Network Design
              </h6>
              <p className="text-zinc-700 text-sm">Designing least-cost networks (e.g., roads, cables)</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-database text-green-600"></i> Clustering
              </h6>
              <p className="text-zinc-700 text-sm">Grouping data by minimum connections</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-code-square text-green-600"></i> Approximation Algorithms
              </h6>
              <p className="text-zinc-700 text-sm">Used in TSP and other graph problems</p>
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
              <li>Simple and efficient</li>
              <li>Works well with sparse graphs</li>
              <li>Easy to implement</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Requires sorting edges</li>
              <li>Not optimal for dense graphs (Prim’s is better)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kruskal;
