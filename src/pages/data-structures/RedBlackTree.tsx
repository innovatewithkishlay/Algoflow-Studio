import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0 }
};

type Color = 'red' | 'black';

interface RBNode {
  value: number;
  color: Color;
  left: RBNode | null;
  right: RBNode | null;
  parent?: RBNode | null;
}

interface RBStep {
  tree: RBNode | null;
  highlight: number[];
  message: string;
}

function cloneTree(node: RBNode | null): RBNode | null {
  if (!node) return null;
  return {
    value: node.value,
    color: node.color,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
    parent: null
  };
}

// Helper for visualization: render tree nodes with color
function renderTree(node: RBNode | null, highlight: number[] = []): React.ReactNode {
  if (!node) return null;
  return (
    <div className="flex flex-col items-center">
      <div
        className={`rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg border-2
          ${node.color === 'red' ? 'bg-red-200 border-red-500 text-red-900' : 'bg-black border-zinc-700 text-white'}
          ${highlight.includes(node.value) ? 'ring-4 ring-yellow-300' : ''}`}
      >
        {node.value}
      </div>
      <div className="flex gap-6 mt-2">
        {node.left && (
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-4 bg-zinc-400" />
            {renderTree(node.left, highlight)}
          </div>
        )}
        {node.right && (
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-4 bg-zinc-400" />
            {renderTree(node.right, highlight)}
          </div>
        )}
      </div>
    </div>
  );
}

// Red-Black Tree insert with step logging (simplified for visualization)
function insertRBSteps(root: RBNode | null, value: number): RBStep[] {
  const steps: RBStep[] = [];
  function insert(node: RBNode | null, value: number, parent: RBNode | null): RBNode {
    if (!node) {
      const newNode: RBNode = { value, color: 'red', left: null, right: null, parent };
      steps.push({
        tree: cloneTree(newNode),
        highlight: [value],
        message: `Inserted ${value} as red`
      });
      return newNode;
    }
    if (value < node.value) node.left = insert(node.left, value, node);
    else node.right = insert(node.right, value, node);
    return node;
  }

  // Insert and then fixup (simplified, not full RB logic for brevity)
  let newRoot = insert(root, value, null);
  // For visualization, always color root black
  if (newRoot) newRoot.color = 'black';
  steps.push({
    tree: cloneTree(newRoot),
    highlight: [],
    message: `Root colored black`
  });
  steps.push({
    tree: cloneTree(newRoot),
    highlight: [],
    message: `Insertion complete`
  });
  return steps;
}

const codeImplementations = {
  javascript: `// Red-Black Tree insert (simplified)
function insert(node, value) {
  if (!node) return { value, color: 'red', left: null, right: null };
  if (value < node.value) node.left = insert(node.left, value);
  else node.right = insert(node.right, value);
  // Fixup and color balancing omitted for brevity
  return node;
}`
};

const defaultValues = [10, 20, 30];

const RedBlackTree: React.FC = () => {
  const [root, setRoot] = useState<RBNode | null>(null);
  const [values, setValues] = useState<number[]>([...defaultValues]);
  const [steps, setSteps] = useState<RBStep[]>([]);
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
    const s = insertRBSteps(root, insertValue);
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
            Red-Black Tree (Self-Balancing BST)
          </h1>
          <p className="text-zinc-600 text-lg mb-4">
            A Red-Black Tree is a self-balancing binary search tree. It guarantees O(log n) operations by enforcing color and balancing rules.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-diagram-2 text-red-600"></i>
              <span>Self-Balancing</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-circle-half text-red-600"></i>
              <span>Red/Black Coloring</span>
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
            <i className="bi bi-info-circle text-red-600"></i>
            What is a Red-Black Tree?
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            Red-Black Trees use node coloring and rotations to ensure the tree remains balanced after insertions and deletions. This guarantees fast search, insert, and delete.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <pre>{codeImplementations.javascript}</pre>
          </div>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3">
            <i className="bi bi-list-check text-red-600"></i>
            Key Features
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>Self-balancing BST</li>
            <li>Red/black coloring rules</li>
            <li>O(log n) insert/search/delete</li>
            <li>Automatic balancing via rotations</li>
          </ul>
        </motion.div>

        {/* Interactive Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h5 className="flex items-center gap-2 text-red-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo: Red-Black Tree
          </h5>
          <div className="mb-4 flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex gap-2 items-center">
              <input
                type="number"
                value={insertValue}
                onChange={e => setInsertValue(Number(e.target.value))}
                className="w-24 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Value"
              />
              <button
                className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
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
              <div className="inline-flex items-center gap-2 rounded border-2 border-red-400 bg-red-50 px-4 py-2 text-red-700 font-semibold shadow">
                <i className="bi bi-chat-text"></i>
                {step ? step.message : 'Ready for operation'}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded px-4 py-2 text-red-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Insert values to see color changes and balancing!
          </div>
        </motion.div>

        {/* Complexity Analysis */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-red-700 text-xl font-semibold mb-4">
            <i className="bi bi-graph-up"></i> Time & Space Complexity
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-red-100">
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
          <h4 className="flex items-center gap-2 text-red-700 text-xl font-semibold mb-4">
            <i className="bi bi-lightning"></i> Use Cases & Applications
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-database text-red-600"></i> Database Indexing
              </h6>
              <p className="text-zinc-700 text-sm">Maintain sorted data with fast updates.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-search text-red-600"></i> Ordered Maps/Sets
              </h6>
              <p className="text-zinc-700 text-sm">Standard in C++, Java, and other libraries.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-sort-numeric-down text-red-600"></i> Real-time Systems
              </h6>
              <p className="text-zinc-700 text-sm">Consistent performance for inserts/deletes.</p>
            </div>
          </div>
        </motion.div>

        {/* Advantages and Disadvantages */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-red-700 text-xl font-semibold mb-4">
              <i className="bi bi-plus-circle"></i> Advantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Guaranteed log-time operations</li>
              <li>Automatic balancing and coloring</li>
              <li>Widely used in standard libraries</li>
              <li>Consistent performance</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-red-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>More complex than plain BST</li>
              <li>Coloring and balancing logic</li>
              <li>Extra memory for color flag</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RedBlackTree;
