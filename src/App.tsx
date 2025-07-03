import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react'; 
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import WelcomePage from './components/pages/WelcomePage';
import DataStructuresPage from './pages/DataStructuresPage';
import AlgorithmsPage from './pages/AlgorithmsPage';
import DataStructureVisualizer from './pages/DataStructureVisualizer';
import AlgorithmVisualizer from './pages/AlgorithmVisualizer';
import TimeComplexityPage from './pages/TimeComplexityPage';


// Import custom styles
import './styles/globals.css';
import './styles/components.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const App: React.FC = () => {
	return (
		<ClerkProvider publishableKey={clerkPubKey}>
			<ThemeProvider>
				<Router>
					<Layout>
						<Routes>
							{/* Home/Welcome Page */}
							<Route path="/" element={<WelcomePage />} />

							{/* Data Structures Routes */}
							<Route path="/data-structures" element={<DataStructuresPage />} />
							<Route path="/data-structures/:id" element={<DataStructureVisualizer />} />

							{/* Algorithms Routes */}
							<Route path="/algorithms" element={<AlgorithmsPage />} />
							<Route path="/algorithms/:id" element={<AlgorithmVisualizer />} />

							{/* Time Complexity Routes */}
							<Route path="/time-complexity" element={<TimeComplexityPage />} />

							{/* 404 Page - Redirect to home */}
							<Route path="*" element={<WelcomePage />} />
						</Routes>
					</Layout>
				</Router>
			</ThemeProvider>
		</ClerkProvider>
	);
};

export default App;
