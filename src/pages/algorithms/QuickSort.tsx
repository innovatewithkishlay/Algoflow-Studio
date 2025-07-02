import React, { useState, useRef, useEffect } from 'react';

interface QuickSortStep {
  pivot: number;
  pivotIndex: number;
  left: number;
  right: number;
  i: number;
  j: number;
  message: string;
  array: number[];
  partitioning?: number[];
  sorted?: number[];
}

const codeImplementations = {
  javascript: `function quickSort(arr, low, high) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
  python: `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1

    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]

    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
  cpp: `void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}`,
  go: `func quickSort(arr []int, low, high int) []int {
    if low < high {
        pi := partition(arr, low, high)
        quickSort(arr, low, pi-1)
        quickSort(arr, pi+1, high)
    }
    return arr
}

func partition(arr []int, low, high int) int {
    pivot := arr[high]
    i := low - 1

    for j := low; j < high; j++ {
        if arr[j] <= pivot {
            i++
            arr[i], arr[j] = arr[j], arr[i]
        }
    }
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i + 1
}`,
  rust: `fn quick_sort<T: Ord>(arr: &mut [T]) {
    if arr.len() > 1 {
        let pivot_index = partition(arr);
        quick_sort(&mut arr[..pivot_index]);
        quick_sort(&mut arr[pivot_index + 1..]);
    }
}

fn partition<T: Ord>(arr: &mut [T]) -> usize {
    let pivot_index = arr.len() - 1;
    let mut i = 0;

    for j in 0..pivot_index {
        if arr[j] <= arr[pivot_index] {
            arr.swap(i, j);
            i += 1;
        }
    }
    arr.swap(i, pivot_index);
    i
}`
};

