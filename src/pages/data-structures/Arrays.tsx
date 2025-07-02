import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Arrays: React.FC = () => {
	const { isDarkMode } = useTheme();
	const [input, setInput] = useState<string>('1,2,3,4,5,6,7,8,9,10');
	const [array, setArray] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	// Dynamic input handling
	useEffect(() => {
		const nums = input
			.split(',')
			.map(Number)
			.filter((n) => !isNaN(n));
		setArray(nums);
		setSelectedIndex(null);
	}, [input]);

	const handleElementClick = (index: number) => {
		setSelectedIndex(index);
	};

	const resetSelection = () => {
		setSelectedIndex(null);
	};

	return (
		<div className="container-fluid py-3">
			{/* Page Header */}
			<div className="page-header mb-4">
				<div className="page-header-content">
					<h1 className="page-title">Arrays</h1>
					<p className="page-subtitle">
						A collection of elements stored at contiguous memory locations, providing efficient random access.
					</p>
					<div className="page-meta">
						<div className="page-meta-item">
							<i className="bi bi-collection"></i>
							<span>Linear Data Structure</span>
						</div>
						<div className="page-meta-item">
							<i className="bi bi-lightning"></i>
							<span>O(1) Access Time</span>
						</div>
						<div className="page-meta-item">
							<i className="bi bi-lightbulb"></i>
							<span>Beginner Level</span>
						</div>
					</div>
				</div>
			</div>

			{/* Information Section */}
			<div className="info-section fade-in-up mb-4">
				<h4>
					<i className="bi bi-info-circle"></i>
					What is an Array?
				</h4>
				<p className="info-description">
					An array is a linear data structure that stores elements of the same data type in contiguous memory locations.
					Each element can be accessed directly using an index, making it one of the most efficient data structures for random access.
				</p>

				<div className="code-example">
						<p>// Array declaration and initialization <br/> int numbers[] = { '{' }1, 2, 3, 4, 5{ '}' };</p>
						<p>// Accessing elements by index <br /> int first = numbers[0]; // O(1) access time <br /> int last = numbers[4];   // O(1) access time</p>
						<p>// Memory layout: [1][2][3][4][5] <br />// Index: 0  1  2  3  4</p>
				</div>

				<h4 className="mt-4"><i className="bi bi-list-check"></i> Key Features</h4>
				<ul className="features-list">
					<li>Fixed or dynamic size</li>
					<li>Random access in O(1) time</li>
					<li>Contiguous memory allocation</li>
					<li>Index-based element access</li>
					<li>Cache-friendly due to locality</li>
				</ul>
			</div>

						{/* Memory Layout Section */}
			<div className="info-section mb-4">
				<h4><i className="bi bi-cpu"></i> Memory Layout</h4>
				<p className="info-description">
					Arrays are stored in contiguous memory locations, which means all elements are stored next to each other in memory.
					This layout provides excellent cache performance and allows for efficient random access.
				</p>

				<div
					className="p-3 rounded"
					style={{
						background: isDarkMode ? '#23272f' : '#f8f9fa',
						color: isDarkMode ? '#f8f9fa' : '#23272f',
					}}
				>
					<div className="d-flex justify-content-center align-items-center gap-1 mb-2">
						{array.map((num, idx) => (
							<div key={idx} className="text-center">
								<div
									className="border border-2 border-primary bg-primary text-white p-2 rounded"
								>
									{num}
								</div>
								<small
									className="fw-semibold"
									style={{ color: isDarkMode ? '#f8f9fa' : '#23272f' }}
								>
									Address + {idx * 4}
								</small>
							</div>
						))}
					</div>
					<p
						className="text-center small mb-0 fw-medium"
						style={{ color: isDarkMode ? '#f8f9fa' : '#23272f' }}
					>
						<i className="bi bi-info-circle me-1"></i>
						Each element occupies 4 bytes (for integers) in contiguous memory
					</p>
				</div>
			</div>

			{/* Interactive Section */}
			<div className="interactive-section slide-in-right mb-4">
				<h5><i className="bi bi-play-circle"></i> Interactive Demo & Visualization</h5>

				<div className="row g-3 mb-4">
					<div className="col-12">
						<label className="form-label">Array Elements:</label>
						<input
							type='text'
							value={input}
							onChange={(e) => setInput(e.target.value)}
							className='form-control'
							placeholder='Enter comma-separated numbers (e.g., 1,2,3,4,5)'
						/>
					</div>
				</div>

				<div className="mb-3">
					<label className="form-label">Current Array:</label>
					<div className="array-visualization-container mb-3">
						{array.length > 0 ? (
							<>
								<div className='d-flex gap-2 flex-wrap justify-content-center mb-3'>
									{array.map((num, idx) => (
										<div
											key={idx}
											className={`array-element ${
												selectedIndex === idx ? 'found' : 'info'
											} cursor-pointer`}
											onClick={() => handleElementClick(idx)}>
											{num}
										</div>
									))}
								</div>

								{/* Index Labels */}
								<div className='d-flex gap-2 flex-wrap justify-content-center mb-3'>
									{array.map((_, idx) => (
										<div
											key={idx}
											className="text-center"
											style={{ minWidth: '3rem' }}>
											<small className="array-index-label">[{idx}]</small>
										</div>
									))}
								</div>

								{selectedIndex !== null && (
									<div className="text-center">
										<div
											className="alert alert-success d-inline-flex align-items-center"
											style={{
												background: 'linear-gradient(135deg, rgba(25, 135, 84, 0.3) 0%, rgba(20, 108, 67, 0.3) 100%)',

												fontWeight: '600',
												border: '2px solid #198754',
												boxShadow: '0 2px 8px rgba(25, 135, 84, 0.2)'
											}}>
											<i className="bi bi-info-circle me-2"></i>
											Selected: Array[{selectedIndex}] = {array[selectedIndex]}
										</div>
									</div>
								)}
							</>
						) : (
							<div className="empty-state">
								<i className="bi bi-array empty-state-icon"></i>
								<p>No array elements to display</p>
							</div>
						)}
					</div>
				</div>

				<div className="mb-3">
					<div className="d-flex flex-wrap gap-2 justify-content-center">
						<button
							className='btn btn-info-enhanced btn-enhanced'
							onClick={resetSelection}>
							<i className="bi bi-arrow-counterclockwise"></i> Reset Selection
						</button>
					</div>
				</div>

				<div className="alert alert-info">
					<i className="bi bi-lightbulb"></i> <strong>Tip:</strong> Click on any array element to select it and see its index and value.
				</div>
			</div>

			{/* Complexity Analysis */}
			<div className="info-section mb-4">
				<h4><i className="bi bi-graph-up"></i> Time & Space Complexity</h4>
				<div className="table-responsive">
					<table className="table complexity-table">
						<thead>
							<tr>
								<th>Operation</th>
								<th>Time Complexity</th>
								<th>Space Complexity</th>
								<th>Description</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Access</td>
								<td><span className="complexity-badge best">O(1)</span></td>
								<td>O(1)</td>
								<td>Direct index access</td>
							</tr>
							<tr>
								<td>Search</td>
								<td><span className="complexity-badge worst">O(n)</span></td>
								<td>O(1)</td>
								<td>Linear search required</td>
							</tr>
							<tr>
								<td>Insertion</td>
								<td><span className="complexity-badge worst">O(n)</span></td>
								<td>O(1)</td>
								<td>Shifting elements required</td>
							</tr>
							<tr>
								<td>Deletion</td>
								<td><span className="complexity-badge worst">O(n)</span></td>
								<td>O(1)</td>
								<td>Shifting elements required</td>
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
						<h6><i className="bi bi-collection"></i> Data Storage</h6>
						<p>Storing collections of related data</p>
					</div>
					<div className="use-case-item">
						<h6><i className="bi bi-grid-3x3"></i> Matrix Operations</h6>
						<p>2D arrays for mathematical computations</p>
					</div>
					<div className="use-case-item">
						<h6><i className="bi bi-speedometer2"></i> Buffer Management</h6>
						<p>Temporary storage for data processing</p>
					</div>
					<div className="use-case-item">
						<h6><i className="bi bi-table"></i> Lookup Tables</h6>
						<p>Fast access to precomputed values</p>
					</div>
					<div className="use-case-item">
						<h6><i className="bi bi-cpu"></i> Memory Management</h6>
						<p>Contiguous memory allocation</p>
					</div>
					<div className="use-case-item">
						<h6><i className="bi bi-code"></i> Algorithm Implementation</h6>
						<p>Foundation for many algorithms</p>
					</div>
				</div>
			</div>

			{/* Advantages and Disadvantages */}
			<div className="content-grid mb-4">
				<div className="info-section">
					<h4><i className="bi bi-plus-circle"></i> Advantages</h4>
					<ul className="features-list">
						<li>Fast random access O(1)</li>
						<li>Memory efficient</li>
						<li>Cache-friendly</li>
						<li>Simple implementation</li>
						<li>Good for indexed operations</li>
					</ul>
				</div>
				<div className="info-section disadvantages-section">
					<h4><i className="bi bi-dash-circle"></i> Disadvantages</h4>
					<ul className="features-list">
						<li>Fixed size (static arrays)</li>
						<li>Slow insertion/deletion O(n)</li>
						<li>Memory fragmentation</li>
						<li>Wasteful for sparse data</li>
						<li>Difficult to resize</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Arrays;
