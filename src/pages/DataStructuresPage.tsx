import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import { dataStructures } from "../config/data-structures";
import { motion, AnimatePresence } from "framer-motion";

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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Badge = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <span className={`inline-block px-3 py-1 rounded-full ${color} text-xs font-medium shadow-sm`}>
    {children}
  </span>
);

const ComingSoonCard = () => (
  <motion.div
    variants={cardVariants}
    whileHover={{ y: -4, boxShadow: "0 8px 32px rgba(100, 116, 139, 0.15)" }}
    transition={{ type: "spring", stiffness: 100, damping: 18 }}
    className="relative w-full rounded-2xl p-6 flex flex-col gap-4 bg-white/30 dark:bg-zinc-800/30 backdrop-blur-xl border border-zinc-200 dark:border-zinc-700 shadow-lg text-zinc-900 dark:text-zinc-100 transition-all"
  >
    <div className="flex items-center gap-3 mb-2">
      <span className="text-3xl opacity-80">⏳</span>
      <h2 className="text-xl font-bold tracking-tight">Coming Soon</h2>
    </div>

    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
      We’re adding more data structures to help you learn visually with ease and depth.
    </p>

    <div>
      <h6 className="text-xs font-medium text-zinc-500 mb-1">Categories</h6>
      <div className="flex gap-2 flex-wrap">
        <Badge color="bg-indigo-100 text-indigo-700">Hash Tables</Badge>
        <Badge color="bg-purple-100 text-purple-700">Heaps</Badge>
      </div>
    </div>

    <div>
      <h6 className="text-xs font-medium text-zinc-500 mb-1 mt-2">Difficulty</h6>
      <div className="flex gap-2">
        <Badge color="bg-green-100 text-green-700">Intermediate</Badge>
        <Badge color="bg-red-100 text-red-700">Advanced</Badge>
      </div>
    </div>

    <div>
      <h6 className="text-xs font-medium text-zinc-500 mb-1 mt-2">Time Complexity</h6>
      <div className="grid grid-cols-4 gap-2 text-center text-xs text-zinc-600 dark:text-zinc-400">
        {["Access", "Search", "Insert", "Delete"].map((label) => (
          <div key={label}>
            <div>{label}</div>
            <div className="font-bold text-zinc-700 dark:text-zinc-100">TBD</div>
          </div>
        ))}
      </div>
    </div>

    <div className="flex items-center justify-between mt-3">
      <Badge color="bg-zinc-200 text-zinc-800 dark:bg-zinc-600 dark:text-zinc-200">Space: TBD</Badge>
      <Badge color="bg-zinc-300 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-200">Coming Soon</Badge>
    </div>
  </motion.div>
);

const DataStructuresPage: React.FC = () => {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 py-10 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.header
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        >
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-1">
                Data Structures
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-base">
                Visualize, explore, and master core data structures interactively.
              </p>
            </div>
          </div>
        </motion.header>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {dataStructures.map((ds) => (
            <motion.div
              key={ds.id}
              variants={cardVariants}
              whileHover={{
                y: -4,
                boxShadow: "0 8px 32px rgba(80, 80, 120, 0.1)",
              }}
              transition={{ type: "spring", stiffness: 90 }}
              className="transition-all"
            >
              <Card
                title={ds.name}
                subtitle={
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge color="bg-indigo-100 text-indigo-700">{ds.category}</Badge>
                    <Badge color="bg-purple-100 text-purple-700">{ds.difficulty}</Badge>
                  </div>
                }
                icon={ds.icon}
                variant={ds.component ? "primary" : "secondary"}
                disabled={!ds.component}
                className="flex flex-col h-full bg-white/90 dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-700 hover:border-indigo-200"
              >
                <p className="text-zinc-600 dark:text-zinc-300 mb-4">{ds.description}</p>

                <div className="mb-4">
                  <h6 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-2">Features</h6>
                  <div className="flex flex-wrap gap-2">
                    {ds.features.slice(0, 2).map((feature, idx) => (
                      <Badge key={idx} color="bg-indigo-50 text-indigo-700">
                        <span className="w-2 h-2 rounded-full bg-green-400 mr-2 inline-block"></span>
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h6 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-2">Time Complexity</h6>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    {["access", "search", "insertion", "deletion"].map((key, i) => (
                      <div key={i}>
                        <div className="text-zinc-400 capitalize">{key}</div>
                        <div className="font-bold text-zinc-700 dark:text-zinc-100">
                          {(ds.timeComplexity as any)[key]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <Badge color="bg-indigo-50 text-indigo-700">Space: {ds.spaceComplexity}</Badge>
                  {ds.component ? (
                    <Link
                      to={`/data-structures/${ds.id}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    >
                      Visualize
                    </Link>
                  ) : (
                    <Badge color="bg-zinc-200 text-zinc-500">Coming Soon</Badge>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}

          <ComingSoonCard />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DataStructuresPage;