const QuickSort: React.FC = () => {
  const [originalArray, setOriginalArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [sortSteps, setSortSteps] = useState<QuickSortStep[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [inputArray, setInputArray] = useState<string>('64,34,25,12,22,11,90');
  const [speed] = useState<number>(1000);
  const [activeLanguage, setActiveLanguage] = useState<string>('javascript');
const intervalRef = useRef<number | null>(null);

  // Generate quick sort steps for the current array
  const generateQuickSortSteps = (arr: number[]): QuickSortStep[] => {
    const steps: QuickSortStep[] = [];
    const workingArray = [...arr];

    steps.push({
      pivot: -1,
      pivotIndex: -1,
      left: -1,
      right: -1,
      i: -1,
      j: -1,
      message: 'Starting quick sort...',
      array: [...workingArray]
    });

    const quickSortHelper = (left: number, right: number) => {
      if (left < right) {
        const pivot = workingArray[right];
        const pivotIndex = right;

        steps.push({
          pivot,
          pivotIndex,
          left,
          right,
          i: left - 1,
          j: left,
          message: `Selecting pivot: ${pivot} at index ${pivotIndex}`,
          array: [...workingArray],
          partitioning: [left, right]
        });

        let i = left - 1;

        for (let j = left; j < right; j++) {
          steps.push({
            pivot,
            pivotIndex,
            left,
            right,
            i,
            j,
            message: `Comparing ${workingArray[j]} with pivot ${pivot}`,
            array: [...workingArray],
            partitioning: [left, right]
          });

          if (workingArray[j] <= pivot) {
            i++;
            if (i !== j) {
              [workingArray[i], workingArray[j]] = [workingArray[j], workingArray[i]];
              steps.push({
                pivot,
                pivotIndex,
                left,
                right,
                i,
                j,
                message: `Swapped ${workingArray[i]} and ${workingArray[j]}`,
                array: [...workingArray],
                partitioning: [left, right]
              });
            }
          }
        }

        [workingArray[i + 1], workingArray[right]] = [workingArray[right], workingArray[i + 1]];
        steps.push({
          pivot,
          pivotIndex,
          left,
          right,
          i: i + 1,
          j: right,
          message: `Pivot ${pivot} placed in final position at index ${i + 1}`,
          array: [...workingArray],
          partitioning: [left, right],
          sorted: [i + 1]
        });

        quickSortHelper(left, i);
        quickSortHelper(i + 2, right);
      }
    };

    quickSortHelper(0, workingArray.length - 1);
    steps.push({
      pivot: -1,
      pivotIndex: -1,
      left: -1,
      right: -1,
      i: -1,
      j: -1,
      message: 'Array is now sorted!',
      array: [...workingArray],
      sorted: Array.from({ length: workingArray.length }, (_, i) => i)
    });

    return steps;
  };

  // Initialize sort steps when original array changes
  useEffect(() => {
    if (originalArray.length > 0) {
      const steps = generateQuickSortSteps(originalArray);
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
        setArray(sortSteps[next].array);
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
      setArray(sortSteps[nextStep].array);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setArray(sortSteps[prevStep].array);
    } else if (currentStep === 0) {
      setCurrentStep(-1);
      setArray([...originalArray]);
    }
  };

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100) + 1);
    setOriginalArray(newArray);
    setInputArray(newArray.join(','));
    stopAnimation();
  };

  const resetArray = () => {
    setOriginalArray([64, 34, 25, 12, 22, 11, 90]);
    setInputArray('64,34,25,12,22,11,90');
  };

  // Array element coloring
  const getElementClass = (index: number) => {
    const step = sortSteps[currentStep];
    if (!step) return 'bg-zinc-100 border-zinc-300 text-zinc-700';
    if (step.sorted && step.sorted.includes(index)) return 'bg-green-500 border-green-700 text-white font-bold scale-110 shadow-lg';
    if (step.pivotIndex === index) return 'bg-yellow-400 border-yellow-600 text-zinc-900 font-bold scale-105 shadow';
    if (step.partitioning && index >= step.partitioning[0] && index <= step.partitioning[1]) return 'bg-blue-100 border-blue-300 text-blue-700';
    if (step.i === index) return 'bg-indigo-300 border-indigo-600 text-indigo-900 font-bold scale-105 shadow';
    if (step.j === index) return 'bg-pink-300 border-pink-600 text-pink-900 font-bold scale-105 shadow';
    return 'bg-zinc-200 border-zinc-300 text-zinc-700';
  };

  const getCurrentMessage = () => {
    if (currentStep >= 0 && currentStep < sortSteps.length) return sortSteps[currentStep].message;
    return 'Click "Start" to begin the quick sort visualization';
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900">Quick Sort</h1>
          <p className="text-zinc-700 text-lg mt-2">
            A highly efficient, comparison-based sorting algorithm that uses a divide-and-conquer strategy with a pivot element
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm mt-4">
            <div className="flex items-center gap-2"><i className="bi bi-clock text-indigo-600"></i> <span>Average: O(n log n)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-graph-up text-indigo-600"></i> <span>Worst: O(n²)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-gear text-indigo-600"></i> <span>Space: O(log n)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-check-circle text-indigo-600"></i> <span>In-place</span></div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3"><i className="bi bi-info-circle text-indigo-600"></i> How Quick Sort Works</h4>
          <p className="text-zinc-700 leading-relaxed">
            Quick Sort is a highly efficient, comparison-based sorting algorithm that uses a divide-and-conquer strategy. It works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays according to whether they are less than or greater than the pivot.
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
            <li>Uses divide-and-conquer strategy</li>
            <li>In-place sorting algorithm</li>
            <li>Average case time complexity of O(n log n)</li>
            <li>Worst case time complexity of O(n²)</li>
            <li>Space complexity of O(log n)</li>
            <li>Unstable sorting algorithm</li>
            <li>Cache-friendly due to good locality of reference</li>
          </ul>
        </div>

        {/* Algorithm Steps */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3"><i className="bi bi-list-ol text-indigo-600"></i> Step-by-Step Process</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Partitioning Phase:</h6>
              <ol className="list-decimal list-inside text-zinc-700 space-y-1">
                <li>Choose a pivot element (usually last element)</li>
                <li>Partition elements around the pivot</li>
                <li>Place pivot in its final sorted position</li>
                <li>Elements smaller than pivot go to the left</li>
              </ol>
            </div>
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Recursive Phase:</h6>
              <ol className="list-decimal list-inside text-zinc-700 space-y-1">
                <li>Recursively sort the left subarray</li>
                <li>Recursively sort the right subarray</li>
                <li>Combine the sorted subarrays</li>
                <li>Continue until all elements are sorted</li>
              </ol>
            </div>
          </div>
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
                placeholder="Enter comma-separated numbers"
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
            <strong>Tip:</strong> Use the controls to step through the quick sort algorithm. Watch how the pivot is selected and how elements are partitioned around it.
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
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(n log n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(log n)</td>
                  <td className="px-4 py-2 border border-gray-300">When the pivot divides the array into roughly equal halves</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Average</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-yellow-200 text-yellow-800 rounded px-2 py-1 font-semibold">O(n log n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(log n)</td>
                  <td className="px-4 py-2 border border-gray-300">Typical case with random data</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Worst</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-red-200 text-red-800 rounded px-2 py-1 font-semibold">O(n²)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(n)</td>
                  <td className="px-4 py-2 border border-gray-300">When the pivot is always the smallest or largest element</td>
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
                <i className="bi bi-cpu text-green-600"></i> General Sorting
              </h6>
              <p className="text-zinc-700 text-sm">Most common use case for sorting large datasets efficiently</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-database text-green-600"></i> Database Systems
              </h6>
              <p className="text-zinc-700 text-sm">Used in database engines for sorting query results</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-code-square text-green-600"></i> Programming Languages
              </h6>
              <p className="text-zinc-700 text-sm">Default sorting algorithm in many programming languages</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-graph-up text-green-600"></i> Data Analysis
              </h6>
              <p className="text-zinc-700 text-sm">Sorting large datasets for analysis and visualization</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-speedometer2 text-green-600"></i> Real-time Systems
              </h6>
              <p className="text-zinc-700 text-sm">When predictable average performance is required</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-hdd-network text-green-600"></i> Memory-constrained Systems
              </h6>
              <p className="text-zinc-700 text-sm">Due to its in-place sorting nature</p>
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
              <li>Excellent average-case performance</li>
              <li>In-place sorting algorithm</li>
              <li>Cache-friendly due to locality</li>
              <li>Works well with virtual memory</li>
              <li>Efficient for large datasets</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Poor performance on sorted arrays</li>
              <li>Unstable sorting algorithm</li>
              <li>Complex pivot selection</li>
              <li>Not suitable for linked lists</li>
              <li>Recursive implementation uses stack space</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSort;
