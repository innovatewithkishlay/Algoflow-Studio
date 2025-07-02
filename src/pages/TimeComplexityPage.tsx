import React from "react";
import { motion } from "framer-motion";

const featureCards = [
  {
    icon: "bi-graph-up",
    color: "text-yellow-500",
    title: "Big O Notation",
    desc: "Understand worst-case complexity analysis",
  },
  {
    icon: "bi-bar-chart",
    color: "text-sky-500",
    title: "Comparison Charts",
    desc: "Visual comparison of algorithm efficiency",
  },
  {
    icon: "bi-cpu",
    color: "text-green-500",
    title: "Performance Analysis",
    desc: "Real-time performance metrics",
  },
];

// Use only plain objects for variants!
const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 }
};

const TimeComplexityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-4">
            Time Complexity Analysis & Visualization
          </h1>
          <p className="text-lg text-zinc-600 mb-8">
            Explore the time and space complexity of various data structures and algorithms with interactive visualizations and charts.
          </p>
        </div>

        <motion.section
          initial={{ opacity: 0, scale: 0.97, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 60 }}
          className="rounded-3xl bg-white/80 backdrop-blur-lg shadow-xl px-6 py-10 mb-8 flex flex-col items-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-2">Coming Soon</h2>
          <p className="text-zinc-700 text-base mb-6 max-w-2xl">
            This section will feature <span className="font-semibold text-indigo-600">interactive charts</span> and explanations for <span className="font-semibold text-indigo-600">Big O, Omega, and Theta notations</span>, and visually compare the efficiency of different algorithms.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-6">
            {featureCards.map((card, i) => (
              <motion.div
                key={card.title}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 + i * 0.12, duration: 0.5, type: "spring", stiffness: 80 }}
                className="flex flex-col items-center bg-white/60 rounded-2xl shadow-md p-6 backdrop-blur transition-all"
              >
                <i className={`bi ${card.icon} text-4xl mb-3 ${card.color}`} />
                <h5 className="font-semibold text-zinc-800 mb-1">{card.title}</h5>
                <p className="text-zinc-500 text-sm text-center">{card.desc}</p>
              </motion.div>
            ))}
          </div>
          <i className="bi bi-hourglass-split text-5xl text-yellow-400 opacity-80 mt-2" />
        </motion.section>
      </div>
    </div>
  );
};

export default TimeComplexityPage;
