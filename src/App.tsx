import { useState, useEffect } from 'react';
import { Button, Container, Typography, Paper, Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function App() {
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

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
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">
                <Container maxWidth="sm">
                    <Paper elevation={3} className="p-8 text-center dark:bg-gray-800">
                        <Typography variant="h3" component="h1" gutterBottom className="text-gray-800 dark:text-white font-bold">
                            Focus Loop
                        </Typography>
                        <Typography variant="h6" component="p" gutterBottom className="text-gray-600 dark:text-gray-300 mb-6">
                            Pomodoro Timer Application
                        </Typography>

                        <Box className="flex justify-center items-center gap-4">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={toggleDarkMode}
                                startIcon={darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                                className="capitalize"
                            >
                                {darkMode ? 'Light Mode' : 'Dark Mode'}
                            </Button>
                        </Box>

                        <Box className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                            <Typography variant="body1" className="text-blue-800 dark:text-blue-200">
                                Tailwind CSS & Material UI are working!
                            </Typography>
                        </Box>
                    </Paper>
                </Container>
            </div>
        </ThemeProvider>
    );
}

export default App;
