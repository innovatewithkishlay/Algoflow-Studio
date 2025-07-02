import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

const Tree: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [treeData, setTreeData] = useState<number[]>([1, 2, 3, 4, 5]);
  const [inputValue, setInputValue] = useState<string>('');

  const addNode = () => {
    if (inputValue.trim() && !isNaN(Number(inputValue))) {
      setTreeData([...treeData, Number(inputValue)]);
      setInputValue('');
    }
  };

  const clearTree = () => {
    setTreeData([]);
  };

  const generateRandomTree = () => {
    const newTree = Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 1);
    setTreeData(newTree);
  };

  // Visualization: Flat array (for demo)
  const renderTreeVisualization = () => {
    const containerClass = isDarkMode ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-100 text-zinc-900';
    return (
      <div className={`p-4 rounded min-h-[100px] min-w-[300px] flex items-center justify-center ${containerClass}`}>
        {treeData.length === 0 ? (
          <div className="flex flex-col items-center gap-2 text-zinc-400">
            <span className="text-4xl">🌳</span>
            <p>Tree is empty</p>
          </div>
        ) : (
          <div className="flex flex-row gap-6 justify-center items-center flex-wrap">
            {treeData.map((value, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col items-center relative"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: idx * 0.08, duration: 0.5, type: "spring", stiffness: 80 }}
                whileHover={{ scale: 1.07, boxShadow: '0 8px 20px rgba(0,0,0,0.12)' }}
              >
                <div
                  className={`border-4 rounded-full flex justify-center items-center font-semibold text-xl w-12 h-12 cursor-pointer transition ${
                    isDarkMode
                      ? 'border-indigo-500 bg-indigo-600 text-white'
                      : 'border-indigo-600 bg-indigo-500 text-white'
                  }`}
                >
                  {value}
                </div>
                <div className="text-xs text-indigo-500 mt-1 font-semibold">Node {idx}</div>
              </motion.div>
            ))}
          </div>
        )}
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
              Current Tree Nodes: <span className="font-semibold text-indigo-700">{treeData.length}</span>
            </label>
            {renderTreeVisualization()}
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
              disabled={treeData.length === 0}
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
            <strong>Tip:</strong> Add nodes to see how the tree structure is built.
          </div>
        </motion.div>

        {/* Memory Layout Section */}
        <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeUp}>
          <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
            <i className="bi bi-cpu"></i> Memory Layout
          </h4>
          <p className="text-zinc-700 leading-relaxed mb-4">
            Trees are hierarchical data structures where each node can have multiple children. The visualization below shows the current tree nodes as a flat array (for demo purposes).
          </p>
          {renderTreeVisualization()}
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
