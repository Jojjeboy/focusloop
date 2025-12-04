import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  AppBar,
  Toolbar,
} from '@mui/material';
import { TimerProvider, AuthProvider, NoteProvider } from './core/context';
import { TimersPage } from './features/timers';
import { SettingsPage } from './features/settings';
import { NotesPage } from './features/notes';

import { ProtectedRoute, ProfileMenu } from './core/components';
import Logo from './assets/logo.png';

// Layout component that contains AppBar and navigation
const AppLayout = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Create MUI theme based on dark mode state
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#9333EA', // Updated to match new design
      },
      secondary: {
        main: '#EC4899', // Updated to match new design
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* App Bar */}
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar>
            {/* Logo instead of text */}
            <Box
              sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              <img src={Logo} alt="FocusLoop" style={{ height: '48px' }} />
            </Box>

            <ProfileMenu darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/timers" replace />} />
            <Route path="/timers" element={<TimersPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

// Inner App component to access AuthContext
const AuthenticatedApp = () => {
  return (
    <TimerProvider>
      <NoteProvider>
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      </NoteProvider>
    </TimerProvider>
  );
};

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
