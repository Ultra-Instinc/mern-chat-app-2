import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
//@ts-ignore
import { useAppStore } from "@/store/index";
import { useSocket } from "@/context/SocketCoktext";
import { apiClient } from "@/lib/api-client";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";

export default function MessageBar() {
	const {
		selectedChatType,
		selectedChatData,
		userInfo,
		setIsUploading,
		setFileUploadProgress,
	} = useAppStore();
	const socket: any = useSocket();
	const emojiRef = useRef<HTMLDivElement | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		function handleClickOutsideEvent(e: any) {
			if (emojiRef.current && !emojiRef.current.contains(e.target)) {
				setEmojiPickerOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutsideEvent);

		return () =>
			document.removeEventListener("mousedown", handleClickOutsideEvent);
	}, [emojiRef, emojiPickerOpen]);

	const handleAddEmoji = (emoji: any) => {
		setMessage((prev) => prev + emoji.emoji);
	};
	const handleSendMessage = async () => {
		console.log(userInfo);
		if (selectedChatType === "contact") {
			socket?.emit("sendMessage", {
				sender: userInfo.id,
				content: message,
				recipient: selectedChatData._id,
				messageType: "text",
				fileUrl: undefined,
			});
		} else if (selectedChatType === "channel") {
			socket.emit("send-channel-message", {
				sender: userInfo.id,
				content: message,
				messageType: "text",
				fileUrl: undefined,
				channelId: selectedChatData._id,
			});
		}
		setMessage("");
	};

	const handleAttachmentClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};
	const handleAttachmentChange = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		try {
			//@ts-ignore
			const file = e.target.files[0];
			console.log({ file });
			if (file) {
				const formData = new FormData();
				formData.append("file", file);
				setIsUploading(true);
				const res = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
					withCredentials: true,
					onUploadProgress: (data) => {
						setFileUploadProgress(
							Math.round((100 * data.loaded) / data.total!)
						);
					},
				});
				if (res.status === 200 && res.data) {
					setIsUploading(false);
					if (selectedChatType === "contact") {
						socket?.emit("sendMessage", {
							sender: userInfo.id,
							content: undefined,
							recipient: selectedChatData._id,
							messageType: "file",
							fileUrl: res.data.filePath,
						});
					} else if (selectedChatType === "channel") {
						socket.emit("send-channel-message", {
							sender: userInfo.id,
							content: undefined,
							messageType: "file",
							fileUrl: res.data.filePath,
							channelId: selectedChatData._id,
						});
					}
				}
			}
		} catch (error) {
			console.log(error);
			setIsUploading(false);
		}
	};

	return (
		<div className='h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-5 gap-6'>
			<div className='flex-1 flex bg-[#282b33] rounded-md items-center gap-5 pr-5 '>
				<input
					type='text'
					className='flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none'
					placeholder='Enter Message...'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<button
					className='text-neutral-500 focus:border-none focus:outline-none focus:text-white transition-all duration-300'
					onClick={handleAttachmentClick}>
					<GrAttachment className='text-2xl' />
				</button>
				<input
					ref={fileInputRef}
					type='file'
					className='hidden'
					onChange={(e) => handleAttachmentChange(e)}
				/>
				<div className='relative'>
					<button
						onClick={() => setEmojiPickerOpen(true)}
						className='text-neutral-500 focus:border-none focus:outline-none focus:text-white transition-all duration-300'>
						<RiEmojiStickerLine className='text-2xl' />
					</button>
					{emojiPickerOpen && (
						<div
							ref={emojiRef}
							className='absolute bottom-16 right-0'>
							<EmojiPicker
								onEmojiClick={handleAddEmoji}
								autoFocusSearch={false}
								// open={false}
							/>
						</div>
					)}
				</div>
			</div>
			<button
				onClick={handleSendMessage}
				className='bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white transition-all duration-300'>
				<IoSend className='text-2xl' />
			</button>
		</div>
	);
}
