import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

const codeImplementations = {
  javascript: `class HashTable {
  constructor(size = 10) {
    this.table = new Array(size);
  }

  hash(key) {
    let hash = 0;
    for (let char of key) {
      hash += char.charCodeAt(0);
    }
    return hash % this.table.length;
  }

  set(key, value) {
    const idx = this.hash(key);
    if (!this.table[idx]) this.table[idx] = [];
    this.table[idx].push([key, value]);
  }

  get(key) {
    const idx = this.hash(key);
    const bucket = this.table[idx];
    if (!bucket) return undefined;
    for (let [k, v] of bucket) {
      if (k === key) return v;
    }
    return undefined;
  }
}`
};

const HashTable: React.FC = () => {
  const tableSize = 8;
  const [table, setTable] = useState<Array<[string, string][]>[]>(Array(tableSize).fill([]));
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  const hash = (key: string) => {
    let hash = 0;
    for (let char of key) {
      hash += char.charCodeAt(0);
    }
    return hash % tableSize;
  };

  const insert = () => {
    const idx = hash(key);
    const newTable = [...table];
    newTable[idx] = [...newTable[idx], [key, value]];
    setTable(newTable);
    setKey('');
    setValue('');
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-2">Hash Table Visualizer</h1>
          <p className="text-zinc-600 text-lg mb-4">
            A Hash Table maps keys to values using a hash function for fast access and insertion.
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Key"
            className="border px-3 py-2 rounded w-full md:w-auto"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Value"
            className="border px-3 py-2 rounded w-full md:w-auto"
          />
          <button
            onClick={insert}
            className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
          >
            Insert
          </button>
        </div>

        {/* Hash Table View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {table.map((bucket, idx) => (
            <div key={idx} className="border p-3 rounded shadow">
              <h4 className="font-semibold text-indigo-600 mb-2">Index {idx}</h4>
              <ul className="text-sm space-y-1">
                {bucket.map(([k, v], i) => (
                  <li key={i} className="bg-indigo-100 px-2 py-1 rounded">
                    <span className="font-mono">{k}</span> → <span className="font-semibold">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Code Example */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mt-12">
          <h4 className="text-xl font-semibold mb-3">Hash Table (JavaScript)</h4>
          <div className="rounded bg-gray-100 p-4 font-mono text-sm overflow-x-auto">
            <pre>{codeImplementations.javascript}</pre>
          </div>
        </motion.div>

        {/* Complexity & Use Cases */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mt-10">
          <h4 className="text-xl font-semibold mb-4">Time & Space Complexity</h4>
          <table className="min-w-full border border-gray-300">
            <thead className="bg-indigo-100">
              <tr>
                <th className="p-2 border">Operation</th>
                <th className="p-2 border">Average</th>
                <th className="p-2 border">Worst</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">Search</td>
                <td className="p-2 border">O(1)</td>
                <td className="p-2 border">O(n)</td>
              </tr>
              <tr>
                <td className="p-2 border">Insert</td>
                <td className="p-2 border">O(1)</td>
                <td className="p-2 border">O(n)</td>
              </tr>
              <tr>
                <td className="p-2 border">Delete</td>
                <td className="p-2 border">O(1)</td>
                <td className="p-2 border">O(n)</td>
              </tr>
              <tr>
                <td className="p-2 border">Space</td>
                <td className="p-2 border">O(n)</td>
                <td className="p-2 border">O(n)</td>
              </tr>
            </tbody>
          </table>

          <h4 className="text-xl font-semibold mt-8 mb-3">Use Cases</h4>
          <ul className="list-disc list-inside text-zinc-700">
            <li>Implementing dictionaries/maps</li>
            <li>Caching (e.g., LRU Cache)</li>
            <li>Database indexing</li>
            <li>Symbol tables in compilers</li>
          </ul>

          <h4 className="text-xl font-semibold mt-8 mb-3">Advantages</h4>
          <ul className="list-disc list-inside text-zinc-700">
            <li>Fast access/insertion in average cases</li>
            <li>Simple implementation</li>
            <li>Efficient for key-value storage</li>
          </ul>

          <h4 className="text-xl font-semibold mt-8 mb-3">Disadvantages</h4>
          <ul className="list-disc list-inside text-zinc-700">
            <li>Hash collisions can degrade performance</li>
            <li>Needs a good hash function</li>
            <li>Fixed size unless using dynamic resizing</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default HashTable;
