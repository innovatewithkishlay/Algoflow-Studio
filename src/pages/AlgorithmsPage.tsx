import React from "react";
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
  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shadow">
              <svg
                width={28}
                height={28}
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx={14} cy={22} r={4} fill="#22c55e" />
                <circle cx={7} cy={8} r={3} fill="#86efac" />
                <circle cx={21} cy={8} r={3} fill="#86efac" />
                <circle cx={14} cy={14} r={3.5} fill="#4ade80" />
                <line x1={14} y1={18} x2={14} y2={14} stroke="#22c55e" strokeWidth={2} />
                <line x1={14} y1={14} x2={7} y2={8} stroke="#4ade80" strokeWidth={2} />
                <line x1={14} y1={14} x2={21} y2={8} stroke="#4ade80" strokeWidth={2} />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-1">Algorithms</h1>
              <p className="text-zinc-600 text-base">
                Learn different algorithms through step-by-step visualizations and interactive examples.
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
          {algorithms.map((algo, i) => (
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
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AlgorithmsPage;
