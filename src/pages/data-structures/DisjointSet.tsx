import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

interface UFNode {
  id: number;
  parent: number;
  rank: number;
  x?: number;
  y?: number;
}

// Helper to build the forest structure for visualization
function buildForest(nodes: UFNode[]): UFNode[][] {
  const roots: UFNode[] = [];
  const nodeMap = new Map<number, UFNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));
  nodes.forEach(n => {
    if (n.parent === n.id) roots.push(n);
  });
  // For each root, collect its tree
  function collectTree(root: UFNode): UFNode[] {
    const tree: UFNode[] = [];
    function dfs(node: UFNode) {
      tree.push(node);
      nodes.forEach(child => {
        if (child.parent === node.id && child.id !== node.id) dfs(child);
      });
    }
    dfs(root);
    return tree;
  }
  return roots.map(collectTree);
}

// Layout each tree for SVG
function layoutForest(forest: UFNode[][], width: number, yStep: number) {
  const totalTrees = forest.length;
  forest.forEach((tree, tIdx) => {
    // Layout the tree horizontally in its region
    const xMin = 60 + (width / totalTrees) * tIdx;
    const xMax = xMin + width / totalTrees - 120;
    function layout(node: UFNode, depth: number, xStart: number, xEnd: number) {
      const children = tree.filter(n => n.parent === node.id && n.id !== node.id);
      node.x = (xStart + xEnd) / 2;
      node.y = depth * yStep + 60;
      if (children.length === 0) return;
      children.forEach((child, i) => {
        const cStart = xStart + ((xEnd - xStart) * i) / children.length;
        const cEnd = xStart + ((xEnd - xStart) * (i + 1)) / children.length;
        layout(child, depth + 1, cStart, cEnd);
      });
    }
    const root = tree.find(n => n.parent === n.id)!;
    layout(root, 0, xMin, xMax);
  });
}

