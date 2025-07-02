import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Tree: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [treeData, setTreeData] = useState<number[]>([1, 2, 3, 4, 5]);
  const [inputValue, setInputValue] = useState<string>('');

  const addNode = () => {
    if (inputValue.trim() && !isNaN(Number(inputValue))) {
      setTreeData([...treeData, Number(inputValue)]);
      setInputValue('');
    }
  };

  const clearTree = () => {
    setTreeData([]);
  };

  const generateRandomTree = () => {
    const newTree = Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 1);
    setTreeData(newTree);
  };

  // --- Visualization logic (array-style node display) ---
  const renderTreeVisualization = () => (
    <div
      className="p-3 rounded"
      style={{
        background: isDarkMode ? '#23272f' : '#f8f9fa',
        color: isDarkMode ? '#f8f9fa' : '#23272f',
        minHeight: 100,
        minWidth: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {treeData.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🌳</div>
          <p>Tree is empty</p>
        </div>
      ) : (
        <div className="d-flex flex-row gap-3 justify-content-center align-items-center">
          {treeData.map((value, idx) => (
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
    <div className="container-fluid py-4">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Tree</h1>
          <p className="page-subtitle">
            A hierarchical data structure consisting of nodes connected by edges
          </p>
          <div className="page-meta">
            <div className="page-meta-item">
              <i className="bi bi-clock"></i>
              <span>Search: O(log n)</span>
            </div>
            <div className="page-meta-item">
              <i className="bi bi-plus-circle"></i>
              <span>Insert: O(log n)</span>
            </div>
            <div className="page-meta-item">
              <i className="bi bi-gear"></i>
              <span>Space: O(n)</span>
            </div>
            <div className="page-meta-item">
              <i className="bi bi-diagram-3"></i>
              <span>Hierarchical</span>
            </div>
          </div>
        </div>
      </div>

        {/* Information Section */}
        <div className="info-section fade-in-up mb-4">
          <h4><i className="bi bi-info-circle"></i> How Tree Works</h4>
          <p className="info-description">
            A Tree is a hierarchical data structure that consists of nodes connected by edges.
            Each node contains a value and references to its child nodes. Trees are used to represent
            hierarchical relationships and are fundamental in computer science for organizing data.
          </p>

          <div className="code-example">
            <pre><code>{`class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinaryTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new TreeNode(value);

    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          break;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          break;
        }
        current = current.right;
      }
    }
  }
}`}</code></pre>
          </div>

          <h4><i className="bi bi-list-check"></i> Key Concepts</h4>
          <ul className="features-list">
            <li><strong>Node:</strong> Basic unit containing data and references</li>
            <li><strong>Root:</strong> Topmost node of the tree</li>
            <li><strong>Parent:</strong> Node that has child nodes</li>
            <li><strong>Child:</strong> Node connected to a parent</li>
            <li><strong>Leaf:</strong> Node with no children</li>
            <li><strong>Height:</strong> Length of path from root to deepest leaf</li>
            <li><strong>Depth:</strong> Length of path from root to a specific node</li>
          </ul>
        </div>

              {/* Tree Types */}
      <div className="info-section mb-4">
        <h4><i className="bi bi-diagram-3"></i> Types of Trees</h4>
        <div className="row">
          <div className="col-md-6">
            <h6 className="text-highlight">Binary Tree:</h6>
            <p className="info-description">
              Tree where each node has at most two children (left and right).
            </p>
          </div>
          <div className="col-md-6">
            <h6 className="text-highlight">Binary Search Tree:</h6>
            <p className="info-description">
              Binary tree where left subtree contains nodes with values less than parent.
            </p>
          </div>
          <div className="col-md-6">
            <h6 className="text-highlight">AVL Tree:</h6>
            <p className="info-description">
              Self-balancing binary search tree with height difference constraint.
            </p>
          </div>
          <div className="col-md-6">
            <h6 className="text-highlight">Red-Black Tree:</h6>
            <p className="info-description">
              Self-balancing binary search tree with color properties.
            </p>
          </div>
          <div className="col-md-6">
            <h6 className="text-highlight">B-Tree:</h6>
            <p className="info-description">
              Self-balancing tree data structure for disk-based storage.
            </p>
          </div>
          <div className="col-md-6">
            <h6 className="text-highlight">Trie:</h6>
            <p className="info-description">
              Tree used for efficient string operations and prefix matching.
            </p>
          </div>
        </div>
      </div>

            {/* Traversal Methods */}
      <div className="info-section mb-4">
        <h4><i className="bi bi-arrow-repeat"></i> Tree Traversal Methods</h4>
        <div className="row">
          <div className="col-md-4">
            <h6 className="text-highlight">Inorder (LNR):</h6>
            <p className="info-description">
              Left → Root → Right. Produces sorted output for BST.
            </p>
          </div>
          <div className="col-md-4">
            <h6 className="text-highlight">Preorder (NLR):</h6>
            <p className="info-description">
              Root → Left → Right. Useful for copying trees.
            </p>
          </div>
          <div className="col-md-4">
            <h6 className="text-highlight">Postorder (LRN):</h6>
            <p className="info-description">
              Left → Right → Root. Useful for deleting trees.
            </p>
          </div>
        </div>
      </div>


        {/* Interactive Section */}
        <div className="interactive-section mb-4">
          <h5><i className="bi bi-play-circle"></i> Interactive Demo & Visualization</h5>

          <div className="mb-3">
            <label className="form-label">Current Tree Nodes: <span className="badge-enhanced primary">{treeData.length}</span></label>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {renderTreeVisualization()}
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-8">
              <input
                type="number"
                className="form-control"
                placeholder="Enter a number to add to tree"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addNode()}
              />
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-success-enhanced btn-enhanced w-100"
                onClick={addNode}
                disabled={!inputValue.trim() || isNaN(Number(inputValue))}
              >
                <i className="bi bi-plus-circle"></i> Add Node
              </button>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <button
                className="btn btn-danger btn-enhanced w-100"
                onClick={clearTree}
                disabled={treeData.length === 0}
              >
                <i className="bi bi-trash"></i> Clear Tree
              </button>
            </div>
            <div className="col-md-6">
              <button
                className="btn btn-info-enhanced btn-enhanced w-100"
                onClick={generateRandomTree}
              >
                <i className="bi bi-shuffle"></i> Random Tree
              </button>
            </div>
          </div>

          <div className="alert alert-info">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Add nodes to see how the tree structure is built.
            The visualization will show the hierarchical relationships between nodes.
          </div>
        </div>

      {/* Memory Layout Section */}
      <div className="info-section mb-4">
        <h4><i className="bi bi-cpu"></i> Memory Layout</h4>
        <p className="info-description">
          Trees are hierarchical data structures where each node can have multiple children. The visualization below shows the current tree nodes as a flat array (for demo purposes).
        </p>
        {renderTreeVisualization()}
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
                <td><span className="complexity-badge best">Search</span></td>
                <td>O(log n)</td>
                <td>O(1)</td>
                <td>Find an element in balanced binary tree</td>
              </tr>
              <tr>
                <td><span className="complexity-badge best">Insert</span></td>
                <td>O(log n)</td>
                <td>O(1)</td>
                <td>Add a new node to the tree</td>
              </tr>
              <tr>
                <td><span className="complexity-badge best">Delete</span></td>
                <td>O(log n)</td>
                <td>O(1)</td>
                <td>Remove a node from the tree</td>
              </tr>
              <tr>
                <td><span className="complexity-badge worst">Traversal</span></td>
                <td>O(n)</td>
                <td>O(n)</td>
                <td>Visit all nodes in the tree</td>
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
            <h6><i className="bi bi-search"></i> Binary Search Trees</h6>
            <p>Efficient searching and sorting of data</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-folder"></i> File Systems</h6>
            <p>Organizing files and directories hierarchically</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-diagram-3"></i> Expression Trees</h6>
            <p>Representing mathematical expressions</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-graph-up"></i> Decision Trees</h6>
            <p>Machine learning and decision making</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-code"></i> Abstract Syntax Trees</h6>
            <p>Compilers and code parsing</p>
          </div>
          <div className="use-case-item">
            <h6><i className="bi bi-hdd-network"></i> Network Routing</h6>
            <p>Routing tables and network topology</p>
          </div>
        </div>
      </div>



      {/* Advantages and Disadvantages */}
      <div className="content-grid">
        <div className="info-section p-4 mb-4">
          <h4><i className="bi bi-plus-circle"></i> Advantages</h4>
          <ul className="features-list">
            <li>Hierarchical data organization</li>
            <li>Fast search O(log n)</li>
            <li>Efficient insertion/deletion</li>
            <li>Natural data representation</li>
            <li>Supports various traversal methods</li>
          </ul>
        </div>
        <div className="info-section disadvantages-section p-4 mb-4">
          <h4><i className="bi bi-dash-circle"></i> Disadvantages</h4>
          <ul className="features-list">
            <li>Complex implementation</li>
            <li>Memory overhead for pointers</li>
            <li>Can become unbalanced</li>
            <li>No random access</li>
            <li>Difficult to serialize</li>
          </ul>
        </div>
      </div>


    </div>
  );
};

export default Tree;