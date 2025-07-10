import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

interface PatriciaNode {
  label: string;
  children: PatriciaNode[];
  isWord: boolean;
}

interface PatriciaStep {
  root: PatriciaNode;
  highlightPath: string[];
  message: string;
  query?: string;
}

function clonePatriciaNode(node: PatriciaNode): PatriciaNode {
  return {
    label: node.label,
    isWord: node.isWord,
    children: node.children.map(clonePatriciaNode)
  };
}

function insertPatriciaSteps(root: PatriciaNode, word: string): PatriciaStep[] {
  const steps: PatriciaStep[] = [];

  function insert(node: PatriciaNode, word: string, path: string[]): boolean {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const commonPrefixLength = getCommonPrefixLength(child.label, word);
      if (commonPrefixLength > 0) {
        if (commonPrefixLength < child.label.length) {
          // Split child
          const newChild: PatriciaNode = {
            label: child.label.slice(commonPrefixLength),
            children: child.children,
            isWord: child.isWord
          };
          child.label = child.label.slice(0, commonPrefixLength);
          child.children = [newChild];
          child.isWord = false;
        }
        if (commonPrefixLength < word.length) {
          const suffix = word.slice(commonPrefixLength);
          return insert(child, suffix, [...path, child.label]);
        } else {
          child.isWord = true;
          steps.push({
            root: clonePatriciaNode(root),
            highlightPath: [...path, child.label],
            message: `Marked node "${child.label}" as word end`
          });
          return true;
        }
      }
    }
    // No common prefix, add new child
    const newNode: PatriciaNode = {
      label: word,
      children: [],
      isWord: true
    };
    node.children.push(newNode);
    steps.push({
      root: clonePatriciaNode(root),
      highlightPath: [...path, newNode.label],
      message: `Inserted new node "${newNode.label}"`
    });
    return true;
  }

  insert(root, word, []);
  steps.push({
    root: clonePatriciaNode(root),
    highlightPath: [],
    message: `Insertion of "${word}" complete`
  });
  return steps;
}

function getCommonPrefixLength(a: string, b: string): number {
  let len = 0;
  while (len < a.length && len < b.length && a[len] === b[len]) len++;
  return len;
}

function searchPatriciaSteps(root: PatriciaNode, word: string): PatriciaStep[] {
  const steps: PatriciaStep[] = [];

  function search(node: PatriciaNode, word: string, path: string[]): boolean {
    for (const child of node.children) {
      const commonPrefixLength = getCommonPrefixLength(child.label, word);
      if (commonPrefixLength === child.label.length) {
        steps.push({
          root: clonePatriciaNode(root),
          highlightPath: [...path, child.label],
          message: `Matched "${child.label}"`,
          query: word
        });
        if (commonPrefixLength === word.length) {
          if (child.isWord) {
            steps.push({
              root: clonePatriciaNode(root),
              highlightPath: [...path, child.label],
              message: `Found word "${word}"`,
              query: word
            });
            return true;
          } else {
            steps.push({
              root: clonePatriciaNode(root),
              highlightPath: [...path, child.label],
              message: `"${word}" is a prefix but not a word`,
              query: word
            });
            return false;
          }
        } else {
          return search(child, word.slice(commonPrefixLength), [...path, child.label]);
        }
      }
    }
    steps.push({
      root: clonePatriciaNode(root),
      highlightPath: path,
      message: `No match found for "${word}"`,
      query: word
    });
    return false;
  }

  search(root, word, []);
  return steps;
}

function renderPatriciaNode(node: PatriciaNode, highlightPath: string[], path: string[] = []): React.ReactNode {
  const currentPath = [...path, node.label];
  const isHighlighted = highlightPath.length >= currentPath.length && highlightPath.every((v, i) => v === currentPath[i]);

  return (
    <div className="ml-4 mt-2">
      <div
        className={`inline-block px-3 py-1 rounded border-2 font-semibold cursor-default select-none ${
          isHighlighted ? 'bg-yellow-300 border-yellow-500' : 'bg-indigo-100 border-indigo-300'
        }`}
        title={node.isWord ? 'Word end' : 'Prefix node'}
      >
        {node.label}
        {node.isWord && <span className="ml-1 text-green-700 font-bold">*</span>}
      </div>
      {node.children.length > 0 && (
        <div className="ml-6 border-l-2 border-indigo-300 mt-1 pl-2">
          {node.children.map((child, idx) => (
            <div key={idx}>{renderPatriciaNode(child, highlightPath, currentPath)}</div>
          ))}
        </div>
      )}
    </div>
  );
}

const codeImplementations = {
  javascript: `// Patricia Trie insertion (simplified)
function insert(root, word) {
  for (const child of root.children) {
    const commonPrefix = getCommonPrefix(child.label, word);
    if (commonPrefix.length > 0) {
      if (commonPrefix.length < child.label.length) {
        // Split child node
      }
      // Recurse with suffix
    }
  }
  // Add new child if no common prefix
}`
};

