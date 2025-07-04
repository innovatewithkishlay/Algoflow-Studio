import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

interface Entry {
  key: string;
  value: string;
}

const HashTable: React.FC = () => {
  const [table, setTable] = useState<(Entry | null)[]>(Array(8).fill(null));
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const hash = (key: string) => {
    let hashValue = 0;
    for (let i = 0; i < key.length; i++) {
      hashValue = (hashValue + key.charCodeAt(i)) % table.length;
    }
    return hashValue;
  };

  const insert = () => {
    if (!key) return;
    const idx = hash(key);
    const newTable = [...table];
    let i = idx;
    let attempts = 0;
    while (newTable[i] !== null && newTable[i]?.key !== key && attempts < table.length) {
      i = (i + 1) % table.length;
      attempts++;
    }
    if (attempts >= table.length) {
      setMessage('Table is full!');
      return;
    }
    newTable[i] = { key, value };
    setTable(newTable);
    setMessage(`Inserted key "${key}" at index ${i}`);
    setKey('');
    setValue('');
    setSelectedIndex(i);
  };

  const handleClear = () => {
    setTable(Array(8).fill(null));
    setMessage('Cleared hash table.');
    setSelectedIndex(null);
  };

  // --- Visualization ---
  const renderTableVisualization = () => (
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 mt-2 mb-4">
      {table.map((entry, idx) => (
        <motion.div
          key={idx}
          className={`rounded-lg border-2 px-4 py-3 font-bold text-lg cursor-pointer transition flex flex-col items-center
            ${selectedIndex === idx
              ? 'bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-300'
              : 'bg-indigo-50 border-indigo-400 text-indigo-700 hover:bg-indigo-100'
            }`}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedIndex(idx)}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: idx * 0.08, duration: 0.5, type: "spring", stiffness: 80 }}
        >
          <div className="text-xs font-semibold text-zinc-500 mb-1">{idx}</div>
          {entry ? (
            <>
              <div className="text-indigo-100 font-semibold">{entry.key}</div>
              <div className="text-white text-sm">{entry.value}</div>
            </>
          ) : (
            <div className="text-zinc-400 italic text-sm">Empty</div>
          )}
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-2">Hash Table</h1>
          <p className="text-zinc-600 text-lg mb-4">
            A hash table is a data structure that maps keys to values for highly efficient lookup.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-hash text-indigo-600"></i>
              <span>Key-based Storage</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-lightbulb text-indigo-600"></i>
              <span>Fast Access</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-shuffle text-indigo-600"></i>
              <span>Collision Handling</span>
            </div>
          </div>
        </motion.div>

        {/* What is a Hash Table */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-info-circle text-indigo-600"></i>
            What is a Hash Table?
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            A hash table uses a hash function to compute an index into an array of buckets or slots, from which the desired value can be found.
            If two keys hash to the same index, linear probing is used to find the next available slot.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <span className="text-zinc-400">// Hash function example</span> <br />
            {`function hash(key) {
  let hashValue = 0;
  for (let i = 0; i < key.length; i++) {
    hashValue = (hashValue + key.charCodeAt(i)) % tableSize;
  }
  return hashValue;
}`}
          </div>

          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3">
            <i className="bi bi-list-check text-indigo-600"></i>
            Key Features
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>Key-value mapping</li>
            <li>Fast average-case access</li>
            <li>Handles collisions</li>
            <li>Dynamic resizing (in advanced implementations)</li>
            <li>Efficient for large datasets</li>
          </ul>
        </motion.div>

        {/* Interactive Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo & Visualization
          </h5>
          <div className="mb-4 flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter key"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter value"
              />
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
                onClick={insert}
                disabled={!key}
              >
                <i className="bi bi-plus"></i> Insert
              </button>
            </div>
            <div className="flex-1 flex gap-2">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
                onClick={handleClear}
              >
                <i className="bi bi-trash"></i> Clear Table
              </button>
            </div>
          </div>
          {message && (
            <div className="mb-4 text-indigo-700 font-semibold bg-indigo-50 px-4 py-2 rounded border border-indigo-300">
              {message}
            </div>
          )}
          <label className="block mb-1 text-zinc-700 font-medium">Current Hash Table:</label>
          {renderTableVisualization()}
          {selectedIndex !== null && table[selectedIndex] && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded border-2 border-green-600 bg-green-100 px-4 py-2 text-green-800 font-semibold shadow">
                <i className="bi bi-check-circle"></i>
                Selected: Index {selectedIndex} — key "{table[selectedIndex]?.key}", value "{table[selectedIndex]?.value}"
              </div>
            </div>
          )}
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Click on any cell to select and see its key/value.
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
                  <th className="px-4 py-2 border border-gray-300 text-left">Average Time</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Worst Time</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Space</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Access</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(1)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-red-200 text-red-800 rounded px-2 py-1 font-semibold">O(n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(n)</td>
                  <td className="px-4 py-2 border border-gray-300">Direct index via hash, but may probe linearly</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Search</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(1)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-red-200 text-red-800 rounded px-2 py-1 font-semibold">O(n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(n)</td>
                  <td className="px-4 py-2 border border-gray-300">Hash and probe for key</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Insertion</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(1)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-red-200 text-red-800 rounded px-2 py-1 font-semibold">O(n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(n)</td>
                  <td className="px-4 py-2 border border-gray-300">Hash and probe for empty slot</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Deletion</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(1)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-red-200 text-red-800 rounded px-2 py-1 font-semibold">O(n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(n)</td>
                  <td className="px-4 py-2 border border-gray-300">Hash and probe for key</td>
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
                <i className="bi bi-journal-code text-indigo-600"></i> Dictionaries/Maps
              </h6>
              <p className="text-zinc-700 text-sm">Key-value storage</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-cpu text-indigo-600"></i> Symbol Tables
              </h6>
              <p className="text-zinc-700 text-sm">Compilers/interpreters</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-lightning-charge text-indigo-600"></i> Caching
              </h6>
              <p className="text-zinc-700 text-sm">Fast data retrieval</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-database text-indigo-600"></i> Database Indexing
              </h6>
              <p className="text-zinc-700 text-sm">Efficient lookups</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-shuffle text-indigo-600"></i> Unique Data Sets
              </h6>
              <p className="text-zinc-700 text-sm">Sets, uniqueness checks</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-search text-indigo-600"></i> Search Engines
              </h6>
              <p className="text-zinc-700 text-sm">Indexing and retrieval</p>
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
              <li>Very fast average-case access</li>
              <li>Efficient for large datasets</li>
              <li>Flexible key types</li>
              <li>Good for dynamic data</li>
              <li>Widely used in real-world systems</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Potential for collisions</li>
              <li>Worst-case performance is linear</li>
              <li>Requires good hash function</li>
              <li>Not ordered</li>
              <li>Can waste space if sparsely filled</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HashTable;