const DisjointSet: React.FC = () => {
  const [size, setSize] = useState(7);
  const [nodes, setNodes] = useState<UFNode[]>(Array.from({ length: 7 }, (_, i) => ({ id: i, parent: i, rank: 0 })));
  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');
  const [message, setMessage] = useState('');
  const [highlight, setHighlight] = useState<number[]>([]);

  // Find with path compression (returns root)
  function find(id: number, arr: UFNode[], path: number[] = []): number {
    path.push(id);
    if (arr[id].parent !== id) {
      arr[id].parent = find(arr[id].parent, arr, path);
    }
    return arr[id].parent;
  }

  // Union by rank
  function union(a: number, b: number, arr: UFNode[]): boolean {
    const pathA: number[] = [], pathB: number[] = [];
    const rootA = find(a, arr, pathA);
    const rootB = find(b, arr, pathB);
    setHighlight([...pathA, ...pathB]);
    if (rootA === rootB) return false;
    if (arr[rootA].rank < arr[rootB].rank) {
      arr[rootA].parent = rootB;
    } else if (arr[rootB].rank < arr[rootA].rank) {
      arr[rootB].parent = rootA;
    } else {
      arr[rootB].parent = rootA;
      arr[rootA].rank++;
    }
    return true;
  }

  // Handle union
  const handleUnion = () => {
    const a = Number(inputA), b = Number(inputB);
    if (isNaN(a) || isNaN(b) || a < 0 || b < 0 || a >= nodes.length || b >= nodes.length) {
      setMessage('Invalid node IDs.');
      return;
    }
    const arrCopy = nodes.map(n => ({ ...n }));
    const merged = union(a, b, arrCopy);
    setNodes(arrCopy);
    setMessage(merged ? `Union: ${a} and ${b} merged.` : `${a} and ${b} already connected.`);
    setInputA('');
    setInputB('');
  };

  // Handle find
  const handleFind = () => {
    const a = Number(inputA), b = Number(inputB);
    if (isNaN(a) || isNaN(b) || a < 0 || b < 0 || a >= nodes.length || b >= nodes.length) {
      setMessage('Invalid node IDs.');
      return;
    }
    const arrCopy = nodes.map(n => ({ ...n }));
    const pathA: number[] = [], pathB: number[] = [];
    const rootA = find(a, arrCopy, pathA);
    const rootB = find(b, arrCopy, pathB);
    setHighlight([...pathA, ...pathB]);
    setMessage(rootA === rootB ? `${a} and ${b} are in the same set.` : `${a} and ${b} are in different sets.`);
  };

  // Reset
  const handleReset = () => {
    setNodes(Array.from({ length: size }, (_, i) => ({ id: i, parent: i, rank: 0 })));
    setHighlight([]);
    setInputA('');
    setInputB('');
    setMessage('Reset.');
  };

  // Change size
  const handleSize = (n: number) => {
    setSize(n);
    setNodes(Array.from({ length: n }, (_, i) => ({ id: i, parent: i, rank: 0 })));
    setHighlight([]);
    setInputA('');
    setInputB('');
    setMessage(`Initialized ${n} nodes.`);
  };

  // Visualization
  const forest = buildForest(nodes);
  layoutForest(forest, 1000, 90);
  const allNodes = forest.flat();

  const renderForest = () => {
    if (allNodes.length === 0) {
      return (
        <div className="flex flex-col items-center gap-2 text-zinc-400 min-h-[180px]">
          <span className="text-4xl">🌲</span>
          <p>No sets to display</p>
        </div>
      );
    }
    const height = Math.max(240, Math.max(...allNodes.map(n => n.y || 0)) + 80);
    return (
      <div className="rounded shadow-lg border bg-indigo-50 py-4 px-2">
        <svg width="100%" height={height} viewBox={`0 0 1000 ${height}`}>
          {/* Edges */}
          {allNodes.flatMap((n, idx) =>
            n.parent !== n.id ? [
              <line
                key={`edge-${idx}`}
                x1={n.x}
                y1={n.y}
                x2={allNodes[n.parent].x}
                y2={allNodes[n.parent].y}
                stroke="#a5b4fc"
                strokeWidth={4}
              />
            ] : []
          )}
          {/* Nodes */}
          {allNodes.map((n, idx) => (
            <motion.g
              key={idx}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ delay: idx * 0.05, duration: 0.5, type: "spring", stiffness: 80 }}
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={28}
                fill={
                  highlight.includes(n.id)
                    ? "#facc15"
                    : n.parent === n.id
                      ? "#6366f1"
                      : "#e0e7ef"
                }
                stroke={
                  highlight.includes(n.id)
                    ? "#facc15"
                    : n.parent === n.id
                      ? "#6366f1"
                      : "#6366f1"
                }
                strokeWidth={
                  highlight.includes(n.id)
                    ? 7
                    : n.parent === n.id
                      ? 5
                      : 3
                }
                style={{
                  filter: highlight.includes(n.id)
                    ? 'drop-shadow(0 0 8px #facc15)'
                    : n.parent === n.id
                      ? 'drop-shadow(0 0 6px #818cf8)'
                      : undefined
                }}
              />
              <text
                x={n.x}
                y={n.y! + 7}
                textAnchor="middle"
                fontSize={20}
                fill={
                  highlight.includes(n.id)
                    ? "#fff"
                    : n.parent === n.id
                      ? "#fff"
                      : "#3730a3"
                }
                fontWeight={700}
              >
                {n.id}
              </text>
              {n.parent === n.id && (
                <text
                  x={n.x! + 22}
                  y={n.y! - 22}
                  fontSize={18}
                  fill="#16a34a"
                  fontWeight={700}
                >
                  R
                </text>
              )}
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
          <h1 className="text-4xl font-extrabold text-zinc-900">Disjoint Set (Union-Find)</h1>
          <p className="text-zinc-700 text-lg mt-2">
            Partition elements into disjoint sets and efficiently support union and find operations.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm mt-4">
            <div className="flex items-center gap-2">
              <i className="bi bi-diagram-3 text-indigo-600"></i>
              <span>Dynamic Connectivity</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-lightning text-indigo-600"></i>
              <span>Union by Rank & Path Compression</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-gear text-indigo-600"></i>
              <span>Near Constant Time</span>
            </div>
          </div>
        </motion.div>

        {/* Information Section */}
        <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeUp}>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-info-circle text-indigo-600"></i>
            How Disjoint Set Works
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            Disjoint Set (Union-Find) is a data structure that keeps track of a set of elements partitioned into disjoint (non-overlapping) subsets.
            It supports two main operations: <strong>Find</strong> (determine which subset a particular element is in) and <strong>Union</strong> (merge two subsets into a single subset).
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <pre>
{`// Find with path compression
function find(x) {
  if (parent[x] !== x) {
    parent[x] = find(parent[x]);
  }
  return parent[x];
}

// Union by rank
function union(x, y) {
  let rootX = find(x);
  let rootY = find(y);
  if (rootX === rootY) return;

  if (rank[rootX] < rank[rootY]) {
    parent[rootX] = rootY;
  } else if (rank[rootY] < rank[rootX]) {
    parent[rootY] = rootX;
  } else {
    parent[rootY] = rootX;
    rank[rootX]++;
  }
}`}
            </pre>
          </div>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-list-check"></i>
            Key Concepts
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li><strong>Set Representative:</strong> The root node of each set</li>
            <li><strong>Find:</strong> Returns the representative of an element's set</li>
            <li><strong>Union:</strong> Merges two sets</li>
            <li><strong>Path Compression:</strong> Flattens the structure for efficiency</li>
            <li><strong>Union by Rank:</strong> Attaches smaller tree under larger</li>
          </ul>
        </motion.div>

        {/* Interactive Section */}
        <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeUp}>
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo & Visualization
          </h5>
          <div className="mb-3">
            <label className="block mb-2 text-zinc-700 font-medium">
              Number of Elements: <span className="font-semibold text-indigo-700">{nodes.length}</span>
            </label>
            <input
              type="number"
              min={2}
              max={20}
              value={size}
              className="w-32 rounded border border-gray-300 px-3 py-2 mr-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={e => handleSize(Number(e.target.value))}
            />
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
              onClick={() => handleSize(size)}
            >
              Reset
            </button>
          </div>
          {renderForest()}
          <div className="flex flex-col sm:flex-row gap-3 mt-3 mb-3">
            <input
              type="number"
              className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Node A"
              value={inputA}
              onChange={(e) => setInputA(e.target.value)}
            />
            <input
              type="number"
              className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Node B"
              value={inputB}
              onChange={(e) => setInputB(e.target.value)}
            />
            <button
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
              onClick={handleUnion}
              disabled={inputA === '' || inputB === ''}
            >
              <i className="bi bi-link-45deg"></i> Union
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
              onClick={handleFind}
              disabled={inputA === '' || inputB === ''}
            >
              <i className="bi bi-search"></i> Find
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
              onClick={handleReset}
            >
              <i className="bi bi-trash"></i> Clear
            </button>
          </div>
          {message && (
            <div className="mb-4 text-indigo-700 font-semibold bg-indigo-50 px-4 py-2 rounded border border-indigo-300">
              {message}
            </div>
          )}
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Union merges sets, Find checks connectivity. Roots are marked with <span className="font-bold text-green-700">R</span>.
          </div>
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
                  <td className="px-4 py-2 border border-gray-300">Find</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(α(n))</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Find set representative</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Union</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(α(n))</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Merge two sets</td>
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
                <i className="bi bi-diagram-3 text-green-600"></i> Connected Components
              </h6>
              <p className="text-zinc-700 text-sm">Find connected components in a graph</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-graph-up text-green-600"></i> Kruskal's MST
              </h6>
              <p className="text-zinc-700 text-sm">Minimum spanning tree algorithms</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-vector-pen text-green-600"></i> Image Processing
              </h6>
              <p className="text-zinc-700 text-sm">Find connected regions in images</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-link-45deg text-green-600"></i> Network Connectivity
              </h6>
              <p className="text-zinc-700 text-sm">Dynamic connectivity queries</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-shuffle text-green-600"></i> Dynamic Graphs
              </h6>
              <p className="text-zinc-700 text-sm">Efficient set merging and queries</p>
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
              <li>Efficient union/find operations</li>
              <li>Supports dynamic connectivity</li>
              <li>Simple implementation</li>
              <li>Widely used in algorithms</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Limited to connectivity queries</li>
              <li>Does not store edge information</li>
              <li>Not suitable for ordered data</li>
              <li>Visualization can be complex for large sets</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DisjointSet;
