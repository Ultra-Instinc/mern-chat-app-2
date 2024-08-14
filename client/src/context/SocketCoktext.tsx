import { createContext, useContext, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { HOST } from "@/utils/constants";
//@ts-ignore
import { useAppStore } from "@/store/index";

const SocketContext = createContext(null);

export const useSocket = () => {
	return useContext(SocketContext);
};
export const SocketProvider = ({ children }: { children: JSX.Element[] }) => {
	const socket = useRef<any>(null);
	const {
		userInfo,
		selectedChatData,
		selectedChatType,
		addMessage,
		addChannelInChannelList,
		addContactsInDMContacts,
	} = useAppStore();
	useEffect(() => {
		if (userInfo) {
			socket.current = io(HOST, {
				withCredentials: true,
				query: {
					userId: userInfo.id,
				},
			});
			socket.current.on("connect", () => {
				console.log("Connected to socket server");
			});

			const handleRecieveMessages = (message: any) => {
				const { selectedChatData, selectedChatType } = useAppStore.getState();
				if (
					selectedChatType &&
					(selectedChatData._id === message.sender._id ||
						selectedChatData._id === message.recipient._id)
				) {
					addMessage(message);
				}
				addContactsInDMContacts(message);
			};
			const handleRecieveChannelMessage = (message: any) => {
				const { selectedChatData, selectedChatType, addMessage } =
					useAppStore.getState();
				if (
					selectedChatType !== undefined &&
					selectedChatData._id === message.channelId
				) {
					addMessage(message);
				}
				addChannelInChannelList(message);
			};
			socket.current.on("recieveMessage", handleRecieveMessages);
			socket.current.on("recieve-channel-message", handleRecieveChannelMessage);
			return () => socket.current.disconnect();
		}
	}, [userInfo]);
	return (
		<SocketContext.Provider value={socket.current}>
			{children}
		</SocketContext.Provider>
	);
};
