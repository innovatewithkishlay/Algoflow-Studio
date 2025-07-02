import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

interface Node {
  value: number;
  next: Node | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, type: 'spring', stiffness: 80 },
  }),
};

const LinkedList: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [head, setHead] = useState<Node | null>(null);
  const [input, setInput] = useState<string>('1,2,3,4,5');
  const [insertValue, setInsertValue] = useState<number | ''>('');
  const [deleteValue, setDeleteValue] = useState<number | ''>('');
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  useEffect(() => {
    const values = input
      .split(',')
      .map(Number)
      .filter((n) => !isNaN(n));
    createLinkedList(values);
    setSelectedNode(null);
    // eslint-disable-next-line
  }, [input]);

  const createLinkedList = (values: number[]) => {
    if (values.length === 0) {
      setHead(null);
      return;
    }
    const newHead: Node = { value: values[0], next: null };
    let current = newHead;
    for (let i = 1; i < values.length; i++) {
      current.next = { value: values[i], next: null };
      current = current.next;
    }
    setHead(newHead);
  };

  const insertAtBeginning = () => {
    if (insertValue === '') return;
    const newNode: Node = { value: Number(insertValue), next: head };
    setHead(newNode);
    setInsertValue('');
  };

  const insertAtEnd = () => {
    if (insertValue === '') return;
    const newNode: Node = { value: Number(insertValue), next: null };
    if (!head) {
      setHead(newNode);
    } else {
      let current = head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
      setHead({ ...head });
    }
    setInsertValue('');
  };

  const deleteNode = () => {
    if (deleteValue === '' || !head) return;
    if (head.value === Number(deleteValue)) {
      setHead(head.next);
      setDeleteValue('');
      return;
    }
    let current = head;
    while (current.next && current.next.value !== Number(deleteValue)) {
      current = current.next;
    }
    if (current.next) {
      current.next = current.next.next;
      setHead({ ...head });
    }
    setDeleteValue('');
  };

  const getListLength = () => {
    let count = 0;
    let current = head;
    while (current) {
      count++;
      current = current.next;
    }
    return count;
  };

  const getListAsArray = () => {
    const result: number[] = [];
    let current = head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  };

  const resetList = () => {
    setHead(null);
    setSelectedNode(null);
    setInsertValue('');
    setDeleteValue('');
  };

  // --- Node Visualization ---
  const renderListVisualization = () => (
    <div className="flex flex-wrap justify-center items-center gap-3 mt-2 mb-4">
      {getListAsArray().map((value, idx, arr) => (
        <React.Fragment key={idx}>
          <motion.div
            className={`rounded-lg border-2 px-6 py-3 font-bold text-lg cursor-pointer transition
              ${selectedNode === idx
                ? 'bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-300'
                : 'bg-indigo-50 border-indigo-400 text-indigo-700 hover:bg-indigo-100'
              }`}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedNode(idx)}
          >
            {value}
          </motion.div>
          {idx < arr.length - 1 && (
            <i className="bi bi-arrow-right text-2xl text-indigo-400" />
          )}
        </React.Fragment>
      ))}
      {getListAsArray().length > 0 && (
        <i className="bi bi-x-circle text-2xl text-zinc-400 ml-2" title="null/end" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-2">Linked Lists</h1>
          <p className="text-zinc-600 text-lg mb-4">
            A linear data structure where elements are stored in nodes with references to the next node, providing dynamic memory allocation.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-link-45deg text-indigo-600"></i>
              <span>Linear Data Structure</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-arrow-right text-indigo-600"></i>
              <span>Sequential Access</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-lightbulb text-indigo-600"></i>
              <span>Beginner Level</span>
            </div>
          </div>
        </motion.div>

        {/* What is a Linked List */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-info-circle text-indigo-600"></i>
            What is a Linked List?
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            A linked list is a linear data structure where each element (node) contains data and a reference to the next node.
            Unlike arrays, linked lists don't require contiguous memory allocation, making them flexible for dynamic data.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
  <span className="text-zinc-400">// Node structure</span> <br />
  struct Node {'{'} <br />
  &nbsp;&nbsp;&nbsp;&nbsp;int data; <br />
  &nbsp;&nbsp;&nbsp;&nbsp;Node* next; <br />
  {'}'};<br /><br />
  <span className="text-zinc-400">// Example: 1 -&gt; 2 -&gt; 3 -&gt; 4 -&gt; null</span> <br />
  <span className="text-zinc-400">// Each node points to the next node</span> <br />
  <span className="text-zinc-400">// Last node points to null (end of list)</span>
</div>

          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3">
            <i className="bi bi-list-check text-indigo-600"></i>
            Key Features
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>Dynamic size (grows/shrinks)</li>
            <li>Sequential access only</li>
            <li>Memory efficient</li>
            <li>Easy insertion/deletion</li>
            <li>No memory wastage</li>
          </ul>
        </motion.div>

        {/* Memory Layout */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-cpu text-indigo-600"></i>
            Memory Layout
          </h4>
          <p className="text-zinc-700 leading-relaxed mb-4">
            Unlike arrays, linked list nodes are not stored in contiguous memory locations. Each node contains data and a pointer to the next node,
            allowing for dynamic memory allocation and flexible size management.
          </p>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-[#F3F4F6] rounded-lg p-4 shadow">
              <h6 className="text-indigo-700 font-semibold mb-2">Node Structure:</h6>
              <div className="flex items-center justify-between border border-indigo-200 rounded p-2 bg-white">
                <span className="font-medium">Data: {head ? head.value : 'null'}</span>
                <span className="font-medium">Next: →</span>
              </div>
            </div>
            <div className="flex-1 bg-[#F3F4F6] rounded-lg p-4 shadow">
              <h6 className="text-green-700 font-semibold mb-2">Memory Benefits:</h6>
              <ul className="list-disc list-inside text-zinc-700 space-y-1">
                <li>No memory wastage</li>
                <li>Dynamic allocation</li>
                <li>No size limitations</li>
                <li>Efficient for insertions</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Interactive Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo & Visualization
          </h5>
          <div className="mb-4">
            <label className="block mb-1 text-zinc-700 font-medium">Linked List Elements:</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter comma-separated numbers (e.g., 1,2,3,4,5)"
            />
          </div>
          <div className="mb-4 flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex gap-2">
              <input
                type="number"
                value={insertValue}
                onChange={(e) => setInsertValue(Number(e.target.value))}
                className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter value to insert"
              />
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
                onClick={insertAtBeginning}
                disabled={insertValue === ''}
              >
                <i className="bi bi-arrow-up"></i> Insert Front
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
                onClick={insertAtEnd}
                disabled={insertValue === ''}
              >
                <i className="bi bi-arrow-down"></i> Insert End
              </button>
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="number"
                value={deleteValue}
                onChange={(e) => setDeleteValue(Number(e.target.value))}
                className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter value to delete"
              />
              <button
                className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
                onClick={deleteNode}
                disabled={deleteValue === '' || !head}
              >
                <i className="bi bi-trash"></i> Delete
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-zinc-700 font-medium">Current Linked List:</label>
            {head ? (
              <>
                {renderListVisualization()}
                <div className="text-center mb-3">
                  <div className="inline-flex items-center gap-2 rounded border-2 border-indigo-400 bg-indigo-50 px-4 py-2 text-indigo-700 font-semibold shadow">
                    <i className="bi bi-info-circle"></i>
                    List Length: {getListLength()} nodes
                  </div>
                </div>
                {selectedNode !== null && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 rounded border-2 border-green-600 bg-green-100 px-4 py-2 text-green-800 font-semibold shadow">
                      <i className="bi bi-check-circle"></i>
                      Selected: Node {selectedNode} with value {getListAsArray()[selectedNode]}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-zinc-400 py-6">
                <i className="bi bi-link-45deg text-4xl"></i>
                <p>No linked list to display</p>
                <p className="text-sm">Create a list to see the visualization</p>
              </div>
            )}
          </div>
          <div className="flex justify-center mb-3">
            <button
              className="bg-zinc-200 text-zinc-700 px-4 py-2 rounded shadow hover:bg-zinc-300 transition"
              onClick={resetList}
            >
              <i className="bi bi-trash"></i> Clear List
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Click on any node to select it and see its value.
          </div>
        </motion.div>

        {/* Complexity Analysis */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4} className="mb-8">
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
                  <td className="px-4 py-2 border border-gray-300">Access</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-red-200 text-red-800 rounded px-2 py-1 font-semibold">O(n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Sequential traversal required</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Search</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-red-200 text-red-800 rounded px-2 py-1 font-semibold">O(n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Linear search required</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Insertion (beginning)</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(1)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Direct head insertion</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Deletion (beginning)</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(1)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Direct head removal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Use Cases */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="mb-8">
          <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
            <i className="bi bi-lightning"></i> Use Cases & Applications
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-stack text-indigo-600"></i> Stack Implementation
              </h6>
              <p className="text-zinc-700 text-sm">LIFO data structure</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-arrow-left-right text-indigo-600"></i> Queue Implementation
              </h6>
              <p className="text-zinc-700 text-sm">FIFO data structure</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-arrow-counterclockwise text-indigo-600"></i> Undo Functionality
              </h6>
              <p className="text-zinc-700 text-sm">Command history</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-calculator text-indigo-600"></i> Polynomial Arithmetic
              </h6>
              <p className="text-zinc-700 text-sm">Mathematical operations</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-code text-indigo-600"></i> Memory Management
              </h6>
              <p className="text-zinc-700 text-sm">Dynamic allocation</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-link-45deg text-indigo-600"></i> Graph Representation
              </h6>
              <p className="text-zinc-700 text-sm">Adjacency lists</p>
            </div>
          </div>
        </motion.div>

        {/* Advantages and Disadvantages */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
              <i className="bi bi-plus-circle"></i> Advantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Dynamic size</li>
              <li>Efficient insertion/deletion</li>
              <li>No memory waste</li>
              <li>Flexible structure</li>
              <li>Good for frequent modifications</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>No random access</li>
              <li>Extra memory for pointers</li>
              <li>Poor cache performance</li>
              <li>Complex implementation</li>
              <li>Difficult to reverse traverse</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LinkedList;
