import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0 }
};

interface TreapNode {
  key: number;
  priority: number;
  left: TreapNode | null;
  right: TreapNode | null;
}

interface TreapStep {
  root: TreapNode | null;
  highlight: number[];
  message: string;
}

function cloneTreap(node: TreapNode | null): TreapNode | null {
  if (!node) return null;
  return {
    key: node.key,
    priority: node.priority,
    left: cloneTreap(node.left),
    right: cloneTreap(node.right)
  };
}

function rotateRight(y: TreapNode): TreapNode {
  const x = y.left!;
  const T2 = x.right;
  x.right = y;
  y.left = T2;
  return x;
}

function rotateLeft(x: TreapNode): TreapNode {
  const y = x.right!;
  const T2 = y.left;
  y.left = x;
  x.right = T2;
  return y;
}

function insertTreapSteps(root: TreapNode | null, key: number): TreapStep[] {
  const steps: TreapStep[] = [];

  function _insert(node: TreapNode | null, key: number): TreapNode {
    if (!node) {
      const newNode = { key, priority: Math.random(), left: null, right: null };
      steps.push({
        root: cloneTreap(root),
        highlight: [key],
        message: `Inserted node with key ${key} and priority ${newNode.priority.toFixed(2)}`
      });
      return newNode;
    }

    if (key < node.key) {
      node.left = _insert(node.left, key);
      if (node.left!.priority > node.priority) {
        steps.push({
          root: cloneTreap(root),
          highlight: [node.key],
          message: `Right rotation needed at node ${node.key}`
        });
        node = rotateRight(node);
        steps.push({
          root: cloneTreap(root),
          highlight: [node.key],
          message: `Performed right rotation at node ${node.key}`
        });
      }
    } else if (key > node.key) {
      node.right = _insert(node.right, key);
      if (node.right!.priority > node.priority) {
        steps.push({
          root: cloneTreap(root),
          highlight: [node.key],
          message: `Left rotation needed at node ${node.key}`
        });
        node = rotateLeft(node);
        steps.push({
          root: cloneTreap(root),
          highlight: [node.key],
          message: `Performed left rotation at node ${node.key}`
        });
      }
    } else {
      steps.push({
        root: cloneTreap(root),
        highlight: [node.key],
        message: `Key ${key} already exists, no insertion`
      });
    }
    return node;
  }

  const newRoot = _insert(root, key);
  steps.push({
    root: cloneTreap(newRoot),
    highlight: [],
    message: 'Insertion complete'
  });
  return steps;
}

function renderTreap(node: TreapNode | null, highlight: number[] = []): React.ReactNode {
  if (!node) return <div className="text-gray-400 italic">null</div>;
  return (
    <div className="flex flex-col items-center">
      <div
        className={`rounded-full border-2 px-4 py-2 mb-2 font-bold text-white ${
          highlight.includes(node.key) ? 'bg-yellow-500 border-yellow-600' : 'bg-indigo-600 border-indigo-700'
        }`}
      >
        {node.key} ({node.priority.toFixed(2)})
      </div>
      <div className="flex gap-6">
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-6 bg-indigo-400 mb-2" />
          {renderTreap(node.left, highlight)}
        </div>
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-6 bg-indigo-400 mb-2" />
          {renderTreap(node.right, highlight)}
        </div>
      </div>
    </div>
  );
}

const codeImplementations = {
  javascript: `// Treap insertion (simplified)
function insert(node, key) {
  if (!node) return { key, priority: Math.random(), left: null, right: null };
  if (key < node.key) {
    node.left = insert(node.left, key);
    if (node.left.priority > node.priority) node = rotateRight(node);
  } else if (key > node.key) {
    node.right = insert(node.right, key);
    if (node.right.priority > node.priority) node = rotateLeft(node);
  }
  return node;
}`
};

