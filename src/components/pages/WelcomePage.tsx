import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function DSAModernHero() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 60 }}
      className="relative w-56 h-56 rounded-3xl bg-white/70 shadow-xl flex items-center justify-center overflow-hidden"
      style={{
        boxShadow: "0 8px 40px 0 rgba(60,80,180,0.10)",
        backdropFilter: "blur(8px)",
      }}
    >
      <svg width="140" height="140" viewBox="0 0 140 140" fill="none" className="block">
        <motion.line
          x1="70" y1="120" x2="70" y2="60"
          stroke="#6366f1"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        />
        <motion.line
          x1="70" y1="80" x2="40" y2="40"
          stroke="#818cf8"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />
        <motion.line
          x1="70" y1="80" x2="100" y2="40"
          stroke="#818cf8"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        />
        <motion.circle
          cx="70" cy="120" r="12"
          fill="#6366f1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        <motion.circle
          cx="40" cy="40" r="9"
          fill="#a5b4fc"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        />
        <motion.circle
          cx="100" cy="40" r="9"
          fill="#a5b4fc"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
        <motion.circle
          cx="70" cy="60" r="10"
          fill="#818cf8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        />
      </svg>
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        initial={{ opacity: 0.13 }}
        animate={{ opacity: [0.13, 0.22, 0.13] }}
        transition={{ duration: 2.2, repeat: Infinity, repeatType: "mirror" }}
        style={{
          background: "radial-gradient(circle at 60% 40%, #6366f1 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.55, ease: "easeOut" },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const WelcomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-indigo-50 font-sans antialiased text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 max-w-7xl mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-16">
        {/* Left Content */}
        <motion.div
          className="flex-1 max-w-xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, x: -40 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
          }}
        >
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight mb-6">
            Decode DSA Visually. Learn Smart.
          </h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            Say goodbye to boring theory. <br />
            Experience how Data Structures and Algorithms really work — visually, intuitively, and interactively.
          </p>
          <div className="flex flex-wrap gap-5">
            <Link
              to="/data-structures"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl border border-gray-900 font-semibold text-gray-900 bg-white hover:bg-gray-900 hover:text-white transition"
            >
              Dive into Structures
            </Link>
            <Link
              to="/algorithms"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl border border-gray-300 font-semibold text-gray-700 bg-white hover:bg-gray-200 transition"
            >
              Crack Algorithms Easily
            </Link>
          </div>
        </motion.div>

        {/* Right Visual */}
        <div className="flex-1 flex justify-center">
          <DSAModernHero />
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">What Makes AlgoFlow Special?</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            A beautifully crafted journey that transforms your DSA skills with clarity, practice, and visual brilliance.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            {
              title: "Visual-First Learning",
              subtitle: "Every step, visually explained",
              text:
                "Watch algorithms execute in real-time with detailed step-by-step visualizations that help you understand the logic behind each operation.",
            },
            {
              title: "Code. Tweak. Learn.",
              subtitle: "Experiment with instant feedback",
              text:
                "Experiment with different inputs and see how algorithms behave. Modify parameters and observe the changes in real-time.",
            },
            {
              title: "DSA from A to Z",
              subtitle: "Foundations to Mastery",
              text:
                "Cover essential data structures and algorithms including arrays, linked lists, trees, graphs, sorting, and searching algorithms.",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              variants={fadeUp}
              whileHover={{ scale: 1.04, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
              className="group rounded-3xl border border-gray-200 p-8 bg-white/80 shadow-sm hover:shadow-md transition cursor-pointer backdrop-blur-md"
            >
              <div className="mb-5">
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.subtitle}</p>
              </div>
              <p className="text-gray-600 leading-relaxed">{feature.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Navigation Cards Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">Your Journey Starts Here</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Pick a path and begin mastering DSA like never before.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            custom={0}
            variants={fadeUp}
            whileHover={{ scale: 1.03, boxShadow: "0 10px 30px rgba(0,0,0,0.07)" }}
            className="rounded-3xl border border-gray-200 p-8 bg-white/80 shadow-sm hover:shadow-md transition cursor-pointer backdrop-blur-md"
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Data Structures</h3>
              <p className="text-sm text-gray-500">Foundation of programming</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {["Arrays & Lists", "Stacks & Queues", "Trees & Graphs", "Hash Tables"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-gray-700 text-sm">
                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Link
              to="/data-structures"
              className="inline-block w-full text-center py-3 rounded-xl border border-gray-900 font-semibold text-gray-900 bg-white hover:bg-gray-900 hover:text-white transition"
            >
              Dive into Structures
            </Link>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUp}
            whileHover={{ scale: 1.03, boxShadow: "0 10px 30px rgba(0,0,0,0.07)" }}
            className="rounded-3xl border border-gray-200 p-8 bg-white/80 shadow-sm hover:shadow-md transition cursor-pointer backdrop-blur-md"
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Algorithms</h3>
              <p className="text-sm text-gray-500">Problem-solving techniques</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {["Searching", "Sorting", "Graph Traversal", "Dynamic Programming"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-gray-700 text-sm">
                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Link
              to="/algorithms"
              className="inline-block w-full text-center py-3 rounded-xl border border-gray-900 font-semibold text-gray-900 bg-white hover:bg-gray-900 hover:text-white transition"
            >
              Crack Algorithms Easily
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default WelcomePage;
