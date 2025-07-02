import React, { useState, useRef, useEffect } from 'react';

interface SearchStep {
	index: number;
	value: number;
	found: boolean;
	message: string;
}

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

			steps.push({
				index: i,
				value: arr[i],
				found,
				message
			});

			if (found) break;
		}

		// If not found, add a final step
		if (!steps.some(step => step.found)) {
			steps.push({
				index: -1,
				value: target,
				found: false,
				message: `${target} not found in array`
			});
		}

		return steps;
	};

	// Code implementations for different programming languages
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

	// Initialize search steps when array or search value changes
	useEffect(() => {
		const steps = generateSearchSteps(array, searchValue);
		setSearchSteps(steps);
		setCurrentStep(-1);
		setSearchResult(null);
		setIsPlaying(false);
		setIsPaused(false);
	}, [array, searchValue]);

	// Update array when inputArray changes
	useEffect(() => {
		const nums = inputArray
			.split(',')
			.map(Number)
			.filter(n => !isNaN(n));

		if (nums.length > 0) {
			setArray(nums);
		}
	}, [inputArray]);

	// Animation control functions
	const startAnimation = () => {
		if (currentStep >= searchSteps.length - 1) {
			setCurrentStep(-1);
		}

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
		setSearchResult(null);
	};

	const stepForward = () => {
		if (currentStep < searchSteps.length - 1) {
			const nextStep = currentStep + 1;
			setCurrentStep(nextStep);

			const step = searchSteps[nextStep];
			if (step.found) {
				setSearchResult(step.index);
			} else if (step.index === -1) {
				setSearchResult(-1);
			}
		}
	};

	const stepBackward = () => {
		if (currentStep > -1) {
			const prevStep = currentStep - 1;
			setCurrentStep(prevStep);

			if (prevStep === -1) {
				setSearchResult(null);
			} else {
				const step = searchSteps[prevStep];
				if (step.found) {
					setSearchResult(step.index);
				} else {
					setSearchResult(null);
				}
			}
		}
	};

	const resetAnimation = () => {
		stopAnimation();
		// Reset user inputs to default values
		setInputArray('64,34,25,12,22,11,90,88,76,45');
		setSearchValue(22);
		setArray([64, 34, 25, 12, 22, 11, 90, 88, 76, 45]);
	};

	// Generate random array
	const generateRandomArray = () => {
		const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
		setArray(newArray);
		setInputArray(newArray.join(','));
		resetAnimation();
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

			if (currentStep < searchSteps.length - 1) {
				intervalRef.current = setInterval(() => {
					stepForward();
				}, speed);
			}
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		}
	}, [isPlaying, isPaused, currentStep, searchSteps.length, speed]);

	return (
		<div className="container-fluid py-3">
			{/* Page Header */}
			<div className="page-header mb-4">
				<div className="page-header-content">
					<h1 className="page-title">Linear Search</h1>
					<p className="page-subtitle">
						A simple searching algorithm that checks each element in the array sequentially until the target is found
					</p>
					<div className="page-meta">
						<div className="page-meta-item">
							<i className="bi bi-clock"></i>
							<span>Time: O(n)</span>
						</div>
						<div className="page-meta-item">
							<i className="bi bi-gear"></i>
							<span>Space: O(1)</span>
						</div>
						<div className="page-meta-item">
							<i className="bi bi-search"></i>
							<span>Sequential</span>
						</div>
						<div className="page-meta-item">
							<i className="bi bi-check-circle"></i>
							<span>Simple</span>
						</div>
					</div>
				</div>
			</div>

			{/* Information Section */}
			<div className="info-section fade-in-up mb-4">
				<h4><i className="bi bi-info-circle"></i> How Linear Search Works</h4>
				<p className="info-description">
					Linear Search is a simple searching algorithm that iterates through the array from the beginning to the end,
					checking each element one by one until it finds the target value. If the target is found, it returns the index;
					otherwise, it returns -1.
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
					<li>Works on unsorted arrays</li>
					<li>Simple to implement and understand</li>
					<li>Guaranteed to find element if present</li>
					<li>No preprocessing required</li>
					<li>Sequential access pattern</li>
					<li>Inefficient for large datasets</li>
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
								placeholder="Enter comma-separated numbers (e.g., 64,34,25,12,22)"
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

					{/* Search Value Input */}
					<div className="col-md-6">
						<label className="form-label">Search Value:</label>
						<div className="row g-2">
							<div className="col-8">
								<input
									type="number"
									className="form-control"
									value={searchValue}
									onChange={(e) => setSearchValue(Number(e.target.value))}
									placeholder="Enter number to search"
								/>
							</div>
							<div className="col-4">
								<button
									className="btn btn-success-enhanced btn-enhanced w-100"
									onClick={resetAnimation}
								>
									<i className="bi bi-arrow-clockwise"></i> Reset
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Animation Controls */}
				<div className="mb-3">
					<div className="d-flex flex-wrap gap-2 justify-content-center">
						<button
							className="btn btn-success-enhanced btn-enhanced"
							onClick={isPlaying && !isPaused ? pauseAnimation : startAnimation}
							disabled={currentStep >= searchSteps.length - 1 && !isPaused}
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
							disabled={currentStep >= searchSteps.length - 1}
							title="Step Forward"
						>
							<i className="bi bi-skip-forward-fill"></i>
						</button>
					</div>
				</div>

				{/* Progress Indicator */}
				<div className="mb-3">
					<div className="d-flex justify-content-between align-items-center">
						<span className="small text-muted">Step {currentStep + 1} of {searchSteps.length}</span>
						<div className="progress flex-grow-1 mx-2" style={{ height: '8px' }}>
							<div
								className="progress-bar bg-primary"
								style={{ width: `${((currentStep + 1) / searchSteps.length) * 100}%` }}
							></div>
						</div>
						<span className="small text-muted">{Math.round(((currentStep + 1) / searchSteps.length) * 100)}%</span>
					</div>
				</div>

				{/* Array Visualization with Arrow */}
				<div className="mb-3">
					<h6 className="text-center mb-3">
						<i className="bi bi-display"></i> Step-by-Step Visualization
					</h6>
					<div className="d-flex flex-wrap gap-2 justify-content-center position-relative" style={{ minHeight: '120px' }}>
						{array.map((value, index) => (
							<div
								key={index}
								className={`array-element ${
									currentStep === index
										? 'current'
										: currentStep > index
										? 'checked'
										: 'default'
								}`}
								style={{ position: 'relative' }}
							>
								{value}
								{/* Arrow indicator for current position */}
								{currentStep === index && (
									<div
										className="position-absolute"
										style={{
											top: '-30px',
											left: '50%',
											transform: 'translateX(-50%)',
											fontSize: '1.5rem',
											color: '#0d6efd',
											animation: 'bounce 1s infinite'
										}}
									>
										↓
									</div>
								)}
								{/* Index label */}
								<small className="array-index-label position-absolute" style={{ bottom: '-22px', left: '50%', transform: 'translateX(-50%)' }}>[{index}]</small>
							</div>
						))}
					</div>
				</div>

				{/* Current Step Information */}
				{currentStep >= 0 && searchSteps[currentStep] && !searchSteps[currentStep].found && (
					<div className="text-center mb-3">
						<div className="alert alert-info">
							<i className="bi bi-search"></i>
							<strong> {searchSteps[currentStep].message}</strong>
						</div>
					</div>
				)}

				{/* Final Result */}
				{searchResult !== null && (
					<div className="text-center mb-3">
						{searchResult >= 0 ? (
							<div className="alert alert-success d-inline-flex align-items-center">
								<i className="bi bi-check-circle me-2"></i>
								<strong>Found {searchValue} at index {searchResult}!</strong>
							</div>
						) : (
							<div className="alert alert-warning d-inline-flex align-items-center">
								<i className="bi bi-exclamation-triangle me-2"></i>
								<strong>{searchValue} not found in array</strong>
							</div>
						)}
					</div>
				)}

				<div className="alert alert-info">
					<i className="bi bi-lightbulb"></i>
					<strong>Tip:</strong> Use the controls to step through the algorithm and see how each element is checked sequentially.
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
								<td>O(1)</td>
								<td>O(1)</td>
								<td>Target found at the first position</td>
							</tr>
							<tr>
								<td><span className="complexity-badge average">Average</span></td>
								<td>O(n/2)</td>
								<td>O(1)</td>
								<td>Target found in the middle</td>
							</tr>
							<tr>
								<td><span className="complexity-badge worst">Worst</span></td>
								<td>O(n)</td>
								<td>O(1)</td>
								<td>Target not found or at the end</td>
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
						<h6><i className="bi bi-collection"></i> Small Datasets</h6>
						<p>Perfect for arrays with few elements</p>
					</div>
					<div className="use-case-item">
						<h6><i className="bi bi-shuffle"></i> Unsorted Data</h6>
						<p>Works on any order of elements</p>
					</div>
					<div className="use-case-item">
						<h6><i className="bi bi-book"></i> Educational</h6>
						<p>Great for learning search concepts</p>
					</div>
					<div className="use-case-item">
						<h6><i className="bi bi-gear"></i> Simple Applications</h6>
						<p>When simplicity is preferred</p>
					</div>
					<div className="use-case-item">
						<h6><i className="bi bi-list-check"></i> One-time Searches</h6>
						<p>When searching is done infrequently</p>
					</div>
					<div className="use-case-item">
						<h6><i className="bi bi-code"></i> Prototyping</h6>
						<p>Quick implementation for testing</p>
					</div>
				</div>
			</div>

			{/* Advantages and Disadvantages */}
			<div className="content-grid">
				<div className="info-section">
					<h4><i className="bi bi-plus-circle"></i> Advantages</h4>
					<ul className="features-list">
						<li>Simple to implement and understand</li>
						<li>Works on unsorted arrays</li>
						<li>No preprocessing required</li>
						<li>Guaranteed to find element if present</li>
						<li>Constant space complexity</li>
						<li>Good for small datasets</li>
					</ul>
				</div>

				<div className="info-section disadvantages-section">
					<h4><i className="bi bi-dash-circle"></i> Disadvantages</h4>
					<ul className="features-list">
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
	);
};

export default LinearSearch;
