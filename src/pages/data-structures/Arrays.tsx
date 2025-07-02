import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, type: "spring", stiffness: 80 },
  }),
};

const Arrays: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [input, setInput] = useState("1,2,3,4,5,6,7,8,9,10");
  const [array, setArray] = useState<number[]>([1,2,3,4,5,6,7,8,9,10]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const nums = input
      .split(",")
      .map(Number)
      .filter((n) => !isNaN(n));
    setArray(nums);
    setSelectedIndex(null);
  }, [input]);

  const handleElementClick = (index: number) => {
    setSelectedIndex(index);
  };

  const resetSelection = () => {
    setSelectedIndex(null);
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div custom={0} variants={fadeUp} className="mb-4">
            <h1 className="text-4xl font-extrabold text-zinc-900">Arrays</h1>
          </motion.div>
          <motion.div custom={1} variants={fadeUp} className="mb-6">
            <p className="text-zinc-600 text-lg">
              A collection of elements stored at contiguous memory locations, providing efficient random access.
            </p>
          </motion.div>
          <motion.div
            className="flex flex-wrap gap-6 text-zinc-500 text-sm"
            custom={2}
            variants={fadeUp}
          >
            <div className="flex items-center gap-2">
              <i className="bi bi-collection text-indigo-600"></i>
              <span>Linear Data Structure</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-lightning text-indigo-600"></i>
              <span>O(1) Access Time</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-lightbulb text-indigo-600"></i>
              <span>Beginner Level</span>
            </div>
          </motion.div>
        </motion.div>

        {/* What is an Array */}
        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div custom={0} variants={fadeUp}>
            <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
              <i className="bi bi-info-circle text-indigo-600"></i>
              What is an Array?
            </h4>
            <p className="text-zinc-700 leading-relaxed">
              An array is a linear data structure that stores elements of the same data type in contiguous memory locations.
              Each element can be accessed directly using an index, making it one of the most efficient data structures for random access.
            </p>
          </motion.div>
          <motion.div
            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mt-4 font-mono text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap"
            custom={1}
            variants={fadeUp}
          >
            {`// Array declaration and initialization
int numbers[] = {1, 2, 3, 4, 5};

// Accessing elements by index
int first = numbers[0]; // O(1) access time
int last = numbers[4];  // O(1) access time

// Memory layout: [1][2][3][4][5]
// Index: 0  1  2  3  4`}
          </motion.div>
          <motion.div custom={2} variants={fadeUp}>
            <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3">
              <i className="bi bi-list-check text-indigo-600"></i>
              Key Features
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Fixed or dynamic size</li>
              <li>Random access in O(1) time</li>
              <li>Contiguous memory allocation</li>
              <li>Index-based element access</li>
              <li>Cache-friendly due to locality</li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Memory Layout */}
        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div custom={0} variants={fadeUp}>
            <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
              <i className="bi bi-cpu text-indigo-600"></i>
              Memory Layout
            </h4>
            <p className="text-zinc-700 leading-relaxed">
              Arrays are stored in contiguous memory locations, which means all elements are stored next to each other in memory.
              This layout provides excellent cache performance and allows for efficient random access.
            </p>
          </motion.div>
          <motion.div
            className="p-4 rounded bg-gray-100 dark:bg-gray-800 mt-4"
            style={{ color: isDarkMode ? "#f8f9fa" : "#23272f" }}
            custom={1}
            variants={fadeUp}
          >
            <div className="flex justify-center gap-2 mb-2 flex-wrap">
              {array.map((num, idx) => (
                <div key={idx} className="text-center">
                  <div
                    className={`border-2 border-indigo-600 bg-indigo-600 text-white p-3 rounded cursor-pointer ${
                      selectedIndex === idx ? "ring-4 ring-indigo-400" : ""
                    }`}
                    onClick={() => handleElementClick(idx)}
                  >
                    {num}
                  </div>
                  <small className="block mt-1 text-indigo-700 font-semibold">
                    Address + {idx * 4}
                  </small>
                </div>
              ))}
            </div>
            <p className="text-center text-sm font-medium mt-2 text-indigo-700">
              <i className="bi bi-info-circle me-1"></i>
              Each element occupies 4 bytes (for integers) in contiguous memory
            </p>
          </motion.div>
        </motion.div>

        {/* Interactive Section */}
        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo & Visualization
          </h5>
          <div className="mb-4">
            <label htmlFor="arrayInput" className="form-label block mb-2 text-zinc-700 font-medium">
              Array Elements:
            </label>
            <input
              id="arrayInput"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter comma-separated numbers (e.g., 1,2,3,4,5)"
            />
          </div>
          <div className="mb-4">
            <label className="form-label block mb-2 text-zinc-700 font-medium">Current Array:</label>
            <div className="flex flex-wrap justify-center gap-3 mb-3">
              {array.length > 0 ? (
                array.map((num, idx) => (
                  <motion.div
                    key={idx}
                    className={`cursor-pointer rounded border-2 border-indigo-600 bg-indigo-600 text-white px-4 py-2 select-none transition-shadow duration-300 ease-in-out ${
                      selectedIndex === idx ? "ring-4 ring-indigo-400" : ""
                    }`}
                    onClick={() => handleElementClick(idx)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {num}
                  </motion.div>
                ))
              ) : (
                <div className="text-zinc-500 italic">No array elements to display</div>
              )}
            </div>
            {/* Index Labels */}
            <div className="flex flex-wrap justify-center gap-3">
              {array.map((_, idx) => (
                <div key={idx} className="text-center w-12">
                  <small className="text-indigo-700 font-semibold select-none">[{idx}]</small>
                </div>
              ))}
            </div>
            {selectedIndex !== null && (
              <motion.div
                className="mt-4 inline-flex items-center gap-2 rounded border-2 border-green-600 bg-green-100 px-4 py-2 text-green-800 font-semibold shadow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <i className="bi bi-info-circle"></i>
                Selected: Array[{selectedIndex}] = {array[selectedIndex]}
              </motion.div>
            )}
          </div>
          <div className="flex justify-center">
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
              onClick={resetSelection}
            >
              <i className="bi bi-arrow-counterclockwise"></i> Reset Selection
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Click on any array element to select it and see its index and value.
          </div>
        </motion.div>

        {/* Complexity Analysis */}
        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
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
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(1)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Direct index access</td>
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
                  <td className="px-4 py-2 border border-gray-300">Insertion</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-red-200 text-red-800 rounded px-2 py-1 font-semibold">O(n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Shifting elements required</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Deletion</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-red-200 text-red-800 rounded px-2 py-1 font-semibold">O(n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Shifting elements required</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Use Cases */}
        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
            <i className="bi bi-lightning"></i> Use Cases & Applications
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-collection text-indigo-600"></i> Data Storage
              </h6>
              <p className="text-zinc-700 text-sm">Storing collections of related data</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-grid-3x3 text-indigo-600"></i> Matrix Operations
              </h6>
              <p className="text-zinc-700 text-sm">2D arrays for mathematical computations</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-speedometer2 text-indigo-600"></i> Buffer Management
              </h6>
              <p className="text-zinc-700 text-sm">Temporary storage for data processing</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-table text-indigo-600"></i> Lookup Tables
              </h6>
              <p className="text-zinc-700 text-sm">Fast access to precomputed values</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-cpu text-indigo-600"></i> Memory Management
              </h6>
              <p className="text-zinc-700 text-sm">Contiguous memory allocation</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-code text-indigo-600"></i> Algorithm Implementation
              </h6>
              <p className="text-zinc-700 text-sm">Foundation for many algorithms</p>
            </div>
          </div>
        </motion.div>

        {/* Advantages and Disadvantages */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
              <i className="bi bi-plus-circle"></i> Advantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Fast random access O(1)</li>
              <li>Memory efficient</li>
              <li>Cache-friendly</li>
              <li>Simple implementation</li>
              <li>Good for indexed operations</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Fixed size (static arrays)</li>
              <li>Slow insertion/deletion O(n)</li>
              <li>Memory fragmentation</li>
              <li>Wasteful for sparse data</li>
              <li>Difficult to resize</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Arrays;
