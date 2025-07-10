import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0 }
};

interface TrieNode {
  children: { [key: string]: TrieNode };
  isEnd: boolean;
  label?: string;
}

interface SuffixTrieStep {
  root: TrieNode;
  highlight: string[];
  message: string;
}

function cloneTrie(node: TrieNode): TrieNode {
  return {
    children: Object.fromEntries(
      Object.entries(node.children).map(([k, v]) => [k, cloneTrie(v)])
    ),
    isEnd: node.isEnd,
    label: node.label
  };
}

function insertSuffixTrieSteps(str: string): SuffixTrieStep[] {
  const steps: SuffixTrieStep[] = [];
  const root: TrieNode = { children: {}, isEnd: false, label: '' };
  for (let i = 0; i < str.length; i++) {
    let curr = root;
    const suffix = str.slice(i);
    steps.push({
      root: cloneTrie(root),
      highlight: [],
      message: `Start inserting suffix "${suffix}"`
    });
    for (let j = 0; j < suffix.length; j++) {
      const char = suffix[j];
      if (!curr.children[char]) {
        curr.children[char] = { children: {}, isEnd: false, label: char };
        steps.push({
          root: cloneTrie(root),
          highlight: [char],
          message: `Inserted node for '${char}'`
        });
      }
      curr = curr.children[char];
    }
    curr.isEnd = true;
    steps.push({
      root: cloneTrie(root),
      highlight: [suffix[suffix.length - 1]],
      message: `Marked end of suffix "${suffix}"`
    });
  }
  steps.push({
    root: cloneTrie(root),
    highlight: [],
    message: `All suffixes inserted`
  });
  return steps;
}

function searchSuffixTrieSteps(root: TrieNode, query: string): SuffixTrieStep[] {
  const steps: SuffixTrieStep[] = [];
  let curr = root;
  steps.push({
    root: cloneTrie(root),
    highlight: [],
    message: `Start searching for "${query}"`
  });
  for (let i = 0; i < query.length; i++) {
    const char = query[i];
    if (!curr.children[char]) {
      steps.push({
        root: cloneTrie(root),
        highlight: [char],
        message: `Character '${char}' not found: "${query}" is NOT a substring`
      });
      return steps;
    }
    curr = curr.children[char];
    steps.push({
      root: cloneTrie(root),
      highlight: [char],
      message: `Found '${char}', continue`
    });
  }
  steps.push({
    root: cloneTrie(root),
    highlight: [],
    message: `"${query}" is a substring`
  });
  return steps;
}

function renderTrie(node: TrieNode, highlight: string[] = [], depth = 0): React.ReactNode {
  return (
    <div className="flex flex-col items-center">
      {node.label !== undefined && node.label !== '' && (
        <div
          className={`rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg border-2 mb-1
            ${highlight.includes(node.label) ? 'bg-yellow-200 border-yellow-500 text-indigo-900' : 'bg-indigo-100 border-indigo-300 text-indigo-700'}`}
        >
          {node.label}
        </div>
      )}
      <div className="flex gap-2">
        {Object.entries(node.children).map(([char, child]) => (
          <div key={char} className="flex flex-col items-center">
            <div className="w-0.5 h-4 bg-indigo-300" />
            {renderTrie(child, highlight, depth + 1)}
          </div>
        ))}
      </div>
    </div>
  );
}

const codeImplementations = {
  javascript: `// Suffix Trie construction (simplified)
function buildSuffixTrie(str) {
  const root = {};
  for (let i = 0; i < str.length; i++) {
    let node = root;
    for (let j = i; j < str.length; j++) {
      const c = str[j];
      if (!node[c]) node[c] = {};
      node = node[c];
    }
    node['$'] = true; // End marker
  }
  return root;
}`
};

const defaultString = 'banana';

