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

const SegmentTreeVisualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>([1, 3, 5, 7, 9, 11]);
  const [root, setRoot] = useState<SegmentTreeNode | undefined>();
  const [queryStart, setQueryStart] = useState<string>('');
  const [queryEnd, setQueryEnd] = useState<string>('');
  const [queryResult, setQueryResult] = useState<number | null>(null);
  const [updateIndex, setUpdateIndex] = useState<string>('');
  const [updateValue, setUpdateValue] = useState<string>('');
  const [message, setMessage] = useState('');

  // Build tree on array change
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

        {/* Interactive Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo
          </h5>

          {/* Array Input */}
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

          {/* Query Section */}
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

          {/* Update Section */}
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

          {/* Tree Visualization */}
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
        </motion.div>

        {/* Complexity Analysis */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
            <i className="bi bi-graph-up"></i> Time & Space Complexity
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>Build: <strong>O(n)</strong></li>
            <li>Query: <strong>O(log n)</strong></li>
            <li>Update: <strong>O(log n)</strong></li>
            <li>Space: <strong>O(n)</strong></li>
          </ul>
        </motion.div>

        {/* Use Cases */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
            <i className="bi bi-lightning"></i> Use Cases & Applications
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>Range sum/min/max queries</li>
            <li>Interval problems</li>
            <li>Competitive programming</li>
            <li>Dynamic array queries</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default SegmentTreeVisualizer;
