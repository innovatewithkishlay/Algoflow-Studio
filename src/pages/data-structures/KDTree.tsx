import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0 }
};

interface Point {
  x: number;
  y: number;
}

interface KDNode {
  point: Point;
  left: KDNode | null;
  right: KDNode | null;
  axis: 0 | 1; // 0 = x-axis, 1 = y-axis
}

interface KDTreeStep {
  root: KDNode | null;
  highlight: Point[];
  message: string;
  queryRange?: { xmin: number; xmax: number; ymin: number; ymax: number } | null;
  foundPoints?: Point[];
}

function cloneKDTree(node: KDNode | null): KDNode | null {
  if (!node) return null;
  return {
    point: { ...node.point },
    axis: node.axis,
    left: cloneKDTree(node.left),
    right: cloneKDTree(node.right)
  };
}

function insertKDTreeSteps(root: KDNode | null, point: Point, depth: number, steps: KDTreeStep[]): KDNode {
  if (!root) {
    const newNode = { point, left: null, right: null, axis: (depth % 2) as 0 | 1 };
    steps.push({
      root: cloneKDTree(newNode),
      highlight: [point],
      message: `Inserted point (${point.x}, ${point.y}) at depth ${depth}`
    });
    return newNode;
  }

  const axis = root.axis;
  if ((axis === 0 && point.x < root.point.x) || (axis === 1 && point.y < root.point.y)) {
    root.left = insertKDTreeSteps(root.left, point, depth + 1, steps);
  } else {
    root.right = insertKDTreeSteps(root.right, point, depth + 1, steps);
  }

  steps.push({
    root: cloneKDTree(root),
    highlight: [root.point],
    message: `At node (${root.point.x}, ${root.point.y}), axis ${axis === 0 ? 'x' : 'y'}`
  });

  return root;
}

function rangeSearchKDTree(
  root: KDNode | null,
  query: { xmin: number; xmax: number; ymin: number; ymax: number },
  steps: KDTreeStep[],
  found: Point[] = []
): Point[] {
  if (!root) {
    steps.push({
      root: null,
      highlight: [],
      message: 'Reached null node, backtracking',
      queryRange: query,
      foundPoints: [...found]
    });
    return found;
  }

  const { xmin, xmax, ymin, ymax } = query;
  const { point, axis, left, right } = root;

  steps.push({
    root: cloneKDTree(root),
    highlight: [point],
    message: `Visiting node (${point.x}, ${point.y}), axis ${axis === 0 ? 'x' : 'y'}`,
    queryRange: query,
    foundPoints: [...found]
  });

  // Check if point is inside query range
  if (point.x >= xmin && point.x <= xmax && point.y >= ymin && point.y <= ymax) {
    found.push(point);
    steps.push({
      root: cloneKDTree(root),
      highlight: [point],
      message: `Point (${point.x}, ${point.y}) is inside query range`,
      queryRange: query,
      foundPoints: [...found]
    });
  }

  // Decide whether to search left/right subtree
  if (
    (axis === 0 && xmin <= point.x) ||
    (axis === 1 && ymin <= point.y)
  ) {
    rangeSearchKDTree(left, query, steps, found);
  }
  if (
    (axis === 0 && xmax >= point.x) ||
    (axis === 1 && ymax >= point.y)
  ) {
    rangeSearchKDTree(right, query, steps, found);
  }

  return found;
}

function renderKDTree(node: KDNode | null, highlight: Point[] = [], depth = 0, xmin = 0, xmax = 100, ymin = 0, ymax = 100): React.ReactNode {
  if (!node) return <div className="text-gray-400 italic">null</div>;

  const axis = node.axis;
  const point = node.point;
  const isHighlighted = highlight.some(p => p.x === point.x && p.y === point.y);

  // Calculate splitting line coordinates for visualization
  const verticalLine = axis === 0;
  const splitLineStyle = {
    position: 'absolute' as const,
    backgroundColor: 'rgba(99, 102, 241, 0.5)', // indigo-500 with opacity
    zIndex: 0
  };

  return (
    <div className="relative flex flex-col items-center" style={{ minWidth: 120, minHeight: 120 }}>
      <div
        className={`rounded-full border-2 px-3 py-1 mb-2 font-bold text-white z-10 ${
          isHighlighted ? 'bg-yellow-400 border-yellow-600' : 'bg-indigo-600 border-indigo-700'
        }`}
      >
        ({point.x}, {point.y})
      </div>

      {/* Splitting line */}
      <div
        style={
          verticalLine
            ? { ...splitLineStyle, width: 2, height: 100, left: 60, top: 30 }
            : { ...splitLineStyle, height: 2, width: 100, top: 60, left: 30 }
        }
      />

      <div className="flex gap-6 z-10">
        <div className="flex flex-col items-center" style={{ minWidth: 120 }}>
          {renderKDTree(node.left, highlight, depth + 1, xmin, verticalLine ? point.x : xmax, ymin, verticalLine ? ymax : point.y)}
        </div>
        <div className="flex flex-col items-center" style={{ minWidth: 120 }}>
          {renderKDTree(node.right, highlight, depth + 1, verticalLine ? point.x : xmin, xmax, verticalLine ? ymin : point.y, ymax)}
        </div>
      </div>
    </div>
  );
}

