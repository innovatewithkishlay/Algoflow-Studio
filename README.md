# DSA Visualizer

A modern, interactive web application for learning Data Structures and Algorithms through visualizations. Built with React, TypeScript, and Bootstrap 5.3.

## 🚀 Features

- **Interactive Visualizations**: Step-by-step animations for algorithms and data structures
- **Dark/Light Theme**: Toggle between themes with persistent preferences
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Comprehensive Coverage**: From basic arrays to advanced graph algorithms
- **Educational Focus**: Designed specifically for learning and understanding DSA concepts
- **Modern Routing**: Clean URL structure with React Router

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0 with TypeScript
- **Routing**: React Router DOM
- **Styling**: Bootstrap 5.3.7 with custom CSS
- **Icons**: Bootstrap Icons
- **Build Tool**: Vite
- **Package Manager**: npm

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dsa-visualizer.git
cd dsa-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
dsa-visualizer/
├── src/
│   ├── components/
│   │   ├── algorithms/          # Algorithm visualizers
│   │   ├── data-structures/     # Data structure visualizers
│   │   ├── layout/              # Layout components (Navbar)
│   │   ├── pages/               # Page components (Welcome)
│   │   └── ui/                  # Reusable UI components
│   ├── pages/                   # Route pages
│   ├── config/                  # Configuration files
│   ├── contexts/                # React contexts (Theme)
│   ├── hooks/                   # Custom React hooks
│   ├── styles/                  # CSS files
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Utility functions
├── public/                      # Static assets
└── package.json
```

## 🎯 Available Visualizations

### Data Structures
- ✅ **Arrays** - Basic array operations and properties
- 🔄 **Linked Lists** - Coming soon
- 🔄 **Stacks** - Coming soon
- 🔄 **Queues** - Coming soon
- 🔄 **Trees** - Coming soon
- 🔄 **Graphs** - Coming soon

### Algorithms
- ✅ **Linear Search** - Sequential search algorithm
- 🔄 **Binary Search** - Coming soon
- 🔄 **Bubble Sort** - Coming soon
- 🔄 **Merge Sort** - Coming soon
- 🔄 **Quick Sort** - Coming soon
- 🔄 **DFS** - Coming soon
- 🔄 **BFS** - Coming soon

## 🧭 Navigation Structure

The application uses React Router with the following routes:

- `/` - Welcome/Home page
- `/data-structures` - Data structures overview page
- `/data-structures/:id` - Individual data structure visualizer
- `/algorithms` - Algorithms overview page
- `/algorithms/:id` - Individual algorithm visualizer

### Navigation Features

- **Navbar Dropdowns**: Easy access to all data structures and algorithms
- **Breadcrumb Navigation**: Clear indication of current location
- **Responsive Design**: Mobile-friendly navigation
- **Theme Toggle**: Accessible from the navbar

## 🎨 Customization

### Adding New Visualizations

1. Create a new component in the appropriate directory:
   - `src/components/algorithms/` for algorithms
   - `src/components/data-structures/` for data structures

2. Add the component to the configuration:
   - `src/config/algorithms.ts` for algorithms
   - `src/config/dataStructures.ts` for data structures

3. The routing will automatically work with the new components.

### Styling

The application uses Bootstrap 5.3 with custom CSS variables. You can customize the appearance by modifying:
- `src/styles/globals.css` - Global styles and custom utilities
- Bootstrap theme variables in the CSS file

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Maintain responsive design
- Add proper error handling
- Include accessibility features
- Write clean, documented code
- Use React Router for navigation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Bootstrap](https://getbootstrap.com/) for the UI framework
- [React](https://reactjs.org/) for the frontend library
- [React Router](https://reactrouter.com/) for routing
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Vite](https://vitejs.dev/) for the build tool

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**Happy Learning! 🎓**
