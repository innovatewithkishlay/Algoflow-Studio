// src/components/DsaRoadmap.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Types for our roadmap
type TopicLevel = 'beginner' | 'intermediate' | 'advanced';

interface TopicNode {
  id: string;
  label: string;
  description: string;
  details: string;
  next: string[];
  color: string;
  col: number;
  row: number;
  level: TopicLevel;
  resources: { label: string; url: string }[];
  icon: string;
}

// Manual grid positioning: (col, row)
const topics: TopicNode[] = [
  {
    id: "arrays", 
    label: "Arrays", 
    description: "Foundation for all DSA", 
    details: "Learn about static and dynamic arrays, basic operations (access, insert, delete), and common array manipulation techniques.", 
    next: ["linkedlist", "string"], 
    color: "#818cf8", 
    col: 2, 
    row: 0,
    level: 'beginner',
    resources: [
      { label: "Array Basics", url: "https://example.com/arrays" },
      { label: "Dynamic Arrays", url: "https://example.com/dynamic-arrays" }
    ],
    icon: "📊"
  },
  {
    id: "linkedlist", 
    label: "Linked List", 
    description: "Pointers and dynamic memory", 
    details: "Understand singly, doubly, and circular linked lists. Learn pointer manipulation, common operations, and when to use linked lists over arrays.", 
    next: ["stack", "queue"], 
    color: "#f472b6", 
    col: 1, 
    row: 1,
    level: 'beginner',
    resources: [
      { label: "Linked List Guide", url: "https://example.com/linked-lists" },
      { label: "Pointer Techniques", url: "https://example.com/pointers" }
    ],
    icon: "⛓️"
  },
  {
    id: "string", 
    label: "String", 
    description: "Text and pattern problems", 
    details: "Master string manipulation, pattern matching algorithms (including KMP algorithm), and common string problems.", 
    next: ["trie"], 
    color: "#fbbf24", 
    col: 3, 
    row: 1,
    level: 'beginner',
    resources: [
      { label: "String Manipulation", url: "https://example.com/strings" },
      { label: "Pattern Matching", url: "https://example.com/pattern-matching" }
    ],
    icon: "🔤"
  },
  {
    id: "stack", 
    label: "Stack", 
    description: "LIFO and recursion", 
    details: "Learn stack operations, implementation, and applications like expression evaluation, backtracking, and recursion management.", 
    next: ["tree"], 
    color: "#34d399", 
    col: 0, 
    row: 2,
    level: 'beginner',
    resources: [
      { label: "Stack Operations", url: "https://example.com/stacks" },
      { label: "Recursion Techniques", url: "https://example.com/recursion" }
    ],
    icon: "📚"
  },
  {
    id: "queue", 
    label: "Queue", 
    description: "FIFO and scheduling", 
    details: "Understand queue operations, implementations (including circular queues), and applications in scheduling, BFS, and buffering.", 
    next: ["tree"], 
    color: "#60a5fa", 
    col: 2, 
    row: 2,
    level: 'beginner',
    resources: [
      { label: "Queue Fundamentals", url: "https://example.com/queues" },
      { label: "BFS Algorithm", url: "https://example.com/bfs" }
    ],
    icon: "📥"
  },
  {
    id: "trie", 
    label: "Trie", 
    description: "Efficient string search", 
    details: "Master trie data structure for efficient prefix matching, autocomplete systems, and word games.", 
    next: [], 
    color: "#fbbf24", 
    col: 4, 
    row: 2,
    level: 'intermediate',
    resources: [
      { label: "Trie Implementation", url: "https://example.com/tries" },
      { label: "Prefix Matching", url: "https://example.com/prefix-matching" }
    ],
    icon: "🔍"
  },
  {
    id: "tree", 
    label: "Tree", 
    description: "Hierarchical data structures", 
    details: "Learn binary trees, N-ary trees, tree traversals (preorder, inorder, postorder), and common tree algorithms.", 
    next: ["bst", "heap"], 
    color: "#f59e42", 
    col: 1, 
    row: 3,
    level: 'intermediate',
    resources: [
      { label: "Tree Fundamentals", url: "https://example.com/trees" },
      { label: "Tree Traversals", url: "https://example.com/tree-traversals" }
    ],
    icon: "🌳"
  },
  {
    id: "bst", 
    label: "BST", 
    description: "Ordered trees", 
    details: "Understand Binary Search Trees, operations (insert, delete, search), and their time complexities.", 
    next: ["avl", "segmenttree"], 
    color: "#f472b6", 
    col: 0, 
    row: 4,
    level: 'intermediate',
    resources: [
      { label: "BST Operations", url: "https://example.com/bst" },
      { label: "Balancing Techniques", url: "https://example.com/balancing" }
    ],
    icon: "🔎"
  },
  {
    id: "heap", 
    label: "Heap", 
    description: "Priority queues", 
    details: "Learn min-heaps, max-heaps, heap operations, heap sort, and priority queue implementations.", 
    next: ["graph"], 
    color: "#818cf8", 
    col: 2, 
    row: 4,
    level: 'intermediate',
    resources: [
      { label: "Heap Fundamentals", url: "https://example.com/heaps" },
      { label: "Heap Sort", url: "https://example.com/heap-sort" }
    ],
    icon: "📊"
  },
  {
    id: "avl", 
    label: "AVL Tree", 
    description: "Self-balancing BST", 
    details: "Master AVL trees, rotation techniques, and balancing operations to maintain O(log n) time complexity.", 
    next: [], 
    color: "#34d399", 
    col: 0, 
    row: 5,
    level: 'advanced',
    resources: [
      { label: "AVL Tree Guide", url: "https://example.com/avl-trees" },
      { label: "Tree Rotations", url: "https://example.com/tree-rotations" }
    ],
    icon: "⚖️"
  },
  {
    id: "segmenttree", 
    label: "Segment Tree", 
    description: "Range queries", 
    details: "Learn segment trees for efficient range queries (sum, min, max) and range updates.", 
    next: [], 
    color: "#60a5fa", 
    col: 1, 
    row: 5,
    level: 'advanced',
    resources: [
      { label: "Segment Trees", url: "https://example.com/segment-trees" },
      { label: "Range Queries", url: "https://example.com/range-queries" }
    ],
    icon: "📏"
  },
  {
    id: "graph", 
    label: "Graph", 
    description: "Networks and relationships", 
    details: "Master graph representations (adjacency list/matrix), graph properties, and common graph algorithms.", 
    next: ["bfs", "dfs", "mst"], 
    color: "#f59e42", 
    col: 2, 
    row: 5,
    level: 'intermediate',
    resources: [
      { label: "Graph Fundamentals", url: "https://example.com/graphs" },
      { label: "Graph Representations", url: "https://example.com/graph-representations" }
    ],
    icon: "📈"
  },
  {
    id: "bfs", 
    label: "BFS", 
    description: "Level order traversal", 
    details: "Learn Breadth-First Search for shortest path in unweighted graphs, connectivity checks, and level order traversal.", 
    next: [], 
    color: "#818cf8", 
    col: 1, 
    row: 6,
    level: 'intermediate',
    resources: [
      { label: "BFS Algorithm", url: "https://example.com/bfs" },
      { label: "Shortest Path", url: "https://example.com/shortest-path" }
    ],
    icon: "➡️"
  },
  {
    id: "dfs", 
    label: "DFS", 
    description: "Depth traversal", 
    details: "Master Depth-First Search for cycle detection, topological sorting, and backtracking problems.", 
    next: [], 
    color: "#f472b6", 
    col: 2, 
    row: 6,
    level: 'intermediate',
    resources: [
      { label: "DFS Algorithm", url: "https://example.com/dfs" },
      { label: "Backtracking", url: "https://example.com/backtracking" }
    ],
    icon: "⬇️"
  },
  {
    id: "mst", 
    label: "MST", 
    description: "Minimum Spanning Tree", 
    details: "Learn Kruskal's and Prim's algorithms for finding minimum spanning trees in weighted graphs.", 
    next: [], 
    color: "#34d399", 
    col: 3, 
    row: 6,
    level: 'advanced',
    resources: [
      { label: "MST Algorithms", url: "https://example.com/mst" },
      { label: "Kruskal vs Prim", url: "https://example.com/kruskal-prim" }
    ],
    icon: "🌐"
  },
];

