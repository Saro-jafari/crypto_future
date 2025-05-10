import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [theme, setTheme] = useState<Theme>(() => {
		const stored = localStorage.getItem('theme');
		return stored === 'light' || stored === 'dark' ? stored : 'dark';
	});

	// Prevent initial flash of unstyled content
	useEffect(() => {
		const root = window.document.documentElement;
		const storedTheme = localStorage.getItem('theme');
		if (storedTheme) {
			root.classList.add(storedTheme);
		} else {
			root.classList.add('dark'); // Default theme
		}
	}, []);

	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove('light', 'dark');
		root.classList.add(theme);
		localStorage.setItem('theme', theme);

		const metaThemeColor = document.querySelector('meta[name="theme-color"]');
		if (metaThemeColor) {
			metaThemeColor.setAttribute('content', theme === 'dark' ? '#111827' : '#ffffff');
		}
	}, [theme]);

	const toggleTheme = () => {
		setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
	};

	return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) throw new Error('useTheme must be used within a ThemeProvider');
	return context;
};
