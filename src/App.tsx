import Navbar from './components/Navbar';
import { Routes, Route, Navigate } from 'react-router';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { useEffect } from 'react';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoutes from './components/auth/ProtectedRoutes';
import GuestRoutes from './components/auth/GuestRoutes';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import { Toaster } from 'react-hot-toast';

const App = () => {
	const { checkAuth } = useAuthStore();
	const { theme } = useThemeStore();

	useEffect(() => {

		checkAuth()
	}, [checkAuth]);
	return (
		<div data-theme={theme}>
			<Navbar />
			<Routes>
				<Route element={<GuestRoutes />}>
					<Route path='/login' element={<LoginPage />} />
					<Route path='/signup' element={<SignUpPage />} />
				</Route>

				<Route element={<ProtectedRoutes />}>
					<Route path='/' element={<HomePage />} />
					<Route path='/profile' element={<ProfilePage />} />
				</Route>

				<Route path='/settings' element={<SettingsPage />}></Route>

				<Route path='*' element={<Navigate to='/' replace />} />
			</Routes>
			<Toaster />
		</div>
	);
};

export default App;
