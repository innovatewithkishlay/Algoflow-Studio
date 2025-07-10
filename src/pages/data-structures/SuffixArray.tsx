import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0 }
};

interface Suffix {
  index: number;
  text: string;
}

interface SuffixArrayStep {
  suffixes: Suffix[];
  highlight: number[];
  message: string;
  lcp?: number[];
}

function buildSuffixArraySteps(str: string): SuffixArrayStep[] {
  const steps: SuffixArrayStep[] = [];
  const suffixes: Suffix[] = [];
  for (let i = 0; i < str.length; i++) {
    suffixes.push({ index: i, text: str.slice(i) });
    steps.push({
      suffixes: [...suffixes],
      highlight: [i],
      message: `Added suffix "${str.slice(i)}" starting at index ${i}`
    });
  }
  // Sort suffixes step by step
  const sorted = [...suffixes];
  sorted.sort((a, b) => a.text.localeCompare(b.text));
  steps.push({
    suffixes: [...sorted],
    highlight: [],
    message: 'Sorted all suffixes lexicographically'
  });

  // Build LCP array (Longest Common Prefix)
  const lcp: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    let len = 0;
    while (
      sorted[i - 1].text[len] &&
      sorted[i].text[len] &&
      sorted[i - 1].text[len] === sorted[i].text[len]
    ) {
      len++;
    }
    lcp.push(len);
  }
  steps.push({
    suffixes: [...sorted],
    highlight: [],
    message: 'Computed LCP array',
    lcp: [0, ...lcp]
  });

  return steps;
}

function renderSuffixArray(suffixes: Suffix[], highlight: number[] = [], lcp?: number[]) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex font-mono font-bold text-indigo-700 mb-2">
        <div className="w-16">Index</div>
        <div className="w-32">Suffix</div>
        {lcp && <div className="w-16">LCP</div>}
      </div>
      {suffixes.map((suf, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-16 px-2 py-1 rounded text-center border
              ${highlight.includes(i) ? 'bg-yellow-200 border-yellow-500' : 'bg-indigo-50 border-indigo-200'}`}
          >
            {suf.index}
          </div>
          <div
            className={`w-32 px-2 py-1 rounded border font-mono
              ${highlight.includes(i) ? 'bg-yellow-200 border-yellow-500' : 'bg-indigo-50 border-indigo-200'}`}
          >
            {suf.text}
          </div>
          {lcp && (
            <div className="w-16 px-2 py-1 text-center border bg-indigo-50 border-indigo-200">
              {lcp[i]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const codeImplementations = {
  javascript: `// Suffix Array construction (naive)
function buildSuffixArray(str) {
  const suffixes = [];
  for (let i = 0; i < str.length; i++) {
    suffixes.push({ index: i, text: str.slice(i) });
  }
  suffixes.sort((a, b) => a.text.localeCompare(b.text));
  return suffixes.map(s => s.index);
}`
};

const defaultString = 'banana';

const SuffixArray: React.FC = () => {
  const [inputStr, setInputStr] = useState<string>(defaultString);
  const [steps, setSteps] = useState<SuffixArrayStep[]>(buildSuffixArraySteps(defaultString));
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed] = useState<number>(1000);

  // Animation effect
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
      if (interval !== undefined) clearInterval(interval);
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  // Handle new input string
  const handleSetString = () => {
    setSteps(buildSuffixArraySteps(inputStr));
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // Stepper controls
  const handleStepForward = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };
  const handleStepBackward = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };
  const handleReset = () => setCurrentStep(0);

  // Visualization
  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-2">
            Suffix Array
          </h1>
          <p className="text-zinc-600 text-lg mb-4">
            A Suffix Array is a sorted array of all suffixes of a string. It enables fast substring search and pattern matching, and is widely used in text indexing.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-list-ol text-indigo-600"></i>
              <span>Suffix Sorting</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-sort-alpha-down text-indigo-600"></i>
              <span>Lexicographical Order</span>
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
            What is a Suffix Array?
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            A Suffix Array is a space-efficient alternative to Suffix Trie/Tree. It stores all suffixes of a string in sorted order, enabling fast substring and pattern search with binary search.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <pre>{codeImplementations.javascript}</pre>
          </div>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3">
            <i className="bi bi-list-check text-indigo-600"></i>
            Key Features
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>All suffixes sorted lexicographically</li>
            <li>Fast substring/pattern search</li>
            <li>Space-efficient for large texts</li>
            <li>Foundation for advanced text algorithms</li>
          </ul>
        </motion.div>

        {/* Interactive Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo: Suffix Array
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
                Build Suffix Array
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                onClick={() => setIsPlaying((p) => !p)}
                disabled={steps.length <= 1}
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
                disabled={currentStep <= 0}
              >
                <i className="bi bi-skip-backward-fill"></i>
              </button>
              <button
                className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
                onClick={handleStepForward}
                disabled={currentStep >= steps.length - 1}
              >
                <i className="bi bi-skip-forward-fill"></i>
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-zinc-700 font-medium">Suffix Array Visualization:</label>
            <div className="flex justify-center">{renderSuffixArray(step.suffixes, step.highlight, step.lcp)}</div>
            <div className="text-center mb-3">
              <div className="inline-flex items-center gap-2 rounded border-2 border-indigo-400 bg-indigo-50 px-4 py-2 text-indigo-700 font-semibold shadow">
                <i className="bi bi-chat-text"></i>
                {step ? step.message : 'Ready for operation'}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Try different strings to see how suffixes and LCPs change!
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
                  <td className="px-4 py-2 border border-gray-300">Build (naive)</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-yellow-200 text-yellow-800 rounded px-2 py-1 font-semibold">O(n² log n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(n²)</td>
                  <td className="px-4 py-2 border border-gray-300">Sort all suffixes</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Substring Search</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(m log n)</span>
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
              <p className="text-zinc-700 text-sm">Find all occurrences of a substring efficiently.</p>
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
                <i className="bi bi-file-earmark-text text-indigo-600"></i> Full-Text Indexing
              </h6>
              <p className="text-zinc-700 text-sm">Used in search engines and databases.</p>
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
              <li>Space-efficient compared to suffix trie/tree</li>
              <li>Fast substring/pattern search</li>
              <li>Foundation for advanced text algorithms</li>
              <li>Widely used in search engines</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Naive build is O(n² log n); advanced algorithms are complex</li>
              <li>Less intuitive than tries for beginners</li>
              <li>LCP array requires extra computation</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuffixArray;
