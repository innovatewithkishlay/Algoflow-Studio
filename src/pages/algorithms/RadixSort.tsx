import React, { useState, useRef, useEffect } from 'react';

interface RadixSortStep {
  array: number[];
  digitPlace: number;
  bucket: number[][];
  phase: 'distribute' | 'collect' | 'done';
  i: number;
  message: string;
  sorted: number[];
}

const codeImplementations = {
  javascript: `function radixSort(arr) {
  const max = Math.max(...arr);
  let exp = 1;
  while (Math.floor(max / exp) > 0) {
    countingSortByDigit(arr, exp);
    exp *= 10;
  }
  return arr;
}
function countingSortByDigit(arr, exp) {
  let output = Array(arr.length).fill(0);
  let count = Array(10).fill(0);
  for (let i = 0; i < arr.length; i++) {
    let digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
  }
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];
  for (let i = arr.length - 1; i >= 0; i--) {
    let digit = Math.floor(arr[i] / exp) % 10;
    output[count[digit] - 1] = arr[i];
    count[digit]--;
  }
  for (let i = 0; i < arr.length; i++) arr[i] = output[i];
}`
};

const getMaxDigits = (arr: number[]) => {
  const max = Math.max(...arr);
  return max.toString().length;
};

const getDigit = (num: number, place: number) => {
  return Math.floor(Math.abs(num) / Math.pow(10, place)) % 10;
};

const RadixSort: React.FC = () => {
  const [originalArray, setOriginalArray] = useState<number[]>([170, 45, 75, 90, 802, 24, 2, 66]);
  const [array, setArray] = useState<number[]>([170, 45, 75, 90, 802, 24, 2, 66]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [sortSteps, setSortSteps] = useState<RadixSortStep[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [inputArray, setInputArray] = useState<string>('170,45,75,90,802,24,2,66');
  const [speed] = useState<number>(1000);
  const [activeLanguage, setActiveLanguage] = useState<string>('javascript');
  const intervalRef = useRef<number | null>(null);

  // Generate radix sort steps for the current array
  const generateRadixSortSteps = (arr: number[]): RadixSortStep[] => {
    const steps: RadixSortStep[] = [];
    const workingArray = [...arr];
    const maxDigits = getMaxDigits(workingArray);

    const sorted: number[] = [];
    for (let place = 0; place < maxDigits; place++) {
      // Distribute to buckets
      const buckets: number[][] = Array.from({ length: 10 }, () => []);
      for (let i = 0; i < workingArray.length; i++) {
        const digit = getDigit(workingArray[i], place);
        buckets[digit].push(workingArray[i]);
        steps.push({
          array: [...workingArray],
          digitPlace: place,
          bucket: buckets.map(b => [...b]),
          phase: 'distribute',
          i,
          message: `Placing ${workingArray[i]} in bucket ${digit} (digit place ${place + 1})`,
          sorted: [...sorted]
        });
      }
      // Collect from buckets
      let idx = 0;
      for (let b = 0; b < 10; b++) {
        for (let k = 0; k < buckets[b].length; k++) {
          workingArray[idx] = buckets[b][k];
          steps.push({
            array: [...workingArray],
            digitPlace: place,
            bucket: buckets.map(b => [...b]),
            phase: 'collect',
            i: idx,
            message: `Collecting ${buckets[b][k]} from bucket ${b}`,
            sorted: [...sorted]
          });
          idx++;
        }
      }
    }
    steps.push({
      array: [...workingArray],
      digitPlace: maxDigits - 1,
      bucket: [],
      phase: 'done',
      i: -1,
      message: 'Array is now sorted!',
      sorted: Array.from({ length: workingArray.length }, (_, idx) => idx)
    });
    return steps;
  };

  // Initialize sort steps when original array changes
  useEffect(() => {
    if (originalArray.length > 0) {
      const steps = generateRadixSortSteps(originalArray);
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
    const newArray = Array.from({ length: 7 }, () => Math.floor(Math.random() * 900) + 10);
    setOriginalArray(newArray);
    setInputArray(newArray.join(','));
    stopAnimation();
  };

  const resetArray = () => {
    setOriginalArray([170, 45, 75, 90, 802, 24, 2, 66]);
    setInputArray('170,45,75,90,802,24,2,66');
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
    return 'Click "Start" to begin the radix sort visualization';
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900">Radix Sort</h1>
          <p className="text-zinc-700 text-lg mt-2">
            A non-comparison-based sorting algorithm that sorts numbers by processing individual digits.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm mt-4">
            <div className="flex items-center gap-2"><i className="bi bi-clock text-indigo-600"></i> <span>Average: O(d·(n + k))</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-graph-up text-indigo-600"></i> <span>Worst: O(d·(n + k))</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-gear text-indigo-600"></i> <span>Space: O(n + k)</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-check-circle text-indigo-600"></i> <span>Stable</span></div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3"><i className="bi bi-info-circle text-indigo-600"></i> How Radix Sort Works</h4>
          <p className="text-zinc-700 leading-relaxed">
            Radix Sort sorts numbers by processing each digit from least significant to most significant. It uses a stable subroutine (like counting sort) for each digit place.
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
            <li>Non-comparison-based sorting</li>
            <li>Stable sort</li>
            <li>Efficient for fixed-length integers</li>
            <li>Time complexity O(d·(n + k))</li>
            <li>Space complexity O(n + k)</li>
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
          {/* Bucket Visualization */}
          {sortSteps[currentStep]?.bucket && sortSteps[currentStep]?.bucket.length > 0 && (
            <div className="mb-3">
              <label className="block mb-1 text-zinc-700 font-medium">Buckets (Digit Place {sortSteps[currentStep]?.digitPlace + 1}):</label>
              <div className="flex flex-wrap gap-3 justify-center items-end mb-6">
                {sortSteps[currentStep].bucket.map((bucket, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-lg border-2 bg-blue-100 border-blue-300 text-blue-700 flex items-center justify-center mb-1">
                      <span className="font-semibold">{idx}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      {bucket.map((val, i) => (
                        <div key={i} className="w-10 h-8 rounded bg-blue-200 text-blue-800 flex items-center justify-center text-sm">
                          {val}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            <strong>Tip:</strong> Radix Sort works best for numbers with a similar number of digits. Watch how each digit place is processed!
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadixSort;
