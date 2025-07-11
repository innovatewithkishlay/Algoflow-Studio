import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import { dataStructures } from "../config/data-structures";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const }
  },
};

const Badge = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color} transition-all`}>
    {children}
  </span>
);

const DataStructuresPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDataStructures = dataStructures.filter(ds => {
    const q = searchQuery.toLowerCase();
    return (
      ds.name.toLowerCase().includes(q) ||
      ds.description.toLowerCase().includes(q) ||
      ds.features.some(f => f.toLowerCase().includes(q)) ||
      ds.useCases.some(u => u.toLowerCase().includes(q))
    );
  });

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950 py-12 px-4 sm:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.header
          className="text-center mb-12"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        >
          <div className="flex flex-col items-center">
            <div className="relative inline-flex mb-3">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
                Data Structures Explorer
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mt-3">
              Interactive visualizations to understand and master fundamental data structures
            </p>
          </div>
        </motion.header>

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
              placeholder="Search data structures..."
            />
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredDataStructures.length > 0 ? (
            filteredDataStructures.map((ds) => (
              <motion.div
                key={ds.id}
                variants={cardVariants}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <Card
                  title={ds.name}
                  subtitle={
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      <Badge color="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200">
                        {ds.category}
                      </Badge>
                      <Badge color="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200">
                        {ds.difficulty}
                      </Badge>
                    </div>
                  }
                  icon={ds.icon}
                  variant={ds.component ? "primary" : "secondary"}
                  disabled={!ds.component}
                  className="relative flex flex-col h-full bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 group-hover:border-transparent transition-all duration-300 overflow-hidden"
                >
                  {/* Left accent bar (hidden until hover) */}
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{ds.description}</p>

                  <div className="mb-4">
                    <h6 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Key Features</h6>
                    <div className="flex flex-wrap gap-2">
                      {ds.features.slice(0, 3).map((feature, idx) => (
                        <Badge key={idx} color="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                          <svg className="w-3 h-3 mr-1.5 text-green-500" fill="currentColor" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="3" />
                          </svg>
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h6 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Time Complexity</h6>
                    <div className="grid grid-cols-4 gap-3 text-center text-xs">
                      {(["access", "search", "insertion", "deletion"] as const).map((key) => (
                        <div key={key} className="flex flex-col">
                          <div className="text-gray-500 dark:text-gray-400 uppercase text-[0.65rem] tracking-tight mb-1">{key}</div>
                          <div className="font-bold text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-zinc-700/50 rounded-lg py-1.5">
                            {ds.timeComplexity[key]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-zinc-700/50">
                    <Badge color="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                      Space: {ds.spaceComplexity}
                    </Badge>
                    {ds.component ? (
                      <Link
                        to={`/data-structures/${ds.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm shadow-blue-500/20 group-hover:shadow-blue-500/40"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Visualize
                      </Link>
                    ) : (
                      <Badge color="bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-gray-300">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full w-full">
              <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-4xl mx-auto px-4">
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full max-w-2xl h-48 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 blur-3xl rounded-full"></div>
                  </div>
                  
                  <div className="relative z-10 text-center">
                    <div className="flex justify-center mb-8">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                        <div className="relative w-24 h-24 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-lg border border-gray-200 dark:border-zinc-700">
                          <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Structure Not Found</h3>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-2 max-w-2xl">
                      We're continuously adding new data structures to our collection
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                      Check back soon for updates, or request a structure to be added
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link
                        to="/data-structures"
                        className="relative inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative z-10">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                          </svg>
                        </span>
                        <span className="relative z-10">View All Structures</span>
                      </Link>
                      
                      <a
                        href="mailto:kishlay141@gmail.com?subject=Request%20for%20new%20Data%20Structure%20Visualizer"
                        className="relative inline-flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-gray-200 font-medium rounded-xl overflow-hidden group hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <span className="relative z-10">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                        </span>
                        <span className="relative z-10">Request Structure</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DataStructuresPage;
