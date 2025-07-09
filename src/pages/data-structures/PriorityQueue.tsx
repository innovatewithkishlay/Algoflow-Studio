import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0 }
};

interface HeapStep {
  heap: { value: number; priority: number }[];
  action: string;
  highlight: number[];
  message: string;
}

function parent(i: number) { return Math.floor((i - 1) / 2); }
function left(i: number) { return 2 * i + 1; }
function right(i: number) { return 2 * i + 2; }

function heapifyUp(heap: { value: number; priority: number }[], idx: number, steps: HeapStep[]) {
  while (idx > 0 && heap[parent(idx)].priority < heap[idx].priority) {
    [heap[parent(idx)], heap[idx]] = [heap[idx], heap[parent(idx)]];
    steps.push({
      heap: [...heap],
      action: 'heapify-up',
      highlight: [idx, parent(idx)],
      message: `Swapped with parent to maintain heap property`
    });
    idx = parent(idx);
  }
}

function heapifyDown(heap: { value: number; priority: number }[], idx: number, steps: HeapStep[]) {
  let n = heap.length;
  while (true) {
    let largest = idx;
    let l = left(idx), r = right(idx);
    if (l < n && heap[l].priority > heap[largest].priority) largest = l;
    if (r < n && heap[r].priority > heap[largest].priority) largest = r;
    if (largest !== idx) {
      [heap[largest], heap[idx]] = [heap[idx], heap[largest]];
      steps.push({
        heap: [...heap],
        action: 'heapify-down',
        highlight: [idx, largest],
        message: `Swapped with child to maintain heap property`
      });
      idx = largest;
    } else break;
  }
}

function insertSteps(
  heap: { value: number; priority: number }[],
  value: number,
  priority: number
): HeapStep[] {
  const steps: HeapStep[] = [];
  const newHeap = [...heap, { value, priority }];
  steps.push({
    heap: [...newHeap],
    action: 'insert',
    highlight: [newHeap.length - 1],
    message: `Inserted value ${value} with priority ${priority}`
  });
  heapifyUp(newHeap, newHeap.length - 1, steps);
  steps.push({
    heap: [...newHeap],
    action: 'insert-complete',
    highlight: [],
    message: `Insert complete`
  });
  return steps;
}

function extractMaxSteps(heap: { value: number; priority: number }[]): HeapStep[] {
  const steps: HeapStep[] = [];
  if (heap.length === 0) {
    steps.push({
      heap: [],
      action: 'extract-empty',
      highlight: [],
      message: 'Heap is empty!'
    });
    return steps;
  }
  const newHeap = [...heap];
  steps.push({
    heap: [...newHeap],
    action: 'extract',
    highlight: [0],
    message: `Extracting max value ${newHeap[0].value} (priority ${newHeap[0].priority})`
  });
  newHeap[0] = newHeap[newHeap.length - 1];
  newHeap.pop();
  steps.push({
    heap: [...newHeap],
    action: 'extract-pop',
    highlight: [0],
    message: `Moved last element to root and popped`
  });
  heapifyDown(newHeap, 0, steps);
  steps.push({
    heap: [...newHeap],
    action: 'extract-complete',
    highlight: [],
    message: `Extract complete`
  });
  return steps;
}

const codeImplementations = {
  javascript: `// Max Priority Queue using Heap
class PriorityQueue {
  constructor() { this.heap = []; }
  insert(value, priority) {
    this.heap.push({ value, priority });
    let idx = this.heap.length - 1;
    while (idx > 0 && this.heap[Math.floor((idx-1)/2)].priority < this.heap[idx].priority) {
      [this.heap[Math.floor((idx-1)/2)], this.heap[idx]] = [this.heap[idx], this.heap[Math.floor((idx-1)/2)]];
      idx = Math.floor((idx-1)/2);
    }
  }
  extractMax() {
    if (this.heap.length === 0) return null;
    const max = this.heap[0];
    this.heap[0] = this.heap[this.heap.length-1];
    this.heap.pop();
    let idx = 0, n = this.heap.length;
    while (true) {
      let largest = idx, l = 2*idx+1, r = 2*idx+2;
      if (l < n && this.heap[l].priority > this.heap[largest].priority) largest = l;
      if (r < n && this.heap[r].priority > this.heap[largest].priority) largest = r;
      if (largest !== idx) {
        [this.heap[largest], this.heap[idx]] = [this.heap[idx], this.heap[largest]];
        idx = largest;
      } else break;
    }
    return max;
  }
}`
};

const defaultHeap = [
  { value: 10, priority: 5 },
  { value: 20, priority: 8 },
  { value: 15, priority: 7 }
];

