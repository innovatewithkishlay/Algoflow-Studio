import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

function left(i: number) { return 2 * i + 1; }
function right(i: number) { return 2 * i + 2; }
function parent(i: number) { return Math.floor((i - 1) / 2); }

const Heap: React.FC = () => {
  const [heap, setHeap] = useState<number[]>([15, 12, 10, 8, 9, 5, 7]);
  const [input, setInput] = useState<string>('15,12,10,8,9,5,7');
  const [insertValue, setInsertValue] = useState<number | ''>('');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Build heap from input string
  React.useEffect(() => {
    const values = input
      .split(',')
      .map(Number)
      .filter((n) => !isNaN(n));
    setHeap(buildMaxHeap(values));
    setSelectedIdx(null);
    // eslint-disable-next-line
  }, [input]);

  // Heapify helpers
  function buildMaxHeap(arr: number[]): number[] {
    const a = [...arr];
    for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) {
      heapify(a, i, a.length);
    }
    return a;
  }

  function heapify(a: number[], i: number, n: number) {
    let largest = i;
    const l = left(i), r = right(i);
    if (l < n && a[l] > a[largest]) largest = l;
    if (r < n && a[r] > a[largest]) largest = r;
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      heapify(a, largest, n);
    }
  }

  // Insert a value into the heap
  const handleInsert = () => {
    if (insertValue === '') return;
    const a = [...heap, Number(insertValue)];
    let i = a.length - 1;
    while (i > 0 && a[parent(i)] < a[i]) {
      [a[i], a[parent(i)]] = [a[parent(i)], a[i]];
      i = parent(i);
    }
    setHeap(a);
    setInsertValue('');
  };

  // Remove max (root) from heap
  const handleRemoveMax = () => {
    if (heap.length === 0) return;
    const a = [...heap];
    a[0] = a[a.length - 1];
    a.pop();
    heapify(a, 0, a.length);
    setHeap(a);
    setSelectedIdx(null);
  };

  const handleReset = () => {
    setHeap([]);
    setSelectedIdx(null);
    setInsertValue('');
  };

  // Heap as tree visualization (simple binary tree layout)
  const renderHeapTree = () => {
    if (heap.length === 0) {
      return <div className="text-zinc-400 text-lg italic">Heap is empty</div>;
    }
    // Recursive tree rendering
    const renderNode = (idx: number, depth: number, pos: number) => {
      if (idx >= heap.length) return null;
      // Positioning for binary tree
      const leftPos = pos - 120 / (depth + 1);
      const rightPos = pos + 120 / (depth + 1);
      return (
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <motion.div
            className={`mx-auto my-2 w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold text-lg cursor-pointer
              transition ${selectedIdx === idx
                ? 'bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-300'
                : 'bg-indigo-50 border-indigo-400 text-indigo-700 hover:bg-indigo-100'
              }`}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedIdx(idx)}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: idx * 0.08, duration: 0.5, type: "spring", stiffness: 80 }}
          >
            {heap[idx]}
          </motion.div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              {left(idx) < heap.length && (
                <div style={{ position: 'relative', left: leftPos }}>
                  <div className="w-0 h-0 border-l-2 border-indigo-400 mx-auto" style={{ height: 16 }} />
                  {renderNode(left(idx), depth + 1, leftPos)}
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              {right(idx) < heap.length && (
                <div style={{ position: 'relative', left: rightPos }}>
                  <div className="w-0 h-0 border-l-2 border-indigo-400 mx-auto" style={{ height: 16 }} />
                  {renderNode(right(idx), depth + 1, rightPos)}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    };
    return <div className="flex flex-col items-center">{renderNode(0, 0, 0)}</div>;
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-2">Heap (Binary Max Heap)</h1>
          <p className="text-zinc-600 text-lg mb-4">
            A complete binary tree where each parent node is greater than or equal to its children, supporting efficient priority queue operations.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-diagram-2 text-indigo-600"></i>
              <span>Non-linear Data Structure</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-arrow-up text-indigo-600"></i>
              <span>Priority Queue</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-lightbulb text-indigo-600"></i>
              <span>Intermediate Level</span>
            </div>
          </div>
        </motion.div>

        {/* What is a Heap */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-info-circle text-indigo-600"></i>
            What is a Heap?
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            A heap is a specialized tree-based data structure that satisfies the heap property.
            In a max-heap, for any given node, the value is greater than or equal to its children.
            Heaps are commonly used to implement priority queues and in efficient sorting algorithms.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <span className="text-zinc-400">// Max Heap Example</span> <br />
            [15, 12, 10, 8, 9, 5, 7] <br />
            <span className="text-zinc-400">// 15 is the root (max), each parent ≥ its children</span>
          </div>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3">
            <i className="bi bi-list-check text-indigo-600"></i>
            Key Features
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>Complete binary tree</li>
            <li>Efficient insert and remove-max (O(log n))</li>
            <li>Used for priority queues and heap sort</li>
            <li>Parent is always ≥ children (max-heap)</li>
          </ul>
        </motion.div>

        {/* Interactive Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo & Visualization
          </h5>
          <div className="mb-4">
            <label className="block mb-1 text-zinc-700 font-medium">Heap Elements:</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter comma-separated numbers (e.g., 15,12,10,8,9,5,7)"
            />
          </div>
          <div className="mb-4 flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex gap-2">
              <input
                type="number"
                value={insertValue}
                onChange={(e) => setInsertValue(Number(e.target.value))}
                className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Value to insert"
              />
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
                onClick={handleInsert}
                disabled={insertValue === ''}
              >
                <i className="bi bi-plus-circle"></i> Insert
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
                onClick={handleRemoveMax}
                disabled={heap.length === 0}
              >
                <i className="bi bi-dash-circle"></i> Remove Max
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-zinc-700 font-medium">Current Heap:</label>
            {renderHeapTree()}
            {selectedIdx !== null && heap.length > 0 && (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 rounded border-2 border-green-600 bg-green-100 px-4 py-2 text-green-800 font-semibold shadow">
                  <i className="bi bi-check-circle"></i>
                  Selected: Index {selectedIdx} (Value: {heap[selectedIdx]})
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center mb-3">
            <button
              className="bg-zinc-200 text-zinc-700 px-4 py-2 rounded shadow hover:bg-zinc-300 transition"
              onClick={handleReset}
            >
              <i className="bi bi-trash"></i> Clear Heap
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Click on any heap node to select and highlight it.
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
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(log n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Percolate up to maintain heap</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Remove Max</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(log n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Percolate down to maintain heap</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Peek Max</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(1)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Root element access</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Search</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-red-200 text-red-800 rounded px-2 py-1 font-semibold">O(n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Linear search required</td>
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
                <i className="bi bi-arrow-up text-indigo-600"></i> Priority Queues
              </h6>
              <p className="text-zinc-700 text-sm">Efficiently manage priorities</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-sort-numeric-up text-indigo-600"></i> Heap Sort
              </h6>
              <p className="text-zinc-700 text-sm">Efficient O(n log n) sorting</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-geo-alt text-indigo-600"></i> Dijkstra/Prim's Algorithm
              </h6>
              <p className="text-zinc-700 text-sm">Graph algorithms for shortest path/MST</p>
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
              <li>Efficient priority queue operations</li>
              <li>Simple array implementation</li>
              <li>Great for scheduling and simulation</li>
              <li>Used in many algorithms</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>No efficient search for arbitrary values</li>
              <li>Not suitable for all queue types</li>
              <li>Tree structure not explicit (array-based)</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Heap;
