import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
// Animation variants with proper typing
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  }
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { 
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const scaleHover: Variants = {
  hover: { 
    scale: 1.03,
    boxShadow: "0 20px 40px -15px rgba(79, 70, 229, 0.15)",
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const textGlow: Variants = {
  hidden: { opacity: 0.8, textShadow: "0 0 0px rgba(79, 70, 229, 0)" },
  visible: { 
    opacity: 1, 
    textShadow: [
      "0 0 0px rgba(79, 70, 229, 0)",
      "0 0 10px rgba(79, 70, 229, 0.3)",
      "0 0 0px rgba(79, 70, 229, 0)"
    ],
    transition: { 
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const pulse: Variants = {
  hidden: { scale: 1 },
  visible: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "mirror" as const
    }
  }
};

// Visual components for algorithm previews
const GraphVisual = () => (
  <div className="relative w-full h-40 flex items-center justify-center">
    <div className="absolute w-32 h-32 rounded-full border-2 border-indigo-200" />
    <div className="absolute w-8 h-8 rounded-full bg-indigo-500" />
    <div className="absolute w-8 h-8 rounded-full bg-indigo-400 top-4 left-12" />
    <div className="absolute w-8 h-8 rounded-full bg-indigo-400 top-4 right-12" />
    <div className="absolute w-8 h-8 rounded-full bg-indigo-300 bottom-4 left-8" />
    <div className="absolute w-8 h-8 rounded-full bg-indigo-300 bottom-4 right-8" />
    <div className="absolute w-8 h-8 rounded-full bg-indigo-200 top-12 left-4" />
    <div className="absolute w-8 h-8 rounded-full bg-indigo-200 top-12 right-4" />
    
    {/* Connections */}
    <div className="absolute w-2 h-16 bg-indigo-300 transform rotate-45" />
    <div className="absolute w-2 h-16 bg-indigo-300 transform -rotate-45" />
    <div className="absolute w-2 h-12 bg-indigo-200 transform rotate-20 top-16 left-16" />
    <div className="absolute w-2 h-12 bg-indigo-200 transform -rotate-20 top-16 right-16" />
  </div>
);

const TreeVisual = () => (
  <div className="relative w-full h-40 flex items-center justify-center">
    {/* Tree trunk */}
    <div className="absolute w-3 h-32 bg-yellow-700" />
    
    {/* Tree levels */}
    <div className="absolute top-4 w-24 h-10 bg-green-500 rounded-full" />
    <div className="absolute top-10 w-32 h-12 bg-green-600 rounded-full" />
    <div className="absolute top-20 w-40 h-16 bg-green-700 rounded-full" />
    
    {/* Decorations */}
    <div className="absolute top-8 left-1/2 w-3 h-3 bg-red-500 rounded-full" />
    <div className="absolute top-14 left-1/3 w-3 h-3 bg-red-500 rounded-full" />
    <div className="absolute top-14 right-1/3 w-3 h-3 bg-red-500 rounded-full" />
    <div className="absolute top-24 left-1/4 w-3 h-3 bg-red-500 rounded-full" />
    <div className="absolute top-24 right-1/4 w-3 h-3 bg-red-500 rounded-full" />
    <div className="absolute top-24 left-1/2 w-3 h-3 bg-red-500 rounded-full" />
  </div>
);

const SortingVisual = () => {
  const [active, setActive] = useState(0);
  
  return (
    <div className="relative w-full h-40 flex items-end justify-center gap-1 px-4">
      {[4, 9, 2, 7, 5, 1, 8, 3, 6].map((height, i) => (
        <motion.div
          key={i}
          className={`w-6 rounded-t-md ${i === active ? 'bg-indigo-600' : 'bg-indigo-300'}`}
          style={{ height: `${height * 14}px` }}
          animate={{ 
            height: `${height * 14}px`,
            backgroundColor: i === active ? "#4f46e5" : "#a5b4fc"
          }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          onHoverStart={() => setActive(i)}
        />
      ))}
    </div>
  );
};

const PathfindingVisual = () => (
  <div className="relative w-full h-40 flex items-center justify-center">
    <div className="grid grid-cols-5 grid-rows-5 gap-1 w-40 h-40">
      {Array.from({ length: 25 }).map((_, i) => (
        <div 
          key={i} 
          className={`
            rounded-sm 
            ${i === 0 ? 'bg-green-500' : 
              i === 24 ? 'bg-red-500' : 
              [2, 7, 8, 9, 12, 17, 22].includes(i) ? 'bg-gray-300' : 'bg-indigo-100'}
          `}
        />
      ))}
      
      {/* Path */}
      <motion.div 
        className="absolute w-6 h-6 bg-yellow-400 rounded-full"
        initial={{ x: -40, y: -40 }}
        animate={{ 
          x: [0, 0, 40, 40, 80, 80, 80, 120, 120, 160],
          y: [0, 40, 40, 80, 80, 120, 160, 160, 120, 160]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "loop" as const
        }}
      />
    </div>
  </div>
);

const WelcomePage: React.FC = () => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-indigo-50 font-sans antialiased text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Content */}
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp}>
            <motion.div 
              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mb-5"
              variants={pulse}
            >
              Visualize • Understand • Master
            </motion.div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-gray-900"
            variants={staggerContainer}
          >
            <motion.span 
              className="block"
              variants={fadeUp}
            >
              Master Advanced
            </motion.span>
            <motion.span 
              className="block bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent mt-2"
              variants={textGlow}
              onHoverStart={() => setHovered(true)}
              onHoverEnd={() => setHovered(false)}
              animate={hovered ? "hover" : "visible"}
            >
              Data Structures & Algorithms
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            variants={fadeUp}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Transform complex algorithms into intuitive visual experiences. 
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="block mt-2"
            >
              See how code works in real-time with our interactive visualizations.
            </motion.span>
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp}>
              <Link
                to="/data-structures"
                className="relative inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200/50"
              >
                <motion.span
                  animate={{
                    background: [
                      "linear-gradient(to right, #4f46e5, #7c3aed)",
                      "linear-gradient(to right, #7c3aed, #4f46e5)",
                      "linear-gradient(to right, #4f46e5, #7c3aed)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 rounded-xl opacity-90"
                />
                <span className="relative z-10">
                  Start Learning Free
                  <motion.span 
                    className="ml-2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    &rarr;
                  </motion.span>
                </span>
              </Link>
            </motion.div>
            
            <motion.div variants={fadeUp}>
              <Link
                to="/algorithms"
                className="inline-flex items-center px-8 py-4 rounded-xl font-bold text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 transition"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                >
                  Explore Algorithms
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Why Visual Learning Works
          </motion.div>
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Learn Complex Concepts <motion.span 
              className="text-indigo-600"
              variants={textGlow}
            >60,000x Faster</motion.span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Cognitive science shows visual processing is exponentially faster than text. We leverage this to make DSA intuitive.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {[
            {
              icon: (
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-12 w-12 text-indigo-500" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  whileHover={{ rotate: 20 }}
                >
                  <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
                </motion.svg>
              ),
              title: "Step-by-Step Animations",
              text: "Watch algorithms execute in real-time with detailed visual explanations at every stage."
            },
            {
              icon: (
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-12 w-12 text-indigo-500" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  whileHover={{ rotate: 20 }}
                >
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                </motion.svg>
              ),
              title: "Interactive Playgrounds",
              text: "Modify parameters, create custom inputs, and see instant visual feedback on algorithm behavior."
            },
            {
              icon: (
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-12 w-12 text-indigo-500" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  whileHover={{ rotate: 20 }}
                >
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </motion.svg>
              ),
              title: "Real-World Applications",
              text: "See how each data structure powers real systems from databases to AI implementations."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover="hover"
              className="group"
            >
              <motion.div
                variants={scaleHover}
                className="h-full rounded-2xl border border-gray-100 p-8 bg-white shadow-sm transition-all cursor-pointer"
              >
                <motion.div 
                  className="mb-6"
                  whileHover={{ rotate: 5 }}
                >
                  {feature.icon}
                </motion.div>
                <motion.h3 
                  className="text-2xl font-bold text-gray-900 mb-4"
                  whileHover={{ color: "#4f46e5" }}
                >
                  {feature.title}
                </motion.h3>
                <motion.p 
                  className="text-gray-600 text-lg leading-relaxed"
                  whileHover={{ color: "#4b5563" }}
                >
                  {feature.text}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Advanced Topics Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 bg-gradient-to-br from-white to-indigo-50 rounded-3xl mx-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div 
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Master Advanced Concepts
          </motion.div>
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            From <motion.span 
              className="text-indigo-600"
              variants={textGlow}
            >Abstract</motion.span> to Intuitive
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Complex algorithms transform into clear visual models you can manipulate and understand
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {[
            {
              title: "Graph Algorithms",
              subtitle: "BFS, DFS, Dijkstra's, Floyd Warshall",
              visual: <GraphVisual />,
              description: "Visualize pathfinding and traversal algorithms on complex networks"
            },
            {
              title: "Tree Structures",
              subtitle: "Binary, AVL, Red-Black, Tries",
              visual: <TreeVisual />,
              description: "Understand hierarchical data structures and their balancing techniques"
            },
            {
              title: "Sorting Algorithms",
              subtitle: "QuickSort, MergeSort, HeapSort, Radix",
              visual: <SortingVisual />,
              description: "Watch sorting algorithms in action with real-time comparisons"
            },
            {
              title: "Dynamic Programming",
              subtitle: "Knapsack, LCS, Matrix Chain Multiplication",
              visual: <PathfindingVisual />,
              description: "Visualize optimal substructure and overlapping subproblems"
            },
            {
              title: "Hash Tables & Sets",
              subtitle: "Hash Collisions, Open Addressing, Disjoint Sets",
              visual: <div className="relative w-full h-40 flex items-center justify-center">
                <div className="grid grid-cols-5 gap-1 w-40">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="h-6 bg-indigo-200 rounded flex items-center justify-center">
                      <div className="w-4 h-4 bg-indigo-500 rounded-full" />
                    </div>
                  ))}
                  <div className="absolute w-6 h-6 bg-indigo-600 rounded-full" />
                  <div className="absolute w-6 h-6 bg-indigo-600 rounded-full top-20 left-24" />
                  <div className="absolute w-6 h-6 bg-indigo-600 rounded-full top-32 left-12" />
                </div>
              </div>,
              description: "See how hashing functions distribute data and handle collisions"
            },
            {
              title: "Advanced Data Structures",
              subtitle: "Heaps, Segment Trees, Tries, Disjoint Sets",
              visual: <div className="relative w-full h-40 flex items-center justify-center">
                <div className="absolute w-32 h-32 border-2 border-indigo-200 rounded-lg" />
                <div className="absolute w-24 h-24 border-2 border-indigo-300 rounded-lg rotate-12" />
                <div className="absolute w-16 h-16 border-2 border-indigo-400 rounded-lg rotate-24" />
                <div className="absolute w-8 h-8 bg-indigo-500 rounded-lg rotate-12" />
              </div>,
              description: "Explore specialized structures for optimized problem solving"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group"
            >
              <motion.div 
                className="h-full bg-white rounded-2xl border border-gray-100 p-6 shadow-sm transition-all flex flex-col"
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(79, 70, 229, 0.1)"
                }}
              >
                <div className="mb-4">
                  <motion.h3 
                    className="font-bold text-xl text-gray-900"
                    whileHover={{ color: "#4f46e5" }}
                  >
                    {item.title}
                  </motion.h3>
                  <motion.p 
                    className="text-gray-600 text-sm"
                    whileHover={{ color: "#4b5563" }}
                  >
                    {item.subtitle}
                  </motion.p>
                </div>
                
                <div className="flex-1 flex items-center justify-center mb-4">
                  {item.visual}
                </div>
                
                <motion.p 
                  className="text-gray-600 text-center mb-5"
                  whileHover={{ color: "#4b5563" }}
                >
                  {item.description}
                </motion.p>
                
                <motion.div
                  whileHover={{ rotate: 45 }}
                  className="text-center"
                >
                  <Link 
                    to="/data-structures"
                    className="inline-flex items-center text-indigo-600 font-medium"
                  >
                    Explore Visualization
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link
            to="/data-structures"
            className="inline-flex items-center px-8 py-4 rounded-xl font-bold text-indigo-700 bg-white border border-indigo-200 hover:border-indigo-300 shadow-sm hover:shadow-md transition"
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
            >
              Explore All Visualizations
            </motion.span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </motion.div>
      </section>

      {/* Data Structures & Algorithms Preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mb-4">
                Core Foundations
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Essential Data Structures</h3>
              <p className="text-gray-600 text-lg mb-6">
                Master the building blocks of efficient algorithms with our interactive visualizations.
              </p>
            </div>
            
            <div className="space-y-4">
              {['Arrays', 'Linked Lists', 'Stacks & Queues', 'Hash Tables', 'Trees', 'Graphs', 'Heaps', 'Tries', 'Segment Trees'].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition"
                >
                  <motion.div 
                    className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <motion.div 
                    className="font-medium text-gray-900"
                    whileHover={{ color: "#4f46e5" }}
                  >
                    {item}
                  </motion.div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8">
              <Link
                to="/data-structures"
                className="inline-flex items-center px-6 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                >
                  Explore Data Structures
                </motion.span>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-4">
                Problem Solving
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Key Algorithms</h3>
              <p className="text-gray-600 text-lg mb-6">
                Visualize how algorithms solve real problems with our step-by-step animations.
              </p>
            </div>
            
            <div className="space-y-4">
              {['Sorting Algorithms', 'Search Algorithms', 'Graph Traversals', 'Shortest Path', 'Dynamic Programming', 'Greedy Algorithms', 'Backtracking', 'String Matching', 'Tree Algorithms'].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition"
                >
                  <motion.div 
                    className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <motion.div 
                    className="font-medium text-gray-900"
                    whileHover={{ color: "#10b981" }}
                  >
                    {item}
                  </motion.div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8">
              <Link
                to="/algorithms"
                className="inline-flex items-center px-6 py-3.5 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 transition"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                >
                  Explore Algorithms
                </motion.span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div 
          className="bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-3xl px-8 py-16 shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Ready to Transform How You Learn DSA?
          </motion.h2>
          <motion.p 
            className="text-indigo-100 text-xl max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Join thousands of developers who've mastered algorithms visually
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 rounded-xl font-bold text-indigo-600 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition"
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
              >
                Start Learning Free Today
              </motion.span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default WelcomePage;
