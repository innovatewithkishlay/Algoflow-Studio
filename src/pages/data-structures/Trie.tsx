import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};
interface TrieNode {
  char: string;
  children: TrieNode[];
  isEnd: boolean;
  x?: number;
  y?: number;
  parent?: TrieNode | null;
}

function createNode(char: string, parent: TrieNode | null = null): TrieNode {
  return { char, children: [], isEnd: false, parent };
}

// Recursively layout the trie nodes for SVG
function layoutTrie(
  node: TrieNode,
  depth: number,
  xMin: number,
  xMax: number,
  yStep: number
) {
  const x = (xMin + xMax) / 2;
  const y = depth * yStep + 60;
  node.x = x;
  node.y = y;
  const n = node.children.length;
  node.children.forEach((child, i) => {
    const childXMin = xMin + ((xMax - xMin) * i) / n;
    const childXMax = xMin + ((xMax - xMin) * (i + 1)) / n;
    layoutTrie(child, depth + 1, childXMin, childXMax, yStep);
  });
}

// Flatten trie for rendering (DFS)
function flattenTrie(node: TrieNode): TrieNode[] {
  return [node, ...node.children.flatMap(flattenTrie)];
}

// Insert a word into the trie (returns new root)
function insertWord(root: TrieNode, word: string) {
  let node = root;
  for (const char of word) {
    let child = node.children.find((c) => c.char === char);
    if (!child) {
      child = createNode(char, node);
      node.children.push(child);
    }
    node = child;
  }
  node.isEnd = true;
}

// Find nodes along a prefix path
function findPrefixPath(root: TrieNode, prefix: string): TrieNode[] {
  let node = root;
  const path: TrieNode[] = [root];
  for (const char of prefix) {
    const child = node.children.find((c) => c.char === char);
    if (!child) return [];
    node = child;
    path.push(node);
  }
  return path;
}

