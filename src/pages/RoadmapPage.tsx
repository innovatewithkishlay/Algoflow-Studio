import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";

interface TopicNode {
  id: string;
  label: string;
  description: string;
  next: string[];
  color: string;
}

const topics: TopicNode[] = [
  { id: "arrays", label: "Arrays", description: "Foundation for all DSA.", next: ["linkedlist", "string"], color: "#818cf8" },
  { id: "linkedlist", label: "Linked List", description: "Dynamic memory, pointers.", next: ["stack", "queue"], color: "#f472b6" },
  { id: "string", label: "String", description: "Text and pattern problems.", next: ["trie"], color: "#fbbf24" },
  { id: "stack", label: "Stack", description: "LIFO, recursion, parsing.", next: ["tree"], color: "#34d399" },
  { id: "queue", label: "Queue", description: "FIFO, scheduling.", next: ["tree"], color: "#60a5fa" },
  { id: "tree", label: "Tree", description: "Hierarchical data.", next: ["bst", "heap", "trie"], color: "#f59e42" },
  { id: "bst", label: "BST", description: "Ordered trees.", next: ["avl", "segmenttree"], color: "#f472b6" },
  { id: "heap", label: "Heap", description: "Priority queues.", next: ["graph"], color: "#818cf8" },
  { id: "trie", label: "Trie", description: "Efficient string search.", next: [], color: "#fbbf24" },
  { id: "avl", label: "AVL Tree", description: "Self-balancing BST.", next: [], color: "#34d399" },
  { id: "segmenttree", label: "Segment Tree", description: "Range queries.", next: [], color: "#60a5fa" },
  { id: "graph", label: "Graph", description: "Networks, relationships.", next: ["bfs", "dfs", "mst"], color: "#f59e42" },
  { id: "bfs", label: "BFS", description: "Level order traversal.", next: [], color: "#818cf8" },
  { id: "dfs", label: "DFS", description: "Depth traversal.", next: [], color: "#f472b6" },
  { id: "mst", label: "MST", description: "Minimum Spanning Tree.", next: [], color: "#34d399" },
];

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
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
};

const positions: Record<string, { x: number; y: number }> = {
  arrays: { x: 0, y: 0 },
  linkedlist: { x: -220, y: 120 },
  string: { x: 220, y: 120 },
  stack: { x: -320, y: 260 },
  queue: { x: -120, y: 260 },
  tree: { x: 0, y: 400 },
  bst: { x: -120, y: 540 },
  heap: { x: 120, y: 540 },
  trie: { x: 220, y: 260 },
  avl: { x: -220, y: 680 },
  segmenttree: { x: -20, y: 680 },
  graph: { x: 240, y: 680 },
  bfs: { x: 120, y: 820 },
  dfs: { x: 240, y: 820 },
  mst: { x: 360, y: 820 },
};

const RoadmapPage: React.FC = () => {
  const [highlighted, setHighlighted] = useState<string[]>([traversalOrder[0]]);
  const [isPlaying, setIsPlaying] = useState(false);

  React.useEffect(() => {
    if (!isPlaying) return;
    const idx = highlighted.length;
    if (idx >= traversalOrder.length) return;
    const timer = setTimeout(() => {
      setHighlighted(traversalOrder.slice(0, idx + 1));
    }, 600);
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
        const from = positions[node.id];
        const to = positions[nextId];
        if (!from || !to) return null;
        return (
          <motion.line
            key={`${node.id}->${nextId}`}
            x1={from.x + 100}
            y1={from.y + 60}
            x2={to.x + 100}
            y2={to.y + 60}
            stroke={highlighted.includes(node.id) && highlighted.includes(nextId) ? "#6366f1" : "#c7d2fe"}
            strokeWidth={highlighted.includes(node.id) && highlighted.includes(nextId) ? 5 : 2}
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-5xl font-extrabold text-indigo-800 mb-2 text-center drop-shadow"
        >
          DSA Roadmap
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-zinc-700 text-lg mb-8 text-center"
        >
          Your interactive journey through Data Structures & Algorithms.<br />
          This roadmap is powered by a real graph and animated with BFS traversal!
        </motion.p>

        <div className="flex justify-center mb-6 gap-4">
          <button
            className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white px-7 py-2 rounded-xl shadow-lg hover:from-indigo-700 hover:to-indigo-500 font-bold text-lg transition-all"
            onClick={handlePlay}
            disabled={isPlaying}
          >
            <i className="bi bi-play-fill mr-2"></i> Animate Roadmap
          </button>
          <button
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-7 py-2 rounded-xl shadow-lg hover:from-yellow-500 hover:to-yellow-600 font-bold text-lg transition-all"
            onClick={handleReset}
          >
            <i className="bi bi-arrow-counterclockwise mr-2"></i> Reset
          </button>
        </div>

        <div className="relative w-full h-[950px] bg-white/80 rounded-3xl shadow-2xl border border-indigo-200 overflow-auto backdrop-blur-md">
          <svg width={900} height={950} style={{ position: "absolute", left: 0, top: 0, zIndex: 1 }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto" markerUnits="strokeWidth">
                <polygon points="0 0, 10 3.5, 0 7" fill="#a5b4fc" />
              </marker>
            </defs>
            {renderEdges()}
          </svg>
          {topics.map(node => {
            const pos = positions[node.id];
            if (!pos) return null;
            const isActive = highlighted.includes(node.id);
            return (
              <motion.div
                key={node.id}
                className={`absolute cursor-pointer rounded-2xl shadow-2xl border-2 flex flex-col items-center justify-center
                  transition-all duration-300
                  ${isActive ? "scale-110 z-30" : "scale-100 z-10"}
                `}
                style={{
                  left: pos.x + 60,
                  top: pos.y + 20,
                  width: 180,
                  height: 90,
                  background: isActive
                    ? `linear-gradient(135deg, ${node.color} 60%, #fff 100%)`
                    : "rgba(255,255,255,0.7)",
                  borderColor: isActive ? node.color : "#c7d2fe",
                  color: isActive ? "#fff" : "#3730a3",
                  boxShadow: isActive
                    ? `0 8px 32px 0 ${node.color}44, 0 2px 8px 0 #6366f133`
                    : "0 2px 8px 0 #6366f122",
                  filter: isActive ? "drop-shadow(0 0 16px #818cf8)" : "none",
                  fontWeight: 600,
                  fontSize: "1.15rem",
                  transition: "all 0.25s cubic-bezier(.4,2,.6,1)",
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: isActive ? 1.1 : 1 }}
                transition={{ delay: 0.2 + 0.03 * highlighted.indexOf(node.id) }}
                whileHover={{ scale: 1.15, boxShadow: `0 0 32px 0 ${node.color}77` }}
                data-tooltip-id={node.id}
                data-tooltip-content={`${node.label}: ${node.description}`}
              >
                <span className="font-extrabold text-lg tracking-tight">{node.label}</span>
                <span className="text-xs mt-1 font-medium opacity-90">{node.description}</span>
                {isActive && <span className="mt-2 text-xs font-bold uppercase tracking-wide text-white/80">Active</span>}
                <Tooltip id={node.id} place="top" style={{ zIndex: 1000 }} />
              </motion.div>
            );
          })}
        </div>
        <div className="mt-8 text-center text-zinc-500 text-lg flex flex-col items-center">
          <span>
            <i className="bi bi-lightbulb text-indigo-400"></i> This roadmap is powered by a real graph data structure and animated with BFS traversal.
          </span>
          <span className="mt-1 text-xs text-zinc-400">
            Click any topic for a quick description. Try the animation to see the recommended learning order!
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
