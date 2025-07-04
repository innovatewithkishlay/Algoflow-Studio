import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

// Tree node structure for binary tree
interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x?: number;
  y?: number;
}

// Insert a value into a BST
function insertNode(root: TreeNode | null, value: number): TreeNode {
  if (!root) return { value, left: null, right: null };
  if (value < root.value) root.left = insertNode(root.left, value);
  else root.right = insertNode(root.right, value);
  return root;
}

// Build BST from array
function buildTree(arr: number[]): TreeNode | null {
  let root: TreeNode | null = null;
  for (const v of arr) root = insertNode(root, v);
  return root;
}

// Recursively assign x/y positions for tree layout
function layoutTree(
  node: TreeNode | null,
  depth: number,
  xMin: number,
  xMax: number,
  yStep: number
): void {
  if (!node) return;
  const x = (xMin + xMax) / 2;
  const y = depth * yStep + 60;
  node.x = x;
  node.y = y;
  if (node.left) layoutTree(node.left, depth + 1, xMin, x, yStep);
  if (node.right) layoutTree(node.right, depth + 1, x, xMax, yStep);
}

// Flatten tree for rendering (DFS)
function flattenTree(node: TreeNode | null): TreeNode[] {
  if (!node) return [];
  return [node, ...flattenTree(node.left), ...flattenTree(node.right)];
}

