import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  AppBar,
  Toolbar,
  Typography,
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
    if (typeof globalThis.window !== 'undefined') {
      return (
        localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) &&
          globalThis.window.matchMedia('(prefers-color-scheme: dark)').matches)
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

  // Create MUI theme based on dark mode state - matching Anti app
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2563EB', // blue-600
      },
      secondary: {
        main: '#9333EA', // purple-600
      },
      background: {
        default: darkMode ? '#111827' : '#F9FAFB', // gray-900 / gray-50
        paper: darkMode ? '#1F2937' : '#FFFFFF', // gray-800 / white
      },
      text: {
        primary: darkMode ? '#F3F4F6' : '#111827', // gray-100 / gray-900
        secondary: darkMode ? '#9CA3AF' : '#4B5563', // gray-400 / gray-600
      },
      divider: darkMode ? '#374151' : '#E5E7EB', // gray-700 / gray-200
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
    },
    shape: {
      borderRadius: 12, // rounded-xl
    },
    shadows: [
      'none',
      '0 1px 2px 0 rgb(0 0 0 / 0.05)', // shadow-sm
      '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // shadow-md
      '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', // shadow-lg
      '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', // shadow-xl
      ...new Array(19).fill('none'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any,
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: '1px solid',
            borderColor: darkMode ? '#374151' : '#E5E7EB',
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 12,
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          contained: {
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            '&:hover': {
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid',
            borderColor: darkMode ? '#374151' : '#E5E7EB',
            boxShadow: 'none',
            color: darkMode ? '#F3F4F6' : '#111827',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* App Bar */}
        <AppBar position="sticky" elevation={0}>
          <Toolbar>
            {/* Logo instead of text */}
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                gap: 1.5,
              }}
              onClick={() => navigate('/')}
            >
              <img src={Logo} alt="FocusLoop" style={{ height: '32px', borderRadius: '8px' }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(to right, #2563EB, #9333EA)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                FocusLoop
              </Typography>
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

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 2,
            px: 2,
            mt: 'auto',
            textAlign: 'center',
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Latest Update: {__COMMIT_MESSAGE__}
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
            {new Date(__COMMIT_DATE__).toLocaleString()}
          </Typography>
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
