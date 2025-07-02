import React, { useState, useRef, useEffect } from 'react';

interface SortStep {
	i: number;
	j: number;
	swapped: boolean;
	message: string;
	array: number[];
}

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

		// Add initial state
		steps.push({
			i: -1,
			j: -1,
			swapped: false,
			message: 'Starting bubble sort...',
			array: [...workingArray]
		});

		for (let i = 0; i < n - 1; i++) {
			for (let j = 0; j < n - i - 1; j++) {
				// Add comparison step
				steps.push({
					i: j,
					j: j + 1,
					swapped: false,
					message: `Comparing ${workingArray[j]} and ${workingArray[j + 1]}`,
					array: [...workingArray]
				});

				if (workingArray[j] > workingArray[j + 1]) {
					// Store values before swap for message
					const val1 = workingArray[j];
					const val2 = workingArray[j + 1];

					// Swap elements
					[workingArray[j], workingArray[j + 1]] = [workingArray[j + 1], workingArray[j]];

					// Add swap step
					steps.push({
						i: j,
						j: j + 1,
						swapped: true,
						message: `Swapped ${val1} and ${val2}`,
						array: [...workingArray]
					});
				}
			}
		}

		// Add final sorted state
		steps.push({
			i: -1,
			j: -1,
			swapped: false,
			message: 'Array is now sorted!',
			array: [...workingArray]
		});

		return steps;
	};

	// Code implementations for different programming languages
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

	// Initialize sort steps when original array changes
	useEffect(() => {
		if (originalArray.length > 0) {
			const steps = generateSortSteps(originalArray);
			setSortSteps(steps);
			setCurrentStep(-1);
			setIsPlaying(false);
			setIsPaused(false);
			// Reset working array to original
			setArray([...originalArray]);
		}
	}, [originalArray]);

	// Update original array when inputArray changes
	useEffect(() => {
		const nums = inputArray
			.split(',')
			.map(Number)
			.filter(n => !isNaN(n));

		if (nums.length > 0) {
			setOriginalArray(nums);
		}
	}, [inputArray]);

	// Animation control functions
	const startAnimation = () => {
		if (currentStep >= sortSteps.length - 1) {
			setCurrentStep(-1);
		}

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
		setCurrentStep(-1);
		setIsPlaying(false);
		setIsPaused(false);
		// Reset to original array
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
			if (prevStep >= 0) {
				const step = sortSteps[prevStep];
				setArray(step.array);
			} else {
				// Reset to original array
				setArray([...originalArray]);
			}
		}
	};

	const resetAnimation = () => {
		stopAnimation();
		// Reset user inputs to default values
		setInputArray('64,34,25,12,22,11,90');
		setOriginalArray([64, 34, 25, 12, 22, 11, 90]);
	};

	// Generate random array
	const generateRandomArray = () => {
		const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100) + 1);
		setOriginalArray(newArray);
		setInputArray(newArray.join(','));
		// Don't call resetAnimation here as it resets to default values
		stopAnimation();
	};

	// Cleanup interval on unmount
	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	// Handle play/pause toggle
	useEffect(() => {
		if (isPlaying && !isPaused) {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}

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
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		}
	}, [isPlaying, isPaused, currentStep, sortSteps.length, speed, sortSteps]);

	// Get element class for visualization
	const getElementClass = (index: number) => {
		if (currentStep === -1) return 'array-element default';

		const step = sortSteps[currentStep];
		if (!step) return 'array-element default';

		if (step.i === -1 && step.j === -1) {
			// Initial or final state
			return 'array-element default';
		}

		if (index === step.i || index === step.j) {
			return step.swapped ? 'array-element found' : 'array-element current';
		}

		return 'array-element default';
	};

	return (
		<div className="container-fluid py-3">
			{/* Page Header */}
			<div className="page-header mb-4">
				<div className="page-header-content">
					<h1 className="page-title">Bubble Sort</h1>
					<p className="page-subtitle">
						A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.
					</p>
					<div className="page-meta">
						<div className="page-meta-item">
							<i className="bi bi-clock"></i>
							<span>Time: O(n²)</span>
						</div>
						<div className="page-meta-item">
							<i className="bi bi-gear"></i>
							<span>Space: O(1)</span>
						</div>
						<div className="page-meta-item">
							<i className="bi bi-arrow-left-right"></i>
							<span>In-place</span>
						</div>
						<div className="page-meta-item">
							<i className="bi bi-check-circle"></i>
							<span>Stable</span>
						</div>
					</div>
				</div>
			</div>

			{/* Information Section */}
			<div className="info-section fade-in-up mb-4">
				<h4><i className="bi bi-info-circle"></i> How Bubble Sort Works</h4>
				<p className="info-description">
					Bubble sort works by repeatedly stepping through the array, comparing each pair of adjacent elements and swapping them if they are in the wrong order.
					The pass through the array is repeated until no swaps are needed, which indicates that the array is sorted. Each pass "bubbles up" the largest unsorted element to its correct position.
				</p>

				<div className="code-example">
					{/* Language Tabs */}
					<div className="language-tabs mb-3">
						<div className="nav nav-tabs" role="tablist">
							<button
								className={`nav-link ${activeLanguage === 'javascript' ? 'active' : ''}`}
								onClick={() => setActiveLanguage('javascript')}
								type="button"
								role="tab"
							>
								<i className="bi bi-code-slash"></i> JavaScript
							</button>
							<button
								className={`nav-link ${activeLanguage === 'python' ? 'active' : ''}`}
								onClick={() => setActiveLanguage('python')}
								type="button"
								role="tab"
							>
								<i className="bi bi-code-square"></i> Python
							</button>
							<button
								className={`nav-link ${activeLanguage === 'cpp' ? 'active' : ''}`}
								onClick={() => setActiveLanguage('cpp')}
								type="button"
								role="tab"
							>
								<i className="bi bi-braces"></i> C/C++
							</button>
							<button
								className={`nav-link ${activeLanguage === 'go' ? 'active' : ''}`}
								onClick={() => setActiveLanguage('go')}
								type="button"
								role="tab"
							>
								<i className="bi bi-gear"></i> Go
							</button>
							<button
								className={`nav-link ${activeLanguage === 'rust' ? 'active' : ''}`}
								onClick={() => setActiveLanguage('rust')}
								type="button"
								role="tab"
							>
								<i className="bi bi-shield-check"></i> Rust
							</button>
						</div>
					</div>

					{/* Code Display */}
					<div className="tab-content">
						<div className="tab-pane fade show active">
							<pre><code>{codeImplementations[activeLanguage as keyof typeof codeImplementations]}</code></pre>
						</div>
					</div>
				</div>

				<h4 className="mt-4"><i className="bi bi-list-check"></i> Key Features</h4>
				<ul className="features-list">
					<li>In-place sorting algorithm</li>
					<li>Stable sort (preserves order)</li>
					<li>Simple to implement and understand</li>
					<li>Adaptive algorithm</li>
					<li>Good for nearly sorted data</li>
					<li>Space complexity O(1)</li>
				</ul>
			</div>

			{/* Interactive Demo & Visualization Section */}
			<div className="interactive-section slide-in-right mb-4">
				<h5><i className="bi bi-play-circle"></i> Interactive Demo & Visualization</h5>

				{/* Controls Section */}
				<div className="row g-3 mb-4">
					{/* Array Input */}
					<div className="col-md-6">
						<label className="form-label">Array Elements:</label>
						<div className="mb-2">
							<input
								type="text"
								className="form-control"
								value={inputArray}
								onChange={(e) => setInputArray(e.target.value)}
								placeholder="Enter comma-separated numbers (e.g., 64,34,25,12,22,11,90)"
							/>
						</div>
						<div className="d-flex gap-2">
							<button
								className="btn btn-info-enhanced btn-enhanced"
								onClick={generateRandomArray}
							>
								<i className="bi bi-shuffle"></i> Generate Random Array
							</button>
							<button
								className="btn btn-secondary btn-enhanced"
								onClick={resetAnimation}
							>
								<i className="bi bi-arrow-clockwise"></i> Reset Array
							</button>
						</div>
					</div>

					{/* Animation Controls */}
					<div className="col-md-6">
						<label className="form-label">Animation Controls:</label>
						<div className="d-flex flex-wrap gap-2">
							<button
								className="btn btn-success-enhanced btn-enhanced"
								onClick={isPlaying && !isPaused ? pauseAnimation : startAnimation}
								disabled={currentStep >= sortSteps.length - 1 && !isPaused}
								title={isPlaying && !isPaused ? 'Pause' : 'Play'}
							>
								<i className={`bi ${isPlaying && !isPaused ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
							</button>

							<button
								className="btn btn-warning btn-enhanced"
								onClick={stopAnimation}
								title="Stop"
							>
								<i className="bi bi-stop-fill"></i>
							</button>

							<button
								className="btn btn-info-enhanced btn-enhanced"
								onClick={stepBackward}
								disabled={currentStep <= -1}
								title="Step Back"
							>
								<i className="bi bi-skip-backward-fill"></i>
							</button>

							<button
								className="btn btn-info-enhanced btn-enhanced"
								onClick={stepForward}
								disabled={currentStep >= sortSteps.length - 1}
								title="Step Forward"
							>
								<i className="bi bi-skip-forward-fill"></i>
							</button>
						</div>
					</div>
				</div>

				{/* Progress Indicator */}
				<div className="mb-3">
					<div className="d-flex justify-content-between align-items-center">
						<span className="small text-muted">Step {currentStep + 1} of {sortSteps.length}</span>
						<div className="progress flex-grow-1 mx-2" style={{ height: '8px' }}>
							<div
								className="progress-bar bg-primary"
								style={{ width: `${((currentStep + 1) / sortSteps.length) * 100}%` }}
							></div>
						</div>
						<span className="small text-muted">{Math.round(((currentStep + 1) / sortSteps.length) * 100)}%</span>
					</div>
				</div>

				{/* Array Visualization with Arrows */}
				<div className="mb-3">
					<h6 className="text-center mb-3">
						<i className="bi bi-display"></i> Step-by-Step Visualization
					</h6>
					<div className="d-flex flex-wrap gap-2 justify-content-center position-relative" style={{ minHeight: '120px' }}>
						{array.map((value, index) => (
							<div
								key={index}
								className={`array-element ${getElementClass(index)}`}
								style={{ position: 'relative' }}
							>
								{value}
								{/* Arrow indicators for comparison */}
								{currentStep >= 0 && sortSteps[currentStep] &&
									(index === sortSteps[currentStep].i || index === sortSteps[currentStep].j) && (
										<div
											className="position-absolute"
											style={{
												top: '-30px',
												left: '50%',
												transform: 'translateX(-50%)',
												fontSize: '1.5rem',
												color: sortSteps[currentStep].swapped ? '#198754' : '#0d6efd',
												animation: 'bounce 1s infinite'
											}}
										>
											{sortSteps[currentStep].swapped ? '↔' : '↓'}
										</div>
									)}
								{/* Index label */}
								<small className="array-index-label position-absolute" style={{ bottom: '-22px', left: '50%', transform: 'translateX(-50%)' }}>[{index}]</small>
							</div>
						))}
					</div>
				</div>

				{/* Current Step Information */}
				{currentStep >= 0 && sortSteps[currentStep] && (
					<div className="text-center mb-3">
						<div className="alert alert-info">
							<i className="bi bi-arrow-left-right"></i>
							<strong> {sortSteps[currentStep].message}</strong>
						</div>
					</div>
				)}

				<div className="alert alert-info">
					<i className="bi bi-lightbulb"></i>
					<strong>Tip:</strong> Use the controls to step through the algorithm and see how adjacent elements are compared and swapped.
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
								<td>O(n)</td>
								<td>O(1)</td>
								<td>Array is already sorted</td>
							</tr>
							<tr>
								<td><span className="complexity-badge average">Average</span></td>
								<td>O(n²)</td>
								<td>O(1)</td>
								<td>Random array</td>
							</tr>
							<tr>
								<td><span className="complexity-badge worst">Worst</span></td>
								<td>O(n²)</td>
								<td>O(1)</td>
								<td>Array is reverse sorted</td>
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
						<h6><i className="bi bi-book"></i> Educational</h6>
						<p className="small mb-0">Learning sorting concepts</p>
					</div>
					<div className="use-case-item">
						<h6><i className="bi bi-collection"></i> Small Datasets</h6>
						<p className="small mb-0">When n &lt; 50 elements</p>
					</div>
					<div className="use-case-item">
						<h6><i className="bi bi-arrow-up"></i> Nearly Sorted</h6>
						<p className="small mb-0">Data that's mostly in order</p>
					</div>
					<div className="use-case-item">
						<h6><i className="bi bi-gear"></i> Simple Applications</h6>
						<p className="small mb-0">When simplicity is preferred</p>
					</div>
				</div>
			</div>

			{/* Advantages and Disadvantages */}
			<div className="content-grid">
				<div className="info-section">
					<h4><i className="bi bi-plus-circle"></i> Advantages</h4>
					<ul className="features-list">
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

				<div className="info-section disadvantages-section">
					<h4><i className="bi bi-dash-circle"></i> Disadvantages</h4>
					<ul className="features-list">
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
	);
};

export default BubbleSort;