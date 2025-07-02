import React, { useState, useRef, useEffect } from 'react';

interface SortStep {
  i: number;
  j: number;
  swapped: boolean;
  message: string;
  array: number[];
}

const codeImplementations = {
  javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
  python: `def bubble_sort(arr):
  n = len(arr)
  for i in range(n - 1):
    for j in range(n - i - 1):
      if arr[j] > arr[j + 1]:
        # Swap elements
        arr[j], arr[j + 1] = arr[j + 1], arr[j]
  return arr`,
  cpp: `void bubbleSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        int temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}`,
  go: `func bubbleSort(arr []int) []int {
  n := len(arr)
  for i := 0; i < n-1; i++ {
    for j := 0; j < n-i-1; j++ {
      if arr[j] > arr[j+1] {
        // Swap elements
        arr[j], arr[j+1] = arr[j+1], arr[j]
      }
    }
  }
  return arr
}`,
  rust: `fn bubble_sort(arr: &mut [i32]) {
  let n = arr.len();
  for i in 0..n-1 {
    for j in 0..n-i-1 {
      if arr[j] > arr[j+1] {
        // Swap elements
        arr.swap(j, j+1);
      }
    }
  }
}`
};

const BubbleSort: React.FC = () => {
  const [originalArray, setOriginalArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [sortSteps, setSortSteps] = useState<SortStep[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [inputArray, setInputArray] = useState<string>('64,34,25,12,22,11,90');
  const [speed] = useState<number>(1000);
  const [activeLanguage, setActiveLanguage] = useState<string>('javascript');
const intervalRef = useRef<number | null>(null);

  // Generate sort steps for the current array
  const generateSortSteps = (arr: number[]): SortStep[] => {
    const steps: SortStep[] = [];
    const workingArray = [...arr];
    const n = workingArray.length;
    steps.push({ i: -1, j: -1, swapped: false, message: 'Starting bubble sort...', array: [...workingArray] });
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({ i: j, j: j + 1, swapped: false, message: `Comparing ${workingArray[j]} and ${workingArray[j + 1]}`, array: [...workingArray] });
        if (workingArray[j] > workingArray[j + 1]) {
          const val1 = workingArray[j];
          const val2 = workingArray[j + 1];
          [workingArray[j], workingArray[j + 1]] = [workingArray[j + 1], workingArray[j]];
          steps.push({ i: j, j: j + 1, swapped: true, message: `Swapped ${val1} and ${val2}`, array: [...workingArray] });
        }
      }
    }
    steps.push({ i: -1, j: -1, swapped: false, message: 'Array is now sorted!', array: [...workingArray] });
    return steps;
  };

  useEffect(() => {
    if (originalArray.length > 0) {
      const steps = generateSortSteps(originalArray);
      setSortSteps(steps);
      setCurrentStep(-1);
      setIsPlaying(false);
      setIsPaused(false);
      setArray([...originalArray]);
    }
  }, [originalArray]);

  useEffect(() => {
    const nums = inputArray
      .split(',')
      .map(Number)
      .filter(n => !isNaN(n));
    if (nums.length > 0) setOriginalArray(nums);
  }, [inputArray]);

  // Animation control functions
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
        const step = sortSteps[next];
        setArray(step.array);
        return next;
      });
    };
    intervalRef.current = setInterval(animate, speed);
  };

  const pauseAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPaused(true);
  };

  const stopAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentStep(-1);
    setIsPlaying(false);
    setIsPaused(false);
    setArray([...originalArray]);
  };

  const stepForward = () => {
    if (currentStep < sortSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const step = sortSteps[nextStep];
      setArray(step.array);
    }
  };

  const stepBackward = () => {
    if (currentStep > -1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      if (prevStep >= 0) setArray(sortSteps[prevStep].array);
      else setArray([...originalArray]);
    }
  };

  const resetAnimation = () => {
    stopAnimation();
    setInputArray('64,34,25,12,22,11,90');
    setOriginalArray([64, 34, 25, 12, 22, 11, 90]);
  };

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100) + 1);
    setOriginalArray(newArray);
    setInputArray(newArray.join(','));
    stopAnimation();
  };

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (currentStep < sortSteps.length - 1) {
        intervalRef.current = setInterval(() => {
          setCurrentStep(prev => {
            const next = prev + 1;
            if (next >= sortSteps.length) {
              setIsPlaying(false);
              setIsPaused(false);
              return prev;
            }
            const step = sortSteps[next];
            setArray(step.array);
            return next;
          });
        }, speed);
      }
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isPlaying, isPaused, currentStep, sortSteps.length, speed, sortSteps]);

  // Get element class for visualization
  const getElementClass = (index: number) => {
    if (currentStep === -1) return 'bg-zinc-100 border-zinc-300 text-zinc-700';
    const step = sortSteps[currentStep];
    if (!step) return 'bg-zinc-100 border-zinc-300 text-zinc-700';
    if (step.i === -1 && step.j === -1) return 'bg-zinc-100 border-zinc-300 text-zinc-700';
    if (index === step.i || index === step.j) {
      return step.swapped
        ? 'bg-green-500 border-green-700 text-white font-bold scale-110 shadow-lg'
        : 'bg-yellow-400 border-yellow-600 text-zinc-900 font-bold scale-105 shadow';
    }
    return 'bg-blue-100 border-blue-300 text-blue-700';
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900">Bubble Sort</h1>
          <p className="text-zinc-700 text-lg mt-2">
            A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm mt-4">
            <div className="flex items-center gap-2"><i className="bi bi-clock text-indigo-600"></i> <span>Time: O(n²)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-gear text-indigo-600"></i> <span>Space: O(1)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-arrow-left-right text-indigo-600"></i> <span>In-place</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-check-circle text-indigo-600"></i> <span>Stable</span></div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3"><i className="bi bi-info-circle text-indigo-600"></i> How Bubble Sort Works</h4>
          <p className="text-zinc-700 leading-relaxed">
            Bubble sort works by repeatedly stepping through the array, comparing each pair of adjacent elements and swapping them if they are in the wrong order.
            The pass through the array is repeated until no swaps are needed, which indicates that the array is sorted. Each pass "bubbles up" the largest unsorted element to its correct position.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <pre>{codeImplementations[activeLanguage as keyof typeof codeImplementations]}</pre>
          </div>
          <div className="flex gap-2 mb-2">
            {Object.keys(codeImplementations).map(lang => (
              <button
                key={lang}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${activeLanguage === lang ? 'bg-indigo-600 text-white' : 'bg-zinc-200 text-zinc-700'}`}
                onClick={() => setActiveLanguage(lang)}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3"><i className="bi bi-list-check text-indigo-600"></i> Key Features</h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>In-place sorting algorithm</li>
            <li>Stable sort (preserves order)</li>
            <li>Simple to implement and understand</li>
            <li>Adaptive algorithm</li>
            <li>Good for nearly sorted data</li>
            <li>Space complexity O(1)</li>
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
                placeholder="Enter comma-separated numbers (e.g., 64,34,25,12,22,11,90)"
              />
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
                  onClick={generateRandomArray}
                >
                  <i className="bi bi-shuffle"></i> Random Array
                </button>
                <button
                  className="bg-zinc-300 text-zinc-700 px-4 py-2 rounded shadow hover:bg-zinc-400 transition"
                  onClick={resetAnimation}
                >
                  <i className="bi bi-arrow-clockwise"></i> Reset Array
                </button>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-2 justify-end">
              <label className="block mb-1 text-zinc-700 font-medium">Animation Controls:</label>
              <div className="flex flex-wrap gap-2">
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
            </div>
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
          {/* Array Visualization */}
          <div className="flex flex-wrap gap-3 justify-center items-end mb-6">
            {array.map((value, index) => (
              <div
                key={index}
                className={`relative w-14 h-14 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${getElementClass(index)}`}
              >
                <span className="text-lg font-semibold">{value}</span>
                <span className="absolute left-1/2 -bottom-5 -translate-x-1/2 text-xs text-zinc-400">[{index}]</span>
                {/* Arrow indicators for comparison */}
                {currentStep >= 0 && sortSteps[currentStep] &&
                  (index === sortSteps[currentStep].i || index === sortSteps[currentStep].j) && (
                    <span
                      className={`absolute left-1/2 -top-6 -translate-x-1/2 text-2xl ${sortSteps[currentStep].swapped ? 'text-green-600' : 'text-indigo-500'} animate-bounce`}
                    >
                      {sortSteps[currentStep].swapped ? '↔' : '↓'}
                    </span>
                  )}
              </div>
            ))}
          </div>
          {/* Step message */}
          {currentStep >= 0 && sortSteps[currentStep] && (
            <div className="text-center mb-3">
              <div className="inline-flex items-center gap-2 rounded border-2 border-indigo-400 bg-indigo-50 px-4 py-2 text-indigo-700 font-semibold shadow">
                <i className="bi bi-chat-text"></i>
                {sortSteps[currentStep].message}
              </div>
            </div>
          )}
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Use the controls to step through the algorithm and see how adjacent elements are compared and swapped.
          </div>
        </div>

        {/* Complexity Analysis */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
            <i className="bi bi-graph-up"></i> Time & Space Complexity
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-2 border border-gray-300 text-left">Case</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Time Complexity</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Space Complexity</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Best</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Array is already sorted</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Average</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-yellow-200 text-yellow-800 rounded px-2 py-1 font-semibold">O(n²)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Random array</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Worst</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-red-200 text-red-800 rounded px-2 py-1 font-semibold">O(n²)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Array is reverse sorted</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
            <i className="bi bi-lightning"></i> Use Cases & Applications
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-book text-green-600"></i> Educational
              </h6>
              <p className="text-zinc-700 text-sm">Learning sorting concepts</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-collection text-green-600"></i> Small Datasets
              </h6>
              <p className="text-zinc-700 text-sm">When n &lt; 50 elements</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-arrow-up text-green-600"></i> Nearly Sorted
              </h6>
              <p className="text-zinc-700 text-sm">Data that's mostly in order</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-gear text-green-600"></i> Simple Applications
              </h6>
              <p className="text-zinc-700 text-sm">When simplicity is preferred</p>
            </div>
          </div>
        </div>

        {/* Advantages and Disadvantages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
              <i className="bi bi-plus-circle"></i> Advantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Simple to implement and understand</li>
              <li>In-place sorting algorithm</li>
              <li>Stable sort (preserves order)</li>
              <li>Adaptive algorithm</li>
              <li>Good for nearly sorted data</li>
              <li>Constant space complexity O(1)</li>
              <li>No additional memory required</li>
              <li>Easy to debug and trace</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Poor performance on large datasets</li>
              <li>Quadratic time complexity O(n²)</li>
              <li>Many unnecessary comparisons</li>
              <li>Inefficient for random data</li>
              <li>Not suitable for production use</li>
              <li>Poor cache performance</li>
              <li>Many swaps even when not needed</li>
              <li>Better algorithms available</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BubbleSort;
