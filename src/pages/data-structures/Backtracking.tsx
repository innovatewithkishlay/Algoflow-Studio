import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

// Helper to generate all steps for N-Queens backtracking visualization
function solveNQueensSteps(n: number) {
  const board: number[] = [];
  const steps: { board: number[]; row: number; col: number; placing: boolean; solutions: number[][]; message: string }[] = [];
  const solutions: number[][] = [];

  function isSafe(row: number, col: number) {
    for (let r = 0; r < row; r++) {
      const c = board[r];
      if (c === col || Math.abs(c - col) === Math.abs(r - row)) return false;
    }
    return true;
  }

  function backtrack(row: number) {
    if (row === n) {
      solutions.push([...board]);
      steps.push({
        board: [...board],
        row: -1,
        col: -1,
        placing: false,
        solutions: solutions.map(sol => [...sol]),
        message: `Found a solution!`
      });
      return;
    }
    for (let col = 0; col < n; col++) {
      steps.push({
        board: [...board],
        row,
        col,
        placing: true,
        solutions: solutions.map(sol => [...sol]),
        message: `Trying to place queen at row ${row}, col ${col}`
      });
      if (isSafe(row, col)) {
        board[row] = col;
        steps.push({
          board: [...board],
          row,
          col,
          placing: false,
          solutions: solutions.map(sol => [...sol]),
          message: `Placed queen at row ${row}, col ${col}`
        });
        backtrack(row + 1);
        board[row] = -1;
        steps.push({
          board: [...board],
          row,
          col,
          placing: false,
          solutions: solutions.map(sol => [...sol]),
          message: `Backtracking from row ${row}, col ${col}`
        });
      } else {
        steps.push({
          board: [...board],
          row,
          col,
          placing: false,
          solutions: solutions.map(sol => [...sol]),
          message: `Cannot place queen at row ${row}, col ${col} (unsafe)`
        });
      }
    }
  }

  for (let i = 0; i < n; i++) board[i] = -1;
  backtrack(0);
  return steps;
}

const codeImplementations = {
  javascript: `function solveNQueens(n) {
  const board = [];
  const solutions = [];
  function isSafe(row, col) {
    for (let r = 0; r < row; r++) {
      const c = board[r];
      if (c === col || Math.abs(c - col) === Math.abs(r - row)) return false;
    }
    return true;
  }
  function backtrack(row) {
    if (row === n) {
      solutions.push([...board]);
      return;
    }
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row] = col;
        backtrack(row + 1);
        board[row] = -1;
      }
    }
  }
  backtrack(0);
  return solutions;
}`
};

const defaultN = 4;

