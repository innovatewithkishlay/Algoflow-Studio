import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0 }
};

interface BloomStep {
  bitArray: number[];
  hashes: number[];
  value: string;
  operation: 'add' | 'query';
  result?: boolean;
  message: string;
}

const BLOOM_SIZE = 16;
// const HASH_COUNT = 3;

// Simple hash functions for demonstration
function hash1(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash + str.charCodeAt(i)) % BLOOM_SIZE;
  return hash;
}
function hash2(str: string) {
  let hash = 1;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) % BLOOM_SIZE;
  return hash;
}
function hash3(str: string) {
  let hash = 7;
  for (let i = 0; i < str.length; i++) hash = (hash * 17 + str.charCodeAt(i) * 13) % BLOOM_SIZE;
  return hash;
}
const hashFns = [hash1, hash2, hash3];

function bloomAddSteps(bitArray: number[], value: string): BloomStep[] {
  const steps: BloomStep[] = [];
  const hashes = hashFns.map(fn => fn(value));
  const arr = [...bitArray];
  steps.push({
    bitArray: [...arr],
    hashes,
    value,
    operation: 'add',
    message: `Hashing "${value}" to positions ${hashes.join(', ')}`
  });
  hashes.forEach((h, idx) => {
    arr[h] = 1;
    steps.push({
      bitArray: [...arr],
      hashes: [h],
      value,
      operation: 'add',
      message: `Set bit at position ${h} to 1 (hash #${idx + 1})`
    });
  });
  steps.push({
    bitArray: [...arr],
    hashes: [],
    value,
    operation: 'add',
    message: `Element "${value}" added`
  });
  return steps;
}

function bloomQuerySteps(bitArray: number[], value: string): BloomStep[] {
  const steps: BloomStep[] = [];
  const hashes = hashFns.map(fn => fn(value));
  const arr = [...bitArray];
  steps.push({
    bitArray: [...arr],
    hashes,
    value,
    operation: 'query',
    message: `Hashing "${value}" to positions ${hashes.join(', ')}`
  });
  let found = true;
  hashes.forEach((h, idx) => {
    steps.push({
      bitArray: [...arr],
      hashes: [h],
      value,
      operation: 'query',
      result: arr[h] === 1,
      message:
        arr[h] === 1
          ? `Bit at position ${h} is set (hash #${idx + 1})`
          : `Bit at position ${h} is 0 (hash #${idx + 1}): definitely not in set`
    });
    if (arr[h] === 0) found = false;
  });
  steps.push({
    bitArray: [...arr],
    hashes: [],
    value,
    operation: 'query',
    result: found,
    message: found
      ? `"${value}" may be in the set (possible false positive)`
      : `"${value}" is definitely not in the set`
  });
  return steps;
}

const codeImplementations = {
  javascript: `// Simple Bloom Filter (fixed size, 3 hashes)
class BloomFilter {
  constructor(size = 16) {
    this.size = size;
    this.bits = Array(size).fill(0);
  }
  _hashes(str) {
    // Use 3 simple hashes for demo
    const hash1 = [...str].reduce((h, c) => (h + c.charCodeAt(0)) % this.size, 0);
    const hash2 = [...str].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % this.size, 1);
    const hash3 = [...str].reduce((h, c) => (h * 17 + c.charCodeAt(0) * 13) % this.size, 7);
    return [hash1, hash2, hash3];
  }
  add(str) {
    for (const h of this._hashes(str)) this.bits[h] = 1;
  }
  query(str) {
    return this._hashes(str).every(h => this.bits[h] === 1);
  }
}`
};

const defaultElements = ['cat', 'dog', 'bird'];

