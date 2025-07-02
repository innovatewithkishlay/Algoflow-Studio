import React, { useState, useRef, useEffect } from 'react';

interface SearchStep {
  left: number;
  right: number;
  mid: number;
  found: boolean;
  message: string;
}

const codeImplementations = {
  javascript: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;  // Found at index mid
    } else if (arr[mid] < target) {
      left = mid + 1;  // Search right half
    } else {
      right = mid - 1;  // Search left half
    }
  }
  return -1;  // Not found
}`,
  python: `def binary_search(arr, target):
  left = 0
  right = len(arr) - 1

  while left <= right:
    mid = (left + right) // 2

    if arr[mid] == target:
      return mid  # Found at index mid
    elif arr[mid] < target:
      left = mid + 1  # Search right half
    else:
      right = mid - 1  # Search left half

  return -1  # Not found`,
  cpp: `int binarySearch(int arr[], int n, int target) {
  int left = 0;
  int right = n - 1;

  while (left <= right) {
    int mid = (left + right) / 2;

    if (arr[mid] == target) {
      return mid;  // Found at index mid
    } else if (arr[mid] < target) {
      left = mid + 1;  // Search right half
    } else {
      right = mid - 1;  // Search left half
    }
  }
  return -1;  // Not found
}`,
  go: `func binarySearch(arr []int, target int) int {
  left := 0
  right := len(arr) - 1

  for left <= right {
    mid := (left + right) / 2

    if arr[mid] == target {
      return mid  // Found at index mid
    } else if arr[mid] < target {
      left = mid + 1  // Search right half
    } else {
      right = mid - 1  // Search left half
    }
  }
  return -1  // Not found
}`,
  rust: `fn binary_search(arr: &[i32], target: i32) -> i32 {
  let mut left = 0;
  let mut right = arr.len() as i32 - 1;

  while left <= right {
    let mid = (left + right) / 2;

    if arr[mid as usize] == target {
      return mid;  // Found at index mid
    } else if arr[mid as usize] < target {
      left = mid + 1;  // Search right half
    } else {
      right = mid - 1;  // Search left half
    }
  }
  -1  // Not found
}`
};

