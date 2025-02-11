import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { User } from '../global.types';
import { SignUpFormData } from '../pages/SignUpPage';
import { LoginFormData } from '../pages/LoginPage';
import { io, Socket } from 'socket.io-client';

interface AuthState {
	authUser: User | null;
	appName: string;
	isCheckingAuth: boolean;
	isSigningUp: boolean;
	isLoggingIn: boolean;
	isUpdatingProfile: boolean;
	onlineUsers: string[];
	socket: null | Socket;
	checkAuth: () => Promise<void>;
	signup: (input: SignUpFormData) => Promise<void>;
	logout: () => Promise<void>;
	login: (input: LoginFormData) => Promise<void>;
	updateProfile: (profilePic: string) => Promise<void>;
	connectSocket: () => void;
	disconnectSocket: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
	authUser: null,
	isCheckingAuth: true,
	isSigningUp: false,
	isLoggingIn: false,
	isUpdatingProfile: false,
	appName: 'Chattify',
	onlineUsers: [],
	socket: null,

	checkAuth: async () => {
		try {
			const res = await axiosInstance.get('/auth/check-auth');
			set({ authUser: res.data?.data });
			get().connectSocket();
		} catch (error) {
			get().disconnectSocket();
			throw error;
		} finally {
			set({ isCheckingAuth: false });
		}
	},

	signup: async (input: SignUpFormData) => {
		try {
			set({ isSigningUp: true });

			const res = await axiosInstance.post('/users/user', input);

			set({ authUser: res.data?.data });

			get().connectSocket();
		} catch (error) {
			throw error;
		} finally {
			set({ isSigningUp: false });
		}
	},

	logout: async () => {
		try {
			await axiosInstance.post('/auth/logout');

			set({ authUser: null });

			get().disconnectSocket();
		} catch (error) {
			throw error;
		}
	},

	login: async (input: LoginFormData) => {
		try {
			set({ isLoggingIn: true });

			const response = await axiosInstance.post('/auth/login', input);

			set({ authUser: response.data?.data });

			get().connectSocket();
		} catch (error) {
			set({ authUser: null });
			throw error;
		} finally {
			set({ isLoggingIn: false });
		}
	},

	updateProfile: async (profilePic: string) => {
		try {
			set({ isUpdatingProfile: true });

			const response = await axiosInstance.patch('/users/user/update-profile', {
				profilePic,
			});

			set({ authUser: response.data?.data });
		} catch (error) {
			throw error;
		} finally {
			set({ isUpdatingProfile: false });
		}
	},

	connectSocket: () => {
		const { authUser } = get();
		//const { socket: connectedSocket } = get();
	    if (!authUser) return;
		const socket = io(import.meta.env.VITE_SOCKET_BASE_URL, {
			query: {
				userId: authUser._id,
				name: authUser.firstName,
			},
		});
		set({ socket: socket });

		socket.on('getOnlineUsers', (userIds) => {
			set({ onlineUsers: userIds });
		});
	},
	disconnectSocket: () => {
		const { socket } = get();
		if (socket) {
			socket.disconnect();
		}
	},
}));
