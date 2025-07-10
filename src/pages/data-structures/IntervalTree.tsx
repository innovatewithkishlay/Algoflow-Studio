import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0 }
};

interface Interval {
  low: number;
  high: number;
}

interface IntervalNode {
  interval: Interval;
  max: number;
  left: IntervalNode | null;
  right: IntervalNode | null;
}

interface IntervalTreeStep {
  root: IntervalNode | null;
  highlight: Interval[];
  message: string;
  query?: Interval | null;
  found?: boolean;
}

function cloneIntervalTree(node: IntervalNode | null): IntervalNode | null {
  if (!node) return null;
  return {
    interval: { ...node.interval },
    max: node.max,
    left: cloneIntervalTree(node.left),
    right: cloneIntervalTree(node.right)
  };
}

function insertIntervalNode(root: IntervalNode | null, interval: Interval, steps: IntervalTreeStep[]): IntervalNode {
  if (!root) {
    const newNode = { interval, max: interval.high, left: null, right: null };
    steps.push({
      root: cloneIntervalTree(newNode),
      highlight: [interval],
      message: `Inserted interval [${interval.low}, ${interval.high}]`
    });
    return newNode;
  }

  if (interval.low < root.interval.low) {
    root.left = insertIntervalNode(root.left, interval, steps);
  } else {
    root.right = insertIntervalNode(root.right, interval, steps);
  }

  root.max = Math.max(root.max, interval.high);

  steps.push({
    root: cloneIntervalTree(root),
    highlight: [root.interval],
    message: `Updated node [${root.interval.low}, ${root.interval.high}] max to ${root.max}`
  });

  return root;
}

function doOverlap(i1: Interval, i2: Interval): boolean {
  return i1.low <= i2.high && i2.low <= i1.high;
}

function searchOverlap(root: IntervalNode | null, query: Interval, steps: IntervalTreeStep[]): boolean {
  if (!root) {
    steps.push({
      root: cloneIntervalTree(root),
      highlight: [],
      message: `No overlap found for [${query.low}, ${query.high}]`,
      query,
      found: false
    });
    return false;
  }

  steps.push({
    root: cloneIntervalTree(root),
    highlight: [root.interval],
    message: `Checking node [${root.interval.low}, ${root.interval.high}]`,
    query,
    found: false
  });

  if (doOverlap(root.interval, query)) {
    steps.push({
      root: cloneIntervalTree(root),
      highlight: [root.interval],
      message: `Overlap found with [${root.interval.low}, ${root.interval.high}]`,
      query,
      found: true
    });
    return true;
  }

  if (root.left && root.left.max >= query.low) {
    return searchOverlap(root.left, query, steps);
  }

  return searchOverlap(root.right, query, steps);
}

function renderIntervalTree(node: IntervalNode | null, highlight: Interval[] = []): React.ReactNode {
  if (!node) return <div className="text-gray-400 italic">null</div>;

  const isHighlighted = highlight.some(
    (iv) => iv.low === node.interval.low && iv.high === node.interval.high
  );

  return (
    <div className="flex flex-col items-center">
      <div
        className={`rounded-lg border-2 px-4 py-2 mb-2 font-semibold text-white ${
          isHighlighted ? 'bg-yellow-500 border-yellow-600' : 'bg-indigo-600 border-indigo-700'
        }`}
      >
        [{node.interval.low}, {node.interval.high}] (max: {node.max})
      </div>
      <div className="flex gap-6">
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-6 bg-indigo-400 mb-2" />
          {renderIntervalTree(node.left, highlight)}
        </div>
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-6 bg-indigo-400 mb-2" />
          {renderIntervalTree(node.right, highlight)}
        </div>
      </div>
    </div>
  );
}

const codeImplementations = {
  javascript: `// Interval Tree insertion and overlap search (simplified)
function insert(root, interval) {
  if (!root) return { interval, max: interval.high, left: null, right: null };
  if (interval.low < root.interval.low) root.left = insert(root.left, interval);
  else root.right = insert(root.right, interval);
  root.max = Math.max(root.max, interval.high);
  return root;
}

function overlapSearch(root, query) {
  if (!root) return null;
  if (doOverlap(root.interval, query)) return root.interval;
  if (root.left && root.left.max >= query.low) return overlapSearch(root.left, query);
  return overlapSearch(root.right, query);
}

function doOverlap(i1, i2) {
  return i1.low <= i2.high && i2.low <= i1.high;
}`
};

const defaultIntervals: Interval[] = [
  { low: 15, high: 20 },
  { low: 10, high: 30 },
  { low: 17, high: 19 },
  { low: 5, high: 20 },
  { low: 12, high: 15 },
  { low: 30, high: 40 }
];

