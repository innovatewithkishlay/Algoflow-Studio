import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

// Utility: generate random undirected edges for demo
function generateRandomEdges(nodeCount: number): [number, number][] {
  const edges: [number, number][] = [];
  for (let i = 0; i < nodeCount; i++) {
    const connections = new Set<number>();
    const edgeCount = Math.floor(Math.random() * 2) + 1;
    while (connections.size < edgeCount && nodeCount > 1) {
      const j = Math.floor(Math.random() * nodeCount);
      if (j !== i) connections.add(j);
    }
    for (const j of connections) {
      if (!edges.some(([a, b]) => (a === i && b === j) || (a === j && b === i))) {
        edges.push([i, j]);
      }
    }
  }
  return edges;
}

const Graph: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [graphData, setGraphData] = useState<number[]>([1, 2, 3, 4, 5]);
  const [inputValue, setInputValue] = useState<string>('');
  const [selected, setSelected] = useState<number | null>(null);

  const addNode = () => {
    if (inputValue.trim() && !isNaN(Number(inputValue))) {
      setGraphData([...graphData, Number(inputValue)]);
      setInputValue('');
    }
  };

  const clearGraph = () => {
    setGraphData([]);
    setSelected(null);
  };

  const generateRandomGraph = () => {
    const newGraph = Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 1);
    setGraphData(newGraph);
    setSelected(null);
  };

  // --- Visualization logic: circular node layout with edges ---
  const renderGraphVisualization = () => {
    const n = graphData.length;
    if (n === 0) {
      return (
        <div className="flex flex-col items-center gap-2 text-zinc-400 min-h-[180px]">
          <span className="text-4xl">🕸️</span>
          <p>Graph is empty</p>
        </div>
      );
    }
    const width = 440, height = 340;
    const cx = width / 2, cy = height / 2;
    const R = Math.min(100, 0.35 * Math.min(width, height)); // Always fits inside SVG
    const nodePos = graphData.map((_, i) => {
      const angle = (2 * Math.PI * i) / n;
      return {
        x: cx + R * Math.cos(angle - Math.PI / 2),
        y: cy + R * Math.sin(angle - Math.PI / 2)
      };
    });
    const edges = generateRandomEdges(n);

    return (
      <svg width={width} height={height} className={`block mx-auto rounded shadow border ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
        {/* Edges */}
        {edges.map(([a, b], idx) => (
          <line
            key={idx}
            x1={nodePos[a].x}
            y1={nodePos[a].y}
            x2={nodePos[b].x}
            y2={nodePos[b].y}
            stroke="#818cf8"
            strokeWidth={4}
            opacity={0.7}
          />
        ))}
        {/* Nodes */}
        {nodePos.map((pos, idx) => (
          <g key={idx} onClick={() => setSelected(idx)} style={{ cursor: 'pointer' }}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={28}
              fill={selected === idx ? "#6366f1" : "#e0e7ef"}
              stroke="#6366f1"
              strokeWidth={selected === idx ? 5 : 3}
              style={{
                filter: selected === idx ? 'drop-shadow(0 0 6px #818cf8)' : undefined,
                transition: 'all 0.2s'
              }}
            />
            <text
              x={pos.x}
              y={pos.y + 7}
              textAnchor="middle"
              fontSize={20}
              fill={selected === idx ? "#fff" : "#3730a3"}
              fontWeight={700}
            >
              {graphData[idx]}
            </text>
            <text
              x={pos.x}
              y={pos.y + 32}
              textAnchor="middle"
              fontSize={11}
              fill="#818cf8"
              fontWeight={600}
            >
              Node {idx}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900">Graph</h1>
          <p className="text-zinc-700 text-lg mt-2">
            A non-linear data structure consisting of vertices connected by edges
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm mt-4">
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
          </div>
        </div>

        {/* Information Section */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-info-circle text-indigo-600"></i>
            How Graph Works
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            A Graph is a non-linear data structure consisting of a finite set of vertices (nodes)
            and edges that connect these vertices. Graphs are used to represent relationships
            between objects and are fundamental in modeling real-world problems.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <pre>
{`class Graph {
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
}`}
            </pre>
          </div>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3">
            <i className="bi bi-list-check text-indigo-600"></i>
            Key Concepts
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li><strong>Vertex/Node:</strong> Fundamental unit of the graph</li>
            <li><strong>Edge:</strong> Connection between two vertices</li>
            <li><strong>Directed Graph:</strong> Edges have direction</li>
            <li><strong>Undirected Graph:</strong> Edges have no direction</li>
            <li><strong>Weighted Graph:</strong> Edges have associated weights</li>
            <li><strong>Path:</strong> Sequence of vertices connected by edges</li>
            <li><strong>Cycle:</strong> Path that starts and ends at the same vertex</li>
          </ul>
        </div>

        {/* Memory Layout Section */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-cpu text-indigo-600"></i>
            Memory Layout
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            Graphs are stored using structures like adjacency lists or matrices. The visualization below shows the current graph nodes and their connections.
          </p>
          {renderGraphVisualization()}
          {selected !== null && (
            <div className="text-center mt-2">
              <div className="inline-flex items-center gap-2 rounded border-2 border-green-600 bg-green-100 px-4 py-2 text-green-800 font-semibold shadow">
                <i className="bi bi-check-circle"></i>
                Selected: Node {selected} (Value: {graphData[selected]})
              </div>
            </div>
          )}
        </div>

        {/* Graph Representations */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
            <i className="bi bi-code-slash"></i> Graph Representations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Adjacency Matrix:</h6>
              <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-2 shadow-sm border border-zinc-200 overflow-x-auto">
                <pre>
{`// 2D array representation
const graph = [
  [0, 1, 1, 0],
  [1, 0, 1, 1],
  [1, 1, 0, 1],
  [0, 1, 1, 0]
];`}
                </pre>
              </div>
            </div>
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Adjacency List:</h6>
              <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-2 shadow-sm border border-zinc-200 overflow-x-auto">
                <pre>
{`// Map/object representation
const graph = {
  0: [1, 2],
  1: [0, 2, 3],
  2: [0, 1, 3],
  3: [1, 2]
};`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Graph Types */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
            <i className="bi bi-diagram-3"></i> Types of Graphs
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Undirected Graph:</h6>
              <p className="text-zinc-700 text-sm">Edges have no direction, relationships are bidirectional.</p>
            </div>
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Directed Graph:</h6>
              <p className="text-zinc-700 text-sm">Edges have direction, relationships are one-way.</p>
            </div>
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Weighted Graph:</h6>
              <p className="text-zinc-700 text-sm">Edges have associated weights or costs.</p>
            </div>
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Unweighted Graph:</h6>
              <p className="text-zinc-700 text-sm">All edges have equal weight or no weight.</p>
            </div>
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Connected Graph:</h6>
              <p className="text-zinc-700 text-sm">There is a path between every pair of vertices.</p>
            </div>
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Disconnected Graph:</h6>
              <p className="text-zinc-700 text-sm">Contains isolated vertices or components.</p>
            </div>
          </div>
        </div>

        {/* Graph Algorithms */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
            <i className="bi bi-arrow-repeat"></i> Common Graph Algorithms
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Breadth-First Search (BFS):</h6>
              <p className="text-zinc-700 text-sm">Explores all vertices at the current depth before moving to next level. Used for shortest path in unweighted graphs.</p>
            </div>
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Depth-First Search (DFS):</h6>
              <p className="text-zinc-700 text-sm">Explores as far as possible along each branch before backtracking. Used for topological sorting and cycle detection.</p>
            </div>
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Dijkstra's Algorithm:</h6>
              <p className="text-zinc-700 text-sm">Finds shortest path between vertices in weighted graphs. Uses priority queue for efficiency.</p>
            </div>
            <div>
              <h6 className="font-semibold text-zinc-900 mb-2">Minimum Spanning Tree:</h6>
              <p className="text-zinc-700 text-sm">Finds tree that connects all vertices with minimum total edge weight. Used in network design.</p>
            </div>
          </div>
        </div>

        {/* Interactive Section */}
        <div className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo & Visualization
          </h5>
          <div className="mb-3">
            <label className="block mb-2 text-zinc-700 font-medium">
              Current Graph Nodes: <span className="font-semibold text-indigo-700">{graphData.length}</span>
            </label>
            {renderGraphVisualization()}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <input
              type="number"
              className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter a number to add as node"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addNode()}
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
              className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
              onClick={generateRandomGraph}
            >
              <i className="bi bi-shuffle"></i> Random Graph
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Click a node to select it. Try adding, clearing, or randomizing!
          </div>
        </div>

        {/* Complexity Analysis */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
            <i className="bi bi-graph-up"></i> Time & Space Complexity
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-2 border border-gray-300 text-left">Operation</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Time Complexity</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Space Complexity</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Add Vertex</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(1)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Add a new vertex to the graph</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Add Edge</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-green-200 text-green-800 rounded px-2 py-1 font-semibold">O(1)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(1)</td>
                  <td className="px-4 py-2 border border-gray-300">Add a new edge between vertices</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">BFS/DFS</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-yellow-200 text-yellow-800 rounded px-2 py-1 font-semibold">O(V+E)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(V)</td>
                  <td className="px-4 py-2 border border-gray-300">Traverse all vertices and edges</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Shortest Path</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-red-200 text-red-800 rounded px-2 py-1 font-semibold">O(V²)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(V)</td>
                  <td className="px-4 py-2 border border-gray-300">Find shortest path between vertices</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
            <i className="bi bi-lightning"></i> Use Cases & Applications
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-geo-alt text-green-600"></i> Social Networks
              </h6>
              <p className="text-zinc-700 text-sm">Modeling relationships between users</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-map text-green-600"></i> Navigation Systems
              </h6>
              <p className="text-zinc-700 text-sm">Finding shortest routes between locations</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-hdd-network text-green-600"></i> Computer Networks
              </h6>
              <p className="text-zinc-700 text-sm">Modeling network topology and routing</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-diagram-3 text-green-600"></i> Dependency Graphs
              </h6>
              <p className="text-zinc-700 text-sm">Managing software dependencies</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-graph-up text-green-600"></i> Recommendation Systems
              </h6>
              <p className="text-zinc-700 text-sm">Building user-item relationship graphs</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-cpu text-green-600"></i> Circuit Design
              </h6>
              <p className="text-zinc-700 text-sm">Modeling electronic circuits</p>
            </div>
          </div>
        </div>

        {/* Advantages and Disadvantages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
              <i className="bi bi-plus-circle"></i> Advantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Flexible data relationships</li>
              <li>Natural problem modeling</li>
              <li>Powerful traversal algorithms</li>
              <li>Supports complex networks</li>
              <li>Wide range of applications</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-green-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Complex implementation</li>
              <li>Memory intensive</li>
              <li>Difficult to visualize</li>
              <li>No standard representation</li>
              <li>Performance varies with structure</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graph;
