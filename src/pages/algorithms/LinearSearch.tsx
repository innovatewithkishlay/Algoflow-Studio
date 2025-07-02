import React, { useState, useRef, useEffect } from 'react';

interface SearchStep {
  index: number;
  value: number;
  found: boolean;
  message: string;
}

const codeImplementations = {
  javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;  // Found at index i
    }
  }
  return -1;  // Not found
}`,
  python: `def linear_search(arr, target):
  for i in range(len(arr)):
    if arr[i] == target:
      return i  # Found at index i
  return -1  # Not found`,
  cpp: `int linearSearch(int arr[], int n, int target) {
  for (int i = 0; i < n; i++) {
    if (arr[i] == target) {
      return i;  // Found at index i
    }
  }
  return -1;  // Not found
}`,
  go: `func linearSearch(arr []int, target int) int {
  for i, val := range arr {
    if val == target {
      return i  // Found at index i
    }
  }
  return -1  // Not found
}`,
  rust: `fn linear_search(arr: &[i32], target: i32) -> i32 {
  for (i, &val) in arr.iter().enumerate() {
    if val == target {
      return i as i32;  // Found at index i
    }
  }
  -1  // Not found
}`
};

const LinearSearch: React.FC = () => {
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90, 88, 76, 45]);
  const [searchValue, setSearchValue] = useState<number>(22);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [searchSteps, setSearchSteps] = useState<SearchStep[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<number | null>(null);
  const [inputArray, setInputArray] = useState<string>('64,34,25,12,22,11,90,88,76,45');
  const [speed] = useState<number>(1000);
  const [activeLanguage, setActiveLanguage] = useState<string>('javascript');
const intervalRef = useRef<number | null>(null);

  // Generate search steps for the current array and search value
  const generateSearchSteps = (arr: number[], target: number): SearchStep[] => {
    const steps: SearchStep[] = [];
    for (let i = 0; i < arr.length; i++) {
      const found = arr[i] === target;
      const message = found
        ? `Found ${target} at index ${i}!`
        : `Checking index ${i}: ${arr[i]} ≠ ${target}`;
      steps.push({ index: i, value: arr[i], found, message });
      if (found) break;
    }
    if (!steps.some(step => step.found)) {
      steps.push({ index: -1, value: target, found: false, message: `${target} not found in array` });
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
      .filter(n => !isNaN(n));
    if (nums.length > 0) setArray(nums);
  }, [inputArray]);

  // Animation control functions
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
          setSearchResult(step.index);
          setIsPlaying(false);
          setIsPaused(false);
        } else if (step.index === -1) {
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
      if (step.found) setSearchResult(step.index);
      else if (step.index === -1) setSearchResult(-1);
    }
  };

  const stepBackward = () => {
    if (currentStep > -1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      if (prevStep === -1) setSearchResult(null);
      else {
        const step = searchSteps[prevStep];
        if (step.found) setSearchResult(step.index);
        else setSearchResult(null);
      }
    }
  };

  const resetAnimation = () => {
    stopAnimation();
    setInputArray('64,34,25,12,22,11,90,88,76,45');
    setSearchValue(22);
    setArray([64, 34, 25, 12, 22, 11, 90, 88, 76, 45]);
  };

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
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

  // Array element coloring
  const getElementClass = (index: number) => {
    if (currentStep === -1) return 'bg-zinc-100 border-zinc-300 text-zinc-700';
    if (currentStep === index) return 'bg-yellow-400 border-yellow-600 text-zinc-900 font-bold scale-105 shadow';
    if (currentStep > index) return 'bg-green-500 border-green-700 text-white font-bold';
    return 'bg-zinc-200 border-zinc-300 text-zinc-400 opacity-50';
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900">Linear Search</h1>
          <p className="text-zinc-700 text-lg mt-2">
            A simple searching algorithm that checks each element in the array sequentially until the target is found
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm mt-4">
            <div className="flex items-center gap-2"><i className="bi bi-clock text-indigo-600"></i> <span>Time: O(n)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-gear text-indigo-600"></i> <span>Space: O(1)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-search text-indigo-600"></i> <span>Sequential</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-check-circle text-indigo-600"></i> <span>Simple</span></div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3"><i className="bi bi-info-circle text-indigo-600"></i> How Linear Search Works</h4>
          <p className="text-zinc-700 leading-relaxed">
            Linear Search is a simple searching algorithm that iterates through the array from the beginning to the end,
            checking each element one by one until it finds the target value. If the target is found, it returns the index;
            otherwise, it returns -1.
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
            <li>Works on unsorted arrays</li>
            <li>Simple to implement and understand</li>
            <li>Guaranteed to find element if present</li>
            <li>No preprocessing required</li>
            <li>Sequential access pattern</li>
            <li>Inefficient for large datasets</li>
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
                placeholder="Enter comma-separated numbers (e.g., 64,34,25,12,22)"
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
                {/* Arrow indicator for current position */}
                {currentStep === index && (
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
            <strong>Tip:</strong> Use the controls to step through the algorithm and see how each element is checked sequentially.
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
                  <td className="px-4 py-2 border border-gray-300">Target found at the first position</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Average</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-yellow-200 text-yellow-800 rounded px-2 py-1 font-semibold">O(n/2)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Target found in the middle</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Worst</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-red-200 text-red-800 rounded px-2 py-1 font-semibold">O(n)</span>
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
                <i className="bi bi-collection text-green-600"></i> Small Datasets
              </h6>
              <p className="text-zinc-700 text-sm">Perfect for arrays with few elements</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-shuffle text-green-600"></i> Unsorted Data
              </h6>
              <p className="text-zinc-700 text-sm">Works on any order of elements</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-book text-green-600"></i> Educational
              </h6>
              <p className="text-zinc-700 text-sm">Great for learning search concepts</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-gear text-green-600"></i> Simple Applications
              </h6>
              <p className="text-zinc-700 text-sm">When simplicity is preferred</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-list-check text-green-600"></i> One-time Searches
              </h6>
              <p className="text-zinc-700 text-sm">When searching is done infrequently</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-code text-indigo-600"></i> Prototyping
              </h6>
              <p className="text-zinc-700 text-sm">Quick implementation for testing</p>
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
              <li>Works on unsorted arrays</li>
              <li>No preprocessing required</li>
              <li>Guaranteed to find element if present</li>
              <li>Constant space complexity</li>
              <li>Good for small datasets</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Inefficient for large datasets</li>
              <li>Linear time complexity</li>
              <li>Not suitable for frequent searches</li>
              <li>No optimization for sorted data</li>
              <li>Sequential access pattern</li>
              <li>Poor performance compared to binary search</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinearSearch;