const COL_WIDTH = 200;
const ROW_HEIGHT = 120;

const topicMap: Record<string, TopicNode> = Object.fromEntries(topics.map(t => [t.id, t]));

function bfsOrder(startId: string): string[] {
  const visited = new Set<string>();
  const order: string[] = [];
  const queue: string[] = [startId];
  while (queue.length) {
    const node = queue.shift()!;
    if (!visited.has(node)) {
      visited.add(node);
      order.push(node);
      queue.push(...(topicMap[node]?.next || []));
    }
  }
  return order;
}

const traversalOrder = bfsOrder("arrays");

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const DsaRoadmap = () => {
  const [highlighted, setHighlighted] = useState<string[]>([traversalOrder[0]]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<TopicNode | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Animation effect
  useEffect(() => {
    if (!isPlaying) return;
    let idx = highlighted.length;
    if (idx >= traversalOrder.length) return;
    
    const timer = setTimeout(() => {
      setHighlighted(traversalOrder.slice(0, idx + 1));
    }, 600);
    
    return () => clearTimeout(timer);
  }, [highlighted, isPlaying]);

  const handlePlay = () => {
    setHighlighted([traversalOrder[0]]);
    setIsPlaying(true);
  };
  
  const handleReset = () => {
    setHighlighted([traversalOrder[0]]);
    setIsPlaying(false);
  };

  const handleTopicClick = (node: TopicNode) => {
    setSelectedTopic(node);
    setIsSidebarOpen(true);
  };

  function renderEdges() {
    return topics.flatMap(node =>
      node.next.map(nextId => {
        const from = node;
        const to = topicMap[nextId];
        if (!from || !to) return null;
        
        const isHighlighted = highlighted.includes(node.id) && highlighted.includes(nextId);
        
        return (
          <motion.line
            key={`${node.id}->${nextId}`}
            x1={from.col * COL_WIDTH + COL_WIDTH / 2}
            y1={from.row * ROW_HEIGHT + ROW_HEIGHT / 2}
            x2={to.col * COL_WIDTH + COL_WIDTH / 2}
            y2={to.row * ROW_HEIGHT + ROW_HEIGHT / 2}
            stroke={isHighlighted ? "#6366f1" : "#c7d2fe"}
            strokeWidth={isHighlighted ? 4 : 1.5}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            markerEnd={isHighlighted ? "url(#arrowhead)" : undefined}
            className={isHighlighted ? "animate-pulse" : ""}
          />
        );
      })
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-7 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <motion.h1
            variants={fadeUp}
            className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2 drop-shadow-sm"
          >
            Data Structures & Algorithms Roadmap
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-zinc-700 text-base md:text-lg mb-6 max-w-3xl mx-auto"
          >
            Master computer science fundamentals with our interactive learning path.<br />
            This roadmap visualizes dependencies and progression through key concepts.
          </motion.p>
        </motion.div>

        {/* Controls and Legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <div className="flex gap-3">
            <button
              className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-5 py-2 rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-600 font-semibold text-base transition-all flex items-center"
              onClick={handlePlay}
              disabled={isPlaying}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Animate Roadmap
            </button>
            <button
              className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-5 py-2 rounded-lg shadow-md hover:from-gray-800 hover:to-gray-700 font-semibold text-base transition-all flex items-center"
              onClick={handleReset}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Reset
            </button>
          </div>
          
          <div className="flex items-center gap-4 bg-white/80 px-4 py-2 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Beginner</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm">Intermediate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm">Advanced</span>
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-x-auto py-6" style={{ minHeight: '800px' }}>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-100 p-4 mx-auto" style={{ width: `${COL_WIDTH * 5}px`, minHeight: '800px' }}>
            <svg width="100%" height="100%" style={{ position: "absolute", left: 0, top: 0, zIndex: 1 }}>
              <defs>
                <linearGradient id="node-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c7d2fe" />
                </linearGradient>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto" markerUnits="strokeWidth">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
                </marker>
              </defs>
              {renderEdges()}
            </svg>
            
            {topics.map(node => {
              const isActive = highlighted.includes(node.id);
              let levelColor = '';
              switch (node.level) {
                case 'beginner': levelColor = 'bg-green-500'; break;
                case 'intermediate': levelColor = 'bg-yellow-500'; break;
                case 'advanced': levelColor = 'bg-red-500'; break;
              }
              
              return (
                <motion.div
                  key={node.id}
                  className={`absolute cursor-pointer rounded-xl shadow-lg border-2 flex flex-col items-center justify-center
                    transition-all duration-300 overflow-hidden
                    ${isActive ? "scale-105 z-20 shadow-lg" : "scale-100 z-10"}
                  `}
                  style={{
                    left: node.col * COL_WIDTH + 20,
                    top: node.row * ROW_HEIGHT + 20,
                    width: 160,
                    height: 100,
                    background: isActive
                      ? `linear-gradient(135deg, ${node.color} 0%, ${node.color}33 100%)`
                      : "rgba(255,255,255,0.95)",
                    borderColor: isActive ? node.color : "#c7d2fe",
                    color: isActive ? "#fff" : "#3730a3",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    boxShadow: isActive
                      ? `0 6px 20px 0 ${node.color}80`
                      : "0 4px 12px 0 #6366f122",
                  }}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isActive ? 1.05 : 1,
                    borderWidth: isActive ? 3 : 2
                  }}
                  transition={{ 
                    delay: 0.2 + 0.03 * highlighted.indexOf(node.id),
                    type: "spring",
                    stiffness: 300,
                    damping: 15
                  }}
                  whileHover={{ 
                    scale: 1.1, 
                    boxShadow: `0 0 24px 0 ${node.color}80`,
                    borderWidth: 3
                  }}
                  onClick={() => handleTopicClick(node)}
                >
                  <div className="absolute top-2 right-2 flex items-center">
                    <div className={`w-3 h-3 rounded-full ${levelColor}`}></div>
                  </div>
                  
                  <div className="text-2xl mb-1">{node.icon}</div>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{node.label}</span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 500, opacity: 0.93, marginTop: '4px' }}>{node.description}</span>
                  
                  {isActive && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-3xl mx-auto mt-6 bg-white rounded-xl shadow-sm p-4">
          <div className="flex justify-between mb-2">
            <span className="text-indigo-700 font-medium">Learning Progress</span>
            <span className="text-indigo-700 font-bold">{Math.round((highlighted.length / traversalOrder.length) * 100)}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(highlighted.length / traversalOrder.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="mt-3 text-center text-sm text-gray-600">
            Completed {highlighted.length} of {traversalOrder.length} topics
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-zinc-600 text-sm flex flex-col items-center max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <p className="mb-2">
              <span className="text-indigo-600 font-semibold">Interactive Learning Path:</span> This roadmap visualizes the recommended learning order for Data Structures and Algorithms concepts.
            </p>
            <p>
              Click on any node to view detailed information and resources. Use the animation to see the suggested progression path.
            </p>
          </div>
        </div>
      </div>

      {/* Topic Detail Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && selectedTopic && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
            />
            
            <motion.div 
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="p-6">
                <button 
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="flex items-center mb-4">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl mr-4"
                    style={{ backgroundColor: selectedTopic.color + '20', color: selectedTopic.color }}
                  >
                    {selectedTopic.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedTopic.label}</h2>
                    <div className="flex items-center mt-1">
                      <div className={`w-3 h-3 rounded-full ${selectedTopic.level === 'beginner' ? 'bg-green-500' : selectedTopic.level === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'} mr-2`}></div>
                      <span className="text-sm font-medium text-gray-600 capitalize">{selectedTopic.level}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600">{selectedTopic.description}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Details</h3>
                  <p className="text-gray-600">{selectedTopic.details}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Learning Resources</h3>
                  <div className="space-y-3">
                    {selectedTopic.resources.map((resource, index) => (
                      <a 
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-indigo-50 transition-colors group"
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-indigo-600 font-medium group-hover:text-indigo-800 transition-colors">{resource.label}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Next Steps</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTopic.next.map(nextId => {
                      const nextTopic = topicMap[nextId];
                      if (!nextTopic) return null;
                      
                      return (
                        <div 
                          key={nextId}
                          className="px-3 py-1.5 bg-indigo-100 rounded-full text-indigo-700 font-medium flex items-center"
                          onClick={() => {
                            setSelectedTopic(nextTopic);
                            setHighlighted(prev => [...prev, nextId]);
                          }}
                        >
                          <span>{nextTopic.label}</span>
                        </div>
                      );
                    })}
                    {selectedTopic.next.length === 0 && (
                      <div className="text-gray-500 italic">This is a terminal topic in the roadmap</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DsaRoadmap;