const PriorityQueue: React.FC = () => {
  const [heap, setHeap] = useState<{ value: number; priority: number }[]>([...defaultHeap]);
  const [steps, setSteps] = useState<HeapStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [insertValue, setInsertValue] = useState<number>(0);
  const [insertPriority, setInsertPriority] = useState<number>(1);
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

  // Insert operation
  const handleInsert = () => {
    const s = insertSteps(heap, insertValue, insertPriority);
    setSteps(s);
    setCurrentStep(0);
    setIsPlaying(false);
    setTimeout(() => {
      setHeap(s[s.length - 1].heap);
    }, s.length * speed);
  };

  // Extract max operation
  const handleExtract = () => {
    const s = extractMaxSteps(heap);
    setSteps(s);
    setCurrentStep(0);
    setIsPlaying(false);
    setTimeout(() => {
      setHeap(s[s.length - 1].heap);
    }, s.length * speed);
  };

  // Visualization
  const step = steps[currentStep];

  const renderHeap = (heap: { value: number; priority: number }[], highlight: number[]) => (
    <div className="flex flex-wrap gap-3 justify-center items-end mt-2 mb-2">
      {heap.map((node, i) => (
        <div
          key={i}
          className={`flex flex-col items-center transition-all duration-300
            ${highlight.includes(i) ? 'bg-yellow-200 border-yellow-500' : 'bg-indigo-100 border-indigo-300'}
            border-2 rounded-lg px-3 py-2 shadow`}
        >
          <div className="text-xl font-bold text-indigo-700">{node.value}</div>
          <div className="text-xs text-zinc-600">Priority: {node.priority}</div>
          <div className="text-xs text-zinc-400">[{i}]</div>
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
            Priority Queue (Max-Heap)
          </h1>
          <p className="text-zinc-600 text-lg mb-4">
            A Priority Queue processes elements based on priority, not insertion order. This demo uses a Max-Heap for visualization.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-arrow-up-circle text-indigo-600"></i>
              <span>Heap-based</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-lightbulb text-indigo-600"></i>
              <span>Dynamic Priorities</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-stack text-indigo-600"></i>
              <span>Efficient Extraction</span>
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-info-circle text-indigo-600"></i>
            What is a Priority Queue?
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            A Priority Queue is a data structure where each element has a priority. Elements are served based on priority, not just order of insertion. Usually implemented with a heap for efficiency.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <pre>{codeImplementations.javascript}</pre>
          </div>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3">
            <i className="bi bi-list-check text-indigo-600"></i>
            Key Features
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>Elements with priorities</li>
            <li>Efficient insert and extract-max operations</li>
            <li>Heap-based implementation</li>
            <li>Dynamic priority updates</li>
          </ul>
        </motion.div>

        {/* Interactive Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo: Priority Queue
          </h5>
          <div className="mb-4 flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex gap-2 items-center">
              <input
                type="number"
                value={insertValue}
                onChange={e => setInsertValue(Number(e.target.value))}
                className="w-20 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Value"
              />
              <input
                type="number"
                value={insertPriority}
                onChange={e => setInsertPriority(Number(e.target.value))}
                className="w-24 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Priority"
              />
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
                onClick={handleInsert}
              >
                Insert
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
                onClick={handleExtract}
                disabled={heap.length === 0}
              >
                Extract Max
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
            <label className="block mb-1 text-zinc-700 font-medium">Heap Visualization:</label>
            {renderHeap(step ? step.heap : heap, step ? step.highlight : [])}
            <div className="text-center mb-3">
              <div className="inline-flex items-center gap-2 rounded border-2 border-indigo-400 bg-indigo-50 px-4 py-2 text-indigo-700 font-semibold shadow">
                <i className="bi bi-chat-text"></i>
                {step ? step.message : 'Ready for operation'}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Insert values with custom priorities and watch the heap restructure itself!
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
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(log n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(n)</td>
                  <td className="px-4 py-2 border border-gray-300">Add value with priority</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Extract Max</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(log n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(n)</td>
                  <td className="px-4 py-2 border border-gray-300">Remove and return max priority</td>
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
                <i className="bi bi-calendar-check text-indigo-600"></i> Task Scheduling
              </h6>
              <p className="text-zinc-700 text-sm">Process high-priority tasks first.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-geo-alt text-indigo-600"></i> Dijkstra's Algorithm
              </h6>
              <p className="text-zinc-700 text-sm">Find shortest paths efficiently.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-clock-history text-indigo-600"></i> Event-driven Simulation
              </h6>
              <p className="text-zinc-700 text-sm">Simulate events by priority/time.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-bar-chart text-indigo-600"></i> Load Balancing
              </h6>
              <p className="text-zinc-700 text-sm">Distribute jobs by priority.</p>
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
              <li>Efficient insert/extract operations</li>
              <li>Dynamic priorities</li>
              <li>Widely used in algorithms</li>
              <li>Simple heap implementation</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Not suitable for fast arbitrary removal</li>
              <li>Heap property only guarantees max/min at root</li>
              <li>Priority updates require re-heapify</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PriorityQueue;
