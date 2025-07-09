import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0 }
};

interface FenwickStep {
  bit: number[];
  arr: number[];
  index: number;
  value: number;
  operation: 'update' | 'query' | null;
  highlight: number[];
  message: string;
  result?: number;
}

function getLSB(i: number) {
  return i & -i;
}

// Generate steps for update/query operations for visualization
function fenwickSteps(
  arr: number[],
  op: 'update' | 'query',
  idx: number,
  val: number = 0
): FenwickStep[] {
  const n = arr.length;
  const bit = Array(n + 1).fill(0);
  const steps: FenwickStep[] = [];
  // Build BIT from arr
  for (let i = 1; i <= n; i++) {
    let j = i;
    while (j <= n) {
      bit[j] += arr[i - 1];
      j += getLSB(j);
    }
  }

  if (op === 'update') {
    let i = idx + 1;
    steps.push({
      bit: [...bit],
      arr: [...arr],
      index: idx,
      value: val,
      operation: 'update',
      highlight: [i],
      message: `Start updating index ${idx} (add ${val})`
    });
    arr[idx] += val;
    while (i <= n) {
      bit[i] += val;
      steps.push({
        bit: [...bit],
        arr: [...arr],
        index: idx,
        value: val,
        operation: 'update',
        highlight: [i],
        message: `Update BIT[${i}] += ${val}`
      });
      i += getLSB(i);
    }
    steps.push({
      bit: [...bit],
      arr: [...arr],
      index: idx,
      value: val,
      operation: 'update',
      highlight: [],
      message: `Update complete`
    });
  } else if (op === 'query') {
    let sum = 0;
    let i = idx + 1;
    steps.push({
      bit: [...bit],
      arr: [...arr],
      index: idx,
      value: 0,
      operation: 'query',
      highlight: [i],
      message: `Start prefix sum query for index ${idx}`,
      result: sum
    });
    while (i > 0) {
      sum += bit[i];
      steps.push({
        bit: [...bit],
        arr: [...arr],
        index: idx,
        value: 0,
        operation: 'query',
        highlight: [i],
        message: `Add BIT[${i}] (${bit[i]}) to sum (now ${sum})`,
        result: sum
      });
      i -= getLSB(i);
    }
    steps.push({
      bit: [...bit],
      arr: [...arr],
      index: idx,
      value: 0,
      operation: 'query',
      highlight: [],
      message: `Final prefix sum: ${sum}`,
      result: sum
    });
  }
  return steps;
}

const codeImplementations = {
  javascript: `// Fenwick Tree implementation
class FenwickTree {
  constructor(n) {
    this.n = n;
    this.bit = Array(n + 1).fill(0);
  }
  update(i, val) {
    i++;
    while (i <= this.n) {
      this.bit[i] += val;
      i += i & -i;
    }
  }
  query(i) {
    i++;
    let sum = 0;
    while (i > 0) {
      sum += this.bit[i];
      i -= i & -i;
    }
    return sum;
  }
}`
};

const defaultArr = [2, 1, 4, 6, -1, 5];

