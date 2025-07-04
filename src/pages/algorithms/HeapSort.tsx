import React, { useState, useRef, useEffect } from 'react';

interface HeapSortStep {
  array: number[];
  heapSize: number;
  i: number;
  j: number;
  message: string;
  sorted: number[];
  buildingHeap?: boolean;
  swapping?: [number, number];
}

const codeImplementations = {
  javascript: `function heapSort(arr) {
  let n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}
function heapify(arr, n, i) {
  let largest = i;
  let l = 2 * i + 1;
  let r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
  python: `def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        heapify(arr, i, 0)
    return arr

def heapify(arr, n, i):
    largest = i
    l = 2 * i + 1
    r = 2 * i + 2
    if l < n and arr[l] > arr[largest]:
        largest = l
    if r < n and arr[r] > arr[largest]:
        largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`,
  cpp: `void heapSort(int arr[], int n) {
  for (int i = n / 2 - 1; i >= 0; i--)
    heapify(arr, n, i);
  for (int i = n - 1; i > 0; i--) {
    swap(arr[0], arr[i]);
    heapify(arr, i, 0);
  }
}
void heapify(int arr[], int n, int i) {
  int largest = i;
  int l = 2 * i + 1;
  int r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest != i) {
    swap(arr[i], arr[largest]);
    heapify(arr, n, largest);
  }
}`,
  go: `func heapSort(arr []int) []int {
  n := len(arr)
  for i := n/2 - 1; i >= 0; i-- {
    heapify(arr, n, i)
  }
  for i := n-1; i > 0; i-- {
    arr[0], arr[i] = arr[i], arr[0]
    heapify(arr, i, 0)
  }
  return arr
}
func heapify(arr []int, n, i int) {
  largest := i
  l := 2*i + 1
  r := 2*i + 2
  if l < n && arr[l] > arr[largest] {
    largest = l
  }
  if r < n && arr[r] > arr[largest] {
    largest = r
  }
  if largest != i {
    arr[i], arr[largest] = arr[largest], arr[i]
    heapify(arr, n, largest)
  }
}`,
  rust: `fn heap_sort<T: Ord>(arr: &mut [T]) {
  let n = arr.len();
  for i in (0..n / 2).rev() {
    heapify(arr, n, i);
  }
  for i in (1..n).rev() {
    arr.swap(0, i);
    heapify(arr, i, 0);
  }
}
fn heapify<T: Ord>(arr: &mut [T], n: usize, i: usize) {
  let mut largest = i;
  let l = 2 * i + 1;
  let r = 2 * i + 2;
  if l < n && arr[l] > arr[largest] { largest = l; }
  if r < n && arr[r] > arr[largest] { largest = r; }
  if largest != i {
    arr.swap(i, largest);
    heapify(arr, n, largest);
  }
}`
};

const HeapSort: React.FC = () => {
  const [originalArray, setOriginalArray] = useState<number[]>([16, 14, 10, 8, 7, 9, 3, 2, 4, 1]);
  const [array, setArray] = useState<number[]>([16, 14, 10, 8, 7, 9, 3, 2, 4, 1]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [sortSteps, setSortSteps] = useState<HeapSortStep[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [inputArray, setInputArray] = useState<string>('16,14,10,8,7,9,3,2,4,1');
  const [speed] = useState<number>(1000);
  const [activeLanguage, setActiveLanguage] = useState<string>('javascript');
  const intervalRef = useRef<number | null>(null);

  // Generate heap sort steps for the current array
  const generateHeapSortSteps = (arr: number[]): HeapSortStep[] => {
    const steps: HeapSortStep[] = [];
    const workingArray = [...arr];
    const n = workingArray.length;

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(workingArray, n, i, steps, true);
    }

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      steps.push({
        array: [...workingArray],
        heapSize: i + 1,
        i: 0,
        j: i,
        message: `Swapping max (${workingArray[0]}) with end element (${workingArray[i]})`,
        sorted: Array.from({ length: n - i }, (_, idx) => n - idx - 1),
        swapping: [0, i]
      });
      [workingArray[0], workingArray[i]] = [workingArray[i], workingArray[0]];
      heapify(workingArray, i, 0, steps, false, n - i);
    }
    steps.push({
      array: [...workingArray],
      heapSize: 0,
      i: -1,
      j: -1,
      message: 'Array is now sorted!',
      sorted: Array.from({ length: n }, (_, idx) => idx)
    });
    return steps;
  };

  function heapify(arr: number[], n: number, i: number, steps: HeapSortStep[], buildingHeap = false, sortedCount = 0) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    steps.push({
      array: [...arr],
      heapSize: n,
      i,
      j: -1,
      message: buildingHeap
        ? `Heapifying at index ${i} (building heap)`
        : `Heapifying at index ${i}`,
      sorted: Array.from({ length: sortedCount }, (_, idx) => arr.length - idx - 1),
      buildingHeap
    });
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest !== i) {
      steps.push({
        array: [...arr],
        heapSize: n,
        i,
        j: largest,
        message: `Swapping ${arr[i]} and ${arr[largest]}`,
        sorted: Array.from({ length: sortedCount }, (_, idx) => arr.length - idx - 1),
        swapping: [i, largest],
        buildingHeap
      });
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(arr, n, largest, steps, buildingHeap, sortedCount);
    }
  }

  // Initialize sort steps when original array changes
  useEffect(() => {
    if (originalArray.length > 0) {
      const steps = generateHeapSortSteps(originalArray);
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
    setOriginalArray([16, 14, 10, 8, 7, 9, 3, 2, 4, 1]);
    setInputArray('16,14,10,8,7,9,3,2,4,1');
  };

  // Array element coloring
  const getElementClass = (index: number) => {
    const step = sortSteps[currentStep];
    if (!step) return 'bg-zinc-100 border-zinc-300 text-zinc-700';
    if (step.sorted && step.sorted.includes(index)) return 'bg-green-500 border-green-700 text-white font-bold scale-110 shadow-lg';
    if (step.swapping && step.swapping.includes(index)) return 'bg-pink-300 border-pink-600 text-pink-900 font-bold scale-105 shadow';
    if (step.i === index) return 'bg-yellow-400 border-yellow-600 text-zinc-900 font-bold scale-105 shadow';
    if (step.j === index) return 'bg-indigo-300 border-indigo-600 text-indigo-900 font-bold scale-105 shadow';
    return 'bg-zinc-200 border-zinc-300 text-zinc-700';
  };

  const getCurrentMessage = () => {
    if (currentStep >= 0 && currentStep < sortSteps.length) return sortSteps[currentStep].message;
    return 'Click "Start" to begin the heap sort visualization';
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900">Heap Sort</h1>
          <p className="text-zinc-700 text-lg mt-2">
            An efficient, comparison-based sorting algorithm that uses a binary heap data structure to sort elements.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm mt-4">
            <div className="flex items-center gap-2"><i className="bi bi-clock text-indigo-600"></i> <span>Average: O(n log n)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-graph-up text-indigo-600"></i> <span>Worst: O(n log n)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-gear text-indigo-600"></i> <span>Space: O(1)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-check-circle text-indigo-600"></i> <span>In-place</span></div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3"><i className="bi bi-info-circle text-indigo-600"></i> How Heap Sort Works</h4>
          <p className="text-zinc-700 leading-relaxed">
            Heap Sort first builds a max heap from the input array. Then, it repeatedly swaps the largest element (at the root) with the last element of the heap, reduces the heap size, and heapifies the root. This process continues until the array is sorted.
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
            <li>Uses binary heap data structure</li>
            <li>In-place sorting algorithm</li>
            <li>Consistent O(n log n) time complexity</li>
            <li>Not stable</li>
            <li>Good for large datasets</li>
          </ul>
        </div>

        {/* Algorithm Steps */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3"><i className="bi bi-list-ol text-indigo-600"></i> Step-by-Step Process</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Heap Construction:</h6>
              <ol className="list-decimal list-inside text-zinc-700 space-y-1">
                <li>Build a max heap from the array</li>
                <li>Heapify all non-leaf nodes</li>
              </ol>
            </div>
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Sorting Phase:</h6>
              <ol className="list-decimal list-inside text-zinc-700 space-y-1">
                <li>Swap the max element (root) with the last element</li>
                <li>Reduce heap size and heapify root</li>
                <li>Repeat until array is sorted</li>
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
            <strong>Tip:</strong> Use the controls to step through the heap sort algorithm. Watch how the heap is built and sorted.
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
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">All cases have same complexity</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Average</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-yellow-200 text-yellow-800 rounded px-2 py-1 font-semibold">O(n log n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Random order array</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Worst</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-red-200 text-red-800 rounded px-2 py-1 font-semibold">O(n log n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Reverse sorted array</td>
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
                <i className="bi bi-cpu text-green-600"></i> Large Datasets
              </h6>
              <p className="text-zinc-700 text-sm">Efficient for sorting large datasets</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-database text-green-600"></i> Real-Time Systems
              </h6>
              <p className="text-zinc-700 text-sm">Predictable performance for real-time applications</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-code-square text-green-600"></i> Memory-Constrained Systems
              </h6>
              <p className="text-zinc-700 text-sm">In-place sorting with O(1) extra space</p>
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
              <li>Consistent O(n log n) time complexity</li>
              <li>In-place sorting</li>
              <li>Good for large datasets</li>
              <li>Not recursive (unlike merge sort)</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Not stable</li>
              <li>More complex than simpler sorts</li>
              <li>Poor locality of reference</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeapSort;
