import React, { useState, useRef, useEffect } from 'react';

interface FloydStep {
  k: number;
  i: number;
  j: number;
  dist: number[][];
  prev: (number | null)[][];
  message: string;
  path: number[];
}

const codeImplementations = {
  javascript: `function floydWarshall(graph) {
  const n = graph.length;
  const dist = Array.from({ length: n }, (_, i) => [...graph[i]]);
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (dist[i][k] + dist[k][j] < dist[i][j])
          dist[i][j] = dist[i][k] + dist[k][j];
  return dist;
}`,
  python: `def floyd_warshall(graph):
    n = len(graph)
    dist = [row[:] for row in graph]
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    return dist`,
  cpp: `void floydWarshall(vector<vector<int>>& dist) {
  int n = dist.size();
  for (int k = 0; k < n; ++k)
    for (int i = 0; i < n; ++i)
      for (int j = 0; j < n; ++j)
        if (dist[i][k] + dist[k][j] < dist[i][j])
          dist[i][j] = dist[i][k] + dist[k][j];
}`,
  java: `void floydWarshall(int[][] dist) {
  int n = dist.length;
  for (int k = 0; k < n; k++)
    for (int i = 0; i < n; i++)
      for (int j = 0; j < n; j++)
        if (dist[i][k] + dist[k][j] < dist[i][j])
          dist[i][j] = dist[i][k] + dist[k][j];
}`
};

const INF = 99999;
const defaultGraph = [
  [0, 3, INF, 7],
  [8, 0, 2, INF],
  [5, INF, 0, 1],
  [2, INF, INF, 0],
];

const FloydWarshall: React.FC = () => {
  const [graph, ] = useState<number[][]>(defaultGraph);
  const [sortSteps, setSortSteps] = useState<FloydStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speed] = useState<number>(1000);
  const intervalRef = useRef<number | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<string>('javascript');

  // Generate Floyd-Warshall steps
  const generateFloydSteps = (graph: number[][]): FloydStep[] => {
    const n = graph.length;
    const dist = graph.map(row => [...row]);
    const prev: (number | null)[][] = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => (i !== j && dist[i][j] < INF ? i : null))
    );
    const steps: FloydStep[] = [];
    steps.push({
      k: -1, i: -1, j: -1, dist: dist.map(row => [...row]), prev: prev.map(row => [...row]),
      message: 'Starting Floyd-Warshall Algorithm...', path: []
    });

    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          let message = `k=${k}, i=${i}, j=${j}: `;
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            prev[i][j] = prev[k][j];
            message += `Updated dist[${i}][${j}] to ${dist[i][j]} via ${k}`;
          } else {
            message += `No update (current: ${dist[i][j]})`;
          }
          steps.push({
            k, i, j,
            dist: dist.map(row => [...row]),
            prev: prev.map(row => [...row]),
            message,
            path: [],
          });
        }
      }
    }
    steps.push({
      k: n, i: -1, j: -1, dist: dist.map(row => [...row]), prev: prev.map(row => [...row]),
      message: 'Floyd-Warshall Algorithm completed. All-pairs shortest paths found.', path: []
    });
    return steps;
  };

  useEffect(() => {
    setSortSteps(generateFloydSteps(graph));
    setCurrentStep(-1);
    setIsPlaying(false);
    setIsPaused(false);
  }, [graph]);

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

  const getCurrentMessage = () => {
    if (currentStep >= 0 && currentStep < sortSteps.length) return sortSteps[currentStep].message;
    return "Click 'Start' to begin Floyd-Warshall Algorithm visualization.";
  };

  const step = currentStep >= 0 ? sortSteps[currentStep] : undefined;

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900">Floyd-Warshall Algorithm</h1>
          <p className="text-zinc-700 text-lg mt-2">
            An efficient algorithm to find shortest paths between all pairs of nodes in a weighted graph (including negative weights, no negative cycles).
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm mt-4">
            <div className="flex items-center gap-2"><i className="bi bi-diagram-3 text-indigo-600"></i> <span>Graph Algorithm</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-clock text-indigo-600"></i> <span>O(V³)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-gear text-indigo-600"></i> <span>Dynamic Programming</span></div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3"><i className="bi bi-info-circle text-indigo-600"></i> How Floyd-Warshall Works</h4>
          <p className="text-zinc-700 leading-relaxed">
            Floyd-Warshall iteratively improves the shortest paths between all pairs of nodes by considering each node as an intermediate point.
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
            <li>Dynamic programming approach</li>
            <li>Handles negative edge weights (no negative cycles)</li>
            <li>All-pairs shortest paths</li>
            <li>O(V³) time complexity</li>
          </ul>
        </div>

        {/* Interactive Section */}
        <div className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo & Visualization
          </h5>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block mb-1 text-zinc-700 font-medium">Distance Matrix:</label>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 rounded-lg">
                  <thead className="bg-green-100">
                    <tr>
                      <th className="px-4 py-2 border border-gray-300 text-left"></th>
                      {graph.map((_, idx) => (
                        <th key={idx} className="px-4 py-2 border border-gray-300 text-left">
                          {idx}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {step &&
                      step.dist.map((row, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2 border border-gray-300 font-semibold">{i}</td>
                          {row.map((val, j) => (
                            <td
                              key={j}
                              className={`px-4 py-2 border border-gray-300 ${
                                step.k === i || step.k === j ? 'bg-yellow-100' : ''
                              }`}
                            >
                              {val === INF ? '∞' : val}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
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
            <strong>Tip:</strong> Watch how the matrix updates as each node is considered as an intermediate point!
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
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(V³)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(V²)</td>
                  <td className="px-4 py-2 border border-gray-300">V = vertices</td>
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
                <i className="bi bi-cpu text-green-600"></i> Network Routing
              </h6>
              <p className="text-zinc-700 text-sm">Optimizing all-pairs communication</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-database text-green-600"></i> Operations Research
              </h6>
              <p className="text-zinc-700 text-sm">Solving shortest path problems</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-code-square text-green-600"></i> Map Analysis
              </h6>
              <p className="text-zinc-700 text-sm">Analyzing distances between all locations</p>
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
              <li>Handles negative weights (no negative cycles)</li>
              <li>Finds all-pairs shortest paths</li>
              <li>Simple and systematic</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>O(V³) time complexity (slow for large graphs)</li>
              <li>Does not handle negative cycles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloydWarshall;
