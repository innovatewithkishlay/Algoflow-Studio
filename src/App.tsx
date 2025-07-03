import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  ClerkProvider,
  useUser,
  useClerk,
  ClerkLoaded,
} from '@clerk/clerk-react';

import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import WelcomePage from './components/pages/WelcomePage';
import DataStructuresPage from './pages/DataStructuresPage';
import AlgorithmsPage from './pages/AlgorithmsPage';
import DataStructureVisualizer from './pages/DataStructureVisualizer';	
import AlgorithmVisualizer from './pages/AlgorithmVisualizer';
import TimeComplexityPage from './pages/TimeComplexityPage';

import './styles/globals.css';
import './styles/components.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isSignedIn) {
      openSignIn({ redirectUrl: location.pathname });

      const timeout = setTimeout(() => {
        if (!isSignedIn) {
          navigate('/', { replace: true }); 
        }
      }, 1000); 

      return () => clearTimeout(timeout);
    }
  }, [isSignedIn, openSignIn, location, navigate]);

  return isSignedIn ? <>{children}</> : null;
};

const App: React.FC = () => {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ClerkLoaded>
        <ThemeProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<WelcomePage />} />

                <Route
                  path="/data-structures"
                  element={
                    <RequireAuth>
                      <DataStructuresPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/data-structures/:id"
                  element={
                    <RequireAuth>
                      <DataStructureVisualizer />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/algorithms"
                  element={
                    <RequireAuth>
                      <AlgorithmsPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/algorithms/:id"
                  element={
                    <RequireAuth>
                      <AlgorithmVisualizer />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/time-complexity"
                  element={
                    <RequireAuth>
                      <TimeComplexityPage />
                    </RequireAuth>
                  }
                />

                <Route path="*" element={<WelcomePage />} />
              </Routes>
            </Layout>
          </Router>
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
};

export default App;
