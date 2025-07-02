import React, { useState } from 'react';
// import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

// Only plain objects for variants!
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

const Stack: React.FC = () => {
  // const { isDarkMode } = useTheme();
  const [stack, setStack] = useState<number[]>([1, 2, 3, 4, 5]);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const pushElement = () => {
    if (inputValue.trim() && !isNaN(Number(inputValue))) {
      setStack([...stack, Number(inputValue)]);
      setInputValue('');
      setSelectedIndex(null);
    }
  };

  const popElement = () => {
    if (stack.length > 0) {
      setStack(stack.slice(0, -1));
      setSelectedIndex(null);
    }
  };

  const clearStack = () => {
    setStack([]);
    setSelectedIndex(null);
  };

  const generateRandomStack = () => {
    const newStack = Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 1);
    setStack(newStack);
    setSelectedIndex(null);
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-2">Stack</h1>
          <p className="text-zinc-600 text-lg mb-4">
            A linear data structure that follows the Last-In-First-Out (LIFO) principle.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-clock text-indigo-600"></i>
              <span>Push/Pop: O(1)</span>
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
              <i className="bi bi-arrow-up text-indigo-600"></i>
              <span>LIFO</span>
            </div>
          </div>
        </motion.div>

        {/* How Stack Works */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-info-circle text-indigo-600"></i>
            How Stack Works
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            A Stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle.
            This means that the last element added to the stack will be the first one to be removed.
            Think of it like a stack of plates - you can only add or remove plates from the top.
          </p>
          <pre className="bg-[#F3F4F6] rounded-xl p-5 mt-4 font-mono text-sm text-zinc-800 overflow-x-auto shadow-sm border border-zinc-200">
            {`class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    return this.items.pop();
  }

  peek() {
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
        </motion.div>

        {/* Key Operations */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-list-check text-indigo-600"></i>
            Key Operations
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li><strong>Push:</strong> Add an element to the top of the stack</li>
            <li><strong>Pop:</strong> Remove and return the top element</li>
            <li><strong>Peek/Top:</strong> View the top element without removing it</li>
            <li><strong>isEmpty:</strong> Check if the stack is empty</li>
            <li><strong>Size:</strong> Get the number of elements in the stack</li>
            <li><strong>Clear:</strong> Remove all elements from the stack</li>
          </ul>
        </motion.div>

        {/* Memory Layout */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-cpu text-indigo-600"></i>
            Memory Layout
          </h4>
          <p className="text-zinc-700 leading-relaxed mb-4">
            Stacks are typically implemented using arrays or linked lists. In array-based implementation,
            elements are stored in contiguous memory locations, while in linked list implementation,
            each element points to the next one in the stack.
          </p>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-[#F3F4F6] rounded-lg p-4 shadow">
              <h6 className="text-indigo-700 font-semibold mb-2">Array Implementation:</h6>
              <div className="flex items-center justify-between border border-indigo-200 rounded p-2 bg-white">
                <span className="font-medium">Top: {stack.length > 0 ? stack[stack.length - 1] : 'null'}</span>
                <span className="font-medium">Size: {stack.length}</span>
              </div>
            </div>
            <div className="flex-1 bg-[#F3F4F6] rounded-lg p-4 shadow">
              <h6 className="text-green-700 font-semibold mb-2">Stack Benefits:</h6>
              <ul className="list-disc list-inside text-zinc-700 space-y-1">
                <li>Fast push/pop operations</li>
                <li>Memory efficient</li>
                <li>Simple implementation</li>
                <li>Perfect for LIFO scenarios</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Interactive Demo */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo & Visualization
          </h5>
          <div className="mb-4">
            <label htmlFor="stackInput" className="block mb-2 text-zinc-700 font-medium">Stack Elements:</label>
            <input
              id="stackInput"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && pushElement()}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter a number to push"
            />
          </div>
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={pushElement}
              disabled={!inputValue.trim() || isNaN(Number(inputValue))}
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition flex items-center gap-2"
            >
              <i className="bi bi-plus-circle"></i> Push Element
            </button>
            <button
              onClick={popElement}
              disabled={stack.length === 0}
              className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition flex items-center gap-2"
            >
              <i className="bi bi-dash-circle"></i> Pop
            </button>
            <button
              onClick={clearStack}
              disabled={stack.length === 0}
              className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition flex items-center gap-2"
            >
              <i className="bi bi-trash"></i> Clear
            </button>
            <button
              onClick={generateRandomStack}
              className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <i className="bi bi-shuffle"></i> Random
            </button>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-zinc-700 font-medium">Current Stack:</label>
            <div className="flex flex-col items-center gap-3">
              {stack.length === 0 ? (
                <div className="text-zinc-400 italic">Stack is empty</div>
              ) : (
                <div className="flex flex-col-reverse gap-2">
                  {stack.map((value, idx) => (
                    <motion.div
                      key={idx}
                      className={`cursor-pointer rounded border-2 px-6 py-3 font-bold text-lg select-none transition-shadow duration-300 ease-in-out ${
                        selectedIndex === idx
                          ? 'bg-green-600 border-green-600 text-white ring-4 ring-green-400'
                          : 'bg-green-50 border-green-400 text-green-700 hover:bg-green-100'
                      }`}
                      onClick={() => setSelectedIndex(idx)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      // Animate each stack element with a staggered delay
                      initial="hidden"
                      animate="visible"
                      variants={fadeUp}
                      transition={{ delay: idx * 0.08, duration: 0.5, type: "spring", stiffness: 80 }}
                    >
                      {value}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {selectedIndex !== null && (
            <motion.div
              className="mt-4 inline-flex items-center gap-2 rounded border-2 border-green-600 bg-green-100 px-4 py-2 text-green-800 font-semibold shadow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <i className="bi bi-info-circle"></i>
              Selected: Stack[{selectedIndex}] = {stack[selectedIndex]}
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
            <strong>Tip:</strong> Push and pop elements to see how the LIFO principle works.
          </div>
        </motion.div>

        {/* Complexity Analysis */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
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
                  <td className="px-4 py-2 border border-gray-300">Push</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(1)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Add element to the top of the stack</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Pop</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(1)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Remove and return the top element</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Peek</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(1)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">View the top element without removal</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Search</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-red-200 text-red-800 rounded px-2 py-1 font-semibold">O(n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Find an element in the stack</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Use Cases */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
            <i className="bi bi-lightning"></i> Use Cases & Applications
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-arrow-return-left text-green-600"></i> Function Calls
              </h6>
              <p className="text-zinc-700 text-sm">Managing function call stack in programming languages</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-braces text-green-600"></i> Expression Evaluation
              </h6>
              <p className="text-zinc-700 text-sm">Evaluating mathematical expressions and parentheses matching</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-arrow-clockwise text-green-600"></i> Undo Operations
              </h6>
              <p className="text-zinc-700 text-sm">Implementing undo/redo functionality in applications</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-diagram-3 text-green-600"></i> Depth-First Search
              </h6>
              <p className="text-zinc-700 text-sm">Traversing graphs and trees using DFS algorithm</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-file-text text-green-600"></i> Browser History
              </h6>
              <p className="text-zinc-700 text-sm">Managing back/forward navigation in web browsers</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-layers text-green-600"></i> Memory Management
              </h6>
              <p className="text-zinc-700 text-sm">Managing memory allocation and deallocation</p>
            </div>
          </div>
        </motion.div>

        {/* Advantages and Disadvantages */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
              <i className="bi bi-plus-circle"></i> Advantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Simple LIFO operations</li>
              <li>Fast push/pop O(1)</li>
              <li>Memory efficient</li>
              <li>Easy to implement</li>
              <li>Perfect for recursion</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Limited access (top only)</li>
              <li>No random access</li>
              <li>Fixed size (array-based)</li>
              <li>Stack overflow risk</li>
              <li>Not suitable for all use cases</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Stack;