const BinarySearch: React.FC = () => {
  const [array, setArray] = useState<number[]>([1,2,3,4,5,6,7,8,9,10]);
  const [searchValue, setSearchValue] = useState<number>(7);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [searchSteps, setSearchSteps] = useState<SearchStep[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<number | null>(null);
  const [inputArray, setInputArray] = useState<string>('1,2,3,4,5,6,7,8,9,10');
  const [speed] = useState<number>(1000);
  const [activeLanguage, setActiveLanguage] = useState<string>('javascript');
const intervalRef = useRef<number | null>(null);

  // Generate search steps for the current array and search value
  const generateSearchSteps = (arr: number[], target: number): SearchStep[] => {
    const steps: SearchStep[] = [];
    const sortedArray = [...arr].sort((a, b) => a - b);

    let left = 0;
    let right = sortedArray.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const found = sortedArray[mid] === target;

      let message = '';
      if (found) {
        message = `Found ${target} at index ${mid}!`;
      } else if (sortedArray[mid] < target) {
        message = `array[${mid}] = ${sortedArray[mid]} < ${target}, search right half`;
      } else {
        message = `array[${mid}] = ${sortedArray[mid]} > ${target}, search left half`;
      }

      steps.push({ left, right, mid, found, message });

      if (found) break;
      if (sortedArray[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    if (!steps.some(step => step.found)) {
      steps.push({ left: -1, right: -1, mid: -1, found: false, message: `${target} not found in array` });
    }

    return steps;
  };

  useEffect(() => {
    const steps = generateSearchSteps(array, searchValue);
    setSearchSteps(steps);
    setCurrentStep(-1);
    setSearchResult(null);
    setIsPlaying(false);
    setIsPaused(false);
  }, [array, searchValue]);

  useEffect(() => {
    const nums = inputArray
      .split(',')
      .map(Number)
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);
    if (nums.length > 0) setArray(nums);
  }, [inputArray]);

  // Animation logic
  const startAnimation = () => {
    if (currentStep >= searchSteps.length - 1) setCurrentStep(-1);
    setIsPlaying(true);
    setIsPaused(false);
    const animate = () => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= searchSteps.length) {
          setIsPlaying(false);
          setIsPaused(false);
          return prev;
        }
        const step = searchSteps[next];
        if (step.found) {
          setSearchResult(step.mid);
          setIsPlaying(false);
          setIsPaused(false);
        } else if (step.mid === -1) {
          setSearchResult(-1);
          setIsPlaying(false);
          setIsPaused(false);
        }
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
    setSearchResult(null);
  };

  const stepForward = () => {
    if (currentStep < searchSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const step = searchSteps[nextStep];
      if (step.found) setSearchResult(step.mid);
      else if (step.mid === -1) setSearchResult(-1);
    }
  };

  const stepBackward = () => {
    if (currentStep > -1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      if (prevStep === -1) setSearchResult(null);
      else {
        const step = searchSteps[prevStep];
        if (step.found) setSearchResult(step.mid);
        else setSearchResult(null);
      }
    }
  };

  const resetAnimation = () => {
    stopAnimation();
    setInputArray('1,2,3,4,5,6,7,8,9,10');
    setSearchValue(7);
    setArray([1,2,3,4,5,6,7,8,9,10]);
  };

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1).sort((a,b) => a-b);
    setArray(newArray);
    setInputArray(newArray.join(','));
    resetAnimation();
  };

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (currentStep < searchSteps.length - 1) {
        intervalRef.current = setInterval(() => { stepForward(); }, speed);
      }
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isPlaying, isPaused, currentStep, searchSteps.length, speed]);

  const getElementClass = (index: number) => {
    if (currentStep === -1) return 'bg-zinc-100 border-zinc-300 text-zinc-700';
    const step = searchSteps[currentStep];
    if (!step) return 'bg-zinc-100 border-zinc-300 text-zinc-700';
    if (step.found && index === step.mid) return 'bg-green-500 border-green-700 text-white font-bold scale-110 shadow-lg';
    if (index === step.mid) return 'bg-yellow-400 border-yellow-600 text-zinc-900 font-bold scale-105 shadow';
    if (index >= step.left && index <= step.right) return 'bg-blue-100 border-blue-300 text-blue-700';
    return 'bg-zinc-200 border-zinc-300 text-zinc-400 opacity-50';
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900">Binary Search</h1>
          <p className="text-zinc-700 text-lg mt-2">
            An efficient searching algorithm that works on sorted arrays by repeatedly dividing the search interval in half.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm mt-4">
            <div className="flex items-center gap-2"><i className="bi bi-clock text-indigo-600"></i> <span>Time: O(log n)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-gear text-indigo-600"></i> <span>Space: O(1)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-search text-indigo-600"></i> <span>Divide & Conquer</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-check-circle text-indigo-600"></i> <span>Efficient</span></div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3"><i className="bi bi-info-circle text-indigo-600"></i> How Binary Search Works</h4>
          <p className="text-zinc-700 leading-relaxed">
            Binary Search uses a divide-and-conquer approach. It compares the target value with the middle element of the array.
            If they match, the search is complete. If the target is less than the middle element, the search continues in the lower half.
            If the target is greater, the search continues in the upper half. This process repeats until the target is found or the search space is empty.
          </p>
          {/* Code Block */}
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
            <li>Requires sorted array</li>
            <li>Divide and conquer approach</li>
            <li>Logarithmic time complexity</li>
            <li>Efficient for large datasets</li>
            <li>Predictable performance</li>
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
              <label className="block mb-1 text-zinc-700 font-medium">Sorted Array Elements:</label>
              <input
                type="text"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={inputArray}
                onChange={(e) => setInputArray(e.target.value)}
                placeholder="Enter comma-separated numbers (will be sorted automatically)"
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
            <div className="flex-1">
              <label className="block mb-1 text-zinc-700 font-medium">Search Value:</label>
              <input
                type="number"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchValue}
                onChange={(e) => setSearchValue(Number(e.target.value))}
                placeholder="Enter number to search"
              />
            </div>
          </div>
          {/* Controls */}
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
              onClick={isPlaying && !isPaused ? pauseAnimation : startAnimation}
              disabled={currentStep >= searchSteps.length - 1 && !isPaused}
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
              disabled={currentStep >= searchSteps.length - 1}
              title="Step Forward"
            >
              <i className="bi bi-skip-forward-fill"></i>
            </button>
          </div>
          {/* Progress Bar */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-zinc-500">Step {currentStep + 1} of {searchSteps.length}</span>
            <div className="flex-1 h-2 bg-zinc-200 rounded overflow-hidden mx-2">
              <div
                className="h-2 bg-indigo-500"
                style={{ width: `${searchSteps.length > 0 ? ((currentStep + 1) / searchSteps.length) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="text-xs text-zinc-500">{searchSteps.length > 0 ? Math.round(((currentStep + 1) / searchSteps.length) * 100) : 0}%</span>
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
                {/* Arrow indicator */}
                {currentStep >= 0 && searchSteps[currentStep] && index === searchSteps[currentStep].mid && (
                  <span className="absolute left-1/2 -top-6 -translate-x-1/2 text-2xl text-indigo-500 animate-bounce">↓</span>
                )}
              </div>
            ))}
          </div>
          {/* Step message */}
          {currentStep >= 0 && searchSteps[currentStep] && (
            <div className="text-center mb-3">
              <div className="inline-flex items-center gap-2 rounded border-2 border-indigo-400 bg-indigo-50 px-4 py-2 text-indigo-700 font-semibold shadow">
                <i className="bi bi-chat-text"></i>
                {searchSteps[currentStep].message}
              </div>
            </div>
          )}
          {/* Final result */}
          {searchResult !== null && (
            <div className="text-center mb-3">
              {searchResult >= 0 ? (
                <div className="inline-flex items-center gap-2 rounded border-2 border-green-600 bg-green-100 px-4 py-2 text-green-800 font-semibold shadow">
                  <i className="bi bi-check-circle"></i>
                  Found {searchValue} at index {searchResult}!
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded border-2 border-yellow-600 bg-yellow-100 px-4 py-2 text-yellow-800 font-semibold shadow">
                  <i className="bi bi-exclamation-triangle"></i>
                  {searchValue} not found in array
                </div>
              )}
            </div>
          )}
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Use the controls to step through the algorithm and see how the search space is divided in half at each step.
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
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(1)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Target found at the middle position</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Average</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-yellow-200 text-yellow-800 rounded px-2 py-1 font-semibold">O(log n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Target found after several divisions</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Worst</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-red-200 text-red-800 rounded px-2 py-1 font-semibold">O(log n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Target not found or at the end</td>
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
                <i className="bi bi-database text-green-600"></i> Database Queries
              </h6>
              <p className="text-zinc-700 text-sm">Fast lookup in indexed databases</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-controller text-green-600"></i> Game Development
              </h6>
              <p className="text-zinc-700 text-sm">Finding items in sorted game data</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-calculator text-green-600"></i> Scientific Computing
              </h6>
              <p className="text-zinc-700 text-sm">Numerical analysis and computations</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-search text-green-600"></i> Search Engines
              </h6>
              <p className="text-zinc-700 text-sm">Finding documents in sorted indices</p>
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
              <li>Extremely fast search O(log n)</li>
              <li>Efficient for large datasets</li>
              <li>Predictable performance</li>
              <li>Memory efficient O(1) space</li>
              <li>Perfect for sorted data</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Requires sorted data</li>
              <li>Poor performance on unsorted arrays</li>
              <li>Complex implementation</li>
              <li>Not suitable for dynamic data</li>
              <li>Overkill for small datasets</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinarySearch;
