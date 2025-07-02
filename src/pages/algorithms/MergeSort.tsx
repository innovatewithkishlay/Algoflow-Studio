import React, { useState, useRef, useEffect } from 'react';

interface MergeStep {
  left: number;
  right: number;
  mid: number;
  message: string;
  array: number[];
  subArrays?: { left: number[], right: number[] };
  merging?: number[];
}

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
  const intervalRef = useRef<number | null>(null);

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
          i++;
          k++;
        }
        while (j < tempRight.length) {
          workingArray[k] = tempRight[j];
          steps.push({ left, right, mid, message: `Remaining element from right: ${tempRight[j]}`, array: [...workingArray], subArrays: { left: tempLeft, right: tempRight }, merging: [k, k] });
          j++;
          k++;
        }
      }
    };
    mergeSortHelper(0, workingArray.length - 1);
    steps.push({ left: -1, right: -1, mid: -1, message: 'Array is now sorted!', array: [...workingArray] });
    return steps;
  };

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

  // Initialize sort steps when original array changes
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
    intervalRef.current = window.setInterval(animate, speed);
  };
  const pauseAnimation = () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } setIsPaused(true); };
  const stopAnimation = () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } setIsPlaying(false); setIsPaused(false); setCurrentStep(-1); setArray([...originalArray]); };
  const stepForward = () => { if (currentStep < sortSteps.length - 1) { const nextStep = currentStep + 1; setCurrentStep(nextStep); setArray(sortSteps[nextStep].array); } };
  const stepBackward = () => { if (currentStep > 0) { const prevStep = currentStep - 1; setCurrentStep(prevStep); setArray(sortSteps[prevStep].array); } else if (currentStep === 0) { setCurrentStep(-1); setArray([...originalArray]); } };
  const generateRandomArray = () => { const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100) + 1); setOriginalArray(newArray); setInputArray(newArray.join(',')); stopAnimation(); };
  const resetArray = () => { setOriginalArray([64, 34, 25, 12, 22, 11, 90]); setInputArray('64,34,25,12,22,11,90'); };
  const getElementClass = (index: number) => { const step = sortSteps[currentStep]; if (!step) return 'array-element default'; if (step.merging && step.merging.includes(index)) return 'merging'; if (step.left <= index && index <= step.right) return 'current'; return 'default'; };
  const getCurrentMessage = () => { if (currentStep >= 0 && currentStep < sortSteps.length) return sortSteps[currentStep].message; return 'Click "Start" to begin the merge sort visualization'; };
  const getCurrentSubArrays = () => { if (currentStep >= 0 && currentStep < sortSteps.length) return sortSteps[currentStep].subArrays; return null; };

  return (
    <div className="container-fluid py-3">
      {/* Page Header */}
      <div className="page-header mb-4">
        <div className="page-header-content">
          <h1 className="page-title">Merge Sort</h1>
          <p className="page-subtitle">A stable, divide-and-conquer sorting algorithm that guarantees O(n log n) performance</p>
          <div className="page-meta">
            <div className="page-meta-item"><i className="bi bi-clock"></i><span>Time: O(n log n)</span></div>
            <div className="page-meta-item"><i className="bi bi-graph-up"></i><span>Space: O(n)</span></div>
            <div className="page-meta-item"><i className="bi bi-shield-check"></i><span>Stable</span></div>
            <div className="page-meta-item"><i className="bi bi-arrow-repeat"></i><span>Divide & Conquer</span></div>
          </div>
        </div>
      </div>
      {/* Information Section */}
      <div className="info-section fade-in-up mb-4">
        <h4><i className="bi bi-info-circle"></i> How Merge Sort Works</h4>
        <p className="info-description">Merge Sort is a stable, comparison-based sorting algorithm that uses a divide-and-conquer strategy. It works by recursively dividing the array into two halves, sorting each half, and then merging the sorted halves back together. This process continues until the entire array is sorted.</p>
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
          </div>
          <div className="tab-content">
            <div className="tab-pane fade show active">
              <pre><code>{codeImplementations[activeLanguage as keyof typeof codeImplementations]}</code></pre>
            </div>
          </div>
        </div>
        <h4 className="mt-4"><i className="bi bi-list-check"></i> Key Features</h4>
          <ul className="features-list">
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
      <div className="info-section mb-4">
        <h4><i className="bi bi-list-ol"></i> Step-by-Step Process</h4>
        <div className="row">
          <div className="col-md-6">
            <h6 className="text-highlight">Divide Phase:</h6>
            <ol className="features-list">
              <li>Divide the array into two equal halves</li>
              <li>Recursively sort the left half</li>
              <li>Recursively sort the right half</li>
              <li>Continue until subarrays have 1 element</li>
            </ol>
          </div>
          <div className="col-md-6">
            <h6 className="text-highlight">Conquer Phase:</h6>
            <ol className="features-list">
              <li>Merge the sorted subarrays</li>
              <li>Compare elements from both arrays</li>
              <li>Place smaller element in result array</li>
              <li>Continue until all elements are merged</li>
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
              <input type="text" className="form-control" value={inputArray} onChange={(e) => setInputArray(e.target.value)} placeholder="Enter comma-separated numbers" disabled={isPlaying} />
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-info-enhanced btn-enhanced" onClick={generateRandomArray} disabled={isPlaying}><i className="bi bi-shuffle"></i> Generate Random Array</button>
              <button className="btn btn-secondary btn-enhanced" onClick={resetArray} disabled={isPlaying}><i className="bi bi-arrow-clockwise"></i> Reset Array</button>
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
            <button className="btn btn-success-enhanced btn-enhanced" onClick={isPlaying && !isPaused ? pauseAnimation : startAnimation} disabled={currentStep >= sortSteps.length - 1 && !isPaused} title={isPlaying && !isPaused ? 'Pause' : 'Play'}><i className={`bi ${isPlaying && !isPaused ? 'bi-pause-fill' : 'bi-play-fill'}`}></i></button>
            <button className="btn btn-warning btn-enhanced" onClick={stopAnimation} title="Stop"><i className="bi bi-stop-fill"></i></button>
            <button className="btn btn-info-enhanced btn-enhanced" onClick={stepBackward} disabled={currentStep <= -1} title="Step Back"><i className="bi bi-skip-backward-fill"></i></button>
            <button className="btn btn-info-enhanced btn-enhanced" onClick={stepForward} disabled={currentStep >= sortSteps.length - 1} title="Step Forward"><i className="bi bi-skip-forward-fill"></i></button>
          </div>
            </div>
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <span className="small text-muted">Step {currentStep + 1} of {sortSteps.length}</span>
            <div className="progress flex-grow-1 mx-2" style={{ height: '8px' }}>
              <div className="progress-bar" role="progressbar" style={{ width: `${sortSteps.length > 0 ? ((currentStep + 1) / sortSteps.length) * 100 : 0}%` }} aria-valuenow={currentStep + 1} aria-valuemin={0} aria-valuemax={sortSteps.length}></div>
            </div>
            <span className="small text-muted">{sortSteps.length > 0 ? Math.round(((currentStep + 1) / sortSteps.length) * 100) : 0}%</span>
          </div>
        </div>
        <div className="current-step-info mb-3">
          <div className="alert alert-light"><i className="bi bi-chat-text"></i> <strong>Message:</strong> {getCurrentMessage()}</div>
        </div>
        {getCurrentSubArrays() && (
          <div className="subarrays-display mb-3">
            <div className="row">
              <div className="col-md-6">
                <div className="subarray-container">
                  <h6>Left Subarray:</h6>
                  <div className="d-flex flex-wrap gap-1">
                    {getCurrentSubArrays()?.left.map((value, index) => (
                      <div key={index} className="array-element subarray-element">{value}</div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="subarray-container">
                  <h6>Right Subarray:</h6>
                  <div className="d-flex flex-wrap gap-1">
                    {getCurrentSubArrays()?.right.map((value, index) => (
                      <div key={index} className="array-element subarray-element">{value}</div>
                    ))}
                  </div>
                </div>
          </div>
        </div>
      </div>
        )}
        <div className="alert alert-info"><i className="bi bi-lightbulb"></i> <strong>Tip:</strong> Use the controls to step through the merge sort algorithm. Watch how the array is divided into smaller subarrays and then merged back together in sorted order.</div>
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
                <td>O(n)</td>
                <td>Consistent performance regardless of input order</td>
              </tr>
              <tr>
                <td><span className="complexity-badge average">Average</span></td>
                <td>O(n log n)</td>
                <td>O(n)</td>
                <td>Same as best case - very predictable</td>
              </tr>
              <tr>
                <td><span className="complexity-badge worst">Worst</span></td>
                <td>O(n log n)</td>
                <td>O(n)</td>
                <td>Consistent performance even with worst-case input</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Use Cases */}
      <div className="info-section mb-4">
        <h4><i className="bi bi-lightning"></i> Use Cases & Applications</h4>
        <div className="use-cases-grid">
          <div className="use-case-item"><h6><i className="bi bi-hdd-network"></i> External Sorting</h6><p>Perfect for sorting data that doesn't fit in memory</p></div>
          <div className="use-case-item"><h6><i className="bi bi-link-45deg"></i> Linked Lists</h6><p>Excellent performance when sorting linked list structures</p></div>
          <div className="use-case-item"><h6><i className="bi bi-cpu"></i> Parallel Processing</h6><p>Easily parallelizable for multi-core systems</p></div>
          <div className="use-case-item"><h6><i className="bi bi-database"></i> Database Systems</h6><p>Used in database engines for stable sorting operations</p></div>
          <div className="use-case-item"><h6><i className="bi bi-file-earmark-text"></i> File Systems</h6><p>Sorting large files and directories efficiently</p></div>
          <div className="use-case-item"><h6><i className="bi bi-graph-up"></i> Data Analysis</h6><p>When stability and predictable performance are required</p></div>
        </div>
      </div>
      {/* Advantages and Disadvantages */}
      <div className="content-grid mb-4">
        <div className="info-section">
          <h4><i className="bi bi-plus-circle"></i> Advantages</h4>
          <ul className="features-list">
            <li>Guaranteed O(n log n) performance</li>
            <li>Stable sorting algorithm</li>
            <li>Predictable performance</li>
            <li>Works well with external sorting</li>
            <li>Good for linked lists</li>
          </ul>
        </div>
        <div className="info-section disadvantages-section">
          <h4><i className="bi bi-dash-circle"></i> Disadvantages</h4>
          <ul className="features-list">
            <li>Requires extra space O(n)</li>
            <li>Not in-place algorithm</li>
            <li>Overkill for small arrays</li>
            <li>Poor cache performance</li>
            <li>Complex implementation</li>
          </ul>
        </div>
      </div>

    </div>
  );
};

export default MergeSort;