import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

interface SegmentTreeNode {
  index: number;
  start: number;
  end: number;
  value: number;
  left?: SegmentTreeNode;
  right?: SegmentTreeNode;
  x?: number;
  y?: number;
}

function buildSegmentTree(arr: number[], start: number, end: number, index = 0): SegmentTreeNode {
  if (start === end) {
    return { index, start, end, value: arr[start] };
  }
  const mid = Math.floor((start + end) / 2);
  const left = buildSegmentTree(arr, start, mid, 2 * index + 1);
  const right = buildSegmentTree(arr, mid + 1, end, 2 * index + 2);
  return {
    index,
    start,
    end,
    value: left.value + right.value,
    left,
    right
  };
}

function layoutTree(
  node: SegmentTreeNode | undefined,
  depth: number,
  xMin: number,
  xMax: number,
  yStep: number
) {
  if (!node) return;
  node.x = (xMin + xMax) / 2;
  node.y = depth * yStep + 60;
  if (node.left) layoutTree(node.left, depth + 1, xMin, node.x, yStep);
  if (node.right) layoutTree(node.right, depth + 1, node.x, xMax, yStep);
}

const SegmentTree: React.FC = () => {
  const [array, setArray] = useState<number[]>([1, 3, 5, 7, 9, 11]);
  const [root, setRoot] = useState<SegmentTreeNode | undefined>();
  const [queryStart, setQueryStart] = useState<string>('');
  const [queryEnd, setQueryEnd] = useState<string>('');
  const [queryResult, setQueryResult] = useState<number | null>(null);
  const [updateIndex, setUpdateIndex] = useState<string>('');
  const [updateValue, setUpdateValue] = useState<string>('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (array.length > 0) {
      const treeRoot = buildSegmentTree(array, 0, array.length - 1);
      layoutTree(treeRoot, 0, 60, 940, 90);
      setRoot(treeRoot);
      setQueryResult(null);
      setMessage('');
    } else {
      setRoot(undefined);
    }
  }, [array]);

  // Query sum in range [qs, qe]
  const querySum = (
    node: SegmentTreeNode | undefined,
    qs: number,
    qe: number
  ): number => {
    if (!node || qs > node.end || qe < node.start) return 0;
    if (qs <= node.start && qe >= node.end) return node.value;
    return (
      querySum(node.left, qs, qe) + querySum(node.right, qs, qe)
    );
  };

  // Update value at index idx to val
  const updateValueAtIndex = (
    node: SegmentTreeNode | undefined,
    idx: number,
    val: number
  ): number => {
    if (!node) return 0;
    if (node.start === node.end && node.start === idx) {
      node.value = val;
      return val;
    }
    if (idx < node.start || idx > node.end) return node.value;
    const leftVal = updateValueAtIndex(node.left, idx, val);
    const rightVal = updateValueAtIndex(node.right, idx, val);
    node.value = leftVal + rightVal;
    return node.value;
  };

  // Handle query button
  const handleQuery = () => {
    const qs = Number(queryStart);
    const qe = Number(queryEnd);
    if (
      isNaN(qs) ||
      isNaN(qe) ||
      qs < 0 ||
      qe >= array.length ||
      qs > qe
    ) {
      setMessage('Invalid query range.');
      setQueryResult(null);
      return;
    }
    if (!root) return;
    const res = querySum(root, qs, qe);
    setQueryResult(res);
    setMessage(`Sum of range [${qs}, ${qe}] is ${res}`);
  };

  // Handle update button
  const handleUpdate = () => {
    const idx = Number(updateIndex);
    const val = Number(updateValue);
    if (
      isNaN(idx) ||
      isNaN(val) ||
      idx < 0 ||
      idx >= array.length
    ) {
      setMessage('Invalid update input.');
      return;
    }
    const newArr = [...array];
    newArr[idx] = val;
    setArray(newArr);
    setUpdateIndex('');
    setUpdateValue('');
    setMessage(`Updated index ${idx} to ${val}`);
  };

  // Flatten tree for rendering nodes
  const flattenTree = (node: SegmentTreeNode | undefined): SegmentTreeNode[] => {
    if (!node) return [];
    return [node, ...flattenTree(node.left), ...flattenTree(node.right)];
  };

  const nodes = flattenTree(root);

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-2">Segment Tree</h1>
          <p className="text-zinc-600 text-lg mb-4">
            A Segment Tree is a binary tree data structure that efficiently supports range queries and updates on arrays.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-diagram-2 text-indigo-600"></i>
              <span>Range Queries</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-arrow-repeat text-indigo-600"></i>
              <span>Efficient Updates</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-lightning text-indigo-600"></i>
              <span>O(log n) Operations</span>
            </div>
          </div>
        </motion.div>

        {/* What is a Segment Tree */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-info-circle text-indigo-600"></i>
            What is a Segment Tree?
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            A segment tree is a binary tree that allows efficient range queries and updates on an array. Each node represents a segment (interval) of the array, and stores information (like sum, min, max) about that segment. Segment trees are widely used for problems involving range queries and modifications.<br />
            <span className="text-zinc-400">// Example structure for sum queries</span>
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <pre>
{`// Build segment tree for sum
function build(arr, l, r) {
  if (l === r) return { l, r, sum: arr[l] };
  let m = Math.floor((l + r) / 2);
  let left = build(arr, l, m);
  let right = build(arr, m+1, r);
  return { l, r, sum: left.sum + right.sum, left, right };
}`}
            </pre>
          </div>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-list-check"></i>
            Key Features
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>Efficient range queries and updates</li>
            <li>Supports sum, min, max, gcd, and more</li>
            <li>Binary tree structure</li>
            <li>Divide and conquer approach</li>
            <li>Flexible for different operations</li>
          </ul>
        </motion.div>

        {/* Interactive Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo & Visualization
          </h5>
          <div className="mb-4">
            <label className="block mb-1 text-zinc-700 font-medium">Array Elements (comma separated):</label>
            <input
              type="text"
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={array.join(',')}
              onChange={(e) => {
                const vals = e.target.value.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
                if (vals.length > 0) setArray(vals);
              }}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-3 mb-4 max-w-md">
            <input
              type="number"
              placeholder="Query start index"
              value={queryStart}
              onChange={(e) => setQueryStart(e.target.value)}
              className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min={0}
              max={array.length - 1}
            />
            <input
              type="number"
              placeholder="Query end index"
              value={queryEnd}
              onChange={(e) => setQueryEnd(e.target.value)}
              className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min={0}
              max={array.length - 1}
            />
            <button
              onClick={handleQuery}
              className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
            >
              Query Sum
            </button>
          </div>
          <div className="flex flex-col md:flex-row gap-3 mb-4 max-w-md">
            <input
              type="number"
              placeholder="Update index"
              value={updateIndex}
              onChange={(e) => setUpdateIndex(e.target.value)}
              className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min={0}
              max={array.length - 1}
            />
            <input
              type="number"
              placeholder="New value"
              value={updateValue}
              onChange={(e) => setUpdateValue(e.target.value)}
              className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
            >
              Update
            </button>
          </div>
          {message && (
            <div className="mb-4 text-indigo-700 font-semibold bg-indigo-50 px-4 py-2 rounded border border-indigo-300">
              {message}
            </div>
          )}
          <div className="rounded shadow-lg border bg-indigo-50 py-4 px-2 overflow-x-auto">
            <svg width="100%" height={Math.max(240, (nodes.length > 0 ? Math.max(...nodes.map(n => n.y || 0)) + 80 : 240))}
              viewBox={`0 0 1000 ${Math.max(240, (nodes.length > 0 ? Math.max(...nodes.map(n => n.y || 0)) + 80 : 240))}`}
            >
              {/* Edges */}
              {nodes.map((node, idx) => (
                <g key={'edges-' + idx}>
                  {node.left && (
                    <line
                      x1={node.x}
                      y1={node.y}
                      x2={node.left.x}
                      y2={node.left.y}
                      stroke="#a5b4fc"
                      strokeWidth={4}
                    />
                  )}
                  {node.right && (
                    <line
                      x1={node.x}
                      y1={node.y}
                      x2={node.right.x}
                      y2={node.right.y}
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
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={28}
                    fill="#6366f1"
                    stroke="#4f46e5"
                    strokeWidth={3}
                  />
                  <text
                    x={node.x}
                    y={node.y! + 7}
                    textAnchor="middle"
                    fontSize={18}
                    fill="#fff"
                    fontWeight={700}
                  >
                    {node.value}
                  </text>
                  <text
                    x={node.x}
                    y={node.y! + 30}
                    textAnchor="middle"
                    fontSize={12}
                    fill="#c7d2fe"
                  >
                    [{node.start}, {node.end}]
                  </text>
                </motion.g>
              ))}
            </svg>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Use range queries and updates to see the segment tree in action!
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
                  <td className="px-4 py-2 border border-gray-300">Build</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(n)</td>
                  <td className="px-4 py-2 border border-gray-300">Build the tree from array</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Query</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(log n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Range sum/min/max</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Update</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(log n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Update element value</td>
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
                <i className="bi bi-diagram-2 text-indigo-600"></i> Range Queries
              </h6>
              <p className="text-zinc-700 text-sm">Sum, min, max, gcd, etc. over intervals</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-arrow-repeat text-indigo-600"></i> Interval Problems
              </h6>
              <p className="text-zinc-700 text-sm">Dynamic interval updates and queries</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-lightning text-indigo-600"></i> Competitive Programming
              </h6>
              <p className="text-zinc-700 text-sm">Efficient solutions for coding contests</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-list-ol text-indigo-600"></i> Dynamic Arrays
              </h6>
              <p className="text-zinc-700 text-sm">Queries and updates on changing arrays</p>
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
              <li>Efficient range queries and updates (<b>O(log n)</b>)</li>
              <li>Flexible for many types of queries (sum, min, max, etc.)</li>
              <li>Can handle dynamic array modifications</li>
              <li>Supports divide-and-conquer and recursive algorithms</li>
              <li>Space-efficient compared to brute-force solutions</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Requires extra space for the tree structure (<b>O(n)</b>)</li>
              <li>More complex to implement than arrays or prefix sums</li>
              <li>Updates and queries require recursive logic</li>
              <li>Not as cache-friendly as flat arrays</li>
              <li>Less efficient for very small arrays or simple use-cases</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SegmentTree;
