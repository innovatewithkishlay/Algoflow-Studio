import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Stack: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [stack, setStack] = useState<number[]>([1, 2, 3, 4, 5]);
  const [inputValue, setInputValue] = useState<string>('');

  const pushElement = () => {
    if (inputValue.trim() && !isNaN(Number(inputValue))) {
      setStack([...stack, Number(inputValue)]);
      setInputValue('');
    }
  };

  const popElement = () => {
    if (stack.length > 0) {
      setStack(stack.slice(0, -1));
    }
  };

  const clearStack = () => {
    setStack([]);
  };

  const generateRandomStack = () => {
    const newStack = Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 1);
    setStack(newStack);
  };

  // --- Visualization logic (card-style stack display) ---
  const renderStackVisualization = () => (
    <div
      className="p-3 rounded"
      style={{
        background: isDarkMode ? '#23272f' : '#f8f9fa',
        color: isDarkMode ? '#f8f9fa' : '#23272f',
        minHeight: 180,
        minWidth: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {stack.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <p>Stack is empty</p>
        </div>
      ) : (
        <div className="d-flex flex-column-reverse gap-2 justify-content-end align-items-center">
          {stack.map((value, idx) => (
            <div key={idx} className="d-flex flex-column align-items-center" style={{ position: 'relative' }}>
              <div
                className="border border-2 border-primary bg-primary text-white p-2 rounded d-flex justify-content-center align-items-center"
                style={{ width: 48, height: 48, fontWeight: 600, fontSize: 20 }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="container-fluid py-3">
      {/* Page Header */}
      <div className="page-header mb-4">
        <div className="page-header-content">
          <h1 className="page-title">Stack</h1>
          <p className="page-subtitle">
            A linear data structure that follows the Last-In-First-Out (LIFO) principle
          </p>
          <div className="page-meta">
            <div className="page-meta-item">
              <i className="bi bi-clock"></i>
              <span>Push/Pop: O(1)</span>
            </div>
            <div className="page-meta-item">
              <i className="bi bi-search"></i>
              <span>Search: O(n)</span>
            </div>
            <div className="page-meta-item">
              <i className="bi bi-gear"></i>
              <span>Space: O(n)</span>
            </div>
            <div className="page-meta-item">
              <i className="bi bi-arrow-up"></i>
              <span>LIFO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="info-section fade-in-up mb-4">
        <h4><i className="bi bi-info-circle"></i> How Stack Works</h4>
        <p className="info-description">
          A Stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle.
          This means that the last element added to the stack will be the first one to be removed.
          Think of it like a stack of plates - you can only add or remove plates from the top.
        </p>

        <div className="code-example">
          <pre><code>{`class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}`}</code></pre>
        </div>

        <h4 className="mt-4"><i className="bi bi-list-check"></i> Key Operations</h4>
        <ul className="features-list">
          <li><strong>Push:</strong> Add an element to the top of the stack</li>
          <li><strong>Pop:</strong> Remove and return the top element</li>
          <li><strong>Peek/Top:</strong> View the top element without removing it</li>
          <li><strong>isEmpty:</strong> Check if the stack is empty</li>
          <li><strong>Size:</strong> Get the number of elements in the stack</li>
          <li><strong>Clear:</strong> Remove all elements from the stack</li>
        </ul>
      </div>

      {/* Memory Layout Section */}
      <div className="info-section mb-4">
        <h4><i className="bi bi-cpu"></i> Memory Layout</h4>
        <p className="info-description">
          Stacks are typically implemented using arrays or linked lists. In array-based implementation,
          elements are stored in contiguous memory locations, while in linked list implementation,
          each element points to the next one in the stack.
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
              <h6 className="text-primary fw-semibold">Array Implementation:</h6>
              <div className="border border-2 border-primary p-2 rounded mb-2">
                <div className="d-flex justify-content-between">
                  <span className="fw-medium" style={{ color: isDarkMode ? '#f8f9fa' : '#23272f' }}>Top: {stack.length > 0 ? stack[stack.length - 1] : 'null'}</span>
                  <span className="fw-medium" style={{ color: isDarkMode ? '#f8f9fa' : '#23272f' }}>Size: {stack.length}</span>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <h6 className="text-success fw-semibold">Stack Benefits:</h6>
              <ul className="features-list">
                <li className="fw-medium" style={{ color: isDarkMode ? '#f8f9fa' : '#23272f' }}>Fast push/pop operations</li>
                <li className="fw-medium" style={{ color: isDarkMode ? '#f8f9fa' : '#23272f' }}>Memory efficient</li>
                <li className="fw-medium" style={{ color: isDarkMode ? '#f8f9fa' : '#23272f' }}>Simple implementation</li>
                <li className="fw-medium" style={{ color: isDarkMode ? '#f8f9fa' : '#23272f' }}>Perfect for LIFO scenarios</li>
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
            <label className="form-label">Stack Elements:</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter a number to push"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && pushElement()}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Push Operations:</label>
          <div className="d-flex gap-2 mb-2">
            <button
              className="btn btn-success-enhanced btn-enhanced"
              onClick={pushElement}
              disabled={!inputValue.trim() || isNaN(Number(inputValue))}
            >
              <i className="bi bi-plus-circle me-2"></i> Push Element
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Stack Operations:</label>
          <div className="d-flex gap-2">
            <button
              className="btn btn-warning btn-enhanced"
              onClick={popElement}
              disabled={stack.length === 0}
            >
              <i className="bi bi-dash-circle me-2"></i> Pop
            </button>
            <button
              className="btn btn-danger btn-enhanced"
              onClick={clearStack}
              disabled={stack.length === 0}
            >
              <i className="bi bi-trash me-2"></i> Clear
            </button>
            <button
              className="btn btn-info-enhanced btn-enhanced"
              onClick={generateRandomStack}
            >
              <i className="bi bi-shuffle me-2"></i> Random
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Current Stack:</label>
          <div className="array-visualization-container mb-3">
            {renderStackVisualization()}
          </div>
        </div>

        <div className="mb-3">
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            <div
              className="alert alert-success d-inline-flex align-items-center"
              style={{
                background: 'linear-gradient(135deg, rgba(25, 135, 84, 0.3) 0%, rgba(20, 108, 67, 0.3) 100%)',
                fontWeight: '600',
                border: '2px solid #198754',
                boxShadow: '0 2px 8px rgba(25, 135, 84, 0.2)'
              }}>
              <i className="bi bi-info-circle me-2"></i>
              Stack Size: {stack.length} elements
            </div>
          </div>
        </div>

        <div className="alert alert-info">
          <i className="bi bi-lightbulb"></i> <strong>Tip:</strong> Try pushing and popping elements to see how the LIFO principle works. The last element you push will be the first one you pop!
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
                <td><span className="complexity-badge best">Push</span></td>
                <td>O(1)</td>
                <td>O(1)</td>
                <td>Add element to the top of the stack</td>
              </tr>
              <tr>
                <td><span className="complexity-badge best">Pop</span></td>
                <td>O(1)</td>
                <td>O(1)</td>
                <td>Remove and return the top element</td>
              </tr>
              <tr>
                <td><span className="complexity-badge best">Peek</span></td>
                <td>O(1)</td>
                <td>O(1)</td>
                <td>View the top element without removal</td>
              </tr>
              <tr>
                <td><span className="complexity-badge worst">Search</span></td>
                <td>O(n)</td>
                <td>O(1)</td>
                <td>Find an element in the stack</td>
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
            <h6><i className="bi bi-arrow-return-left"></i> Function Calls</h6>
            <p>Managing function call stack in programming languages</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-braces"></i> Expression Evaluation</h6>
            <p>Evaluating mathematical expressions and parentheses matching</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-arrow-clockwise"></i> Undo Operations</h6>
            <p>Implementing undo/redo functionality in applications</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-diagram-3"></i> Depth-First Search</h6>
            <p>Traversing graphs and trees using DFS algorithm</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-file-text"></i> Browser History</h6>
            <p>Managing back/forward navigation in web browsers</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-layers"></i> Memory Management</h6>
            <p>Managing memory allocation and deallocation</p>
          </div>
        </div>
      </div>

      {/* Advantages and Disadvantages */}
      <div className="content-grid mb-4">
        <div className="info-section p-4 mb-4">
          <h4><i className="bi bi-plus-circle"></i> Advantages</h4>
          <ul className="features-list">
            <li>Simple LIFO operations</li>
            <li>Fast push/pop O(1)</li>
            <li>Memory efficient</li>
            <li>Easy to implement</li>
            <li>Perfect for recursion</li>
          </ul>
        </div>
        <div className="info-section disadvantages-section p-4 mb-4">
          <h4><i className="bi bi-dash-circle"></i> Disadvantages</h4>
          <ul className="features-list">
            <li>Limited access (top only)</li>
            <li>No random access</li>
            <li>Fixed size (array-based)</li>
            <li>Stack overflow risk</li>
            <li>Not suitable for all use cases</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Stack;