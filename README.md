# AlgoFlow Studio

An interactive web platform for mastering Data Structures and Algorithms through engaging visualizations. Crafted with React, TypeScript, and Bootstrap 5.3 for a seamless learning experience.

## ✨ Key Highlights

- **Stepwise Visualizations**: Watch algorithms and data structures unfold, one step at a time
- **Theme Switcher**: Effortlessly toggle between dark and light modes, with your choice remembered
- **Mobile-First Design**: Fully responsive—optimized for all devices
- **Extensive Topics**: Covers everything from arrays to complex graph algorithms
- **Learning-Oriented**: Built to simplify and demystify DSA concepts
- **Modern Navigation**: Clean, intuitive routing powered by React Router

## 🧰 Technology Stack

- **Frontend**: React 19.1.0 + TypeScript
- **Routing**: React Router DOM
- **Styling**: Bootstrap 5.3.7 & custom CSS
- **Icons**: Bootstrap Icons
- **Build System**: Vite
- **Package Management**: npm

## ⚡ Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dsa-visualizer.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

## 🗂️ Project Layout

```
├── src/
│   ├── components/
│   │   ├── algorithms/        # Algorithm visualizers
│   │   ├── data-structures/   # Data structure visualizers
│   │   ├── layout/            # Layout (Navbar, etc.)
│   │   ├── pages/             # Page components
│   │   └── ui/                # Reusable UI elements
│   ├── pages/                 # Route-level pages
│   ├── config/                # App configuration
│   ├── contexts/              # React contexts (e.g., Theme)
│   ├── hooks/                 # Custom hooks
│   ├── styles/                # CSS & theme files
│   ├── types/                 # TypeScript types
│   └── utils/                 # Helper functions
├── public/                    # Static assets
└── package.json
```

## 📊 Visualizations Available

### Data Structures
- ✅ **Arrays** – Visualize core operations and properties
- 🚧 **Linked Lists** – Coming soon
- 🚧 **Stacks** – Coming soon
- 🚧 **Queues** – Coming soon
- 🚧 **Trees** – Coming soon
- 🚧 **Graphs** – Coming soon

### Algorithms
- ✅ **Linear Search** – Step-by-step search demonstration
- 🚧 **Binary Search** – Coming soon
- 🚧 **Bubble Sort** – Coming soon
- 🚧 **Merge Sort** – Coming soon
- 🚧 **Quick Sort** – Coming soon
- 🚧 **DFS** – Coming soon
- 🚧 **BFS** – Coming soon

## 🧭 App Navigation

The app leverages React Router for a smooth navigation experience:

- `/` – Home/Welcome
- `/data-structures` – Overview of data structures
- `/data-structures/:id` – Visualizer for a specific data structure
- `/algorithms` – Algorithms overview
- `/algorithms/:id` – Visualizer for a specific algorithm

### Navigation Features

- **Dropdown Menus**: Instantly access any topic from the navbar
- **Breadcrumbs**: Always know where you are
- **Mobile Navigation**: Optimized for touch and small screens
- **Theme Toggle**: Switch themes directly from the navbar

## 🎨 Customization Guide

### Adding New Visualizations

1. Create your component:
   - Algorithms: `src/components/algorithms/`
   - Data Structures: `src/components/data-structures/`
2. Register it in the config:
   - Algorithms: `src/config/algorithms.ts`
   - Data Structures: `src/config/dataStructures.ts`
3. The router will automatically pick up your new visualizer.

### Theming & Styling

- Edit `src/styles/globals.css` for global styles and custom utilities
- Adjust Bootstrap variables in the CSS for theme tweaks

## 🚢 Deployment

### Production Build

```bash
npm run build
```

### Preview the Build

```bash
npm run preview
```

## 🤗 Contributing

1. Fork this repo
2. Create a feature branch: `git checkout -b my-feature`
3. Make your changes
4. Commit: `git commit -m "Describe your change"`
5. Push: `git push origin my-feature`
6. Open a pull request

### Dev Best Practices

- Stick to TypeScript conventions
- Use functional components and hooks
- Ensure mobile responsiveness
- Handle errors gracefully
- Prioritize accessibility
- Keep code clean and well-documented
- Use React Router for navigation

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

## 🙌 Credits

- [Bootstrap](https://getbootstrap.com/)
- [React](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)

## 💬 Need Help?

Open an issue on GitHub or reach out to the maintainers for support.

---

**Explore, visualize, and master DSA! 🚀**