const Tree: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [treeArr, setTreeArr] = useState<number[]>([8, 4, 12, 2, 6, 10, 14]);
  const [inputValue, setInputValue] = useState<string>('');
  const [selected, setSelected] = useState<number | null>(null);

  // Build and layout the tree
  const treeRoot = buildTree(treeArr);
  if (treeRoot) layoutTree(treeRoot, 0, 60, 940, 90);
  const nodes = flattenTree(treeRoot);

  const addNode = () => {
    if (inputValue.trim() && !isNaN(Number(inputValue))) {
      setTreeArr([...treeArr, Number(inputValue)]);
      setInputValue('');
    }
  };

  const clearTree = () => {
    setTreeArr([]);
    setSelected(null);
  };

  const generateRandomTree = () => {
    const newTree = Array.from({ length: 7 }, () => Math.floor(Math.random() * 40) + 1);
    setTreeArr(newTree);
    setSelected(null);
  };

  // SVG tree visualization
  const renderTreeVisualization = () => {
    if (!treeRoot) {
      return (
        <div className="flex flex-col items-center gap-2 text-zinc-400 min-h-[180px]">
          <span className="text-4xl">🌳</span>
          <p>Tree is empty</p>
        </div>
      );
    }
    const containerClass = isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100';
    const width = 1000, height = Math.max(240, (nodes.length > 0 ? Math.max(...nodes.map(n => n.y || 0)) + 80 : 240));
    return (
      <div className={`rounded shadow-lg border ${containerClass} py-4 px-2`}>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Edges */}
          {nodes.map((node, idx) => (
            <g key={'edges-' + idx}>
              {node.left && (
                <line
                  x1={node.x} y1={node.y}
                  x2={node.left.x} y2={node.left.y}
                  stroke="#a5b4fc"
                  strokeWidth={4}
                />
              )}
              {node.right && (
                <line
                  x1={node.x} y1={node.y}
                  x2={node.right.x} y2={node.right.y}
                  stroke="#a5b4fc"
                  strokeWidth={4}
                />
              )}
            </g>
          ))}
          {/* Nodes */}
          {nodes.map((node, idx) => (
            <motion.g
              key={idx}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ delay: idx * 0.05, duration: 0.5, type: "spring", stiffness: 80 }}
              onClick={() => setSelected(node.value)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={28}
                fill={selected === node.value ? "#6366f1" : "#e0e7ef"}
                stroke="#6366f1"
                strokeWidth={selected === node.value ? 5 : 3}
                style={{ filter: selected === node.value ? 'drop-shadow(0 0 6px #818cf8)' : undefined }}
              />
              <text
                x={node.x}
                y={node.y! + 7}
                textAnchor="middle"
                fontSize={20}
                fill={selected === node.value ? "#fff" : "#3730a3"}
                fontWeight={700}
              >
                {node.value}
              </text>
            </motion.g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeUp}>
          <h1 className="text-4xl font-extrabold text-zinc-900">Tree</h1>
          <p className="text-zinc-700 text-lg mt-2">
            A hierarchical data structure consisting of nodes connected by edges
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm mt-4">
            <div className="flex items-center gap-2">
              <i className="bi bi-clock text-indigo-600"></i>
              <span>Search: O(log n)</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-plus-circle text-indigo-600"></i>
              <span>Insert: O(log n)</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-gear text-indigo-600"></i>
              <span>Space: O(n)</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-diagram-3 text-indigo-600"></i>
              <span>Hierarchical</span>
            </div>
          </div>
        </motion.div>

        {/* Information Section */}
        <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeUp}>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-info-circle text-indigo-600"></i>
            How Tree Works
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            A Tree is a hierarchical data structure that consists of nodes connected by edges.
            Each node contains a value and references to its child nodes. Trees are used to represent
            hierarchical relationships and are fundamental in computer science for organizing data.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <pre>
{`class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinaryTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new TreeNode(value);

    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          break;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          break;
        }
        current = current.right;
      }
    }
  }
}`}
            </pre>
          </div>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-list-check"></i>
            Key Concepts
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li><strong>Node:</strong> Basic unit containing data and references</li>
            <li><strong>Root:</strong> Topmost node of the tree</li>
            <li><strong>Parent:</strong> Node that has child nodes</li>
            <li><strong>Child:</strong> Node connected to a parent</li>
            <li><strong>Leaf:</strong> Node with no children</li>
            <li><strong>Height:</strong> Length of path from root to deepest leaf</li>
            <li><strong>Depth:</strong> Length of path from root to a specific node</li>
          </ul>
        </motion.div>

        {/* Types of Trees */}
        <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeUp}>
          <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
            <i className="bi bi-diagram-3"></i> Types of Trees
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="font-semibold text-zinc-900 mb-2">Binary Tree</h6>
              <p className="text-zinc-700 text-sm">
                Tree where each node has at most two children (left and right).
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="font-semibold text-zinc-900 mb-2">Binary Search Tree</h6>
              <p className="text-zinc-700 text-sm">
                Binary tree where left subtree contains nodes with values less than parent.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="font-semibold text-zinc-900 mb-2">AVL Tree</h6>
              <p className="text-zinc-700 text-sm">
                Self-balancing binary search tree with height difference constraint.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="font-semibold text-zinc-900 mb-2">Red-Black Tree</h6>
              <p className="text-zinc-700 text-sm">
                Self-balancing binary search tree with color properties.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="font-semibold text-zinc-900 mb-2">B-Tree</h6>
              <p className="text-zinc-700 text-sm">
                Self-balancing tree data structure for disk-based storage.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="font-semibold text-zinc-900 mb-2">Trie</h6>
              <p className="text-zinc-700 text-sm">
                Tree used for efficient string operations and prefix matching.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Traversal Methods */}
        <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeUp}>
          <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
            <i className="bi bi-arrow-repeat"></i> Tree Traversal Methods
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="font-semibold text-zinc-900 mb-2">Inorder (LNR)</h6>
              <p className="text-zinc-700 text-sm">
                Left → Root → Right. Produces sorted output for BST.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="font-semibold text-zinc-900 mb-2">Preorder (NLR)</h6>
              <p className="text-zinc-700 text-sm">
                Root → Left → Right. Useful for copying trees.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="font-semibold text-zinc-900 mb-2">Postorder (LRN)</h6>
              <p className="text-zinc-700 text-sm">
                Left → Right → Root. Useful for deleting trees.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Interactive Section */}
        <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeUp}>
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo & Visualization
          </h5>
          <div className="mb-3">
            <label className="block mb-2 text-zinc-700 font-medium">
              Current Tree Nodes: <span className="font-semibold text-indigo-700">{treeArr.length}</span>
            </label>
            {renderTreeVisualization()}
            {selected !== null && (
              <div className="text-center mt-2">
                <div className="inline-flex items-center gap-2 rounded border-2 border-green-600 bg-green-100 px-4 py-2 text-green-800 font-semibold shadow">
                  <i className="bi bi-check-circle"></i>
                  Selected: {selected}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <input
              type="number"
              className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter a number to add to tree"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addNode()}
            />
            <button
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
              onClick={addNode}
              disabled={!inputValue.trim() || isNaN(Number(inputValue))}
            >
              <i className="bi bi-plus-circle"></i> Add Node
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
              onClick={clearTree}
              disabled={treeArr.length === 0}
            >
              <i className="bi bi-trash"></i> Clear Tree
            </button>
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
              onClick={generateRandomTree}
            >
              <i className="bi bi-shuffle"></i> Random Tree
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Click a node to highlight it. Try adding, clearing, or randomizing!
          </div>
        </motion.div>

        {/* Memory Layout Section */}
        <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeUp}>
          <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
            <i className="bi bi-cpu"></i> Memory Layout
          </h4>
          <p className="text-zinc-700 leading-relaxed mb-4">
            Trees are hierarchical data structures where each node can have multiple children. The visualization above shows a real binary tree structure.
          </p>
        </motion.div>

        {/* Complexity Analysis */}
        <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeUp}>
          <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
            <i className="bi bi-graph-up"></i> Time & Space Complexity
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-2 border border-gray-300 text-left">Operation</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Time Complexity</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Space Complexity</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Search</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(log n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Find an element in balanced binary tree</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Insert</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(log n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Add a new node to the tree</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Delete</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(log n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Remove a node from the tree</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Traversal</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-red-200 text-red-800 rounded px-2 py-1 font-semibold">O(n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(n)</td>
                  <td className="px-4 py-2 border border-gray-300">Visit all nodes in the tree</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Use Cases */}
        <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeUp}>
          <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
            <i className="bi bi-lightning"></i> Use Cases & Applications
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-search text-green-600"></i> Binary Search Trees
              </h6>
              <p className="text-zinc-700 text-sm">Efficient searching and sorting of data</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-folder text-green-600"></i> File Systems
              </h6>
              <p className="text-zinc-700 text-sm">Organizing files and directories hierarchically</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-diagram-3 text-green-600"></i> Expression Trees
              </h6>
              <p className="text-zinc-700 text-sm">Representing mathematical expressions</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-graph-up text-green-600"></i> Decision Trees
              </h6>
              <p className="text-zinc-700 text-sm">Machine learning and decision making</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-code text-green-600"></i> Abstract Syntax Trees
              </h6>
              <p className="text-zinc-700 text-sm">Compilers and code parsing</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-hdd-network text-green-600"></i> Network Routing
              </h6>
              <p className="text-zinc-700 text-sm">Routing tables and network topology</p>
            </div>
          </div>
        </motion.div>

        {/* Advantages and Disadvantages */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
              <i className="bi bi-plus-circle"></i> Advantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Hierarchical data organization</li>
              <li>Fast search O(log n)</li>
              <li>Efficient insertion/deletion</li>
              <li>Natural data representation</li>
              <li>Supports various traversal methods</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Complex implementation</li>
              <li>Memory overhead for pointers</li>
              <li>Can become unbalanced</li>
              <li>No random access</li>
              <li>Difficult to serialize</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Tree;
