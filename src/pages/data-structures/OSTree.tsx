import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

interface OSTNode {
  key: number;
  size: number; // size of subtree rooted at this node
  left: OSTNode | null;
  right: OSTNode | null;
}

interface OSTStep {
  root: OSTNode | null;
  highlight: number[];
  message: string;
  queryRank?: number;
  querySelect?: number;
  result?: number | null;
}

function cloneOST(node: OSTNode | null): OSTNode | null {
  if (!node) return null;
  return {
    key: node.key,
    size: node.size,
    left: cloneOST(node.left),
    right: cloneOST(node.right)
  };
}

function insertOSTSteps(root: OSTNode | null, key: number, steps: OSTStep[]): OSTNode {
  if (!root) {
    const newNode = { key, size: 1, left: null, right: null };
    steps.push({
      root: cloneOST(newNode),
      highlight: [key],
      message: `Inserted node with key ${key}`
    });
    return newNode;
  }

  if (key < root.key) {
    root.left = insertOSTSteps(root.left, key, steps);
  } else if (key > root.key) {
    root.right = insertOSTSteps(root.right, key, steps);
  } else {
    steps.push({
      root: cloneOST(root),
      highlight: [key],
      message: `Key ${key} already exists, no insertion`
    });
    return root;
  }

  root.size = 1 + (root.left ? root.left.size : 0) + (root.right ? root.right.size : 0);
  steps.push({
    root: cloneOST(root),
    highlight: [root.key],
    message: `Updated size of node ${root.key} to ${root.size}`
  });

  return root;
}

function rankOST(root: OSTNode | null, key: number, steps: OSTStep[]): number {
  if (!root) {
    steps.push({
      root: cloneOST(root),
      highlight: [],
      message: `Key ${key} not found`,
      queryRank: key,
      result: null
    });
    return 0;
  }

  if (key === root.key) {
    const leftSize = root.left ? root.left.size : 0;
    steps.push({
      root: cloneOST(root),
      highlight: [root.key],
      message: `Found key ${key}, rank is ${leftSize + 1}`,
      queryRank: key,
      result: leftSize + 1
    });
    return leftSize + 1;
  } else if (key < root.key) {
    steps.push({
      root: cloneOST(root),
      highlight: [root.key],
      message: `Going left from node ${root.key}`,
      queryRank: key
    });
    return rankOST(root.left, key, steps);
  } else {
    const leftSize = root.left ? root.left.size : 0;
    steps.push({
      root: cloneOST(root),
      highlight: [root.key],
      message: `Going right from node ${root.key}`,
      queryRank: key
    });
    return leftSize + 1 + rankOST(root.right, key, steps);
  }
}

function selectOST(root: OSTNode | null, k: number, steps: OSTStep[]): number | null {
  if (!root) {
    steps.push({
      root: cloneOST(root),
      highlight: [],
      message: `Rank ${k} is out of bounds`,
      querySelect: k,
      result: null
    });
    return null;
  }

  const leftSize = root.left ? root.left.size : 0;

  if (k === leftSize + 1) {
    steps.push({
      root: cloneOST(root),
      highlight: [root.key],
      message: `Found node with rank ${k}: key ${root.key}`,
      querySelect: k,
      result: root.key
    });
    return root.key;
  } else if (k <= leftSize) {
    steps.push({
      root: cloneOST(root),
      highlight: [root.key],
      message: `Going left from node ${root.key}`,
      querySelect: k
    });
    return selectOST(root.left, k, steps);
  } else {
    steps.push({
      root: cloneOST(root),
      highlight: [root.key],
      message: `Going right from node ${root.key}`,
      querySelect: k
    });
    return selectOST(root.right, k - leftSize - 1, steps);
  }
}

function renderOST(node: OSTNode | null, highlight: number[] = []): React.ReactNode {
  if (!node) return <div className="text-gray-400 italic">null</div>;

  const isHighlighted = highlight.includes(node.key);

  return (
    <div className="flex flex-col items-center">
      <div
        className={`rounded-full border-2 px-4 py-2 mb-2 font-bold text-white ${
          isHighlighted ? 'bg-yellow-500 border-yellow-600' : 'bg-indigo-600 border-indigo-700'
        }`}
      >
        {node.key} (size: {node.size})
      </div>
      <div className="flex gap-6">
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-6 bg-indigo-400 mb-2" />
          {renderOST(node.left, highlight)}
        </div>
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-6 bg-indigo-400 mb-2" />
          {renderOST(node.right, highlight)}
        </div>
      </div>
    </div>
  );
}

