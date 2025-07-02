import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Queue: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [queue, setQueue] = useState<number[]>([1, 2, 3, 4, 5]);
  const [inputValue, setInputValue] = useState<string>('');

  const enqueueElement = () => {
    if (inputValue.trim() && !isNaN(Number(inputValue))) {
      setQueue([...queue, Number(inputValue)]);
      setInputValue('');
    }
  };

  const dequeueElement = () => {
    if (queue.length > 0) {
      setQueue(queue.slice(1));
    }
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const generateRandomQueue = () => {
    const newQueue = Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 1);
    setQueue(newQueue);
  };

  return (
    <div className="container-fluid py-3">
      {/* Page Header */}
      <div className="page-header mb-4">
        <div className="page-header-content">
          <h1 className="page-title">Queue</h1>
          <p className="page-subtitle">
            A linear data structure that follows the First-In-First-Out (FIFO) principle
          </p>
          <div className="page-meta">
            <div className="page-meta-item">
              <i className="bi bi-clock"></i>
              <span>Enqueue/Dequeue: O(1)</span>
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
              <i className="bi bi-arrow-right"></i>
              <span>FIFO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="info-section fade-in-up mb-4">
        <h4><i className="bi bi-info-circle"></i> How Queue Works</h4>
        <p className="info-description">
          A Queue is a linear data structure that follows the First-In-First-Out (FIFO) principle.
          This means that the first element added to the queue will be the first one to be removed.
          Think of it like a line of people waiting - the first person to join the line is the first to be served.
        </p>
        <div className="code-example">
          <pre><code>{`class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items.shift();
  }

  front() {
    return this.items[0];
  }

  rear() {
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
          <li><strong>Enqueue:</strong> Add an element to the rear of the queue</li>
          <li><strong>Dequeue:</strong> Remove and return the front element</li>
          <li><strong>Front/Peek:</strong> View the front element without removing it</li>
          <li><strong>Rear:</strong> View the rear element without removing it</li>
          <li><strong>isEmpty:</strong> Check if the queue is empty</li>
          <li><strong>Size:</strong> Get the number of elements in the queue</li>
        </ul>
      </div>

      {/* Interactive Section */}
      <div className="interactive-section slide-in-right mb-4">
        <h5><i className="bi bi-play-circle"></i> Interactive Demo & Visualization</h5>
        <div className="row g-3 mb-4">
          <div className="col-12">
            <label className="form-label">Queue Elements:</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter a number to enqueue"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && enqueueElement()}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="form-label">Queue Operations:</label>
          <div className="d-flex gap-2 mb-2">
            <button
              className="btn btn-success-enhanced btn-enhanced"
              onClick={enqueueElement}
              disabled={!inputValue.trim() || isNaN(Number(inputValue))}
            >
              <i className="bi bi-plus-circle me-2"></i> Enqueue
            </button>
            <button
              className="btn btn-warning btn-enhanced"
              onClick={dequeueElement}
              disabled={queue.length === 0}
            >
              <i className="bi bi-dash-circle me-2"></i> Dequeue
            </button>
            <button
              className="btn btn-danger btn-enhanced"
              onClick={clearQueue}
              disabled={queue.length === 0}
            >
              <i className="bi bi-trash me-2"></i> Clear
            </button>
            <button
              className="btn btn-info-enhanced btn-enhanced"
              onClick={generateRandomQueue}
            >
              <i className="bi bi-shuffle me-2"></i> Random
            </button>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Current Queue:</label>
          <div
            className="p-3 rounded array-visualization-container mb-3"
            style={{
              background: isDarkMode ? '#23272f' : '#f8f9fa',
              color: isDarkMode ? '#f8f9fa' : '#23272f',
            }}
          >
            {queue.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <p>Queue is empty</p>
              </div>
            ) : (
              <div className="d-flex flex-row gap-3 justify-content-center align-items-center">
                {queue.map((value, idx) => (
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
        </div>
        <div className="alert alert-info">
          <i className="bi bi-lightbulb"></i> <strong>Tip:</strong> Try enqueueing and dequeueing elements to see how the FIFO principle works. The first element you enqueue will be the first one you dequeue!
        </div>
      </div>

      {/* Queue Types */}
      <div className="info-section mb-4">
        <h4><i className="bi bi-diagram-3"></i> Types of Queues</h4>
        <div className="row">
          <div className="col-md-6">
            <h6 className="text-highlight">Simple Queue:</h6>
            <p className="info-description">
              Basic FIFO queue where elements are added at the rear and removed from the front.
            </p>
          </div>
          <div className="col-md-6">
            <h6 className="text-highlight">Circular Queue:</h6>
            <p className="info-description">
              Queue where the last element points to the first element, making efficient use of space.
            </p>
          </div>
          <div className="col-md-6">
            <h6 className="text-highlight">Priority Queue:</h6>
            <p className="info-description">
              Queue where elements are dequeued based on their priority rather than arrival order.
            </p>
          </div>
          <div className="col-md-6">
            <h6 className="text-highlight">Double-ended Queue (Deque):</h6>
            <p className="info-description">
              Queue that allows insertion and deletion from both ends.
            </p>
          </div>
        </div>
      </div>

      {/* Implementation Examples */}
      <div className="info-section mb-4">
        <h4><i className="bi bi-code-slash"></i> Common Implementations</h4>
        <div className="row">
          <div className="col-md-6">
            <h6 className="text-highlight">Array-based Implementation:</h6>
            <div className="code-example">
              <pre><code>{`// Using JavaScript Array
const queue = [];
queue.push(1);     // Enqueue
queue.shift();     // Dequeue
queue[0];          // Front
queue[queue.length - 1]; // Rear`}</code></pre>
            </div>
          </div>
          <div className="col-md-6">
            <h6 className="text-highlight">Linked List Implementation:</h6>
            <div className="code-example">
              <pre><code>{`// Using Linked List
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

// Enqueue: Add to tail
// Dequeue: Remove from head
// Front: Return head data`}</code></pre>
            </div>
          </div>
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
                <td><span className="complexity-badge best">Enqueue</span></td>
                <td>O(1)</td>
                <td>O(1)</td>
                <td>Add element to the rear of the queue</td>
              </tr>
              <tr>
                <td><span className="complexity-badge best">Dequeue</span></td>
                <td>O(1)</td>
                <td>O(1)</td>
                <td>Remove and return the front element</td>
              </tr>
              <tr>
                <td><span className="complexity-badge best">Front</span></td>
                <td>O(1)</td>
                <td>O(1)</td>
                <td>View the front element without removal</td>
              </tr>
              <tr>
                <td><span className="complexity-badge worst">Search</span></td>
                <td>O(n)</td>
                <td>O(1)</td>
                <td>Find an element in the queue</td>
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
            <h6><i className="bi bi-printer"></i> Print Spooling</h6>
            <p>Managing print jobs in order of submission</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-cpu"></i> Process Scheduling</h6>
            <p>CPU scheduling in operating systems</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-broadcast"></i> Breadth-First Search</h6>
            <p>Traversing graphs and trees using BFS algorithm</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-chat-dots"></i> Message Queues</h6>
            <p>Handling asynchronous communication between processes</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-people"></i> Customer Service</h6>
            <p>Managing customer service requests in order</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-arrow-repeat"></i> Task Scheduling</h6>
            <p>Managing background tasks and job processing</p>
          </div>
        </div>
      </div>

      {/* Advantages and Disadvantages */}
      <div className="content-grid">
        <div className="info-section p-4 mb-4">
          <h4><i className="bi bi-plus-circle"></i> Advantages</h4>
          <ul className="features-list">
            <li>Simple FIFO operations</li>
            <li>Fast enqueue/dequeue O(1)</li>
            <li>Memory efficient</li>
            <li>Easy to implement</li>
            <li>Perfect for task scheduling</li>
          </ul>
        </div>
        <div className="info-section disadvantages-section p-4 mb-4">
          <h4><i className="bi bi-dash-circle"></i> Disadvantages</h4>
          <ul className="features-list">
            <li>Limited access (front/back only)</li>
            <li>No random access</li>
            <li>Fixed size (array-based)</li>
            <li>Memory waste in circular queues</li>
            <li>Not suitable for priority operations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Queue;