const Trie: React.FC = () => {
  const [words, setWords] = useState<string[]>(['cat', 'car', 'cart', 'dog', 'doll']);
  const [inputWord, setInputWord] = useState('');
  const [searchPrefix, setSearchPrefix] = useState('');
  const [message, setMessage] = useState('');
  const [highlightPath, setHighlightPath] = useState<TrieNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<TrieNode | null>(null);

  // Build trie from words
  const root = createNode('');
  for (const w of words) insertWord(root, w.toLowerCase());
  layoutTrie(root, 0, 60, 940, 90);
  const nodes = flattenTrie(root);

  // Insert word handler
  const handleInsert = () => {
    if (!inputWord.trim()) return;
    if (words.includes(inputWord.trim().toLowerCase())) {
      setMessage(`"${inputWord.trim()}" already exists.`);
      return;
    }
    setWords([...words, inputWord.trim().toLowerCase()]);
    setInputWord('');
    setMessage(`Inserted "${inputWord.trim()}"`);
    setHighlightPath([]);
    setSelectedNode(null);
  };

  // Search prefix handler
  const handleSearch = () => {
    if (!searchPrefix.trim()) return;
    const path = findPrefixPath(root, searchPrefix.trim().toLowerCase());
    if (path.length === 0) {
      setMessage(`Prefix "${searchPrefix.trim()}" not found.`);
      setHighlightPath([]);
      setSelectedNode(null);
      return;
    }
    setMessage(`Prefix "${searchPrefix.trim()}" found.`);
    setHighlightPath(path);
    setSelectedNode(path[path.length - 1]);
  };

  // Clear trie
  const handleClear = () => {
    setWords([]);
    setInputWord('');
    setSearchPrefix('');
    setMessage('Cleared trie.');
    setHighlightPath([]);
    setSelectedNode(null);
  };

  // SVG visualization
  const renderTrieVisualization = () => {
    if (nodes.length === 1) {
      return (
        <div className="flex flex-col items-center gap-2 text-zinc-400 min-h-[180px]">
          <span className="text-4xl">🌲</span>
          <p>Trie is empty</p>
        </div>
      );
    }
    const width = 1000;
    const height = Math.max(240, Math.max(...nodes.map(n => n.y || 0)) + 80);
    return (
      <div className="rounded shadow-lg border bg-indigo-50 py-4 px-2">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Edges */}
          {nodes.flatMap((node, idx) =>
            node.children.map((child, j) => (
              <line
                key={`edge-${idx}-${j}`}
                x1={node.x}
                y1={node.y}
                x2={child.x}
                y2={child.y}
                stroke="#a5b4fc"
                strokeWidth={4}
              />
            ))
          )}
          {/* Nodes */}
          {nodes.map((node, idx) => (
            node.char !== '' && (
              <motion.g
                key={idx}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: idx * 0.05, duration: 0.5, type: "spring", stiffness: 80 }}
                onClick={() => setSelectedNode(node)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={28}
                  fill={
                    highlightPath.includes(node)
                      ? "#facc15"
                      : selectedNode === node
                        ? "#6366f1"
                        : "#e0e7ef"
                  }
                  stroke={
                    highlightPath.includes(node)
                      ? "#facc15"
                      : selectedNode === node
                        ? "#6366f1"
                        : "#6366f1"
                  }
                  strokeWidth={
                    highlightPath.includes(node)
                      ? 7
                      : selectedNode === node
                        ? 5
                        : 3
                  }
                  style={{
                    filter: highlightPath.includes(node)
                      ? 'drop-shadow(0 0 8px #facc15)'
                      : selectedNode === node
                        ? 'drop-shadow(0 0 6px #818cf8)'
                        : undefined
                  }}
                />
                <text
                  x={node.x}
                  y={node.y! + 7}
                  textAnchor="middle"
                  fontSize={20}
                  fill={
                    highlightPath.includes(node)
                      ? "#fff"
                      : selectedNode === node
                        ? "#fff"
                        : "#3730a3"
                  }
                  fontWeight={700}
                >
                  {node.char}
                </text>
                {node.isEnd && (
                  <text
                    x={node.x! + 22}
                    y={node.y! - 22}
                    fontSize={18}
                    fill="#16a34a"
                    fontWeight={700}
                  >
                    ✓
                  </text>
                )}
              </motion.g>
            )
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
          <h1 className="text-4xl font-extrabold text-zinc-900">Trie (Prefix Tree)</h1>
          <p className="text-zinc-700 text-lg mt-2">
            A trie is a tree-like data structure for storing strings, enabling fast prefix search and autocomplete.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm mt-4">
            <div className="flex items-center gap-2">
              <i className="bi bi-search text-indigo-600"></i>
              <span>Prefix Search: O(m)</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-plus-circle text-indigo-600"></i>
              <span>Insert: O(m)</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-gear text-indigo-600"></i>
              <span>Space: O(n * m)</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-tree text-indigo-600"></i>
              <span>Hierarchical</span>
            </div>
          </div>
        </motion.div>

        {/* Information Section */}
        <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeUp}>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-info-circle text-indigo-600"></i>
            How Trie Works
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            A Trie (Prefix Tree) is a hierarchical data structure used for efficient retrieval of strings and prefixes.
            Each node represents a character, and paths from root to leaf form words.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <pre>
{`class TrieNode {
  constructor(char) {
    this.char = char;
    this.children = [];
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode('');
  }
  insert(word) {
    let node = this.root;
    for (const char of word) {
      let child = node.children.find(c => c.char === char);
      if (!child) {
        child = new TrieNode(char);
        node.children.push(child);
      }
      node = child;
    }
    node.isEnd = true;
  }
}`}
            </pre>
          </div>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-list-check"></i>
            Key Concepts
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li><strong>Node:</strong> Represents a character and links to children</li>
            <li><strong>Root:</strong> Topmost (empty) node</li>
            <li><strong>Leaf:</strong> Node marking end of a word</li>
            <li><strong>Prefix:</strong> Path from root to any node</li>
            <li><strong>Word:</strong> Path from root to a node with <code>isEnd</code> true</li>
          </ul>
        </motion.div>

        {/* Interactive Section */}
        <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeUp}>
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo & Visualization
          </h5>
          <div className="mb-3">
            <label className="block mb-2 text-zinc-700 font-medium">
              Current Words: <span className="font-semibold text-indigo-700">{words.length}</span>
            </label>
            {renderTrieVisualization()}
            {selectedNode && (
              <div className="text-center mt-2">
                <div className="inline-flex items-center gap-2 rounded border-2 border-green-600 bg-green-100 px-4 py-2 text-green-800 font-semibold shadow">
                  <i className="bi bi-check-circle"></i>
                  Selected: {selectedNode.char}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <input
              type="text"
              className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter a word to add"
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
            />
            <button
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
              onClick={handleInsert}
              disabled={!inputWord.trim()}
            >
              <i className="bi bi-plus-circle"></i> Add Word
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
              onClick={handleClear}
              disabled={words.length === 0}
            >
              <i className="bi bi-trash"></i> Clear Trie
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <input
              type="text"
              className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter a prefix to search"
              value={searchPrefix}
              onChange={(e) => setSearchPrefix(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
              onClick={handleSearch}
              disabled={!searchPrefix.trim()}
            >
              <i className="bi bi-search"></i> Search Prefix
            </button>
          </div>
          {message && (
            <div className="mb-4 text-indigo-700 font-semibold bg-indigo-50 px-4 py-2 rounded border border-indigo-300">
              {message}
            </div>
          )}
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Insert words and search prefixes to see the trie update dynamically.
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
                  <td className="px-4 py-2 border border-gray-300">Search</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(m)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Find a prefix of length m</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Insert</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(m)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Add a word of length m</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Delete</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(m)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Remove a word of length m</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Traversal</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-red-200 text-red-800 rounded px-2 py-1 font-semibold">O(n * m)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(n * m)</td>
                  <td className="px-4 py-2 border border-gray-300">Visit all nodes</td>
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
                <i className="bi bi-search text-green-600"></i> Autocomplete
              </h6>
              <p className="text-zinc-700 text-sm">Efficient prefix-based suggestions</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-spellcheck text-green-600"></i> Spell Checking
              </h6>
              <p className="text-zinc-700 text-sm">Fast dictionary lookups</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-diagram-3 text-green-600"></i> IP Routing
              </h6>
              <p className="text-zinc-700 text-sm">Longest prefix match in networks</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-book text-green-600"></i> Dictionary Implementation
              </h6>
              <p className="text-zinc-700 text-sm">Efficient word storage and search</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-sort-alpha-down text-green-600"></i> Pattern Matching
              </h6>
              <p className="text-zinc-700 text-sm">Search for patterns in text</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-terminal text-green-600"></i> Command Completion
              </h6>
              <p className="text-zinc-700 text-sm">Shell/IDE auto-completion</p>
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
              <li>Fast prefix and word search</li>
              <li>Efficient for large dictionaries</li>
              <li>Supports autocomplete and spell-check</li>
              <li>Hierarchical data structure</li>
              <li>Easy to implement</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Can use more memory than hash tables</li>
              <li>Not cache-friendly</li>
              <li>Slower for very short keys</li>
              <li>More complex than arrays/lists</li>
              <li>Harder to visualize for large sets</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Trie;
