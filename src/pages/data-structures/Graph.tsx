import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, type: 'spring', stiffness: 80 },
  }),
};

const Graph: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [graphData, setGraphData] = useState<number[]>([1, 2, 3, 4, 5]);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const addNode = () => {
    if (inputValue.trim() && !isNaN(Number(inputValue))) {
      setGraphData([...graphData, Number(inputValue)]);
      setInputValue('');
    }
  };

  const clearGraph = () => {
    setGraphData([]);
    setSelectedIndex(null);
  };

  const generateRandomGraph = () => {
    const newGraph = Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 1);
    setGraphData(newGraph);
    setSelectedIndex(null);
  };

  const handleElementClick = (index: number) => {
    setSelectedIndex(index);
  };

  const renderGraphVisualization = () => {
    const containerClass = isDarkMode ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-100 text-zinc-900';
    return (
      <div className={`p-3 rounded min-h-[100px] min-w-[300px] flex items-center justify-center ${containerClass}`}>
        {graphData.length === 0 ? (
          <div className="flex flex-col items-center gap-2 text-zinc-400">
            <svg width={36} height={36} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" /></svg>
            <p>Graph is empty</p>
          </div>
        ) : (
          <div className="flex flex-row gap-6 justify-center items-center flex-wrap">
            {graphData.map((value, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col items-center relative"
                custom={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, type: 'spring', stiffness: 80 }}
                whileHover={{ scale: 1.07, boxShadow: '0 8px 20px rgba(0,0,0,0.12)' }}
                onClick={() => handleElementClick(idx)}
              >
                <div
                  className={
                    "border-4 rounded-full flex justify-center items-center font-semibold text-xl w-12 h-12 cursor-pointer transition " +
                    (selectedIndex === idx
                      ? 'ring-4 ring-indigo-400 z-10 ' : '') +
                    (isDarkMode
                      ? 'border-indigo-500 bg-indigo-600 text-white'
                      : 'border-indigo-600 bg-indigo-500 text-white')
                  }
                >
                  {value}
                </div>
                <div className="text-xs text-indigo-500 mt-1 font-semibold">Node {idx}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div className="mb-8" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div custom={0} variants={fadeUp} className="mb-4">
            <h1 className="text-4xl font-extrabold text-zinc-900">Graph</h1>
          </motion.div>
          <motion.div custom={1} variants={fadeUp} className="mb-2">
            <p className="text-zinc-700 text-lg">
              A non-linear data structure consisting of vertices connected by edges
            </p>
          </motion.div>
          <motion.div custom={2} variants={fadeUp} className="flex flex-wrap gap-6 text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-clock text-indigo-600"></i>
              <span>Search: O(V+E)</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-plus-circle text-indigo-600"></i>
              <span>Add Edge: O(1)</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-gear text-indigo-600"></i>
              <span>Space: O(V²)</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-diagram-3 text-indigo-600"></i>
              <span>Non-linear</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Information Section */}
        <motion.div className="info-section fade-in-up mb-6" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.h4 custom={0} variants={fadeUp} className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-info-circle text-indigo-600"></i>
            How Graph Works
          </motion.h4>
          <motion.p custom={1} variants={fadeUp} className="text-zinc-700 leading-relaxed">
            A Graph is a non-linear data structure consisting of a finite set of vertices (nodes)
            and edges that connect these vertices. Graphs are used to represent relationships
            between objects and are fundamental in modeling real-world problems.
          </motion.p>
          <motion.div custom={2} variants={fadeUp} className="code-example mt-4">
            <pre><code>{`class Graph {
  constructor() {
    this.vertices = new Map();
  }
  addVertex(vertex) {
    if (!this.vertices.has(vertex)) {
      this.vertices.set(vertex, []);
    }
  }
  addEdge(vertex1, vertex2) {
    if (this.vertices.has(vertex1) && this.vertices.has(vertex2)) {
      this.vertices.get(vertex1).push(vertex2);
      this.vertices.get(vertex2).push(vertex1); // Undirected
    }
  }
  getNeighbors(vertex) {
    return this.vertices.get(vertex) || [];
  }
  hasEdge(vertex1, vertex2) {
    const neighbors = this.vertices.get(vertex1);
    return neighbors ? neighbors.includes(vertex2) : false;
  }
}`}</code></pre>
          </motion.div>
          <motion.h4 custom={3} variants={fadeUp} className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3">
            <i className="bi bi-list-check text-indigo-600"></i>
            Key Concepts
          </motion.h4>
          <motion.ul custom={4} variants={fadeUp} className="features-list list-disc list-inside text-zinc-700 space-y-1">
            <li><strong>Vertex/Node:</strong> Fundamental unit of the graph</li>
            <li><strong>Edge:</strong> Connection between two vertices</li>
            <li><strong>Directed Graph:</strong> Edges have direction</li>
            <li><strong>Undirected Graph:</strong> Edges have no direction</li>
            <li><strong>Weighted Graph:</strong> Edges have associated weights</li>
            <li><strong>Path:</strong> Sequence of vertices connected by edges</li>
            <li><strong>Cycle:</strong> Path that starts and ends at the same vertex</li>
          </motion.ul>
        </motion.div>

        {/* Memory Layout Section */}
        <motion.div className="info-section mb-6" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.h4 custom={0} variants={fadeUp} className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-cpu text-indigo-600"></i>
            Memory Layout
          </motion.h4>
          <motion.p custom={1} variants={fadeUp} className="text-zinc-700 leading-relaxed">
            Graphs are stored using structures like adjacency lists or matrices. The visualization below shows the current graph nodes as a flat array (for demo purposes).
          </motion.p>
          {renderGraphVisualization()}
        </motion.div>

        {/* Interactive Section */}
        <motion.div className="interactive-section mb-6" initial="hidden" animate="visible" variants={containerVariants}>
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo & Visualization
          </h5>
          <div className="mb-3">
            <label className="form-label">Current Graph Nodes: <span className="font-semibold text-indigo-700">{graphData.length}</span></label>
            <div className="flex flex-wrap gap-2 mb-3">
              {renderGraphVisualization()}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <input
              type="number"
              className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter a number to add as node"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addNode()}
            />
            <button
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
              onClick={addNode}
              disabled={!inputValue.trim() || isNaN(Number(inputValue))}
            >
              <i className="bi bi-plus-circle"></i> Add Node
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
              onClick={clearGraph}
              disabled={graphData.length === 0}
            >
              <i className="bi bi-trash"></i> Clear Graph
            </button>
            <button
              className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
              onClick={generateRandomGraph}
            >
              <i className="bi bi-shuffle"></i> Random Graph
            </button>
          </div>
          {selectedIndex !== null && graphData[selectedIndex] !== undefined && (
            <motion.div
              className="mt-4 inline-flex items-center gap-2 rounded border-2 border-green-600 bg-green-100 px-4 py-2 text-green-800 font-semibold shadow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <i className="bi bi-info-circle"></i>
              Selected: Node {selectedIndex} = {graphData[selectedIndex]}
              <button
                className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                onClick={resetSelection}
              >
                Reset
              </button>
            </motion.div>
          )}
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Click a node to select it. Use buttons to add, clear, or randomize nodes.
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Graph;