const BloomFilter: React.FC = () => {
  const [bitArray, setBitArray] = useState<number[]>(Array(BLOOM_SIZE).fill(0));
  const [elements, setElements] = useState<string[]>([...defaultElements]);
  const [steps, setSteps] = useState<BloomStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [opType, setOpType] = useState<'add' | 'query'>('add');
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

  // Stepper controls
  const handleStepForward = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };
  const handleStepBackward = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };
  const handleReset = () => setCurrentStep(0);

  // Add or Query
  const handleOperate = () => {
    if (!inputValue) return;
    let s: BloomStep[] = [];
    if (opType === 'add') {
      s = bloomAddSteps(bitArray, inputValue);
      setTimeout(() => {
        setBitArray(s[s.length - 1].bitArray);
        setElements([...elements, inputValue]);
      }, s.length * speed);
    } else {
      s = bloomQuerySteps(bitArray, inputValue);
    }
    setSteps(s);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // Visualization
  const step = steps[currentStep];

  const renderBitArray = (arr: number[], highlight: number[]) => (
    <div className="flex flex-wrap gap-1 justify-center items-end mt-2 mb-2">
      {arr.map((bit, i) => (
        <div
          key={i}
          className={`flex flex-col items-center transition-all duration-300
            ${highlight.includes(i) ? 'bg-yellow-200 border-yellow-500' : bit === 1 ? 'bg-indigo-400 border-indigo-600 text-white' : 'bg-indigo-50 border-indigo-200 text-zinc-700'}
            border-2 rounded-lg px-2 py-2 shadow`}
        >
          <div className="text-lg font-bold">{bit}</div>
          <div className="text-xs text-zinc-500">[{i}]</div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-2">
            Bloom Filter
          </h1>
          <p className="text-zinc-600 text-lg mb-4">
            A Bloom Filter is a probabilistic data structure for set membership queries, allowing false positives but no false negatives.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-funnel text-indigo-600"></i>
              <span>Probabilistic</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-lightbulb text-indigo-600"></i>
              <span>Space Efficient</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-hash text-indigo-600"></i>
              <span>Multiple Hashes</span>
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-info-circle text-indigo-600"></i>
            What is a Bloom Filter?
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            A Bloom Filter uses multiple hash functions to set bits in a fixed-size array. Queries may return false positives, but never false negatives.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <pre>{codeImplementations.javascript}</pre>
          </div>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3">
            <i className="bi bi-list-check text-indigo-600"></i>
            Key Features
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>Probabilistic membership testing</li>
            <li>Space-efficient</li>
            <li>No false negatives</li>
            <li>Multiple hash functions</li>
          </ul>
        </motion.div>

        {/* Interactive Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo: Bloom Filter
          </h5>
          <div className="mb-4 flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex gap-2 items-center">
              <select
                value={opType}
                onChange={e => setOpType(e.target.value as 'add' | 'query')}
                className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="add">Add</option>
                <option value="query">Query</option>
              </select>
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="w-32 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Element"
              />
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
                onClick={handleOperate}
                disabled={!inputValue}
              >
                {opType === 'add' ? 'Add' : 'Query'}
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
            <label className="block mb-1 text-zinc-700 font-medium">Bit Array Visualization:</label>
            {renderBitArray(step ? step.bitArray : bitArray, step ? step.hashes : [])}
            <div className="text-center mb-3">
              <div className="inline-flex items-center gap-2 rounded border-2 border-indigo-400 bg-indigo-50 px-4 py-2 text-indigo-700 font-semibold shadow">
                <i className="bi bi-chat-text"></i>
                {step ? step.message : 'Ready for operation'}
                {step && step.operation === 'query' && typeof step.result === 'boolean' ? (
                  <span className={`ml-3 font-bold ${step.result ? 'text-green-700' : 'text-red-700'}`}>
                    {step.hashes.length === 0
                      ? step.result
                        ? 'Possibly present'
                        : 'Definitely not present'
                      : ''}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Try querying for an element that was not added to see a definite "not present"!
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
                  <td className="px-4 py-2 border border-gray-300">Add</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(k)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(m)</td>
                  <td className="px-4 py-2 border border-gray-300">Set k bits for element</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Query</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(k)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(m)</td>
                  <td className="px-4 py-2 border border-gray-300">Check k bits for element</td>
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
                <i className="bi bi-database text-indigo-600"></i> Database Query Optimization
              </h6>
              <p className="text-zinc-700 text-sm">Quickly check if a value might be present in a large dataset.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-cloud text-indigo-600"></i> Web Cache Filtering
              </h6>
              <p className="text-zinc-700 text-sm">Prevent unnecessary lookups for missing items.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-graph-up text-indigo-600"></i> Network Packet Analysis
              </h6>
              <p className="text-zinc-700 text-sm">Efficiently track seen packets in high-throughput networks.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-spellcheck text-indigo-600"></i> Spell Checking
              </h6>
              <p className="text-zinc-700 text-sm">Check if a word is possibly in a dictionary.</p>
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
              <li>Very space efficient</li>
              <li>Fast add and query operations</li>
              <li>No false negatives</li>
              <li>Simple implementation</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>False positives possible</li>
              <li>Cannot remove elements (without extensions)</li>
              <li>Membership is probabilistic</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BloomFilter;