const codeImplementations = {
  javascript: `// Order Statistic Tree insertion and queries (simplified)
function insert(node, key) {
  if (!node) return { key, size: 1, left: null, right: null };
  if (key < node.key) node.left = insert(node.left, key);
  else if (key > node.key) node.right = insert(node.right, key);
  node.size = 1 + size(node.left) + size(node.right);
  return node;
}

function rank(node, key) {
  if (!node) return 0;
  if (key === node.key) return size(node.left) + 1;
  else if (key < node.key) return rank(node.left, key);
  else return size(node.left) + 1 + rank(node.right, key);
}

function select(node, k) {
  if (!node) return null;
  const leftSize = size(node.left);
  if (k === leftSize + 1) return node.key;
  else if (k <= leftSize) return select(node.left, k);
  else return select(node.right, k - leftSize - 1);
}

function size(node) {
  return node ? node.size : 0;
}`
};

const OSTree: React.FC = () => {
  const [root, setRoot] = useState<OSTNode | null>(null);
  const [steps, setSteps] = useState<OSTStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [insertValue, setInsertValue] = useState<number | ''>('');
  const [queryRankKey, setQueryRankKey] = useState<number | ''>('');
  const [querySelectK, setQuerySelectK] = useState<number | ''>('');
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
    if (insertValue === '' || isNaN(Number(insertValue))) return;
    const val = Number(insertValue);
    const newSteps: OSTStep[] = [];
    const newRoot = insertOSTSteps(root, val, newSteps);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
    setRoot(newRoot);
  };

  const handleRankQuery = () => {
    if (queryRankKey === '' || isNaN(Number(queryRankKey))) return;
    const val = Number(queryRankKey);
    const newSteps: OSTStep[] = [];
    rankOST(root, val, newSteps);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleSelectQuery = () => {
    if (querySelectK === '' || isNaN(Number(querySelectK))) return;
    const k = Number(querySelectK);
    const newSteps: OSTStep[] = [];
    selectOST(root, k, newSteps);
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
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-2">Order Statistic Tree</h1>
          <p className="text-zinc-600 text-lg mb-4">
            An Order Statistic Tree is a binary search tree augmented with subtree sizes to support rank and select operations efficiently.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-sort-numeric-down text-indigo-600"></i>
              <span>Supports rank and select queries</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-tree text-indigo-600"></i>
              <span>Augmented BST with subtree sizes</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-speedometer2 text-indigo-600"></i>
              <span>O(log n) query and update time</span>
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-info-circle text-indigo-600"></i> What is an Order Statistic Tree?
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            This data structure augments a binary search tree by storing the size of each node’s subtree. This allows efficient computation of the rank of a key and selection of the k-th smallest key.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <pre>{codeImplementations.javascript}</pre>
          </div>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3">
            <i className="bi bi-list-check text-indigo-600"></i> Key Features
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>Augmented BST with subtree sizes</li>
            <li>Supports rank (order) queries</li>
            <li>Supports select (k-th smallest) queries</li>
            <li>All operations in O(log n) time</li>
          </ul>
        </motion.div>

        {/* Interactive Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo: Order Statistic Tree
          </h5>
          <div className="mb-4 flex flex-wrap gap-3">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={insertValue}
                onChange={e => setInsertValue(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Insert key"
                className="w-24 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
                onClick={handleInsert}
                disabled={insertValue === ''}
              >
                Insert
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={queryRankKey}
                onChange={e => setQueryRankKey(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Rank of key"
                className="w-24 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                onClick={handleRankQuery}
                disabled={queryRankKey === ''}
              >
                Query Rank
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={querySelectK}
                onChange={e => setQuerySelectK(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Select k-th"
                className="w-24 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                onClick={handleSelectQuery}
                disabled={querySelectK === ''}
              >
                Query Select
              </button>
            </div>
          </div>
          <div className="mb-4 overflow-x-auto">{renderOST(step ? step.root : root, step ? step.highlight : [])}</div>
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
                  <td className="px-4 py-2 border border-gray-300">Augmented BST insertion</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Rank Query</td>
                  <td className="px-4 py-2 border border-gray-300">O(log n)</td>
                  <td className="px-4 py-2 border border-gray-300">O(n)</td>
                  <td className="px-4 py-2 border border-gray-300">Find rank of a key</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Select Query</td>
                  <td className="px-4 py-2 border border-gray-300">O(log n)</td>
                  <td className="px-4 py-2 border border-gray-300">O(n)</td>
                  <td className="px-4 py-2 border border-gray-300">Find k-th smallest key</td>
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
                <i className="bi bi-bar-chart-line text-indigo-600"></i> Statistics
              </h6>
              <p className="text-zinc-700 text-sm">Dynamic order statistics queries.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-database text-indigo-600"></i> Databases
              </h6>
              <p className="text-zinc-700 text-sm">Ranking and selection in data sets.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-graph-up-arrow text-indigo-600"></i> Competitive Programming
              </h6>
              <p className="text-zinc-700 text-sm">Efficient rank/select queries in contests.</p>
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
              <li>Supports dynamic rank and select queries</li>
              <li>Efficient O(log n) operations</li>
              <li>Augments BST with subtree sizes</li>
              <li>Widely applicable in statistics and databases</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Requires careful maintenance of subtree sizes</li>
              <li>More complex than standard BSTs</li>
              <li>Does not self-balance; performance depends on tree shape</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OSTree;
