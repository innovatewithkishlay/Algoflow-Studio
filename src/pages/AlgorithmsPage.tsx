import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import { algorithms } from "../config/algorithms";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, type: "spring" as const, stiffness: 80 },
  },
};

const AlgorithmsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter logic: match name, description, features, or advantages
  const filteredAlgorithms = algorithms.filter(algo => {
    const q = searchQuery.toLowerCase();
    return (
      algo.name.toLowerCase().includes(q) ||
      algo.description.toLowerCase().includes(q) ||
      algo.features.some(f => f.toLowerCase().includes(q)) ||
      (algo.advantages && algo.advantages.some(a => a.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
       <header className="max-w-3xl mx-auto pb-10 text-center">
               <motion.h1
                 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient-x"
                 initial={{ opacity: 0, y: -40 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.7, type: "spring" }}
               >
                 Algorithms Explorer
               </motion.h1>
               <motion.p
                 className="mt-4 text-lg text-gray-600 dark:text-gray-300"
                 initial={{ opacity: 0, y: -20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.15, duration: 0.7, type: "spring" }}
               >
                 Visual, interactive, and always growing.
               </motion.p>
               <motion.p
  className="mt-1 text-sm dark:text-blue-300 font-medium"
  style={{ color: '#198754' }} 
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.25, duration: 0.7, type: "spring" }}
>
  We’re continuously adding new data structures. Check back later!
</motion.p>

             </header>
       
               {/* Modern Search Bar */}
               <div className="mb-10 max-w-2xl mx-auto">
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                     </svg>
                   </div>
                   <input
                     type="text"
                     value={searchQuery}
                     onChange={e => setSearchQuery(e.target.value)}
                     className="block w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-300 bg-white/80 dark:bg-zinc-800/70 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                     placeholder="Search algorithms..."
                   />
                 </div>
               </div>
        {/* Card Grid or Not Found */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredAlgorithms.length > 0 ? (
            filteredAlgorithms.map((algo, i) => (
              <motion.div
                key={algo.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{
                  ...cardVariants.visible.transition,
                  delay: i * 0.07,
                }}
                whileHover={{
                  y: -4,
                  scale: 1.02,
                  boxShadow: "0 8px 32px 0 rgba(34,197,94,0.12)",
                }}
                className="transition-all"
              >
                <Card
                  title={algo.name}
                  subtitle={`${algo.category} • ${algo.difficulty}`}
                  icon={algo.icon}
                  variant={algo.component ? "success" : "secondary"}
                  disabled={!algo.component}
                  className="flex flex-col h-full bg-white rounded-2xl shadow-lg border border-zinc-100 hover:border-green-300"
                >
                  <p className="text-zinc-700 mb-4">{algo.description}</p>

                  <div className="mb-4">
                    <h6 className="text-sm font-semibold text-zinc-800 mb-2">Features</h6>
                    <div className="flex flex-wrap gap-2">
                      {algo.features.slice(0, 2).map((feature, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium shadow-sm"
                        >
                          <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h6 className="text-sm font-semibold text-zinc-800 mb-2">Time Complexity</h6>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <div className="text-zinc-500">Best</div>
                        <div className="font-bold text-green-600">{algo.timeComplexity.best}</div>
                      </div>
                      <div>
                        <div className="text-zinc-500">Average</div>
                        <div className="font-bold text-amber-500">{algo.timeComplexity.average}</div>
                      </div>
                      <div>
                        <div className="text-zinc-500">Worst</div>
                        <div className="font-bold text-red-600">{algo.timeComplexity.worst}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h6 className="text-sm font-semibold text-zinc-800 mb-2">Advantages</h6>
                    <ul className="list-disc list-inside text-zinc-700 text-sm">
                      {algo.advantages.slice(0, 2).map((advantage, idx) => (
                        <li key={idx} className="mb-1">
                          {advantage}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-xs bg-green-50 text-green-700 rounded px-2 py-0.5 font-semibold">
                      Space: {algo.spaceComplexity}
                    </span>
                    {algo.component ? (
                      <Link
                        to={`/algorithms/${algo.id}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                      >
                        Visualize
                      </Link>
                    ) : (
                      <span className="text-xs bg-gray-200 text-gray-500 rounded px-2 py-1 font-semibold">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <i className="bi bi-emoji-frown text-5xl text-green-300 mb-4"></i>
              <div className="text-lg font-semibold text-zinc-600 mb-2">
                We don't have this yet!
              </div>
              <div className="text-zinc-500 mb-4">
                Can't find the algorithm you're looking for? You can request it below.
              </div>
              <a
                href="mailto:kishlay141@gmail.com?subject=Request%20for%20new%20Algorithm%20Visualizer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
              >
                <i className="bi bi-envelope"></i>
                Request to Add
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AlgorithmsPage;
