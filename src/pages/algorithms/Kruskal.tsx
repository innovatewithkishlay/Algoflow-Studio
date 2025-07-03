import React, { useState, useEffect, useRef } from 'react';

interface Edge {
  u: number;
  v: number;
  weight: number;
  id: number;
}

interface KruskalStep {
  edgeIndex: number; // index of edge being considered
  mstEdges: number[]; // ids of edges included in MST so far
  message: string;
  unionFind: number[]; // parent array snapshot for visualization
}

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
  const [mstEdges, setMstEdges] = useState<number[]>([]);
  const [steps, setSteps] = useState<KruskalStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Union-Find (Disjoint Set) helper functions
  const find = (parent: number[], i: number): number => {
    if (parent[i] === i) return i;
    parent[i] = find(parent, parent[i]);
    return parent[i];
  };

  const union = (parent: number[], rank: number[], x: number, y: number) => {
    const xroot = find(parent, x);
    const yroot = find(parent, y);
    if (xroot !== yroot) {
      if (rank[xroot] < rank[yroot]) {
        parent[xroot] = yroot;
      } else if (rank[xroot] > rank[yroot]) {
        parent[yroot] = xroot;
      } else {
        parent[yroot] = xroot;
        rank[xroot]++;
      }
    }
  };

  // Generate steps for Kruskal's algorithm
  const generateSteps = () => {
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    const parent = Array(numVertices).fill(0).map((_, i) => i);
    const rank = Array(numVertices).fill(0);
    const mst: number[] = [];
    const stepsArr: KruskalStep[] = [];

    sortedEdges.forEach((edge, idx) => {
      const x = find(parent, edge.u);
      const y = find(parent, edge.v);

      if (x !== y) {
        mst.push(edge.id);
        union(parent, rank, x, y);
        stepsArr.push({
          edgeIndex: idx,
          mstEdges: [...mst],
          message: `Edge (${edge.u} - ${edge.v}) with weight ${edge.weight} added to MST.`,
          unionFind: [...parent],
        });
      } else {
        stepsArr.push({
          edgeIndex: idx,
          mstEdges: [...mst],
          message: `Edge (${edge.u} - ${edge.v}) with weight ${edge.weight} creates a cycle and is skipped.`,
          unionFind: [...parent],
        });
      }
    });

    stepsArr.push({
      edgeIndex: -1,
      mstEdges: [...mst],
      message: 'Minimum Spanning Tree completed.',
      unionFind: [...parent],
    });

    setSteps(stepsArr);
    setCurrentStep(-1);
    setMstEdges([]);
  };

  useEffect(() => {
    generateSteps();
  }, [edges]);

  // Animation controls
  const startAnimation = () => {
    if (currentStep >= steps.length - 1) setCurrentStep(-1);
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(intervalRef.current!);
          setIsPlaying(false);
          return prev;
        }
        setMstEdges(steps[prev + 1].mstEdges);
        return prev + 1;
      });
    }, 1500);
  };

  const pauseAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
    }
  };

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => {
        const next = prev + 1;
        setMstEdges(steps[next].mstEdges);
        return next;
      });
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => {
        const next = prev - 1;
        setMstEdges(steps[next].mstEdges);
        return next;
      });
    }
  };

  const reset = () => {
    pauseAnimation();
    generateSteps();
  };

  // Simple graph visualization (nodes and edges)
  // For brevity, here we just list edges with highlights; you can enhance with SVG or canvas.
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Kruskal's Algorithm Visualization</h1>
      <p className="mb-4">Step {currentStep + 1} of {steps.length}</p>
      <p className="mb-6 italic">{currentStep >= 0 ? steps[currentStep].message : 'Click start to begin visualization.'}</p>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Edges (sorted by weight):</h2>
        <ul>
          {edges
            .slice()
            .sort((a, b) => a.weight - b.weight)
            .map((edge, idx) => {
              const inMST = mstEdges.includes(edge.id);
              const isCurrent = currentStep >= 0 && steps[currentStep].edgeIndex === idx;
              return (
                <li
                  key={edge.id}
                  className={`p-1 rounded cursor-default ${
                    inMST ? 'bg-green-300 font-bold' : ''
                  } ${isCurrent ? 'bg-yellow-300' : ''}`}
                >
                  Edge ({edge.u} - {edge.v}) weight: {edge.weight}
                </li>
              );
            })}
        </ul>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={startAnimation}
          disabled={isPlaying}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Start
        </button>
        <button onClick={pauseAnimation} disabled={!isPlaying} className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50">
          Pause
        </button>
        <button onClick={stepBackward} disabled={currentStep <= 0} className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50">
          Step Back
        </button>
        <button onClick={stepForward} disabled={currentStep >= steps.length - 1} className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50">
          Step Forward
        </button>
        <button onClick={reset} className="bg-red-600 text-white px-4 py-2 rounded">
          Reset
        </button>
      </div>
    </div>
  );
};

export default Kruskal;
