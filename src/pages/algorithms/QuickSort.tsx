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
    intervalRef.current = window.setInterval(animate, speed);
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

  const getElementClass = (index: number) => {
    const step = sortSteps[currentStep];
    if (!step) return 'array-element default';

    if (step.sorted && step.sorted.includes(index)) return 'sorted';
    if (step.pivotIndex === index) return 'pivot';
    if (step.partitioning && index >= step.partitioning[0] && index <= step.partitioning[1]) return 'partitioning';
    if (step.i === index) return 'i-pointer';
    if (step.j === index) return 'j-pointer';

    return 'default';
  };

  const getCurrentMessage = () => {
    if (currentStep >= 0 && currentStep < sortSteps.length) return sortSteps[currentStep].message;
    return 'Click "Start" to begin the quick sort visualization';
  };

  return (
    <div className="container-fluid py-3">
      {/* Page Header */}
      <div className="page-header mb-4">
        <div className="page-header-content">
          <h1 className="page-title">Quick Sort</h1>
          <p className="page-subtitle">A highly efficient, comparison-based sorting algorithm that uses a divide-and-conquer strategy with a pivot element</p>
          <div className="page-meta">
            <div className="page-meta-item"><i className="bi bi-clock"></i><span>Average: O(n log n)</span></div>
            <div className="page-meta-item"><i className="bi bi-graph-up"></i><span>Worst: O(n²)</span></div>
            <div className="page-meta-item"><i className="bi bi-gear"></i><span>Space: O(log n)</span></div>
            <div className="page-meta-item"><i className="bi bi-check-circle"></i><span>In-place</span></div>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="info-section fade-in-up mb-4">
        <h4><i className="bi bi-info-circle"></i> How Quick Sort Works</h4>
        <p className="info-description">Quick Sort is a highly efficient, comparison-based sorting algorithm that uses a divide-and-conquer strategy. It works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays according to whether they are less than or greater than the pivot.</p>

        <div className="code-example">
          <div className="language-tabs mb-3">
            <div className="nav nav-tabs" role="tablist">
              {Object.keys(codeImplementations).map((lang) => (
                <button key={lang} className={`nav-link ${activeLanguage === lang ? 'active' : ''}`} onClick={() => setActiveLanguage(lang)} type="button" role="tab">
                  {lang === 'javascript' && <><i className="bi bi-code-slash"></i> JavaScript</>}
                  {lang === 'python' && <><i className="bi bi-code-square"></i> Python</>}
                  {lang === 'cpp' && <><i className="bi bi-braces"></i> C/C++</>}
                  {lang === 'go' && <><i className="bi bi-gear"></i> Go</>}
                  {lang === 'rust' && <><i className="bi bi-shield-check"></i> Rust</>}
                </button>
              ))}
            </div>
            <div className="tab-content">
              <div className="tab-pane fade show active">
                <pre><code>{codeImplementations[activeLanguage as keyof typeof codeImplementations]}</code></pre>
              </div>
            </div>
          </div>
          </div>

        <h4 className="mt-4"><i className="bi bi-list-check"></i> Key Features</h4>
          <ul className="features-list">
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
      <div className="info-section mb-4">
        <h4><i className="bi bi-list-ol"></i> Step-by-Step Process</h4>
        <div className="row">
          <div className="col-md-6">
            <h6 className="text-highlight">Partitioning Phase:</h6>
            <ol className="features-list">
              <li>Choose a pivot element (usually last element)</li>
              <li>Partition elements around the pivot</li>
              <li>Place pivot in its final sorted position</li>
              <li>Elements smaller than pivot go to the left</li>
            </ol>
          </div>
          <div className="col-md-6">
            <h6 className="text-highlight">Recursive Phase:</h6>
            <ol className="features-list">
              <li>Recursively sort the left subarray</li>
              <li>Recursively sort the right subarray</li>
              <li>Combine the sorted subarrays</li>
              <li>Continue until all elements are sorted</li>
            </ol>
          </div>
        </div>
      </div>

        {/* Interactive Section */}
      <div className="interactive-section slide-in-right mb-4">
        <h5><i className="bi bi-play-circle"></i> Interactive Demo & Visualization</h5>

        <div className="row g-3 mb-4">
          <div className="col-md-12">
            <label className="form-label">Array Elements:</label>
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                value={inputArray}
                onChange={(e) => setInputArray(e.target.value)}
                placeholder="Enter comma-separated numbers"
                disabled={isPlaying}
              />
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-info-enhanced btn-enhanced" onClick={generateRandomArray} disabled={isPlaying}>
                <i className="bi bi-shuffle"></i> Generate Random Array
              </button>
              <button className="btn btn-secondary btn-enhanced" onClick={resetArray} disabled={isPlaying}>
                <i className="bi bi-arrow-clockwise"></i> Reset Array
              </button>
            </div>
          </div>
        </div>

          <div className="mb-3">
            <label className="form-label">Current Array:</label>
            <div className="d-flex flex-wrap gap-2 mb-3">
            {(array || []).map((value, index) => (
              <div key={index} className={`array-element ${getElementClass(index)}`} style={{ minWidth: '3rem', position: 'relative' }}>
                {value}
                <small className="array-index-label position-absolute" style={{ bottom: '-22px', left: '50%', transform: 'translateX(-50%)' }}>[{index}]</small>
              </div>
            ))}
            </div>
          </div>

        <div className="mb-3">
          <div className="d-flex flex-wrap gap-2 justify-content-center">
              <button
              className="btn btn-success-enhanced btn-enhanced"
              onClick={isPlaying && !isPaused ? pauseAnimation : startAnimation}
              disabled={currentStep >= sortSteps.length - 1 && !isPaused}
              title={isPlaying && !isPaused ? 'Pause' : 'Play'}
            >
              <i className={`bi ${isPlaying && !isPaused ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
            </button>
            <button className="btn btn-warning btn-enhanced" onClick={stopAnimation} title="Stop">
              <i className="bi bi-stop-fill"></i>
            </button>
            <button className="btn btn-info-enhanced btn-enhanced" onClick={stepBackward} disabled={currentStep <= -1} title="Step Back">
              <i className="bi bi-skip-backward-fill"></i>
              </button>
            <button className="btn btn-info-enhanced btn-enhanced" onClick={stepForward} disabled={currentStep >= sortSteps.length - 1} title="Step Forward">
              <i className="bi bi-skip-forward-fill"></i>
              </button>
            </div>
          </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <span className="small text-muted">Step {currentStep + 1} of {sortSteps.length}</span>
            <div className="progress flex-grow-1 mx-2" style={{ height: '8px' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${sortSteps.length > 0 ? ((currentStep + 1) / sortSteps.length) * 100 : 0}%` }}
                aria-valuenow={currentStep + 1}
                aria-valuemin={0}
                aria-valuemax={sortSteps.length}
              ></div>
            </div>
            <span className="small text-muted">{sortSteps.length > 0 ? Math.round(((currentStep + 1) / sortSteps.length) * 100) : 0}%</span>
          </div>
        </div>

        <div className="current-step-info mb-3">
          <div className="alert alert-light">
            <i className="bi bi-chat-text"></i> <strong>Message:</strong> {getCurrentMessage()}
        </div>
      </div>

        <div className="alert alert-info">
          <i className="bi bi-lightbulb"></i> <strong>Tip:</strong> Use the controls to step through the quick sort algorithm. Watch how the pivot is selected and how elements are partitioned around it.
        </div>
      </div>

      {/* Complexity Analysis */}
      <div className="info-section mb-4">
        <h4><i className="bi bi-graph-up"></i> Time & Space Complexity</h4>
        <div className="table-responsive">
          <table className="table complexity-table">
            <thead>
              <tr>
                <th>Case</th>
                <th>Time Complexity</th>
                <th>Space Complexity</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="complexity-badge best">Best</span></td>
                <td>O(n log n)</td>
                <td>O(log n)</td>
                <td>When the pivot divides the array into roughly equal halves</td>
              </tr>
              <tr>
                <td><span className="complexity-badge average">Average</span></td>
                <td>O(n log n)</td>
                <td>O(log n)</td>
                <td>Typical case with random data</td>
              </tr>
              <tr>
                <td><span className="complexity-badge worst">Worst</span></td>
                <td>O(n²)</td>
                <td>O(n)</td>
                <td>When the pivot is always the smallest or largest element</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Use Cases */}
      <div className="info-section mb-4">
        <h4><i className="bi bi-lightning"></i> Use Cases & Applications</h4>
        <div className="use-cases-grid">
          <div className="use-case-item">
            <h6><i className="bi bi-cpu"></i> General Sorting</h6>
            <p>Most common use case for sorting large datasets efficiently</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-database"></i> Database Systems</h6>
            <p>Used in database engines for sorting query results</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-code-square"></i> Programming Languages</h6>
            <p>Default sorting algorithm in many programming languages</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-graph-up"></i> Data Analysis</h6>
            <p>Sorting large datasets for analysis and visualization</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-speedometer2"></i> Real-time Systems</h6>
            <p>When predictable average performance is required</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-hdd-network"></i> Memory-constrained Systems</h6>
            <p>Due to its in-place sorting nature</p>
          </div>
        </div>
      </div>

      {/* Advantages and Disadvantages */}
      <div className="content-grid mb-4">
        <div className="info-section">
          <h4><i className="bi bi-plus-circle"></i> Advantages</h4>
          <ul className="features-list">
            <li>Excellent average-case performance</li>
            <li>In-place sorting algorithm</li>
            <li>Cache-friendly due to locality</li>
            <li>Works well with virtual memory</li>
            <li>Efficient for large datasets</li>
          </ul>
        </div>
        <div className="info-section disadvantages-section">
          <h4><i className="bi bi-dash-circle"></i> Disadvantages</h4>
          <ul className="features-list">
            <li>Poor performance on sorted arrays</li>
            <li>Unstable sorting algorithm</li>
            <li>Complex pivot selection</li>
            <li>Not suitable for linked lists</li>
            <li>Recursive implementation uses stack space</li>
          </ul>
        </div>
      </div>


    </div>
  );
};

export default QuickSort;