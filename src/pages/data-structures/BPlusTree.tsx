import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0 }
};

interface BPlusTreeNode {
  keys: number[];
  children: BPlusTreeNode[];
  leaf: boolean;
  next?: BPlusTreeNode | null; // For leaf chaining
}

interface BPlusTreeStep {
  tree: BPlusTreeNode;
  highlight: number[];
  message: string;
}

const ORDER = 3; // B+ Tree of order 3 (max 2 keys per node)

function cloneTree(node: BPlusTreeNode): BPlusTreeNode {
  return {
    keys: [...node.keys],
    leaf: node.leaf,
    children: node.children.map(cloneTree),
    next: node.next ? cloneTree(node.next) : undefined,
  };
}

// Insert with step logging (simplified for visualization)
function insertBPlusTreeSteps(root: BPlusTreeNode, value: number): BPlusTreeStep[] {
  const steps: BPlusTreeStep[] = [];
  function splitChild(parent: BPlusTreeNode, i: number) {
    const y = parent.children[i];
    const z: BPlusTreeNode = { keys: [], children: [], leaf: y.leaf, next: null };
    z.keys = y.keys.splice(ORDER, ORDER - 1);
    if (!y.leaf) z.children = y.children.splice(ORDER, ORDER);
    if (y.leaf) {
      z.next = y.next || null;
      y.next = z;
    }
    parent.children.splice(i + 1, 0, z);
    parent.keys.splice(i, 0, y.keys.pop()!);
    steps.push({
      tree: cloneTree(root),
      highlight: [],
      message: `Split child node at index ${i}`
    });
  }
  function insertNonFull(node: BPlusTreeNode, value: number) {
    let i = node.keys.length - 1;
    if (node.leaf) {
      node.keys.push(value);
      node.keys.sort((a, b) => a - b);
      steps.push({
        tree: cloneTree(root),
        highlight: [value],
        message: `Inserted ${value} in leaf node`
      });
    } else {
      while (i >= 0 && value < node.keys[i]) i--;
      i++;
      if (node.children[i].keys.length === 2 * ORDER - 1) {
        splitChild(node, i);
        if (value > node.keys[i]) i++;
      }
      insertNonFull(node.children[i], value);
    }
  }
  if (root.keys.length === 2 * ORDER - 1) {
    const s: BPlusTreeNode = { keys: [], children: [root], leaf: false };
    splitChild(s, 0);
    insertNonFull(s, value);
    steps.push({
      tree: cloneTree(s),
      highlight: [],
      message: `Root was split`
    });
    return steps;
  } else {
    insertNonFull(root, value);
    steps.push({
      tree: cloneTree(root),
      highlight: [],
      message: `Insertion complete`
    });
    return steps;
  }
}

