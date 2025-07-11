import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";

interface TopicNode {
  id: string;
  label: string;
  description: string;
  details: string;
  next: string[];
  color: string;
  col: number;
  row: number;
}

// Manual grid positioning: (col, row)
const topics: TopicNode[] = [
  { id: "arrays", label: "Arrays", description: "Foundation for all DSA.", details: "Basic operations, static/dynamic arrays.", next: ["linkedlist", "string"], color: "#818cf8", col: 2, row: 0 },
  { id: "linkedlist", label: "Linked List", description: "Pointers, dynamic memory.", details: "Singly, doubly, circular.", next: ["stack", "queue"], color: "#f472b6", col: 1, row: 1 },
  { id: "string", label: "String", description: "Text and pattern problems.", details: "Manipulation, pattern matching.", next: ["trie"], color: "#fbbf24", col: 3, row: 1 },
  { id: "stack", label: "Stack", description: "LIFO, recursion.", details: "Expression eval, call stack.", next: ["tree"], color: "#34d399", col: 0, row: 2 },
  { id: "queue", label: "Queue", description: "FIFO, scheduling.", details: "Task scheduling, BFS.", next: ["tree"], color: "#60a5fa", col: 2, row: 2 },
  { id: "trie", label: "Trie", description: "Efficient string search.", details: "Prefix matching, autocomplete.", next: [], color: "#fbbf24", col: 4, row: 2 },
  { id: "tree", label: "Tree", description: "Hierarchical data.", details: "Binary, N-ary, traversals.", next: ["bst", "heap"], color: "#f59e42", col: 1, row: 3 },
  { id: "bst", label: "BST", description: "Ordered trees.", details: "Insert, delete, search.", next: ["avl", "segmenttree"], color: "#f472b6", col: 0, row: 4 },
  { id: "heap", label: "Heap", description: "Priority queues.", details: "Min/max heap, heap sort.", next: ["graph"], color: "#818cf8", col: 2, row: 4 },
  { id: "avl", label: "AVL Tree", description: "Self-balancing BST.", details: "Rotations, O(log n) ops.", next: [], color: "#34d399", col: 0, row: 5 },
  { id: "segmenttree", label: "Segment Tree", description: "Range queries.", details: "Sum/min/max queries.", next: [], color: "#60a5fa", col: 1, row: 5 },
  { id: "graph", label: "Graph", description: "Networks, relationships.", details: "Adjacency list/matrix.", next: ["bfs", "dfs", "mst"], color: "#f59e42", col: 2, row: 5 },
  { id: "bfs", label: "BFS", description: "Level order traversal.", details: "Shortest path, connectivity.", next: [], color: "#818cf8", col: 1, row: 6 },
  { id: "dfs", label: "DFS", description: "Depth traversal.", details: "Cycle detection, topo sort.", next: [], color: "#f472b6", col: 2, row: 6 },
  { id: "mst", label: "MST", description: "Minimum Spanning Tree.", details: "Kruskal, Prim.", next: [], color: "#34d399", col: 3, row: 6 },
];

const COL_WIDTH = 200;
const ROW_HEIGHT = 110;

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