const codeImplementations = {
  javascript: `// KD-Tree insertion (2D)
function insert(root, point, depth = 0) {
  if (!root) return { point, left: null, right: null, axis: depth % 2 };
  const axis = root.axis;
  if ((axis === 0 && point.x < root.point.x) || (axis === 1 && point.y < root.point.y)) {
    root.left = insert(root.left, point, depth + 1);
  } else {
    root.right = insert(root.right, point, depth + 1);
  }
  return root;
}

// Range search in KD-Tree
function rangeSearch(root, query, found = []) {
  if (!root) return found;
  const { xmin, xmax, ymin, ymax } = query;
  const { point, axis, left, right } = root;
  if (point.x >= xmin && point.x <= xmax && point.y >= ymin && point.y <= ymax) found.push(point);
  if ((axis === 0 && xmin <= point.x) || (axis === 1 && ymin <= point.y)) rangeSearch(left, query, found);
  if ((axis === 0 && xmax >= point.x) || (axis === 1 && ymax >= point.y)) rangeSearch(right, query, found);
  return found;
}`
};

const defaultPoints: Point[] = [
  { x: 30, y: 40 },
  { x: 5, y: 25 },
  { x: 70, y: 70 },
  { x: 10, y: 12 },
  { x: 50, y: 30 },
  { x: 35, y: 45 }
];