function renderBPlusTree(node: BPlusTreeNode, highlight: number[] = []): React.ReactNode {
  if (!node) return null;
  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2 mb-2">
        {node.keys.map((key, i) => (
          <div
            key={i}
            className={`rounded px-3 py-2 font-bold border-2 text-lg
              ${highlight.includes(key) ? 'bg-yellow-200 border-yellow-500 text-indigo-900' : 'bg-indigo-100 border-indigo-300 text-indigo-700'}`}
          >
            {key}
          </div>
        ))}
      </div>
      <div className="flex gap-6">
        {node.children.map((child, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-0.5 h-4 bg-indigo-300" />
            {renderBPlusTree(child, highlight)}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderLeafChain(node: BPlusTreeNode) {
  // Find leftmost leaf
  let curr = node;
  while (!curr.leaf) curr = curr.children[0];
  const leaves: BPlusTreeNode[] = [];
  while (curr) {
    leaves.push(curr);
    curr = curr.next!;
  }
  return (
    <div className="flex gap-2 mt-4 items-center">
      {leaves.map((leaf, idx) => (
        <div key={idx} className="flex gap-1 items-center">
          <div className="flex gap-1">
            {leaf.keys.map((k, i) => (
              <div key={i} className="rounded px-2 py-1 bg-indigo-200 border border-indigo-400 text-indigo-900 font-bold">{k}</div>
            ))}
          </div>
          {idx < leaves.length - 1 && <span className="text-indigo-400 text-2xl">→</span>}
        </div>
      ))}
    </div>
  );
}

const codeImplementations = {
  javascript: `// B+ Tree insert (simplified)
function insert(node, value) {
  // If node is full, split and promote median
  // Otherwise, insert in non-full node
  // Leaf nodes are linked for fast range queries
  // Full logic omitted for brevity
}`
};

const defaultRoot: BPlusTreeNode = {
  keys: [10, 20],
  children: [],
  leaf: true,
  next: null
};

const BPlusTree: React.FC = () => {
  const [root, setRoot] = useState<BPlusTreeNode>(JSON.parse(JSON.stringify(defaultRoot)));
  const [steps, setSteps] = useState<BPlusTreeStep[]>([]);
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
    const s = insertBPlusTreeSteps(root, insertValue);
    setSteps(s);
    setCurrentStep(0);
    setIsPlaying(false);
    setTimeout(() => {
      setRoot(s[s.length - 1].tree);
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
            B+ Tree (Order 3)
          </h1>
          <p className="text-zinc-600 text-lg mb-4">
            A B+ Tree is a self-balancing multi-way search tree where all data is stored in the leaves, and internal nodes only direct the search. Leaves are linked for fast range queries.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-diagram-2 text-indigo-600"></i>
              <span>Multi-way Branching</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-arrow-repeat text-indigo-600"></i>
              <span>Node Splitting</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-link-45deg text-indigo-600"></i>
              <span>Leaf Chaining</span>
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-info-circle text-indigo-600"></i>
            What is a B+ Tree?
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            B+ Trees are used for database and filesystem indexing. All data is stored in the leaves, and the leaves are linked for efficient range queries.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <pre>{codeImplementations.javascript}</pre>
          </div>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3">
            <i className="bi bi-list-check text-indigo-600"></i>
            Key Features
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>All data at leaf level</li>
            <li>Internal nodes for routing</li>
            <li>Leaves linked for fast range queries</li>
            <li>Used in databases and filesystems</li>
          </ul>
        </motion.div>

        {/* Interactive Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo: B+ Tree
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
            <div className="flex justify-center">{renderBPlusTree(step ? step.tree : root, step ? step.highlight : [])}</div>
            <div className="text-center mb-3">
              <div className="inline-flex items-center gap-2 rounded border-2 border-indigo-400 bg-indigo-50 px-4 py-2 text-indigo-700 font-semibold shadow">
                <i className="bi bi-chat-text"></i>
                {step ? step.message : 'Ready for operation'}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-zinc-700 font-medium">Leaf Chain (for range queries):</label>
            {renderLeafChain(step ? step.tree : root)}
          </div>
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Insert values to see node splits and leaf chaining in action!
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
                  <td className="px-4 py-2 border border-gray-300">Maintain balanced multi-way tree</td>
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
              <p className="text-zinc-700 text-sm">Used in SQL, NoSQL databases for fast range queries.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-file-earmark-text text-indigo-600"></i> Filesystems
              </h6>
              <p className="text-zinc-700 text-sm">Efficient storage and retrieval in file systems.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-link-45deg text-indigo-600"></i> Range Queries
              </h6>
              <p className="text-zinc-700 text-sm">Linked leaves make range queries fast.</p>
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
              <li>Efficient for disk-based storage</li>
              <li>All data at leaf level</li>
              <li>Fast range queries via leaf chaining</li>
              <li>Used in real-world databases</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>More complex than binary trees</li>
              <li>Node splitting and leaf chaining logic</li>
              <li>Not as fast for in-memory as arrays</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BPlusTree;
