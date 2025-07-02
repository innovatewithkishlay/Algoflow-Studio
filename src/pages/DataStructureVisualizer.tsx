import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataStructures } from '../config/data-structures';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, type: "spring" as const, stiffness: 80 } },
};

const DataStructureVisualizer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dataStructure = dataStructures.find(ds => ds.id === id);

  if (!dataStructure) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-white rounded-2xl shadow-xl px-8 py-12 text-center max-w-lg w-full"
        >
          <i className="bi bi-exclamation-triangle text-yellow-400 text-6xl mb-6" />
          <h2 className="text-2xl font-bold mb-3">Data Structure Not Found</h2>
          <p className="text-zinc-500 mb-6">
            The requested data structure could not be found.
          </p>
          <Link
            to="/data-structures"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            <i className="bi bi-arrow-left"></i>
            Back to Data Structures
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!dataStructure.component) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-white rounded-2xl shadow-xl px-8 py-12 text-center max-w-lg w-full"
        >
          <i className="bi bi-tools text-zinc-400 text-6xl mb-6" />
          <h2 className="text-2xl font-bold mb-3">{dataStructure.name}</h2>
          <p className="text-zinc-500 mb-4">
            This data structure visualization is coming soon!
          </p>
          <p className="text-zinc-400 mb-6">
            We're working hard to bring you interactive visualizations for this concept. Stay tuned for updates!
          </p>
          <Link
            to="/data-structures"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            <i className="bi bi-arrow-left"></i>
            Back to Data Structures
          </Link>
        </motion.div>
      </div>
    );
  }

  const Component = dataStructure.component;

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/data-structures"
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-zinc-200 bg-white shadow hover:bg-zinc-100 transition"
            title="Back"
          >
            <i className="bi bi-arrow-left text-xl"></i>
          </Link>
          <i className={`bi ${dataStructure.icon} text-3xl text-indigo-600`} />
          <div>
            <h1 className="text-2xl font-bold mb-1">{dataStructure.name}</h1>
            <p className="text-zinc-500 text-sm">
              {dataStructure.category} • {dataStructure.difficulty}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <Component />
        </div>
      </div>
    </div>
  );
};

export default DataStructureVisualizer;
