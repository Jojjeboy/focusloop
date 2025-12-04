import { useState, useEffect } from 'react';
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HomeIcon from '@mui/icons-material/Home';
import TimerIcon from '@mui/icons-material/Timer';
import SettingsIcon from '@mui/icons-material/Settings';
import { TimerProvider } from './core/context/TimerProvider';
import { HomePage } from './features/home';
import { TimersPage } from './features/timers';
import { SettingsPage } from './features/settings';

type Page = 'home' | 'timers' | 'settings';

function App() {
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

  const [currentPage, setCurrentPage] = useState<Page>('timers');
  const [drawerOpen, setDrawerOpen] = useState(false);

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
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  });

  const menuItems = [
    { id: 'home' as Page, label: 'Home', icon: <HomeIcon /> },
    { id: 'timers' as Page, label: 'Timers', icon: <TimerIcon /> },
    { id: 'settings' as Page, label: 'Settings', icon: <SettingsIcon /> },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'timers':
        return <TimersPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <TimersPage />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TimerProvider>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* App Bar */}
          <AppBar position="static" elevation={2}>
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                FocusLoop
              </Typography>
              <IconButton color="inherit" onClick={toggleDarkMode}>
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Toolbar>
          </AppBar>

          {/* Navigation Drawer */}
          <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={() => setDrawerOpen(false)}
              onKeyDown={() => setDrawerOpen(false)}
            >
              <List>
                {menuItems.map((item) => (
                  <ListItem key={item.id} disablePadding>
                    <ListItemButton
                      selected={currentPage === item.id}
                      onClick={() => setCurrentPage(item.id)}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>

          {/* Main Content */}
          <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
            {renderPage()}
          </Box>
        </Box>
      </TimerProvider>
    </ThemeProvider>
  );
}

export default App;
