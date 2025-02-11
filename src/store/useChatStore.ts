import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { User, Message } from '../global.types';
import { useAuthStore } from './useAuthStore';

interface ChatState {
	messages: Message[];
	users: User[];
	selectedUser: User | null;
	isUsersLoading: boolean;
	isMessagesLoading: boolean;
	getUsers: () => Promise<void>;
	getMessages: (userId: string) => Promise<void>;
	setSelectedUser: (selectedUser: User | null) => void;
	sendMessage: (messageData: unknown) => Promise<void>;
	subscribeToMessages: () => void;
	unsubscribeFromMessages: () => void;
}

export const useChatStore = create<ChatState>()((set, get) => ({
	messages: [],
	users: [],
	selectedUser: null,
	isUsersLoading: false,
	isMessagesLoading: false,
	socket: null,

	getUsers: async () => {
		set({ isUsersLoading: true });

		try {
			const response = await axiosInstance.get('/users/all');

			set({ users: response.data?.data });
		} catch (error) {
			throw error;
		} finally {
			set({ isUsersLoading: false });
		}
	},

	getMessages: async (userId) => {
		set({ isMessagesLoading: true });

		try {
			const response = await axiosInstance.get(`/messages/all/${userId}`);

			set({ messages: response.data?.data });
		} catch (error) {
			throw error;
		} finally {
			set({ isMessagesLoading: false });
		}
	},

	sendMessage: async (messageData) => {
		try {
			const { selectedUser, messages } = get();

			const userId = selectedUser?._id;

			const response = await axiosInstance.post(
				`/messages/send/${userId}`,
				messageData
			);

			set({ messages: [...messages, response?.data?.data] });
		} catch (error) {
			throw error;
		}
	},

	subscribeToMessages: () => {
		const { selectedUser } = get();
		//const { messages: existingMessages } = get();
		const socket = useAuthStore.getState().socket;

		if (!selectedUser) return;

		if (socket) {
			socket.on('newMessage', (newMessage: Message) => {
				if (selectedUser._id === newMessage.senderId) {
					set({
						messages: [...get().messages, newMessage],
					});
				}
			});
		}
	},

	unsubscribeFromMessages: () => {
		const socket = useAuthStore.getState().socket;
		socket?.off('newMessage');
	},

	setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