const Treap: React.FC = () => {
  const [root, setRoot] = useState<TreapNode | null>(null);
  const [steps, setSteps] = useState<TreapStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [insertValue, setInsertValue] = useState<number | ''>('');
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
      if (interval !== undefined) clearInterval(interval);
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  const handleInsert = () => {
    if (insertValue === '' || isNaN(Number(insertValue))) return;
    const val = Number(insertValue);
    const newSteps = insertTreapSteps(root, val);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
    setTimeout(() => {
      setRoot(newSteps[newSteps.length - 1].root);
    }, newSteps.length * speed);
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
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-2">Treap (Randomized BST)</h1>
          <p className="text-zinc-600 text-lg mb-4">
            A Treap is a randomized balanced binary search tree combining BST and heap properties. Nodes are ordered by keys and heap priorities.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-tree text-indigo-600"></i>
              <span>Binary Search Tree property</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-lightning text-indigo-600"></i>
              <span>Heap property on priorities</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-shuffle text-indigo-600"></i>
              <span>Randomized balancing</span>
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-info-circle text-indigo-600"></i> What is a Treap?
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            Treaps maintain BST ordering by keys and heap ordering by randomly assigned priorities. They perform rotations to maintain heap property, ensuring balanced trees with high probability.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <pre>{codeImplementations.javascript}</pre>
          </div>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3">
            <i className="bi bi-list-check text-indigo-600"></i> Key Features
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>Maintains BST and heap properties</li>
            <li>Randomized balancing</li>
            <li>Expected O(log n) insert/search/delete</li>
            <li>Uses rotations to maintain heap property</li>
          </ul>
        </motion.div>

        {/* Interactive Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo: Treap
          </h5>
          <div className="mb-4 flex flex-col md:flex-row gap-3">
            <input
              type="number"
              value={insertValue}
              onChange={e => setInsertValue(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-24 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Key"
            />
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
              onClick={handleInsert}
            >
              Insert
            </button>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
              onClick={() => setIsPlaying(p => !p)}
              disabled={steps.length <= 1}
            >
              <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
              onClick={handleReset}
            >
              <i className="bi bi-arrow-counterclockwise"></i> Reset
            </button>
            <button
              className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
              onClick={handleStepBackward}
              disabled={currentStep <= 0}
            >
              <i className="bi bi-skip-backward-fill"></i>
            </button>
            <button
              className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
              onClick={handleStepForward}
              disabled={currentStep >= steps.length - 1}
            >
              <i className="bi bi-skip-forward-fill"></i>
            </button>
          </div>
          <div className="mb-4 overflow-x-auto">
            {renderTreap(step ? step.root : root, step ? step.highlight : [])}
          </div>
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-2 rounded border-2 border-indigo-400 bg-indigo-50 px-4 py-2 text-indigo-700 font-semibold shadow">
              <i className="bi bi-chat-text"></i>
              {step ? step.message : 'Ready for operation'}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Insert keys to see randomized priorities and rotations!
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
                  <td className="px-4 py-2 border border-gray-300">Insert/Search/Delete</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(log n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(n)</td>
                  <td className="px-4 py-2 border border-gray-300">Randomized balancing</td>
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
                <i className="bi bi-shuffle text-indigo-600"></i> Balanced BST Alternative
              </h6>
              <p className="text-zinc-700 text-sm">Randomized balancing without strict rotations.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-lightning-charge text-indigo-600"></i> Fast Insert/Search
              </h6>
              <p className="text-zinc-700 text-sm">Expected O(log n) operations.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-gear text-indigo-600"></i> Used in Advanced Algorithms
              </h6>
              <p className="text-zinc-700 text-sm">Useful in randomized data structures and algorithms.</p>
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
              <li>Simple randomized balancing</li>
              <li>Expected O(log n) operations</li>
              <li>Combines BST and heap properties</li>
              <li>Good average-case performance</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Randomness means no worst-case guarantees</li>
              <li>More complex than simple BSTs</li>
              <li>Requires rotations for balancing</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Treap;