const SuffixTrie: React.FC = () => {
  const [inputStr, setInputStr] = useState<string>(defaultString);
  const [steps, setSteps] = useState<SuffixTrieStep[]>(insertSuffixTrieSteps(defaultString));
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [searchSteps, setSearchSteps] = useState<SuffixTrieStep[]>([]);
  const [searchCurrentStep, setSearchCurrentStep] = useState<number>(0);
  const [searchMode, setSearchMode] = useState<boolean>(false);
  const [speed] = useState<number>(1000);

  // Animation effect for construction
  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (!searchMode && isPlaying && steps.length > 0 && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, speed);
    }
    if (searchMode && isPlaying && searchSteps.length > 0 && searchCurrentStep < searchSteps.length - 1) {
      interval = setInterval(() => {
        setSearchCurrentStep((prev) => {
          if (prev < searchSteps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, speed);
    }
    return () => {
      if (interval !== undefined) clearInterval(interval);
    };
  }, [isPlaying, currentStep, steps.length, speed, searchMode, searchSteps.length, searchCurrentStep]);

  // Handle new input string
  const handleSetString = () => {
    setSteps(insertSuffixTrieSteps(inputStr));
    setCurrentStep(0);
    setIsPlaying(false);
    setSearchMode(false);
    setSearchSteps([]);
    setSearchCurrentStep(0);
  };

  // Handle substring search
  const handleSearch = () => {
    setSearchSteps(searchSuffixTrieSteps(steps[steps.length - 1].root, query));
    setSearchCurrentStep(0);
    setIsPlaying(false);
    setSearchMode(true);
  };

  // Stepper controls
  const handleStepForward = () => {
    if (searchMode) {
      if (searchCurrentStep < searchSteps.length - 1) setSearchCurrentStep(searchCurrentStep + 1);
    } else {
      if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    }
  };
  const handleStepBackward = () => {
    if (searchMode) {
      if (searchCurrentStep > 0) setSearchCurrentStep(searchCurrentStep - 1);
    } else {
      if (currentStep > 0) setCurrentStep(currentStep - 1);
    }
  };
  const handleReset = () => {
    if (searchMode) setSearchCurrentStep(0);
    else setCurrentStep(0);
  };

  // Visualization
  const step = searchMode ? searchSteps[searchCurrentStep] : steps[currentStep];

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-2">
            Suffix Trie
          </h1>
          <p className="text-zinc-600 text-lg mb-4">
            A Suffix Trie contains all suffixes of a string, enabling fast substring and pattern matching. Widely used in text algorithms and bioinformatics.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-diagram-2 text-indigo-600"></i>
              <span>All Suffixes Stored</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-search text-indigo-600"></i>
              <span>Substring Search</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-braces text-indigo-600"></i>
              <span>Pattern Matching</span>
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-info-circle text-indigo-600"></i>
            What is a Suffix Trie?
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            A Suffix Trie is a trie that contains all suffixes of a string. It enables efficient substring and pattern search, and is a foundation for advanced text algorithms.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <pre>{codeImplementations.javascript}</pre>
          </div>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3">
            <i className="bi bi-list-check text-indigo-600"></i>
            Key Features
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>All suffixes stored</li>
            <li>Fast substring/pattern search</li>
            <li>Space-efficient for repeated substrings</li>
            <li>Foundation for advanced text algorithms</li>
          </ul>
        </motion.div>

        {/* Interactive Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo: Suffix Trie
          </h5>
          <div className="mb-4 flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex gap-2 items-center">
              <input
                type="text"
                value={inputStr}
                onChange={e => setInputStr(e.target.value)}
                className="w-40 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="String"
              />
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
                onClick={handleSetString}
                disabled={inputStr.length === 0}
              >
                Build Suffix Trie
              </button>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-40 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Substring to search"
              />
              <button
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                onClick={handleSearch}
                disabled={steps.length === 0 || query.length === 0}
              >
                Search Substring
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                onClick={() => setIsPlaying((p) => !p)}
                disabled={
                  (searchMode && searchSteps.length <= 1) ||
                  (!searchMode && steps.length <= 1)
                }
              >
                <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
                onClick={handleReset}
              >
                <i className="bi bi-arrow-counterclockwise"></i> Reset
              </button>
              <button
                className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
                onClick={handleStepBackward}
                disabled={
                  (searchMode && searchCurrentStep <= 0) ||
                  (!searchMode && currentStep <= 0)
                }
              >
                <i className="bi bi-skip-backward-fill"></i>
              </button>
              <button
                className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
                onClick={handleStepForward}
                disabled={
                  (searchMode && searchCurrentStep >= searchSteps.length - 1) ||
                  (!searchMode && currentStep >= steps.length - 1)
                }
              >
                <i className="bi bi-skip-forward-fill"></i>
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-zinc-700 font-medium">Suffix Trie Visualization:</label>
            <div className="flex justify-center">{renderTrie(step ? step.root : steps[steps.length - 1].root, step ? step.highlight : [])}</div>
            <div className="text-center mb-3">
              <div className="inline-flex items-center gap-2 rounded border-2 border-indigo-400 bg-indigo-50 px-4 py-2 text-indigo-700 font-semibold shadow">
                <i className="bi bi-chat-text"></i>
                {step ? step.message : 'Ready for operation'}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Try searching for different substrings to see how the Suffix Trie enables fast queries!
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
                  <td className="px-4 py-2 border border-gray-300">Build</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-yellow-200 text-yellow-800 rounded px-2 py-1 font-semibold">O(n<sup>2</sup>)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(n<sup>2</sup>)</td>
                  <td className="px-4 py-2 border border-gray-300">Insert all suffixes of string</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Substring Search</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(m)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">m = length of query</td>
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
                <i className="bi bi-search text-indigo-600"></i> Substring Search
              </h6>
              <p className="text-zinc-700 text-sm">Find all occurrences of a substring in linear time.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-braces text-indigo-600"></i> Pattern Matching
              </h6>
              <p className="text-zinc-700 text-sm">Efficient pattern search in large texts.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-activity text-indigo-600"></i> Bioinformatics
              </h6>
              <p className="text-zinc-700 text-sm">DNA sequence analysis and matching.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-file-earmark-text text-indigo-600"></i> Plagiarism Detection
              </h6>
              <p className="text-zinc-700 text-sm">Detect copied text efficiently.</p>
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
              <li>Fast substring/pattern search</li>
              <li>Handles repeated substrings efficiently</li>
              <li>Foundation for suffix tree/array algorithms</li>
              <li>Widely used in text processing</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>O(n<sup>2</sup>) space for naive implementation</li>
              <li>Not optimal for very large texts</li>
              <li>Suffix trees/arrays are more space-efficient for large data</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuffixTrie;