const FenwickTree: React.FC = () => {
  const [arr, setArr] = useState<number[]>([...defaultArr]);
  const [steps, setSteps] = useState<FenwickStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [opType, setOpType] = useState<'update' | 'query'>('update');
  const [index, setIndex] = useState<number>(0);
  const [value, setValue] = useState<number>(1);
  const [speed] = useState<number>(1000);

  // Reset steps when array changes
  React.useEffect(() => {
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [arr]);

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


  // Start visualization
  const handleVisualize = () => {
    setSteps(fenwickSteps([...arr], opType, index, opType === 'update' ? value : 0));
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

  const handleArrChange = (i: number, v: number) => {
    const newArr = [...arr];
    newArr[i] = v;
    setArr(newArr);
  };

  const step = steps[currentStep];

  // Visualize BIT and array
  const renderArray = (arr: number[]) => (
    <div className="flex gap-2 items-end mb-2">
      {arr.map((v, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-10 h-10 flex items-center justify-center rounded bg-indigo-100 text-zinc-900 font-bold border border-indigo-300">
            {v}
          </div>
          <div className="text-xs text-zinc-500 mt-1">arr[{i}]</div>
        </div>
      ))}
    </div>
  );

  const renderBIT = (bit: number[], highlight: number[]) => (
    <div className="flex gap-2 items-end">
      {bit.slice(1).map((v, i) => (
        <div key={i + 1} className={`flex flex-col items-center`}>
          <div
            className={`w-10 h-10 flex items-center justify-center rounded font-bold border
              ${highlight.includes(i + 1)
                ? 'bg-yellow-300 border-yellow-500 text-indigo-900'
                : 'bg-indigo-50 border-indigo-200 text-zinc-700'}`}
          >
            {v}
          </div>
          <div className="text-xs text-zinc-500 mt-1">BIT[{i + 1}]</div>
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
            Fenwick Tree (Binary Indexed Tree)
          </h1>
          <p className="text-zinc-600 text-lg mb-4">
            Fenwick Tree is a data structure that efficiently supports prefix sum queries and point updates on arrays. Used heavily in competitive programming and range query problems.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-list-ol text-indigo-600"></i>
              <span>Prefix Sums</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-lightbulb text-indigo-600"></i>
              <span>Efficient Updates</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-diagram-2 text-indigo-600"></i>
              <span>Array-based Structure</span>
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-info-circle text-indigo-600"></i>
            What is Fenwick Tree?
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            Fenwick Tree, or Binary Indexed Tree, allows efficient calculation of prefix sums and updates in logarithmic time. It is especially useful for frequency tables, inversion counts, and range queries.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <pre>{codeImplementations.javascript}</pre>
          </div>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3">
            <i className="bi bi-list-check text-indigo-600"></i>
            Key Features
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>Efficient prefix sum queries</li>
            <li>Supports point updates</li>
            <li>Space-efficient array-based implementation</li>
            <li>Ideal for cumulative frequency tables</li>
          </ul>
        </motion.div>

        {/* Interactive Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo: Fenwick Tree
          </h5>
          {/* Array Editor */}
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <span className="text-zinc-700 font-medium mr-2">Array:</span>
            {arr.map((v, i) => (
              <input
                key={i}
                type="number"
                value={v}
                onChange={(e) => handleArrChange(i, Number(e.target.value))}
                className="w-14 rounded border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ))}
            <button
              className="ml-2 bg-indigo-600 text-white px-3 py-1 rounded shadow hover:bg-indigo-700 transition"
              onClick={() => setArr([...defaultArr])}
            >
              Reset Array
            </button>
          </div>
          {/* Controls */}
          <div className="mb-4 flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex gap-2 items-center">
              <select
                value={opType}
                onChange={e => setOpType(e.target.value as 'update' | 'query')}
                className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="update">Update</option>
                <option value="query">Prefix Sum Query</option>
              </select>
              <input
                type="number"
                value={index}
                min={0}
                max={arr.length - 1}
                onChange={e => setIndex(Number(e.target.value))}
                className="w-20 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Index"
              />
              {opType === 'update' && (
                <input
                  type="number"
                  value={value}
                  onChange={e => setValue(Number(e.target.value))}
                  className="w-20 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Value"
                />
              )}
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
                onClick={handleVisualize}
                disabled={index < 0 || index >= arr.length}
              >
                Visualize
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
          {/* Visualization */}
          <div className="mb-4">
            <label className="block mb-1 text-zinc-700 font-medium">Original Array:</label>
            {renderArray(step ? step.arr : arr)}
            <label className="block mb-1 text-zinc-700 font-medium">Fenwick Tree Array (BIT):</label>
            {renderBIT(step ? step.bit : Array(arr.length + 1).fill(0), step ? step.highlight : [])}
            <div className="text-center mb-3">
              <div className="inline-flex items-center gap-2 rounded border-2 border-indigo-400 bg-indigo-50 px-4 py-2 text-indigo-700 font-semibold shadow">
                <i className="bi bi-chat-text"></i>
                {step ? step.message : 'Ready for operation'}
                {step && step.operation === 'query' && typeof step.result === 'number' ? (
                  <span className="ml-3 text-green-700 font-bold">
                    {step.highlight.length === 0 ? `Result: ${step.result}` : ''}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Use the controls to step through updates and queries. Watch how only a few BIT cells are touched!
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
                  <td className="px-4 py-2 border border-gray-300">Update</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(log n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(n)</td>
                  <td className="px-4 py-2 border border-gray-300">Add value to index</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Prefix Query</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(log n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(n)</td>
                  <td className="px-4 py-2 border border-gray-300">Sum from 0 to index</td>
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
                <i className="bi bi-list-ol text-indigo-600"></i> Prefix Sum Queries
              </h6>
              <p className="text-zinc-700 text-sm">Efficiently compute cumulative sums in arrays.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-bar-chart-line text-indigo-600"></i> Frequency Tables
              </h6>
              <p className="text-zinc-700 text-sm">Maintain and update running frequencies.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-shuffle text-indigo-600"></i> Inversion Counting
              </h6>
              <p className="text-zinc-700 text-sm">Count inversions in arrays for sorting problems.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-trophy text-indigo-600"></i> Competitive Programming
              </h6>
              <p className="text-zinc-700 text-sm">Widely used for range query problems.</p>
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
              <li>Logarithmic time for updates and queries</li>
              <li>Simple, array-based structure</li>
              <li>Space-efficient</li>
              <li>Easy to implement</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Only supports prefix/range queries (not arbitrary intervals without extension)</li>
              <li>1-indexed implementation can be confusing</li>
              <li>Not as flexible as Segment Tree for range updates</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FenwickTree;
