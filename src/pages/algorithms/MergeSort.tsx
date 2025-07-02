import React, { useState, useRef, useEffect } from 'react';

interface MergeStep {
  left: number;
  right: number;
  mid: number;
  message: string;
  array: number[];
  subArrays?: { left: number[]; right: number[] };
  merging?: number[];
}

const codeImplementations = {
  javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}
function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  return result.concat(left.slice(i), right.slice(j));
}`,
  python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)
def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
  cpp: `void mergeSort(int arr[], int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}
void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (int j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];
    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}`,
  go: `func mergeSort(arr []int) []int {
    if len(arr) <= 1 {
        return arr
    }
    mid := len(arr) / 2
    left := mergeSort(arr[:mid])
    right := mergeSort(arr[mid:])
    return merge(left, right)
}
func merge(left, right []int) []int {
    result := make([]int, 0, len(left)+len(right))
    i, j := 0, 0
    for i < len(left) && j < len(right) {
        if left[i] <= right[j] {
            result = append(result, left[i])
            i++
        } else {
            result = append(result, right[j])
            j++
        }
    }
    result = append(result, left[i:]...)
    result = append(result, right[j:]...)
    return result
}`,
  rust: `fn merge_sort<T: Ord + Clone>(arr: &[T]) -> Vec<T> {
    if arr.len() <= 1 {
        return arr.to_vec();
    }
    let mid = arr.len() / 2;
    let left = merge_sort(&arr[..mid]);
    let right = merge_sort(&arr[mid..]);
    merge(left, right)
}
fn merge<T: Ord + Clone>(left: Vec<T>, right: Vec<T>) -> Vec<T> {
    let mut result = Vec::with_capacity(left.len() + right.len());
    let mut i = 0;
    let mut j = 0;
    while i < left.len() && j < right.len() {
        if left[i] <= right[j] {
            result.push(left[i].clone());
            i += 1;
        } else {
            result.push(right[j].clone());
            j += 1;
        }
    }
    result.extend_from_slice(&left[i..]);
    result.extend_from_slice(&right[j..]);
    result
}`
};

const MergeSort: React.FC = () => {
  const [originalArray, setOriginalArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [sortSteps, setSortSteps] = useState<MergeStep[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [inputArray, setInputArray] = useState<string>('64,34,25,12,22,11,90');
  const [speed] = useState<number>(1000);
  const [activeLanguage, setActiveLanguage] = useState<string>('javascript');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate merge sort steps for the current array
  const generateMergeSteps = (arr: number[]): MergeStep[] => {
    const steps: MergeStep[] = [];
    const workingArray = [...arr];
    steps.push({ left: -1, right: -1, mid: -1, message: 'Starting merge sort...', array: [...workingArray] });
    const mergeSortHelper = (left: number, right: number) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        steps.push({ left, right, mid, message: `Dividing array from index ${left} to ${right} at mid ${mid}`, array: [...workingArray] });
        mergeSortHelper(left, mid);
        mergeSortHelper(mid + 1, right);
        const leftArray = workingArray.slice(left, mid + 1);
        const rightArray = workingArray.slice(mid + 1, right + 1);
        steps.push({ left, right, mid, message: `Merging subarrays: [${leftArray.join(', ')}] and [${rightArray.join(', ')}]`, array: [...workingArray], subArrays: { left: leftArray, right: rightArray }, merging: [left, right] });
        let i = 0, j = 0, k = left;
        const tempLeft = [...leftArray];
        const tempRight = [...rightArray];
        while (i < tempLeft.length && j < tempRight.length) {
          if (tempLeft[i] <= tempRight[j]) {
            workingArray[k] = tempLeft[i];
            steps.push({ left, right, mid, message: `Taking ${tempLeft[i]} from left subarray`, array: [...workingArray], subArrays: { left: tempLeft, right: tempRight }, merging: [k, k] });
            i++;
          } else {
            workingArray[k] = tempRight[j];
            steps.push({ left, right, mid, message: `Taking ${tempRight[j]} from right subarray`, array: [...workingArray], subArrays: { left: tempLeft, right: tempRight }, merging: [k, k] });
            j++;
          }
          k++;
        }
        while (i < tempLeft.length) {
          workingArray[k] = tempLeft[i];
          steps.push({ left, right, mid, message: `Remaining element from left: ${tempLeft[i]}`, array: [...workingArray], subArrays: { left: tempLeft, right: tempRight }, merging: [k, k] });
          i++; k++;
        }
        while (j < tempRight.length) {
          workingArray[k] = tempRight[j];
          steps.push({ left, right, mid, message: `Remaining element from right: ${tempRight[j]}`, array: [...workingArray], subArrays: { left: tempLeft, right: tempRight }, merging: [k, k] });
          j++; k++;
        }
      }
    };
    mergeSortHelper(0, workingArray.length - 1);
    steps.push({ left: -1, right: -1, mid: -1, message: 'Array is now sorted!', array: [...workingArray] });
    return steps;
  };

  useEffect(() => {
    if (originalArray.length > 0) {
      const steps = generateMergeSteps(originalArray);
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
    setIsPlaying(true); setIsPaused(false);
    const animate = () => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= sortSteps.length) { setIsPlaying(false); setIsPaused(false); return prev; }
        setArray(sortSteps[next].array);
        return next;
      });
    };
    intervalRef.current = setInterval(animate, speed);
  };
  const pauseAnimation = () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } setIsPaused(true); };
  const stopAnimation = () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } setIsPlaying(false); setIsPaused(false); setCurrentStep(-1); setArray([...originalArray]); };
  const stepForward = () => { if (currentStep < sortSteps.length - 1) { const nextStep = currentStep + 1; setCurrentStep(nextStep); setArray(sortSteps[nextStep].array); } };
  const stepBackward = () => { if (currentStep > 0) { const prevStep = currentStep - 1; setCurrentStep(prevStep); setArray(sortSteps[prevStep].array); } else if (currentStep === 0) { setCurrentStep(-1); setArray([...originalArray]); } };
  const generateRandomArray = () => { const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100) + 1); setOriginalArray(newArray); setInputArray(newArray.join(',')); stopAnimation(); };
  const resetArray = () => { setOriginalArray([64, 34, 25, 12, 22, 11, 90]); setInputArray('64,34,25,12,22,11,90'); };

  // Array element coloring
  const getElementClass = (index: number) => {
    const step = sortSteps[currentStep];
    if (!step) return 'bg-zinc-100 border-zinc-300 text-zinc-700';
    if (step.merging && step.merging.includes(index)) return 'bg-yellow-400 border-yellow-600 text-zinc-900 font-bold scale-105 shadow';
    if (step.left <= index && index <= step.right && step.left !== -1) return 'bg-blue-100 border-blue-300 text-blue-700';
    return 'bg-zinc-200 border-zinc-300 text-zinc-700';
  };

  const getCurrentMessage = () => (currentStep >= 0 && currentStep < sortSteps.length) ? sortSteps[currentStep].message : 'Click "Start" to begin the merge sort visualization';
  const getCurrentSubArrays = () => (currentStep >= 0 && currentStep < sortSteps.length) ? sortSteps[currentStep].subArrays : null;

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900">Merge Sort</h1>
          <p className="text-zinc-700 text-lg mt-2">
            A stable, divide-and-conquer sorting algorithm that guarantees O(n log n) performance
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm mt-4">
            <div className="flex items-center gap-2"><i className="bi bi-clock text-indigo-600"></i> <span>Time: O(n log n)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-graph-up text-indigo-600"></i> <span>Space: O(n)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-shield-check text-indigo-600"></i> <span>Stable</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-arrow-repeat text-indigo-600"></i> <span>Divide & Conquer</span></div>
          </div>
        </div>
        {/* Info Section */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3"><i className="bi bi-info-circle text-indigo-600"></i> How Merge Sort Works</h4>
          <p className="text-zinc-700 leading-relaxed">
            Merge Sort is a stable, comparison-based sorting algorithm that uses a divide-and-conquer strategy. It works by recursively dividing the array into two halves, sorting each half, and then merging the sorted halves back together. This process continues until the entire array is sorted.
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
            <li>Guaranteed O(n log n) time complexity</li>
            <li>Stable sorting algorithm</li>
            <li>Predictable performance regardless of input</li>
            <li>Excellent for linked lists</li>
            <li>Can be easily parallelized</li>
            <li>External sorting friendly</li>
            <li>Memory efficient for large datasets</li>
          </ul>
        </div>
        {/* Algorithm Steps */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3"><i className="bi bi-list-ol text-indigo-600"></i> Step-by-Step Process</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Divide Phase:</h6>
              <ol className="list-decimal list-inside text-zinc-700 space-y-1">
                <li>Divide the array into two equal halves</li>
                <li>Recursively sort the left half</li>
                <li>Recursively sort the right half</li>
                <li>Continue until subarrays have 1 element</li>
              </ol>
            </div>
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Conquer Phase:</h6>
              <ol className="list-decimal list-inside text-zinc-700 space-y-1">
                <li>Merge the sorted subarrays</li>
                <li>Compare elements from both arrays</li>
                <li>Place smaller element in result array</li>
                <li>Continue until all elements are merged</li>
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
          {/* Subarrays display */}
          {getCurrentSubArrays() && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <h6 className="font-semibold text-zinc-900 mb-2">Left Subarray:</h6>
                <div className="flex flex-wrap gap-2">
                  {getCurrentSubArrays()?.left.map((value, index) => (
                    <div key={index} className="w-10 h-10 rounded-lg border-2 bg-blue-100 border-blue-300 flex items-center justify-center text-blue-700 font-semibold">{value}</div>
                  ))}
                </div>
              </div>
              <div>
                <h6 className="font-semibold text-zinc-900 mb-2">Right Subarray:</h6>
                <div className="flex flex-wrap gap-2">
                  {getCurrentSubArrays()?.right.map((value, index) => (
                    <div key={index} className="w-10 h-10 rounded-lg border-2 bg-green-100 border-green-300 flex items-center justify-center text-green-700 font-semibold">{value}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Use the controls to step through the merge sort algorithm. Watch how the array is divided into smaller subarrays and then merged back together in sorted order.
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
                  <td className="px-4 py-2 border border-gray-300">O(n)</td>
                  <td className="px-4 py-2 border border-gray-300">Consistent performance regardless of input order</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Average</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-yellow-200 text-yellow-800 rounded px-2 py-1 font-semibold">O(n log n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(n)</td>
                  <td className="px-4 py-2 border border-gray-300">Same as best case - very predictable</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Worst</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-red-200 text-red-800 rounded px-2 py-1 font-semibold">O(n log n)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(n)</td>
                  <td className="px-4 py-2 border border-gray-300">Consistent performance even with worst-case input</td>
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
                <i className="bi bi-hdd-network text-green-600"></i> External Sorting
              </h6>
              <p className="text-zinc-700 text-sm">Perfect for sorting data that doesn't fit in memory</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-link-45deg text-green-600"></i> Linked Lists
              </h6>
              <p className="text-zinc-700 text-sm">Excellent performance when sorting linked list structures</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-cpu text-green-600"></i> Parallel Processing
              </h6>
              <p className="text-zinc-700 text-sm">Easily parallelizable for multi-core systems</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-database text-green-600"></i> Database Systems
              </h6>
              <p className="text-zinc-700 text-sm">Used in database engines for stable sorting operations</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-file-earmark-text text-green-600"></i> File Systems
              </h6>
              <p className="text-zinc-700 text-sm">Sorting large files and directories efficiently</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-graph-up text-green-600"></i> Data Analysis
              </h6>
              <p className="text-zinc-700 text-sm">When stability and predictable performance are required</p>
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
              <li>Guaranteed O(n log n) performance</li>
              <li>Stable sorting algorithm</li>
              <li>Predictable performance</li>
              <li>Works well with external sorting</li>
              <li>Good for linked lists</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Requires extra space O(n)</li>
              <li>Not in-place algorithm</li>
              <li>Overkill for small arrays</li>
              <li>Poor cache performance</li>
              <li>Complex implementation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MergeSort;
