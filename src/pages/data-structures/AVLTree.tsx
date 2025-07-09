import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0 }
};

interface AVLNode {
  value: number;
  left: AVLNode | null;
  right: AVLNode | null;
  height: number;
}

interface AVLStep {
  tree: AVLNode | null;
  highlight: number[];
  message: string;
}

function getHeight(node: AVLNode | null): number {
  return node ? node.height : 0;
}

function updateHeight(node: AVLNode | null): void {
  if (node) node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

function rotateRight(y: AVLNode): AVLNode {
  const x = y.left!;
  y.left = x.right;
  x.right = y;
  updateHeight(y);
  updateHeight(x);
  return x;
}

function rotateLeft(x: AVLNode): AVLNode {
  const y = x.right!;
  x.right = y.left;
  y.left = x;
  updateHeight(x);
  updateHeight(y);
  return y;
}

function getBalance(node: AVLNode | null): number {
  return node ? getHeight(node.left) - getHeight(node.right) : 0;
}

function cloneTree(node: AVLNode | null): AVLNode | null {
  if (!node) return null;
  return {
    value: node.value,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
    height: node.height
  };
}

function insertAVLSteps(
  root: AVLNode | null,
  value: number
): AVLStep[] {
  const steps: AVLStep[] = [];
  function insert(node: AVLNode | null, value: number): AVLNode {
    if (!node) {
      const newNode: AVLNode = { value, left: null, right: null, height: 1 };
      steps.push({
        tree: cloneTree(newNode),
        highlight: [value],
        message: `Inserted ${value}`
      });
      return newNode;
    }
    if (value < node.value) node.left = insert(node.left, value);
    else node.right = insert(node.right, value);

    updateHeight(node);
    const balance = getBalance(node);

    // Left heavy
    if (balance > 1 && value < (node.left?.value ?? 0)) {
      steps.push({
        tree: cloneTree(node),
        highlight: [node.value],
        message: `Right rotation at ${node.value} (LL case)`
      });
      return rotateRight(node);
    }
    // Right heavy
    if (balance < -1 && value > (node.right?.value ?? 0)) {
      steps.push({
        tree: cloneTree(node),
        highlight: [node.value],
        message: `Left rotation at ${node.value} (RR case)`
      });
      return rotateLeft(node);
    }
    // Left Right
    if (balance > 1 && value > (node.left?.value ?? 0)) {
      steps.push({
        tree: cloneTree(node),
        highlight: [node.value],
        message: `Left rotation at ${node.left?.value} (LR case)`
      });
      node.left = rotateLeft(node.left!);
      steps.push({
        tree: cloneTree(node),
        highlight: [node.value],
        message: `Right rotation at ${node.value} (LR case)`
      });
      return rotateRight(node);
    }
    // Right Left
    if (balance < -1 && value < (node.right?.value ?? 0)) {
      steps.push({
        tree: cloneTree(node),
        highlight: [node.value],
        message: `Right rotation at ${node.right?.value} (RL case)`
      });
      node.right = rotateRight(node.right!);
      steps.push({
        tree: cloneTree(node),
        highlight: [node.value],
        message: `Left rotation at ${node.value} (RL case)`
      });
      return rotateLeft(node);
    }
    steps.push({
      tree: cloneTree(node),
      highlight: [node.value],
      message: `Updated height/balance at ${node.value}`
    });
    return node;
  }
  const newRoot = insert(root, value);
  steps.push({
    tree: cloneTree(newRoot),
    highlight: [],
    message: `Insertion complete`
  });
  return steps;
}

// Simple tree rendering
function renderTree(node: AVLNode | null, highlight: number[] = []): React.ReactNode {
  if (!node) return null;
  return (
    <div className="flex flex-col items-center">
      <div
        className={`rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg border-2
          ${highlight.includes(node.value) ? 'bg-yellow-200 border-yellow-500 text-indigo-900' : 'bg-indigo-100 border-indigo-300 text-indigo-700'}`}
      >
        {node.value}
      </div>
      <div className="flex gap-6 mt-2">
        {node.left && (
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-4 bg-indigo-300" />
            {renderTree(node.left, highlight)}
          </div>
        )}
        {node.right && (
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-4 bg-indigo-300" />
            {renderTree(node.right, highlight)}
          </div>
        )}
      </div>
    </div>
  );
}

const codeImplementations = {
  javascript: `// AVL Tree insert (simplified)
function insert(node, value) {
  if (!node) return { value, left: null, right: null, height: 1 };
  if (value < node.value) node.left = insert(node.left, value);
  else node.right = insert(node.right, value);

  node.height = 1 + Math.max(height(node.left), height(node.right));
  let balance = height(node.left) - height(node.right);

  // Rotations omitted for brevity
  return node;
}`
};

const defaultValues = [30, 20, 40, 10];

const AVLTree: React.FC = () => {
  const [root, setRoot] = useState<AVLNode | null>(null);
  const [values, setValues] = useState<number[]>([...defaultValues]);
  const [steps, setSteps] = useState<AVLStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [insertValue, setInsertValue] = useState<number>(0);
  const [speed] = useState<number>(1000);

  // Animation effect
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

  // Insert operation
  const handleInsert = () => {
    if (isNaN(insertValue)) return;
    const s = insertAVLSteps(root, insertValue);
    setSteps(s);
    setCurrentStep(0);
    setIsPlaying(false);
    setTimeout(() => {
      setRoot(s[s.length - 1].tree);
      setValues([...values, insertValue]);
    }, s.length * speed);
  };

  // Stepper controls
  const handleStepForward = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };
  const handleStepBackward = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };
  const handleReset = () => setCurrentStep(0);

  // Visualization
  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-2">
            AVL Tree (Self-Balancing BST)
          </h1>
          <p className="text-zinc-600 text-lg mb-4">
            An AVL Tree is a self-balancing binary search tree. It maintains balance by rotating nodes after insertions and deletions.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-diagram-2 text-indigo-600"></i>
              <span>Self-Balancing</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-arrow-repeat text-indigo-600"></i>
              <span>Rotations</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-list-ol text-indigo-600"></i>
              <span>O(log n) Operations</span>
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-info-circle text-indigo-600"></i>
            What is an AVL Tree?
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            AVL Trees automatically balance themselves using rotations, ensuring all operations remain logarithmic in time. They are a classic example of a self-balancing BST.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <pre>{codeImplementations.javascript}</pre>
          </div>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3">
            <i className="bi bi-list-check text-indigo-600"></i>
            Key Features
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>Self-balancing BST</li>
            <li>Automatic rotations</li>
            <li>O(log n) insert/search/delete</li>
            <li>Maintains height balance</li>
          </ul>
        </motion.div>

        {/* Interactive Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo: AVL Tree
          </h5>
          <div className="mb-4 flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex gap-2 items-center">
              <input
                type="number"
                value={insertValue}
                onChange={e => setInsertValue(Number(e.target.value))}
                className="w-24 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Value"
              />
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
                onClick={handleInsert}
              >
                Insert
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                onClick={() => setIsPlaying((p) => !p)}
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
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-zinc-700 font-medium">Tree Visualization:</label>
            <div className="flex justify-center">{renderTree(step ? step.tree : root, step ? step.highlight : [])}</div>
            <div className="text-center mb-3">
              <div className="inline-flex items-center gap-2 rounded border-2 border-indigo-400 bg-indigo-50 px-4 py-2 text-indigo-700 font-semibold shadow">
                <i className="bi bi-chat-text"></i>
                {step ? step.message : 'Ready for operation'}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Insert values to see automatic balancing and rotations!
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
                  <td className="px-4 py-2 border border-gray-300">Maintain balanced BST</td>
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
                <i className="bi bi-database text-indigo-600"></i> Database Indexing
              </h6>
              <p className="text-zinc-700 text-sm">Maintain sorted data with fast updates.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-search text-indigo-600"></i> Range Queries
              </h6>
              <p className="text-zinc-700 text-sm">Efficiently handle range and interval queries.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-sort-numeric-down text-indigo-600"></i> Ordered Maps/Sets
              </h6>
              <p className="text-zinc-700 text-sm">Implement ordered containers with log-time operations.</p>
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
              <li>Guaranteed log-time operations</li>
              <li>Automatic balancing</li>
              <li>Widely used in databases</li>
              <li>Simple rotations</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>More complex than plain BST</li>
              <li>Extra rotations on insert/delete</li>
              <li>Not as cache-friendly as arrays</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AVLTree;
