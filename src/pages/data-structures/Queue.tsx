import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, type: 'spring', stiffness: 80 },
  }),
};

const Queue: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [queue, setQueue] = useState<number[]>([1, 2, 3, 4, 5]);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const enqueueElement = () => {
    if (inputValue.trim() && !isNaN(Number(inputValue))) {
      setQueue([...queue, Number(inputValue)]);
      setInputValue('');
      setSelectedIndex(null);
    }
  };

  const dequeueElement = () => {
    if (queue.length > 0) {
      setQueue(queue.slice(1));
      setSelectedIndex(null);
    }
  };

  const clearQueue = () => {
    setQueue([]);
    setSelectedIndex(null);
  };

  const generateRandomQueue = () => {
    const newQueue = Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 1);
    setQueue(newQueue);
    setSelectedIndex(null);
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-2">Queue</h1>
          <p className="text-zinc-600 text-lg mb-4">
            A linear data structure that follows the First-In-First-Out (FIFO) principle.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-clock text-indigo-600"></i>
              <span>Enqueue/Dequeue: O(1)</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-search text-indigo-600"></i>
              <span>Search: O(n)</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-gear text-indigo-600"></i>
              <span>Space: O(n)</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-arrow-right text-indigo-600"></i>
              <span>FIFO</span>
            </div>
          </div>
        </motion.div>

        {/* How Queue Works */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-info-circle text-indigo-600"></i>
            How Queue Works
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            A Queue is a linear data structure that follows the First-In-First-Out (FIFO) principle.
            This means that the first element added to the queue will be the first one to be removed.
            Think of it like a line of people waiting - the first person to join the line is the first to be served.
          </p>
          <pre className="bg-[#F3F4F6] rounded-xl p-5 mt-4 font-mono text-sm text-zinc-800 overflow-x-auto shadow-sm border border-zinc-200">
{`class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items.shift();
  }

  front() {
    return this.items[0];
  }

  rear() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}`}
          </pre>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3">
            <i className="bi bi-list-check text-indigo-600"></i>
            Key Operations
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li><strong>Enqueue:</strong> Add an element to the rear of the queue</li>
            <li><strong>Dequeue:</strong> Remove and return the front element</li>
            <li><strong>Front/Peek:</strong> View the front element without removing it</li>
            <li><strong>Rear:</strong> View the rear element without removing it</li>
            <li><strong>isEmpty:</strong> Check if the queue is empty</li>
            <li><strong>Size:</strong> Get the number of elements in the queue</li>
          </ul>
        </motion.div>

        {/* Interactive Demo */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo & Visualization
          </h5>
          <div className="mb-4">
            <label htmlFor="queueInput" className="block mb-2 text-zinc-700 font-medium">Queue Elements:</label>
            <input
              id="queueInput"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enqueueElement()}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter a number to enqueue"
            />
          </div>
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={enqueueElement}
              disabled={!inputValue.trim() || isNaN(Number(inputValue))}
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition flex items-center gap-2"
            >
              <i className="bi bi-plus-circle"></i> Enqueue
            </button>
            <button
              onClick={dequeueElement}
              disabled={queue.length === 0}
              className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition flex items-center gap-2"
            >
              <i className="bi bi-dash-circle"></i> Dequeue
            </button>
            <button
              onClick={clearQueue}
              disabled={queue.length === 0}
              className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition flex items-center gap-2"
            >
              <i className="bi bi-trash"></i> Clear
            </button>
            <button
              onClick={generateRandomQueue}
              className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <i className="bi bi-shuffle"></i> Random
            </button>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-zinc-700 font-medium">Current Queue:</label>
            <div className="flex flex-row gap-3 justify-center items-center flex-wrap bg-gray-100 rounded-lg p-4">
              {queue.length === 0 ? (
                <div className="text-zinc-400 italic">Queue is empty</div>
              ) : (
                queue.map((value, idx) => (
                  <motion.div
                    key={idx}
                    className={`cursor-pointer rounded border-2 px-6 py-3 font-bold text-lg select-none transition-shadow duration-300 ease-in-out ${
                      idx === 0
                        ? 'bg-green-600 border-green-600 text-white ring-4 ring-green-300'
                        : 'bg-green-50 border-green-400 text-green-700 hover:bg-green-100'
                    }`}
                    onClick={() => setSelectedIndex(idx)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {value}
                  </motion.div>
                ))
              )}
            </div>
          </div>
          {selectedIndex !== null && queue[selectedIndex] !== undefined && (
            <motion.div
              className="mt-4 inline-flex items-center gap-2 rounded border-2 border-green-600 bg-green-100 px-4 py-2 text-green-800 font-semibold shadow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <i className="bi bi-info-circle"></i>
              Selected: Queue[{selectedIndex}] = {queue[selectedIndex]}
              <button
                className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setSelectedIndex(null)}
              >
                Reset
              </button>
            </motion.div>
          )}
          <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded px-4 py-2 text-green-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Enqueue and dequeue elements to see how the FIFO principle works.
          </div>
        </motion.div>

        {/* Types of Queues */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="mb-8">
          <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
            <i className="bi bi-diagram-3"></i> Types of Queues
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="font-semibold text-zinc-900 mb-2">Simple Queue</h6>
              <p className="text-zinc-700 text-sm">
                Basic FIFO queue where elements are added at the rear and removed from the front.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="font-semibold text-zinc-900 mb-2">Circular Queue</h6>
              <p className="text-zinc-700 text-sm">
                Queue where the last element points to the first element, making efficient use of space.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="font-semibold text-zinc-900 mb-2">Priority Queue</h6>
              <p className="text-zinc-700 text-sm">
                Queue where elements are dequeued based on their priority rather than arrival order.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="font-semibold text-zinc-900 mb-2">Double-ended Queue (Deque)</h6>
              <p className="text-zinc-700 text-sm">
                Queue that allows insertion and deletion from both ends.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Implementation Examples */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4} className="mb-8">
          <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
            <i className="bi bi-code-slash"></i> Common Implementations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Array-based Implementation:</h6>
              <pre className="bg-[#F3F4F6] rounded-xl p-5 font-mono text-sm text-zinc-800 overflow-x-auto shadow-sm border border-zinc-200">
{`// Using JavaScript Array
const queue = [];
queue.push(1);     // Enqueue
queue.shift();     // Dequeue
queue[0];          // Front
queue[queue.length - 1]; // Rear`}
              </pre>
            </div>
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Linked List Implementation:</h6>
              <pre className="bg-[#F3F4F6] rounded-xl p-5 font-mono text-sm text-zinc-800 overflow-x-auto shadow-sm border border-zinc-200">
{`// Using Linked List
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

// Enqueue: Add to tail
// Dequeue: Remove from head
// Front: Return head data`}
              </pre>
            </div>
          </div>
        </motion.div>

        {/* Complexity Analysis */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="mb-8">
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
                  <td className="px-4 py-2 border border-gray-300">Enqueue</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(1)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Add element to the rear of the queue</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Dequeue</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(1)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Remove and return the front element</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Front</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(1)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">View the front element without removal</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Search</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-red-200 text-red-800 rounded px-2 py-1 font-semibold">O(n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Find an element in the queue</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Use Cases */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6} className="mb-8">
          <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
            <i className="bi bi-lightning"></i> Use Cases & Applications
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-printer text-green-600"></i> Print Spooling
              </h6>
              <p className="text-zinc-700 text-sm">Managing print jobs in order of submission</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-cpu text-green-600"></i> Process Scheduling
              </h6>
              <p className="text-zinc-700 text-sm">CPU scheduling in operating systems</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-broadcast text-green-600"></i> Breadth-First Search
              </h6>
              <p className="text-zinc-700 text-sm">Traversing graphs and trees using BFS algorithm</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-chat-dots text-green-600"></i> Message Queues
              </h6>
              <p className="text-zinc-700 text-sm">Handling asynchronous communication between processes</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-people text-green-600"></i> Customer Service
              </h6>
              <p className="text-zinc-700 text-sm">Managing customer service requests in order</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-arrow-repeat text-green-600"></i> Task Scheduling
              </h6>
              <p className="text-zinc-700 text-sm">Managing background tasks and job processing</p>
            </div>
          </div>
        </motion.div>

        {/* Advantages and Disadvantages */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
              <i className="bi bi-plus-circle"></i> Advantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Simple FIFO operations</li>
              <li>Fast enqueue/dequeue O(1)</li>
              <li>Memory efficient</li>
              <li>Easy to implement</li>
              <li>Perfect for task scheduling</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Limited access (front/back only)</li>
              <li>No random access</li>
              <li>Fixed size (array-based)</li>
              <li>Memory waste in circular queues</li>
              <li>Not suitable for priority operations</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Queue;