const IntervalTree: React.FC = () => {
  const [root, setRoot] = useState<IntervalNode | null>(null);
  const [steps, setSteps] = useState<IntervalTreeStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [insertLow, setInsertLow] = useState<number | ''>('');
  const [insertHigh, setInsertHigh] = useState<number | ''>('');
  const [queryLow, setQueryLow] = useState<number | ''>('');
  const [queryHigh, setQueryHigh] = useState<number | ''>('');
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
    if (insertLow === '' || insertHigh === '' || insertLow > insertHigh) return;
    const stepsArr: IntervalTreeStep[] = [];
    const newRoot = insertIntervalNode(root, { low: insertLow, high: insertHigh }, stepsArr);
    setSteps(stepsArr);
    setCurrentStep(0);
    setIsPlaying(false);
    setRoot(newRoot);
  };

  const handleSearch = () => {
    if (queryLow === '' || queryHigh === '' || queryLow > queryHigh) return;
    const stepsArr: IntervalTreeStep[] = [];
    searchOverlap(root, { low: queryLow, high: queryHigh }, stepsArr);
    setSteps(stepsArr);
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-2">Interval Tree</h1>
          <p className="text-zinc-600 text-lg mb-4">
            An Interval Tree stores intervals and allows efficient querying for all intervals that overlap with a given interval.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-diagram-3 text-indigo-600"></i>
              <span>Stores intervals with max values</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-search text-indigo-600"></i>
              <span>Fast overlap queries</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-tree text-indigo-600"></i>
              <span>Balanced BST structure</span>
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-info-circle text-indigo-600"></i> What is an Interval Tree?
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            Interval Trees are balanced binary search trees that store intervals. Each node stores the maximum high endpoint in its subtree to efficiently detect overlapping intervals.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <pre>{codeImplementations.javascript}</pre>
          </div>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3">
            <i className="bi bi-list-check text-indigo-600"></i> Key Features
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>Stores intervals in BST order by low endpoint</li>
            <li>Each node stores max high endpoint in subtree</li>
            <li>Efficient overlap queries</li>
            <li>Used in computational geometry and scheduling</li>
          </ul>
        </motion.div>

        {/* Interactive Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo: Interval Tree
          </h5>
          <div className="mb-4 flex flex-col md:flex-row gap-3 flex-wrap">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={insertLow}
                onChange={e => setInsertLow(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Insert Low"
                className="w-24 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                value={insertHigh}
                onChange={e => setInsertHigh(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Insert High"
                className="w-24 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
                onClick={handleInsert}
                disabled={insertLow === '' || insertHigh === '' || insertLow > insertHigh}
              >
                Insert Interval
              </button>
            </div>
            <div className="flex gap-2 items-center mt-3 md:mt-0">
              <input
                type="number"
                value={queryLow}
                onChange={e => setQueryLow(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Query Low"
                className="w-24 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                value={queryHigh}
                onChange={e => setQueryHigh(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Query High"
                className="w-24 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                onClick={handleSearch}
                disabled={queryLow === '' || queryHigh === '' || queryLow > queryHigh}
              >
                Search Overlap
              </button>
            </div>
          </div>
          <div className="mb-4 overflow-x-auto">{renderIntervalTree(step ? step.root : root, step ? step.highlight : [])}</div>
          <div className="text-center mb-3">
            <div
              className={`inline-flex items-center gap-2 rounded border-2 px-4 py-2 font-semibold shadow ${
                step && step.found ? 'border-green-400 bg-green-50 text-green-700' : 'border-red-400 bg-red-50 text-red-700'
              }`}
            >
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
            <strong>Tip:</strong> Insert intervals and search for overlaps to see the tree update and query process!
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
                  <td className="px-4 py-2 border border-gray-300">Insert</td>
                  <td className="px-4 py-2 border border-gray-300">O(log n)</td>
                  <td className="px-4 py-2 border border-gray-300">O(n)</td>
                  <td className="px-4 py-2 border border-gray-300">Balanced BST insertion</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Overlap Search</td>
                  <td className="px-4 py-2 border border-gray-300">O(log n + k)</td>
                  <td className="px-4 py-2 border border-gray-300">O(n)</td>
                  <td className="px-4 py-2 border border-gray-300">k = number of overlapping intervals</td>
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
                <i className="bi bi-calendar-event text-indigo-600"></i> Scheduling
              </h6>
              <p className="text-zinc-700 text-sm">Detect conflicting time intervals.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-geo-alt text-indigo-600"></i> Computational Geometry
              </h6>
              <p className="text-zinc-700 text-sm">Find overlapping geometric intervals.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-file-earmark-text text-indigo-600"></i> Genome Analysis
              </h6>
              <p className="text-zinc-700 text-sm">Analyze overlapping gene regions.</p>
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
              <li>Efficient interval insertion and overlap queries</li>
              <li>Balanced BST structure with max endpoint tracking</li>
              <li>Widely applicable in many domains</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Complex to implement compared to basic BSTs</li>
              <li>Requires careful maintenance of max values</li>
              <li>Less common outside specialized applications</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default IntervalTree;
