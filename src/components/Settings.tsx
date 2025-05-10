import React from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Languages } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const Settings: React.FC = () => {
	const { t, i18n } = useTranslation();
	const { theme, toggleTheme } = useTheme();

	const toggleLanguage = () => {
		const newLang = i18n.language === 'en' ? 'fa' : 'en';
		i18n.changeLanguage(newLang);
		document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr';
	};

	return (
		<div className="h-screen p-4 space-y-4">
			<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow dark:bg-gray-800">
				<div className="flex items-center space-x-3 rtl:space-x-reverse">
					{theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
					<span>{t('settings.theme')}</span>
				</div>
				<button onClick={toggleTheme} className="px-4 py-2 bg-gray-100 rounded-lg dark:bg-gray-700">
					{theme === 'dark' ? t('settings.darkMode') : t('settings.lightMode')}
				</button>
			</div>

			<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow dark:bg-gray-800">
				<div className="flex items-center space-x-3 rtl:space-x-reverse">
					<Languages className="w-5 h-5" />
					<span>{t('settings.language')}</span>
				</div>
				<button onClick={toggleLanguage} className="px-4 py-2 bg-gray-100 rounded-lg dark:bg-gray-700">
					{i18n.language === 'en' ? 'English' : 'فارسی'}
				</button>
			</div>
		</div>
	);
};

export default Settings;
