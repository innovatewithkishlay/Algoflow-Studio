import React, { useState, useRef, useEffect } from 'react';

interface CountingSortStep {
  array: number[];
  countArray: number[];
  outputArray: number[];
  i: number;
  phase: 'counting' | 'cumulative' | 'building' | 'done';
  message: string;
  sorted: number[];
}

const codeImplementations = {
  javascript: `function countingSort(arr) {
  let max = Math.max(...arr);
  let count = Array(max + 1).fill(0);
  for (let i = 0; i < arr.length; i++) count[arr[i]]++;
  for (let i = 1; i < count.length; i++) count[i] += count[i - 1];
  let output = Array(arr.length);
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i]] - 1] = arr[i];
    count[arr[i]]--;
  }
  return output;
}`
};

const CountingSort: React.FC = () => {
  const [originalArray, setOriginalArray] = useState<number[]>([4, 2, 2, 8, 3, 3, 1]);
  const [array, setArray] = useState<number[]>([4, 2, 2, 8, 3, 3, 1]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [sortSteps, setSortSteps] = useState<CountingSortStep[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [inputArray, setInputArray] = useState<string>('4,2,2,8,3,3,1');
  const [speed] = useState<number>(1000);
  const intervalRef = useRef<number | null>(null);

  // Generate counting sort steps for the current array
  const generateCountingSortSteps = (arr: number[]): CountingSortStep[] => {
    const steps: CountingSortStep[] = [];
    const max = Math.max(...arr);
    const count = Array(max + 1).fill(0);
    const output = Array(arr.length).fill(0);

    // Counting phase
    for (let i = 0; i < arr.length; i++) {
      count[arr[i]]++;
      steps.push({
        array: [...arr],
        countArray: [...count],
        outputArray: [...output],
        i,
        phase: 'counting',
        message: `Counting occurrence of ${arr[i]}`,
        sorted: []
      });
    }

    // Cumulative phase
    for (let i = 1; i < count.length; i++) {
      count[i] += count[i - 1];
      steps.push({
        array: [...arr],
        countArray: [...count],
        outputArray: [...output],
        i,
        phase: 'cumulative',
        message: `Updating cumulative count at index ${i}`,
        sorted: []
      });
    }

    // Building output array
    for (let i = arr.length - 1; i >= 0; i--) {
      output[count[arr[i]] - 1] = arr[i];
      count[arr[i]]--;
      steps.push({
        array: [...arr],
        countArray: [...count],
        outputArray: [...output],
        i,
        phase: 'building',
        message: `Placing ${arr[i]} in output array`,
        sorted: []
      });
    }

    steps.push({
      array: [...output],
      countArray: [...count],
      outputArray: [...output],
      i: -1,
      phase: 'done',
      message: 'Array is now sorted!',
      sorted: Array.from({ length: output.length }, (_, idx) => idx)
    });

    return steps;
  };

  // Initialize sort steps when original array changes
  useEffect(() => {
    if (originalArray.length > 0) {
      const steps = generateCountingSortSteps(originalArray);
      setSortSteps(steps);
      setCurrentStep(-1);
      setIsPlaying(false);
      setIsPaused(false);
      setArray([...originalArray]);
    }
  }, [originalArray]);

  useEffect(() => {
    const nums = inputArray.split(',').map(Number).filter(n => !isNaN(n));
    if (nums.length > 0) setOriginalArray(nums);
  }, [inputArray]);

  // Animation controls
  const startAnimation = () => {
    if (currentStep >= sortSteps.length - 1) setCurrentStep(-1);
    setIsPlaying(true);
    setIsPaused(false);
    const animate = () => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= sortSteps.length) {
          setIsPlaying(false);
          setIsPaused(false);
          return prev;
        }
        setArray(sortSteps[next].phase === 'done' ? sortSteps[next].outputArray : sortSteps[next].array);
        return next;
      });
    };
    intervalRef.current = setInterval(animate, speed);
  };

  const pauseAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPaused(true);
  };

  const stopAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentStep(-1);
    setArray([...originalArray]);
  };

  const stepForward = () => {
    if (currentStep < sortSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setArray(sortSteps[nextStep].phase === 'done' ? sortSteps[nextStep].outputArray : sortSteps[nextStep].array);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setArray(sortSteps[prevStep].phase === 'done' ? sortSteps[prevStep].outputArray : sortSteps[prevStep].array);
    } else if (currentStep === 0) {
      setCurrentStep(-1);
      setArray([...originalArray]);
    }
  };

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 9) + 1);
    setOriginalArray(newArray);
    setInputArray(newArray.join(','));
    stopAnimation();
  };

  const resetArray = () => {
    setOriginalArray([4, 2, 2, 8, 3, 3, 1]);
    setInputArray('4,2,2,8,3,3,1');
  };

  // Array element coloring
  const getElementClass = (index: number) => {
    const step = sortSteps[currentStep];
    if (!step) return 'bg-zinc-100 border-zinc-300 text-zinc-700';
    if (step.sorted && step.sorted.includes(index)) return 'bg-green-500 border-green-700 text-white font-bold scale-110 shadow-lg';
    return 'bg-zinc-200 border-zinc-300 text-zinc-700';
  };

  const getCurrentMessage = () => {
    if (currentStep >= 0 && currentStep < sortSteps.length) return sortSteps[currentStep].message;
    return 'Click "Start" to begin the counting sort visualization';
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900">Counting Sort</h1>
          <p className="text-zinc-700 text-lg mt-2">
            A non-comparison-based sorting algorithm that sorts integers by counting the number of occurrences of each unique value.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm mt-4">
            <div className="flex items-center gap-2"><i className="bi bi-clock text-indigo-600"></i> <span>Average: O(n + k)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-graph-up text-indigo-600"></i> <span>Worst: O(n + k)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-gear text-indigo-600"></i> <span>Space: O(k)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-check-circle text-indigo-600"></i> <span>Stable</span></div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3"><i className="bi bi-info-circle text-indigo-600"></i> How Counting Sort Works</h4>
          <p className="text-zinc-700 leading-relaxed">
            Counting Sort counts the number of occurrences of each value, computes cumulative counts, and then places each value into the correct position in the output array.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <pre>{codeImplementations['javascript']}</pre>
          </div>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3"><i className="bi bi-list-check text-indigo-600"></i> Key Features</h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>Non-comparison-based sorting</li>
            <li>Stable sort</li>
            <li>Efficient for small range of integers</li>
            <li>Time complexity O(n + k)</li>
            <li>Space complexity O(k)</li>
          </ul>
        </div>

        {/* Interactive Section */}
        <div className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo & Visualization
          </h5>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block mb-1 text-zinc-700 font-medium">Array Elements:</label>
              <input
                type="text"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={inputArray}
                onChange={(e) => setInputArray(e.target.value)}
                placeholder="Enter comma-separated numbers (1-9)"
                disabled={isPlaying}
              />
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
                  onClick={generateRandomArray}
                  disabled={isPlaying}
                >
                  <i className="bi bi-shuffle"></i> Random Array
                </button>
                <button
                  className="bg-zinc-300 text-zinc-700 px-4 py-2 rounded shadow hover:bg-zinc-400 transition"
                  onClick={resetArray}
                  disabled={isPlaying}
                >
                  <i className="bi bi-arrow-clockwise"></i> Reset Array
                </button>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label className="block mb-1 text-zinc-700 font-medium">Current Array:</label>
            <div className="flex flex-wrap gap-3 justify-center items-end mb-6">
              {array.map((value, index) => (
                <div
                  key={index}
                  className={`relative w-14 h-14 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${getElementClass(index)}`}
                >
                  <span className="text-lg font-semibold">{value}</span>
                  <span className="absolute left-1/2 -bottom-5 -translate-x-1/2 text-xs text-zinc-400">[{index}]</span>
                </div>
              ))}
            </div>
          </div>
          {/* Count Array Visualization */}
          <div className="mb-3">
            <label className="block mb-1 text-zinc-700 font-medium">Count Array:</label>
            <div className="flex flex-wrap gap-3 justify-center items-end mb-6">
              {sortSteps[currentStep]?.countArray?.map((value, index) => (
                <div
                  key={index}
                  className="relative w-10 h-10 rounded-lg border-2 flex items-center justify-center bg-blue-100 border-blue-300 text-blue-700"
                >
                  <span className="text-base font-semibold">{value}</span>
                  <span className="absolute left-1/2 -bottom-4 -translate-x-1/2 text-xs text-blue-400">{index}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Output Array Visualization */}
          <div className="mb-3">
            <label className="block mb-1 text-zinc-700 font-medium">Output Array:</label>
            <div className="flex flex-wrap gap-3 justify-center items-end mb-6">
              {sortSteps[currentStep]?.outputArray?.map((value, index) => (
                <div
                  key={index}
                  className="relative w-10 h-10 rounded-lg border-2 flex items-center justify-center bg-green-100 border-green-300 text-green-700"
                >
                  <span className="text-base font-semibold">{value !== 0 ? value : ''}</span>
                  <span className="absolute left-1/2 -bottom-4 -translate-x-1/2 text-xs text-green-400">{index}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
              onClick={isPlaying && !isPaused ? pauseAnimation : startAnimation}
              disabled={currentStep >= sortSteps.length - 1 && !isPaused}
              title={isPlaying && !isPaused ? 'Pause' : 'Play'}
            >
              <i className={`bi ${isPlaying && !isPaused ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
              onClick={stopAnimation}
              title="Stop"
            >
              <i className="bi bi-stop-fill"></i>
            </button>
            <button
              className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
              onClick={stepBackward}
              disabled={currentStep <= -1}
              title="Step Back"
            >
              <i className="bi bi-skip-backward-fill"></i>
            </button>
            <button
              className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
              onClick={stepForward}
              disabled={currentStep >= sortSteps.length - 1}
              title="Step Forward"
            >
              <i className="bi bi-skip-forward-fill"></i>
            </button>
          </div>
          {/* Progress Bar */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-zinc-500">Step {currentStep + 1} of {sortSteps.length}</span>
            <div className="flex-1 h-2 bg-zinc-200 rounded overflow-hidden mx-2">
              <div
                className="h-2 bg-indigo-500"
                style={{ width: `${sortSteps.length > 0 ? ((currentStep + 1) / sortSteps.length) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="text-xs text-zinc-500">{sortSteps.length > 0 ? Math.round(((currentStep + 1) / sortSteps.length) * 100) : 0}%</span>
          </div>
          {/* Step message */}
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-2 rounded border-2 border-indigo-400 bg-indigo-50 px-4 py-2 text-indigo-700 font-semibold shadow">
              <i className="bi bi-chat-text"></i>
              {getCurrentMessage()}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Counting Sort is efficient for small integer ranges. Watch how it builds the count and output arrays!
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountingSort;
