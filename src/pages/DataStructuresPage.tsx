import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import { dataStructures } from "../config/data-structures";
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
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const DataStructuresPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center shadow">
              <svg width={28} height={28} viewBox="0 0 28 28" fill="none">
                <circle cx={14} cy={22} r={4} fill="#6366f1" />
                <circle cx={7} cy={8} r={3} fill="#a5b4fc" />
                <circle cx={21} cy={8} r={3} fill="#a5b4fc" />
                <circle cx={14} cy={14} r={3.5} fill="#818cf8" />
                <line x1={14} y1={18} x2={14} y2={14} stroke="#6366f1" strokeWidth={2} />
                <line x1={14} y1={14} x2={7} y2={8} stroke="#818cf8" strokeWidth={2} />
                <line x1={14} y1={14} x2={21} y2={8} stroke="#818cf8" strokeWidth={2} />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-1">Data Structures</h1>
              <p className="text-zinc-500 text-base">
                Explore, visualize, and master core data structures with interactive cards.
              </p>
            </div>
          </div>
        </header>

        {/* Card Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {dataStructures.map((ds, i) => (
            <motion.div
              key={ds.id}
              variants={cardVariants}
              whileHover={{ y: -4, boxShadow: "0 8px 32px 0 rgba(80,80,120,0.10)" }}
              transition={{ type: "spring", stiffness: 80 }}
              className="transition-all"
            >
              <Card
                title={ds.name}
                subtitle={
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">{ds.category}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold">{ds.difficulty}</span>
                  </div>
                }
                icon={ds.icon}
                variant={ds.component ? "primary" : "secondary"}
                disabled={!ds.component}
                className="flex flex-col h-full bg-white/90 rounded-2xl shadow-lg border border-zinc-100 hover:border-indigo-200"
              >
                <p className="text-zinc-600 mb-4">{ds.description}</p>

                <div className="mb-4">
                  <h6 className="text-sm font-semibold text-zinc-700 mb-2">Features</h6>
                  <div className="flex flex-wrap gap-2">
                    {ds.features.slice(0, 2).map((feature, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium shadow-sm"
                      >
                        <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h6 className="text-sm font-semibold text-zinc-700 mb-2">Time Complexity</h6>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div>
                      <div className="text-zinc-400">Access</div>
                      <div className="font-bold text-zinc-700">{ds.timeComplexity.access}</div>
                    </div>
                    <div>
                      <div className="text-zinc-400">Search</div>
                      <div className="font-bold text-zinc-700">{ds.timeComplexity.search}</div>
                    </div>
                    <div>
                      <div className="text-zinc-400">Insert</div>
                      <div className="font-bold text-zinc-700">{ds.timeComplexity.insertion}</div>
                    </div>
                    <div>
                      <div className="text-zinc-400">Delete</div>
                      <div className="font-bold text-zinc-700">{ds.timeComplexity.deletion}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="text-xs bg-indigo-50 text-indigo-700 rounded px-2 py-0.5 font-semibold">
                    Space: {ds.spaceComplexity}
                  </span>
                  {ds.component ? (
                    <Link
                      to={`/data-structures/${ds.id}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    >
                      Visualize
                    </Link>
                  ) : (
                    <span className="text-xs bg-zinc-200 text-zinc-500 rounded px-2 py-1 font-semibold">Coming Soon</span>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}

          {/* Example of a dedicated "Coming Soon" card if you want it as a separate card */}
          {/* 
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4, boxShadow: "0 8px 32px 0 rgba(80,80,120,0.10)" }}
            transition={{ type: "spring", stiffness: 80 }}
            className="transition-all"
          >
            <div className="flex flex-col h-full bg-white/90 rounded-2xl shadow-lg border border-zinc-100 p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⏳</span>
                <h2 className="text-xl font-bold text-zinc-900">More Data Structures Coming Soon</h2>
              </div>
              <hr className="my-2 border-zinc-200" />
              <p className="text-zinc-600 mb-2">
                We are working on <span className="font-semibold text-indigo-600">adding more data structures</span>
                {" "}to help you learn and visualize complex concepts.
              </p>
              <div className="flex gap-2 flex-wrap mb-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                  Hash Tables
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                  Heaps
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs mb-2">
                {["Access", "Search", "Insert", "Delete"].map((label) => (
                  <div key={label}>
                    <div className="text-zinc-400">{label}</div>
                    <div className="font-bold text-zinc-700">TBD</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs bg-indigo-50 text-indigo-700 rounded px-2 py-0.5 font-semibold">
                  Space: TBD
                </span>
                <span className="text-xs bg-zinc-200 text-zinc-500 rounded px-2 py-1 font-semibold">Coming Soon</span>
              </div>
            </div>
          </motion.div>
          */}
        </motion.div>
      </div>
    </div>
  );
};

export default DataStructuresPage;