const PatriciaTrie: React.FC = () => {
  const [root] = useState<PatriciaNode>({ label: '', children: [], isWord: false });
  const [steps, setSteps] = useState<PatriciaStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [insertWord, setInsertWord] = useState<string>('');
  const [searchWord, setSearchWord] = useState<string>('');
  const [speed] = useState<number>(1000);

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlaying && steps.length > 0 && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, speed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  const handleInsert = () => {
    if (!insertWord) return;
    const newSteps = insertPatriciaSteps(root, insertWord);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleSearch = () => {
    if (!searchWord) return;
    const newSteps = searchPatriciaSteps(root, searchWord);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handleStepBackward = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleReset = () => setCurrentStep(0);

  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-2">Patricia Trie (Radix Trie)</h1>
          <p className="text-zinc-600 text-lg mb-4">
            A Patricia Trie is a compressed trie that merges chains of single-child nodes, optimizing space for storing strings with common prefixes.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-tree text-indigo-600"></i>
              <span>Compressed trie structure</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-arrow-repeat text-indigo-600"></i>
              <span>Path compression</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-search text-indigo-600"></i>
              <span>Efficient prefix search</span>
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-info-circle text-indigo-600"></i> What is a Patricia Trie?
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            Patricia Tries optimize standard tries by compressing chains of nodes with only one child into single edges labeled with strings, reducing memory usage and improving search speed.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <pre>{codeImplementations.javascript}</pre>
          </div>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3">
            <i className="bi bi-list-check text-indigo-600"></i> Key Features
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>Compressed trie with path compression</li>
            <li>Efficient storage of strings with common prefixes</li>
            <li>Fast prefix search and insertion</li>
            <li>Used in IP routing and dictionary compression</li>
          </ul>
        </motion.div>

        {/* Interactive Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo: Patricia Trie
          </h5>
          <div className="mb-4 flex flex-wrap gap-3">
            <input
              type="text"
              value={insertWord}
              onChange={e => setInsertWord(e.target.value)}
              placeholder="Insert word"
              className="w-48 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
              onClick={handleInsert}
              disabled={!insertWord}
            >
              Insert
            </button>
            <input
              type="text"
              value={searchWord}
              onChange={e => setSearchWord(e.target.value)}
              placeholder="Search word"
              className="w-48 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
              onClick={handleSearch}
              disabled={!searchWord}
            >
              Search
            </button>
          </div>
          <div className="mb-4 overflow-x-auto">{renderPatriciaNode(root, step ? step.highlightPath : [])}</div>
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-2 rounded border-2 border-indigo-400 bg-indigo-50 px-4 py-2 text-indigo-700 font-semibold shadow">
              <i className="bi bi-chat-text"></i>
              {step ? step.message : 'Ready for operation'}
            </div>
          </div>
          <div className="flex gap-2 justify-center mb-6">
            <button
              className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
              onClick={handleStepBackward}
              disabled={currentStep <= 0}
            >
              <i className="bi bi-skip-backward-fill"></i> Prev
            </button>
            <button
              className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
              onClick={handleStepForward}
              disabled={currentStep >= steps.length - 1}
            >
              <i className="bi bi-skip-forward-fill"></i> Next
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
              onClick={handleReset}
            >
              <i className="bi bi-arrow-counterclockwise"></i> Reset
            </button>
            <button
              className={`bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition ${
                steps.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => setIsPlaying((p) => !p)}
              disabled={steps.length <= 1}
            >
              <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i> {isPlaying ? 'Pause' : 'Play'}
            </button>
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
                  <td className="px-4 py-2 border border-gray-300">O(k)</td>
                  <td className="px-4 py-2 border border-gray-300">O(nk)</td>
                  <td className="px-4 py-2 border border-gray-300">k = length of word, n = number of words</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Search</td>
                  <td className="px-4 py-2 border border-gray-300">O(k)</td>
                  <td className="px-4 py-2 border border-gray-300">O(nk)</td>
                  <td className="px-4 py-2 border border-gray-300">k = length of word</td>
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
                <i className="bi bi-router text-indigo-600"></i> IP Routing
              </h6>
              <p className="text-zinc-700 text-sm">Efficient longest prefix matching in routers.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-file-earmark-text text-indigo-600"></i> Dictionary Compression
              </h6>
              <p className="text-zinc-700 text-sm">Compact storage of large string sets.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-search text-indigo-600"></i> Prefix Search
              </h6>
              <p className="text-zinc-700 text-sm">Fast prefix queries in text processing.</p>
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
              <li>Space-efficient compared to standard tries</li>
              <li>Fast prefix search and insertion</li>
              <li>Reduces memory by path compression</li>
              <li>Widely used in networking and text processing</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>More complex implementation than standard tries</li>
              <li>Insertion and search logic is more involved</li>
              <li>Less intuitive for beginners</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatriciaTrie;