const RoadmapPage: React.FC = () => {
  const [highlighted, setHighlighted] = useState<string[]>([traversalOrder[0]]);
  const [isPlaying, setIsPlaying] = useState(false);

  React.useEffect(() => {
    if (!isPlaying) return;
    let idx = highlighted.length;
    if (idx >= traversalOrder.length) return;
    const timer = setTimeout(() => {
      setHighlighted(traversalOrder.slice(0, idx + 1));
    }, 500);
    if (idx < traversalOrder.length) {
      return () => clearTimeout(timer);
    }
  }, [highlighted, isPlaying]);

  const handlePlay = () => {
    setHighlighted([traversalOrder[0]]);
    setIsPlaying(true);
  };
  const handleReset = () => {
    setHighlighted([traversalOrder[0]]);
    setIsPlaying(false);
  };

  function renderEdges() {
    return topics.flatMap(node =>
      node.next.map(nextId => {
        const from = node;
        const to = topicMap[nextId];
        if (!from || !to) return null;
        return (
          <motion.line
            key={`${node.id}->${nextId}`}
            x1={from.col * COL_WIDTH + COL_WIDTH / 2}
            y1={from.row * ROW_HEIGHT + ROW_HEIGHT / 2}
            x2={to.col * COL_WIDTH + COL_WIDTH / 2}
            y2={to.row * ROW_HEIGHT + ROW_HEIGHT / 2}
            stroke={highlighted.includes(node.id) && highlighted.includes(nextId) ? "#6366f1" : "#c7d2fe"}
            strokeWidth={highlighted.includes(node.id) && highlighted.includes(nextId) ? 4 : 1.5}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            markerEnd="url(#arrowhead)"
          />
        );
      })
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 py-7 px-2">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-3xl font-extrabold text-indigo-800 mb-2 text-center drop-shadow"
        >
          DSA Roadmap
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-zinc-700 text-base mb-6 text-center"
        >
          Explore your path in Data Structures & Algorithms.<br />
          This roadmap is a real graph, animated with BFS traversal!
        </motion.p>

        <div className="flex justify-center mb-4 gap-3">
          <button
            className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white px-5 py-1.5 rounded-lg shadow hover:from-indigo-700 hover:to-indigo-500 font-bold text-base transition-all"
            onClick={handlePlay}
            disabled={isPlaying}
          >
            <i className="bi bi-play-fill mr-1"></i> Animate Roadmap
          </button>
          <button
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-5 py-1.5 rounded-lg shadow hover:from-yellow-500 hover:to-yellow-600 font-bold text-base transition-all"
            onClick={handleReset}
          >
            <i className="bi bi-arrow-counterclockwise mr-1"></i> Reset
          </button>
        </div>

        <div className="relative w-full overflow-x-auto" style={{ background: "rgba(255,255,255,0.95)", borderRadius: 20, boxShadow: "0 4px 32px #818cf822", border: "1px solid #c7d2fe", minHeight: 800 }}>
          <svg width={COL_WIDTH * 5} height={ROW_HEIGHT * 8} style={{ position: "absolute", left: 0, top: 0, zIndex: 1 }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto" markerUnits="strokeWidth">
                <polygon points="0 0, 10 3.5, 0 7" fill="#a5b4fc" />
              </marker>
            </defs>
            {renderEdges()}
          </svg>
          {topics.map(node => {
            const isActive = highlighted.includes(node.id);
            return (
              <motion.div
                key={node.id}
                className={`absolute cursor-pointer rounded-xl shadow-lg border flex flex-col items-center justify-center
                  transition-all duration-300
                  ${isActive ? "scale-105 z-20" : "scale-100 z-10"}
                `}
                style={{
                  left: node.col * COL_WIDTH + 20,
                  top: node.row * ROW_HEIGHT + 20,
                  width: 160,
                  height: 60,
                  background: isActive
                    ? `linear-gradient(135deg, ${node.color} 65%, #fff 100%)`
                    : "rgba(255,255,255,0.8)",
                  borderColor: isActive ? node.color : "#c7d2fe",
                  color: isActive ? "#fff" : "#3730a3",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  boxShadow: isActive
                    ? `0 4px 16px 0 ${node.color}33`
                    : "0 1px 4px 0 #6366f122",
                  transition: "all 0.22s cubic-bezier(.4,2,.6,1)",
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: isActive ? 1.05 : 1 }}
                transition={{ delay: 0.2 + 0.03 * highlighted.indexOf(node.id) }}
                whileHover={{ scale: 1.12, boxShadow: `0 0 18px 0 ${node.color}66` }}
                data-tooltip-id={node.id}
                data-tooltip-content={
                  `<div style='font-size:1rem;font-weight:bold;'>${node.label}</div>
                  <div style='font-size:0.83rem;margin-top:2px;'>${node.description}</div>
                  <div style='font-size:0.70rem;color:#cbd5e1;margin-top:2px;'>${node.details}</div>`
                }
                data-tooltip-html
              >
                <span style={{ fontWeight: 700 }}>{node.label}</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 500, opacity: 0.93 }}>{node.description}</span>
                {isActive && <span className="mt-1 text-[0.7rem] font-bold uppercase tracking-wide text-white/80">Active</span>}
                <Tooltip id={node.id} place="top" style={{ zIndex: 1000, fontSize: "0.95rem", maxWidth: 260 }} />
              </motion.div>
            );
          })}
        </div>
        <div className="mt-7 text-center text-zinc-500 text-base flex flex-col items-center">
          <span>
            <i className="bi bi-lightbulb text-indigo-400"></i> This roadmap is powered by a real graph and animated with BFS traversal.
          </span>
          <span className="mt-1 text-xs text-zinc-400">
            Hover any topic for details. Try the animation to see the recommended learning order!
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