const KDTree: React.FC = () => {
  const [root, setRoot] = useState<KDNode | null>(null);
  const [steps, setSteps] = useState<KDTreeStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [insertX, setInsertX] = useState<number | ''>('');
  const [insertY, setInsertY] = useState<number | ''>('');
  const [queryXMin, setQueryXMin] = useState<number | ''>('');
  const [queryXMax, setQueryXMax] = useState<number | ''>('');
  const [queryYMin, setQueryYMin] = useState<number | ''>('');
  const [queryYMax, setQueryYMax] = useState<number | ''>('');
  const [speed] = useState<number>(1000);

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlaying && steps.length > 0 && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, speed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  const handleInsert = () => {
    if (insertX === '' || insertY === '') return;
    const newSteps: KDTreeStep[] = [];
    const newRoot = insertKDTreeSteps(root, { x: insertX, y: insertY }, 0, newSteps);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
    setRoot(newRoot);
  };

  const handleRangeSearch = () => {
    if (
      queryXMin === '' ||
      queryXMax === '' ||
      queryYMin === '' ||
      queryYMax === '' ||
      queryXMin > queryXMax ||
      queryYMin > queryYMax
    )
      return;
    const newSteps: KDTreeStep[] = [];
    rangeSearchKDTree(root, { xmin: queryXMin, xmax: queryXMax, ymin: queryYMin, ymax: queryYMax }, newSteps);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };
  const handleStepBackward = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };
  const handleReset = () => setCurrentStep(0);

  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-2">KD-Tree (2D)</h1>
          <p className="text-zinc-600 text-lg mb-4">
            A KD-Tree is a binary search tree for multidimensional points. It recursively partitions space by alternating splitting axes.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-bricks text-indigo-600"></i>
              <span>Multidimensional partitioning</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-search text-indigo-600"></i>
              <span>Range and nearest neighbor queries</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-diagram-3 text-indigo-600"></i>
              <span>Recursive space division</span>
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-info-circle text-indigo-600"></i> What is a KD-Tree?
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            KD-Trees are binary trees that recursively split k-dimensional space along alternating axes. They enable efficient multidimensional range searches and nearest neighbor queries.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <pre>{codeImplementations.javascript}</pre>
          </div>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3">
            <i className="bi bi-list-check text-indigo-600"></i> Key Features
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>Recursive partitioning of k-dimensional space</li>
            <li>Alternating splitting axes (x, y, ...)</li>
            <li>Efficient range and nearest neighbor queries</li>
            <li>Widely used in spatial databases and graphics</li>
          </ul>
        </motion.div>

        {/* Interactive Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo: KD-Tree
          </h5>
          <div className="mb-4 flex flex-wrap gap-3">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={insertX}
                onChange={e => setInsertX(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="X"
                className="w-20 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                value={insertY}
                onChange={e => setInsertY(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Y"
                className="w-20 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
                onClick={handleInsert}
                disabled={insertX === '' || insertY === ''}
              >
                Insert Point
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={queryXMin}
                onChange={e => setQueryXMin(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="X min"
                className="w-20 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                value={queryXMax}
                onChange={e => setQueryXMax(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="X max"
                className="w-20 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                value={queryYMin}
                onChange={e => setQueryYMin(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Y min"
                className="w-20 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                value={queryYMax}
                onChange={e => setQueryYMax(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Y max"
                className="w-20 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                onClick={handleRangeSearch}
                disabled={
                  queryXMin === '' ||
                  queryXMax === '' ||
                  queryYMin === '' ||
                  queryYMax === '' ||
                  queryXMin > queryXMax ||
                  queryYMin > queryYMax
                }
              >
                Range Search
              </button>
            </div>
          </div>
          <div className="overflow-x-auto mb-4">{renderKDTree(step ? step.root : root, step ? step.highlight : [])}</div>
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-2 rounded border-2 border-indigo-400 bg-indigo-50 px-4 py-2 text-indigo-700 font-semibold shadow">
              <i className="bi bi-chat-text"></i>
              {step ? step.message : 'Ready for operation'}
            </div>
          </div>
          <div className="flex gap-2 justify-center mb-6">
            <button
              className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
              onClick={handleStepBackward}
              disabled={currentStep <= 0}
            >
              <i className="bi bi-skip-backward-fill"></i> Prev
            </button>
            <button
              className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
              onClick={handleStepForward}
              disabled={currentStep >= steps.length - 1}
            >
              <i className="bi bi-skip-forward-fill"></i> Next
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
              onClick={handleReset}
            >
              <i className="bi bi-arrow-counterclockwise"></i> Reset
            </button>
            <button
              className={`bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition ${
                steps.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => setIsPlaying((p) => !p)}
              disabled={steps.length <= 1}
            >
              <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i> {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Insert points and perform range searches to explore the KD-Tree structure!
          </div>
        </motion.div>

        {/* Complexity Analysis */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
            <i className="bi bi-graph-up"></i> Time & Space Complexity
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="px-4 py-2 border border-gray-300 text-left">Operation</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Time Complexity</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Space Complexity</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Insertion</td>
                  <td className="px-4 py-2 border border-gray-300">O(log n)</td>
                  <td className="px-4 py-2 border border-gray-300">O(n)</td>
                  <td className="px-4 py-2 border border-gray-300">Balanced tree insertion</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Range Search</td>
<td className="px-4 py-2 border border-gray-300">
  O(n
  <sup>1-1/<i>k</i></sup>
  + m)
</td>
                  <td className="px-4 py-2 border border-gray-300">O(n)</td>
                  <td className="px-4 py-2 border border-gray-300">k = dimensions, m = results</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Use Cases */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
            <i className="bi bi-lightning"></i> Use Cases & Applications
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-geo-alt text-indigo-600"></i> Spatial Databases
              </h6>
              <p className="text-zinc-700 text-sm">Efficient spatial queries and indexing.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-controller text-indigo-600"></i> Computer Graphics
              </h6>
              <p className="text-zinc-700 text-sm">Nearest neighbor and collision detection.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-brush text-indigo-600"></i> Machine Learning
              </h6>
              <p className="text-zinc-700 text-sm">Clustering and classification algorithms.</p>
            </div>
          </div>
        </motion.div>

        {/* Advantages and Disadvantages */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
              <i className="bi bi-plus-circle"></i> Advantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Efficient multidimensional range queries</li>
              <li>Recursive space partitioning</li>
              <li>Widely applicable in spatial problems</li>
              <li>Supports nearest neighbor search</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Complex implementation</li>
              <li>Performance degrades with high dimensions (curse of dimensionality)</li>
              <li>Balancing can be tricky</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default KDTree;