const Backtracking: React.FC = () => {
  const [n, setN] = useState<number>(defaultN);
  const [steps, setSteps] = useState<any[]>(() => solveNQueensSteps(defaultN));
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [insertValue, setInsertValue] = useState<number | ''>(defaultN);
  const [speed] = useState<number>(1200);

  React.useEffect(() => {
    setSteps(solveNQueensSteps(n));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [n]);

  React.useEffect(() => {
    let interval: any;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length, speed]);

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };
  const handleStepBackward = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };
  const handleReset = () => setCurrentStep(0);

  const handleSetN = () => {
    if (typeof insertValue === 'number' && insertValue >= 4 && insertValue <= 8) setN(insertValue);
  };

  const step = steps[currentStep];

  // Board visualization
  const renderBoard = (board: number[], highlightRow: number, highlightCol: number, placing: boolean) => (
    <div className="inline-block border-4 border-indigo-400 rounded shadow-lg overflow-hidden my-3">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${n}, 2.5rem)` }}>
        {[...Array(n * n)].map((_, idx) => {
          const row = Math.floor(idx / n);
          const col = idx % n;
          const isQueen = board[row] === col;
          const isActive = placing && row === highlightRow && col === highlightCol;
          return (
            <div
              key={idx}
              className={`w-10 h-10 flex items-center justify-center text-lg font-bold
                ${isActive ? 'bg-yellow-200' : (isQueen ? 'bg-indigo-500 text-white' : ((row + col) % 2 === 0 ? 'bg-indigo-100' : 'bg-white'))}
                border border-indigo-200`}
            >
              {isQueen ? '♛' : ''}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-2">Backtracking (N-Queens Visualizer)</h1>
          <p className="text-zinc-600 text-lg mb-4">
            Backtracking is a recursive, depth-first search technique for solving constraint satisfaction problems. The N-Queens problem is a classic example.
          </p>
          <div className="flex flex-wrap gap-6 text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-diagram-3 text-indigo-600"></i>
              <span>Recursive Search</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-lightbulb text-indigo-600"></i>
              <span>Constraint Satisfaction</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-braces text-indigo-600"></i>
              <span>Exponential Complexity</span>
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mb-3">
            <i className="bi bi-info-circle text-indigo-600"></i>
            What is Backtracking?
          </h4>
          <p className="text-zinc-700 leading-relaxed">
            Backtracking incrementally builds candidates to a solution and abandons ("backtracks") as soon as it determines the candidate cannot possibly lead to a valid solution. It is used for puzzles, pathfinding, and combinatorial search.
          </p>
          <div className="rounded-xl bg-[#F3F4F6] text-zinc-800 font-mono text-sm px-5 py-4 my-4 shadow-sm border border-zinc-200 overflow-x-auto">
            <pre>{codeImplementations.javascript}</pre>
          </div>
          <h4 className="flex items-center gap-2 text-zinc-900 text-xl font-semibold mt-6 mb-3">
            <i className="bi bi-list-check text-indigo-600"></i>
            Key Features
          </h4>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>Recursive, depth-first search</li>
            <li>Builds solutions incrementally</li>
            <li>Abandons invalid paths early</li>
            <li>Efficient for constraint satisfaction</li>
          </ul>
        </motion.div>

        {/* Interactive Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h5 className="flex items-center gap-2 text-indigo-700 text-lg font-semibold mb-4">
            <i className="bi bi-play-circle"></i> Interactive Demo: N-Queens Backtracking
          </h5>
          <div className="mb-4 flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex gap-2 items-center">
              <input
                type="number"
                value={insertValue}
                min={4}
                max={8}
                onChange={(e) => setInsertValue(Number(e.target.value))}
                className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="N (4-8)"
              />
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
                onClick={handleSetN}
                disabled={insertValue === '' || insertValue < 4 || insertValue > 8}
              >
                Set N
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                onClick={() => setIsPlaying((p) => !p)}
                disabled={steps.length <= 1}
              >
                <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
                onClick={handleReset}
              >
                <i className="bi bi-arrow-counterclockwise"></i> Reset
              </button>
              <button
                className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
                onClick={handleStepBackward}
                disabled={currentStep <= 0}
              >
                <i className="bi bi-skip-backward-fill"></i>
              </button>
              <button
                className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
                onClick={handleStepForward}
                disabled={currentStep >= steps.length - 1}
              >
                <i className="bi bi-skip-forward-fill"></i>
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-zinc-700 font-medium">Board Visualization:</label>
            {renderBoard(step.board, step.row, step.col, step.placing)}
            <div className="text-center mb-3">
              <div className="inline-flex items-center gap-2 rounded border-2 border-indigo-400 bg-indigo-50 px-4 py-2 text-indigo-700 font-semibold shadow">
                <i className="bi bi-chat-text"></i>
                {step.message}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-zinc-700 font-medium">All Solutions Found:</label>
            <div className="flex flex-wrap gap-4">
              {step.solutions && step.solutions.length > 0 ? step.solutions.map((sol: number[], idx: number) => (
                <div key={idx} className="border rounded p-2 bg-indigo-50">
                  <div className="grid" style={{ gridTemplateColumns: `repeat(${n}, 1.5rem)` }}>
                    {sol.map((c, r) => (
                      [...Array(n)].map((_, col) => (
                        <div key={col} className={`w-6 h-6 flex items-center justify-center text-xs font-bold
                          ${(col === c) ? 'bg-indigo-500 text-white' : ((r + col) % 2 === 0 ? 'bg-indigo-100' : 'bg-white')}`}>
                          {col === c ? '♛' : ''}
                        </div>
                      ))
                    ))}
                  </div>
                </div>
              )) : <span className="text-zinc-400">No solutions yet</span>}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 text-indigo-700">
            <i className="bi bi-lightbulb"></i>
            <strong>Tip:</strong> Use the controls to step through the backtracking process and watch how the algorithm explores and backtracks!
          </div>
        </motion.div>

        {/* Complexity Analysis */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
            <i className="bi bi-graph-up"></i> Time & Space Complexity
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="px-4 py-2 border border-gray-300 text-left">Problem</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Time Complexity</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Space Complexity</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">N-Queens</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-red-200 text-red-800 rounded px-2 py-1 font-semibold">O(N!)</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">O(N)</td>
                  <td className="px-4 py-2 border border-gray-300">All possible queen placements</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">General Backtracking</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className="inline-block bg-yellow-200 text-yellow-800 rounded px-2 py-1 font-semibold">Exponential</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">Depends</td>
                  <td className="px-4 py-2 border border-gray-300">Depends on problem</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Use Cases */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
            <i className="bi bi-lightning"></i> Use Cases & Applications
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-braces text-indigo-600"></i> N-Queens Problem
              </h6>
              <p className="text-zinc-700 text-sm">Classic chessboard puzzle</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-grid-3x3-gap text-indigo-600"></i> Sudoku Solver
              </h6>
              <p className="text-zinc-700 text-sm">Constraint-based puzzle solving</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-cursor text-indigo-600"></i> Maze/Pathfinding
              </h6>
              <p className="text-zinc-700 text-sm">Finding paths in grids/graphs</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-list-ol text-indigo-600"></i> Permutations & Combinations
              </h6>
              <p className="text-zinc-700 text-sm">Generate all possible orderings</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h6 className="flex items-center gap-2 font-semibold text-zinc-900 mb-2">
                <i className="bi bi-plus-slash-minus text-indigo-600"></i> Subset Sum/Partition
              </h6>
              <p className="text-zinc-700 text-sm">Subset/partition problems</p>
            </div>
          </div>
        </motion.div>

        {/* Advantages and Disadvantages */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
              <i className="bi bi-plus-circle"></i> Advantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Systematic exploration of solution space</li>
              <li>Efficient pruning of impossible paths</li>
              <li>Works for many constraint-based problems</li>
              <li>Simple, recursive structure</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="flex items-center gap-2 text-indigo-700 text-xl font-semibold mb-4">
              <i className="bi bi-dash-circle"></i> Disadvantages
            </h4>
            <ul className="list-disc list-inside text-zinc-700 space-y-1">
              <li>Exponential time complexity in worst case</li>
              <li>Can be slow for large/complex problems</li>
              <li>Requires recursion and stack space</li>
              <li>Not always optimal for all problems</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Backtracking;
