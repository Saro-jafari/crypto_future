import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './i18n';
import './index.css';
import { ThemeProvider } from './hooks/useTheme.tsx';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5000,
			refetchInterval: 8000,
		},
	},
});

createRoot(document.getElementById('root')!).render(
	<QueryClientProvider client={queryClient}>
		<ThemeProvider>
			<App />
		</ThemeProvider>
	</QueryClientProvider>,
);
