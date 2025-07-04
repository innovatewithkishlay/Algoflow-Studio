import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

interface TrieNode {
  children: { [key: string]: TrieNode };
  isEndOfWord: boolean;
}

const createNode = (): TrieNode => ({
  children: {},
  isEndOfWord: false,
});

const TrieVisualizer: React.FC = () => {
  const [root, setRoot] = useState<TrieNode>(createNode());
  const [word, setWord] = useState('');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [foundNodes, setFoundNodes] = useState<string[]>([]);

  // Insert a word into the trie
  const insertWord = (word: string) => {
    if (!word) return;
    const newRoot = { ...root };

    let current = newRoot;
    for (const char of word.toLowerCase()) {
      if (!current.children[char]) {
        current.children[char] = createNode();
      }
      current = current.children[char];
    }
    current.isEndOfWord = true;
    setRoot(newRoot);
    setMessage(`Inserted "${word}"`);
    setWord('');
    setFoundNodes([]);
  };

  // Search for a prefix in the trie, collect nodes along the path
  const searchPrefix = (prefix: string) => {
    if (!prefix) {
      setMessage('Please enter a prefix to search.');
      setFoundNodes([]);
      return;
    }
    let current = root;
    const path: string[] = [];
    for (const char of prefix.toLowerCase()) {
      if (!current.children[char]) {
        setMessage(`Prefix "${prefix}" not found.`);
        setFoundNodes([]);
        return;
      }
      current = current.children[char];
      path.push(char);
    }
    setMessage(`Prefix "${prefix}" found.`);
    setFoundNodes(path);
  };

  // Reset the trie
  const resetTrie = () => {
    setRoot(createNode());
    setWord('');
    setSearch('');
    setMessage('');
    setFoundNodes([]);
  };

  // --- Visualization Helpers ---

  // Recursive function to render trie nodes and edges
  const renderTrie = (node: TrieNode, prefix: string = ''): JSX.Element => {
    const keys = Object.keys(node.children);
    return (
      <ul className="pl-4 border-l border-indigo-300 ml-2">
        {keys.map((char) => {
          const child = node.children[char];
          const currentPrefix = prefix + char;
          const isHighlighted = foundNodes.includes(char) && prefix === foundNodes.slice(0, foundNodes.indexOf(char)).join('');
          return (
            <li key={currentPrefix} className="mb-1">
              <motion.div
                className={`inline-block px-2 py-1 rounded cursor-pointer select-none border ${
                  foundNodes.length > 0 && foundNodes.join('') === currentPrefix
                    ? 'bg-indigo-600 text-white border-indigo-600 ring-4 ring-indigo-300'
                    : 'bg-indigo-50 border-indigo-400 text-indigo-700 hover:bg-indigo-100'
                }`}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ duration: 0.3 }}
              >
                {char}
                {child.isEndOfWord && <span className="ml-1 text-xs font-bold text-green-600">&#10003;</span>}
              </motion.div>
              {renderTrie(child, currentPrefix)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-2">Trie (Prefix Tree)</h1>
          <p className="text-zinc-600 text-lg mb-4">
            A trie is a tree-like data structure used to store dynamic sets or associative arrays where keys are usually strings.
            It is very efficient for prefix-based searches.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-tree text-indigo-600"></i>
              <span>Prefix Search</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-lightning text-indigo-600"></i>
              <span>Fast Lookup</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-check2-circle text-indigo-600"></i>
              <span>Efficient Storage</span>
            </div>
          </div>
        </motion.div>

        {/* Interactive Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo
          </h5>
          <div className="mb-4 flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Enter word to insert"
              className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => insertWord(word.trim())}
              disabled={!word.trim()}
              className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
            >
              Insert
            </button>
          </div>
          <div className="mb-4 flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Enter prefix to search"
              className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => searchPrefix(search.trim())}
              disabled={!search.trim()}
              className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
            >
              Search Prefix
            </button>
          </div>
          {message && (
            <div className="mb-4 text-indigo-700 font-semibold bg-indigo-50 px-4 py-2 rounded border border-indigo-300">
              {message}
            </div>
          )}
          <div className="mb-6">
            <label className="block mb-1 text-zinc-700 font-medium">Trie Visualization:</label>
            {Object.keys(root.children).length > 0 ? (
              <div className="overflow-x-auto border border-indigo-200 rounded p-4 bg-indigo-50">
                {renderTrie(root)}
              </div>
            ) : (
              <div className="text-zinc-400 italic py-6 text-center border border-dashed border-indigo-300 rounded">
                Trie is empty. Insert words to visualize.
              </div>
            )}
          </div>
          <div className="flex justify-center mb-3">
            <button
              onClick={resetTrie}
              className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
            >
              Clear Trie
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Insert words and search prefixes to see the trie update dynamically.
          </div>
        </motion.div>

        {/* Complexity and Use Cases */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="text-indigo-700 text-xl font-semibold mb-4 flex items-center gap-2">
            <i className="bi bi-graph-up"></i> Time & Space Complexity
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1 mb-6">
            <li>Access/Search/Insertion/Deletion: <strong>O(m)</strong> where m is the length of the word/prefix</li>
            <li>Space Complexity: <strong>O(n * m)</strong> where n is number of words and m is average word length</li>
          </ul>

          <h4 className="text-indigo-700 text-xl font-semibold mb-4 flex items-center gap-2">
            <i className="bi bi-lightning"></i> Use Cases & Applications
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>Autocomplete and spell checking</li>
            <li>IP routing and network searches</li>
            <li>Dictionary implementations</li>
            <li>Pattern matching algorithms</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default TrieVisualizer;
