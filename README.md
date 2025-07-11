# AlgoFlow Studio

An immersive, modern platform to learn, visualize, and master Data Structures & Algorithms through engaging animations. Built with React, TypeScript, Tailwind CSS, and Framer Motion.

![AlgoFlow Studio Preview](./Algo.gif)

---

## Key Features

- Live visualizations: Step-by-step algorithm and data structure animations
- Theme toggle: Switch between dark and light modes, with preference saved
- Fully responsive: Optimized for mobile, tablet, and desktop
- Comprehensive DSA coverage: From arrays to advanced algorithms
- Fast and modern: Powered by Vite for optimal performance
- Smooth routing: Seamless navigation with React Router

---

## What's Included?

AlgoFlow Studio currently features **15 algorithms** and **22 data structures** with interactive visualizations and explanations.

### Algorithms (15)

- **Searching:** Linear Search, Binary Search
- **Sorting:** Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort, Counting Sort, Radix Sort
- **Graph Algorithms:** BFS (Breadth-First Search), DFS (Depth-First Search), Kruskal's Algorithm, Dijkstra's Algorithm, Floyd-Warshall Algorithm

### Data Structures (22)

- **Fundamentals:** Arrays, Linked List, Stack, Queue
- **Trees:** Tree, AVL Tree, Red-Black Tree, B-Tree, B+ Tree, Interval Tree, KD-Tree, OSTree
- **Heaps & Queues:** Heap, Priority Queue
- **Graphs:** Graph, Disjoint Set
- **Tries & Variants:** Trie, Suffix Trie, Patricia Trie
- **Other Structures:** Hash Table, Segment Tree, Fenwick Tree (Binary Indexed Tree), Bloom Filter, Suffix Array, Treap, Backtracking

---

## Technology Stack

| Category         | Stack                                    |
|------------------|------------------------------------------|
| Frontend         | React 19 + TypeScript                    |
| Routing          | React Router DOM                         |
| Styling          | Tailwind CSS, Framer Motion, Bootstrap 5 |
| Icons            | Bootstrap Icons, React Icons             |
| Build System     | Vite                                     |
| Auth (Optional)  | Clerk                                    |
| Package Manager  | npm                                      |

---

## Getting Started

Clone the repository and start the development server:

```bash
git clone https://github.com/innovatewithkishlay/Algoflow-Studio.git
cd Algoflow-Studio
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## Project Structure

```
src/
├── components/             # Modular UI components
│   ├── algorithms/         # Algorithm visualizations
│   ├── data-structures/    # Data structure visualizations
│   ├── layout/             # Navbar, footer, layout
│   ├── pages/              # Page-specific components
│   └── ui/                 # Reusable visual elements
├── config/                 # Config files for routing and topics
├── contexts/               # React Context (Theme, etc.)
├── hooks/                  # Custom React hooks
├── styles/                 # Tailwind + global CSS
├── pages/                  # Route-level components
├── utils/                  # Helper logic & utilities
└── public/Algo.gif         # Home page preview GIF
```

---

## App Navigation

| Route                      | Purpose                              |
|----------------------------|--------------------------------------|
| `/`                        | Welcome / Landing Page               |
| `/data-structures`         | Explore DSA concepts                 |
| `/data-structures/:id`     | Visualizer for a specific structure  |
| `/algorithms`              | Algorithm overview                   |
| `/algorithms/:id`          | Algorithm visualizer                 |
| `/time-complexity`         | Complexity theory overview           |

---

## Contribution Guide

We welcome contributions of all kinds:

- Add new algorithm or data structure visualizers
- Improve UI or add new animations
- Add multi-language support (i18n)
- Write unit or integration tests
- Enhance accessibility and performance
- Refactor components using modern React patterns
- Improve documentation or add tutorials

### How to Contribute

1. Fork the repository
2. Clone it:
   ```bash
   git clone https://github.com/your-username/Algoflow-Studio.git
   ```
3. Create a branch:
   ```bash
   git checkout -b feature-branch
   ```
4. Make your changes
5. Commit:
   ```bash
   git commit -m "Add: your feature"
   ```
6. Push:
   ```bash
   git push origin feature-branch
   ```
7. Open a Pull Request on GitHub

For questions, reach out via email: kishlay141@gmail.com

---

## Deployment

### Build for Production

```bash
npm run build
```

### Preview the Build

```bash
npm run preview
```

You can deploy the final build folder to Vercel, Netlify, or any static hosting provider.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Acknowledgements

- React
- React Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Vite

---

## Maintainer

Kishlay Kumar  
GitHub: [@innovatewithkishlay](https://github.com/innovatewithkishlay)  
Email: kishlay141@gmail.com

---

Explore, visualize, and master DSA!
