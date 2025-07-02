import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface Node {
	value: number;
	next: Node | null;
}

const LinkedList: React.FC = () => {
	const { isDarkMode } = useTheme();
	const [head, setHead] = useState<Node | null>(null);
	const [input, setInput] = useState<string>('1,2,3,4,5');
	const [insertValue, setInsertValue] = useState<number | ''>('');
	const [deleteValue, setDeleteValue] = useState<number | ''>('');
	const [selectedNode, setSelectedNode] = useState<number | null>(null);

	// Dynamic input handling
	useEffect(() => {
		const values = input
			.split(',')
			.map(Number)
			.filter((n) => !isNaN(n));
		createLinkedList(values);
		setSelectedNode(null);
	}, [input]);

	const createLinkedList = (values: number[]) => {
		if (values.length === 0) {
			setHead(null);
			return
		}

		const newHead: Node = { value: values[0], next: null };
		let current = newHead;

		for (let i = 1; i < values.length; i++) {
			current.next = { value: values[i], next: null };
			current = current.next;
		}

		setHead(newHead);
	};

	const insertAtBeginning = () => {
		if (insertValue === '') return;

		const newNode: Node = { value: insertValue, next: head };
		setHead(newNode);
		setInsertValue('');
	};

	const insertAtEnd = () => {
		if (insertValue === '') return;

		const newNode: Node = { value: insertValue, next: null };

		if (!head) {
			setHead(newNode);
		} else {
			let current = head;
			while (current.next) {
				current = current.next;
			}
			current.next = newNode;
			setHead({ ...head });
		}
		setInsertValue('');
	};

	const deleteNode = () => {
		if (deleteValue === '' || !head) return;

		if (head.value === deleteValue) {
			setHead(head.next);
			setDeleteValue('');
			return;
		}

		let current = head;
		while (current.next && current.next.value !== deleteValue) {
			current = current.next;
		}

		if (current.next) {
			current.next = current.next.next;
			setHead({ ...head });
		}
		setDeleteValue('');
	};

	const getListLength = () => {
		let count = 0;
		let current = head;
		while (current) {
			count++;
			current = current.next;
		}
		return count;
	};

	const getListAsArray = () => {
		const result: number[] = [];
		let current = head;
		while (current) {
			result.push(current.value);
			current = current.next;
		}
		return result;
	};

	const resetList = () => {
		setHead(null);
		setSelectedNode(null);
		setInsertValue('');
		setDeleteValue('');
	};

	return (
		<div className="container-fluid py-3">
			{/* Page Header */}
			<div className="page-header mb-4">
				<div className="page-header-content">
					<h1 className="page-title">Linked Lists</h1>
					<p className="page-subtitle">
						A linear data structure where elements are stored in nodes with references to the next node, providing dynamic memory allocation.
					</p>
					<div className="page-meta">
						<div className="page-meta-item">
							<i className="bi bi-link-45deg"></i>
							<span>Linear Data Structure</span>
						</div>
						<div className="page-meta-item">
							<i className="bi bi-arrow-right"></i>
							<span>Sequential Access</span>
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
					What is a Linked List?
				</h4>
				<p className="info-description">
					A linked list is a linear data structure where each element (node) contains data and a reference to the next node.
					Unlike arrays, linked lists don't require contiguous memory allocation, making them flexible for dynamic data.
				</p>

				<div className="code-example">
					<p>// Node structure <br />
					 struct Node { '{' } <br />
						&nbsp;&nbsp;&nbsp;&nbsp;int data; <br />
						&nbsp;&nbsp;&nbsp;&nbsp;Node* next; <br />
					{'}'};</p>
					<p>// Example: 1 -&gt; 2 -&gt; 3 -&gt; 4 -&gt; null <br /> // Each node points to the next node <br /> // Last node points to null (end of list)</p>
				</div>

				<h4 className="mt-4"><i className="bi bi-list-check"></i> Key Features</h4>
				<ul className="features-list">
					<li>Dynamic size (grows/shrinks)</li>
					<li>Sequential access only</li>
					<li>Memory efficient</li>
					<li>Easy insertion/deletion</li>
					<li>No memory wastage</li>
				</ul>
			</div>

			{/* Memory Layout Section */}
			<div className="info-section mb-4">
				<h4><i className="bi bi-cpu"></i> Memory Layout</h4>
				<p className="info-description">
					Unlike arrays, linked list nodes are not stored in contiguous memory locations. Each node contains data and a pointer to the next node,
					allowing for dynamic memory allocation and flexible size management.
				</p>

				<div
					className="p-3 rounded"
					style={{
						background: isDarkMode ? '#23272f' : '#f8f9fa',
						color: isDarkMode ? '#f8f9fa' : '#23272f',
					}}
				>
					<div className="row">
						<div className="col-md-6">
							<h6 className="text-primary fw-semibold">Node Structure:</h6>
							<div className="border border-2 border-primary p-2 rounded mb-2">
								<div className="d-flex justify-content-between">
									<span className="fw-medium" style={{ color: isDarkMode ? '#f8f9fa' : '#23272f' }}>Data: {head ? head.value : 'null'}</span>
									<span className="fw-medium" style={{ color: isDarkMode ? '#f8f9fa' : '#23272f' }}>Next: →</span>
								</div>
							</div>
						</div>
						<div className="col-md-6">
							<h6 className="text-success fw-semibold">Memory Benefits:</h6>
							<ul className="features-list">
								<li className="fw-medium" style={{ color: isDarkMode ? '#f8f9fa' : '#23272f' }}>No memory wastage</li>
								<li className="fw-medium" style={{ color: isDarkMode ? '#f8f9fa' : '#23272f' }}>Dynamic allocation</li>
								<li className="fw-medium" style={{ color: isDarkMode ? '#f8f9fa' : '#23272f' }}>No size limitations</li>
								<li className="fw-medium" style={{ color: isDarkMode ? '#f8f9fa' : '#23272f' }}>Efficient for insertions</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			{/* Interactive Section */}
			<div className="interactive-section slide-in-right mb-4">
				<h5><i className="bi bi-play-circle"></i> Interactive Demo & Visualization</h5>

				<div className="row g-3 mb-4">
					<div className="col-12">
						<label className="form-label">Linked List Elements:</label>
						<input
							type='text'
							value={input}
							onChange={(e) => setInput(e.target.value)}
							className='form-control'
							placeholder='Enter comma-separated numbers (e.g., 1,2,3,4,5)'
						/>
					</div>
				</div>

				<div className="mb-4">
					<label className="form-label">Insert Operations:</label>
					<div className="d-flex gap-2 mb-2">
						<input
							type='number'
							value={insertValue}
							onChange={(e) => setInsertValue(Number(e.target.value))}
							className='form-control'
							placeholder='Enter value to insert'
						/>
						<button
							className='btn btn-enhanced btn-success-enhanced'
							onClick={insertAtBeginning}
							disabled={insertValue === ''}>
							<i className="bi bi-arrow-up me-2"></i>
							Insert Front
						</button>
						<button
							className='btn btn-enhanced btn-warning'
							onClick={insertAtEnd}
							disabled={insertValue === ''}>
							<i className="bi bi-arrow-down me-2"></i>
							Insert End
						</button>
					</div>
				</div>

				<div className="mb-4">
					<label className="form-label">Delete Operations:</label>
					<div className="d-flex gap-2">
						<input
							type='number'
							value={deleteValue}
							onChange={(e) => setDeleteValue(Number(e.target.value))}
							className='form-control'
							placeholder='Enter value to delete'
						/>
						<button
							className='btn btn-enhanced btn-danger'
							onClick={deleteNode}
							disabled={deleteValue === '' || !head}>
							<i className="bi bi-trash me-2"></i>
							Delete
						</button>
					</div>
				</div>

				<div className="mb-3">
					<label className="form-label">Current Linked List:</label>
					<div className="array-visualization-container mb-3">
						{head ? (
							<>
								<div className="text-center mb-3">
									<div className="d-flex justify-content-center align-items-center flex-wrap gap-2">
										{getListAsArray().map((value, index) => (
											<React.Fragment key={index}>
												<div
													className={`array-element info cursor-pointer ${
														selectedNode === index ? 'found' : ''
													}`}
													onClick={() => setSelectedNode(index)}
													style={{ position: 'relative' }}>
													{value}
												</div>
												
												{index < getListAsArray().length - 1 && (
													<div className="d-flex align-items-center">
														<i className="bi bi-arrow-right text-primary fs-4"></i>
													</div>
												)}
											</React.Fragment>
										))}
										<div className="d-flex align-items-center">
											<i className="bi bi-x-circle text-muted fs-4"></i>
										</div>
									</div>
								</div>

								<div className="text-center mb-3">
									<div
										className="alert alert-info d-inline-flex align-items-center"
										style={{
											background: 'linear-gradient(135deg, rgba(13, 202, 240, 0.3) 0%, rgba(10, 162, 192, 0.3) 100%)',
											fontWeight: '600',
											border: '2px solid #0dcaf0',
											boxShadow: '0 2px 8px rgba(13, 202, 240, 0.2)'
										}}>
										<i className="bi bi-info-circle me-2"></i>
										List Length: {getListLength()} nodes
									</div>
								</div>

								{selectedNode !== null && (
									<div className="text-center">
										<div
											className="alert alert-success d-inline-flex align-items-center"
											style={{
												background: 'linear-gradient(135deg, rgba(25, 135, 84, 0.3) 0%, rgba(20, 108, 67, 0.3) 100%)',
												color: '#0f5132',
												fontWeight: '600',
												border: '2px solid #198754',
												boxShadow: '0 2px 8px rgba(25, 135, 84, 0.2)'
											}}>
											<i className="bi bi-check-circle me-2"></i>
											Selected: Node {selectedNode} with value {getListAsArray()[selectedNode]}
										</div>
									</div>
								)}
							</>
						) : (
							<div className="empty-state">
								<i className="bi bi-link-45deg empty-state-icon"></i>
								<p>No linked list to display</p>
								<p className="small fw-medium">Create a list to see the visualization</p>
							</div>
						)}
					</div>
				</div>

				<div className="mb-3">
					<div className="d-flex flex-wrap gap-2 justify-content-center">
						<button
							className='btn btn-info-enhanced btn-enhanced'
							onClick={resetList}>
							<i className="bi bi-trash me-2"></i>
							Clear List
						</button>
					</div>
				</div>

				<div className="alert alert-info">
					<i className="bi bi-lightbulb"></i> <strong>Tip:</strong> Click on any node to select it and see its value.
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
								<td><span className="complexity-badge worst">O(n)</span></td>
								<td>O(1)</td>
								<td>Sequential traversal required</td>
							</tr>
							<tr>
								<td>Search</td>
								<td><span className="complexity-badge worst">O(n)</span></td>
								<td>O(1)</td>
								<td>Linear search required</td>
							</tr>
							<tr>
								<td>Insertion (beginning)</td>
								<td><span className="complexity-badge best">O(1)</span></td>
								<td>O(1)</td>
								<td>Direct head insertion</td>
							</tr>
							<tr>
								<td>Deletion (beginning)</td>
								<td><span className="complexity-badge best">O(1)</span></td>
								<td>O(1)</td>
								<td>Direct head removal</td>
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
						<h6><i className="bi bi-stack"></i> Stack Implementation</h6>
						<p>LIFO data structure</p>
					</div>
					<div className="use-case-item">
						<h6><i className="bi bi-arrow-left-right"></i> Queue Implementation</h6>
						<p>FIFO data structure</p>
					</div>
					<div className="use-case-item">
						<h6><i className="bi bi-arrow-counterclockwise"></i> Undo Functionality</h6>
						<p>Command history</p>
					</div>
					<div className="use-case-item">
						<h6><i className="bi bi-calculator"></i> Polynomial Arithmetic</h6>
						<p>Mathematical operations</p>
					</div>
					<div className="use-case-item">
						<h6><i className="bi bi-code"></i> Memory Management</h6>
						<p>Dynamic allocation</p>
					</div>
					<div className="use-case-item">
						<h6><i className="bi bi-link-45deg"></i> Graph Representation</h6>
						<p>Adjacency lists</p>
					</div>
				</div>
			</div>

			{/* Advantages and Disadvantages */}
			<div className="content-grid mb-4">
				<div className="info-section p-4 mb-4">
					<h4><i className="bi bi-plus-circle"></i> Advantages</h4>
					<ul className="features-list">
						<li>Dynamic size</li>
						<li>Efficient insertion/deletion</li>
						<li>No memory waste</li>
						<li>Flexible structure</li>
						<li>Good for frequent modifications</li>
					</ul>
				</div>
				<div className="info-section disadvantages-section p-4 mb-4">
					<h4><i className="bi bi-dash-circle"></i> Disadvantages</h4>
					<ul className="features-list">
						<li>No random access</li>
						<li>Extra memory for pointers</li>
						<li>Poor cache performance</li>
						<li>Complex implementation</li>
						<li>Difficult to reverse traverse</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default LinkedList;