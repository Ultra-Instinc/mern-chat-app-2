import { useEffect, useRef, useState } from "react";
import moment from "moment";
//@ts-ignore
import { useAppStore } from "./../../../../../../store/index";
import { apiClient } from "@/lib/api-client";
import {
	GET_CHANNEL_MESSAGES_ROUTE,
	GET_MESSAGES,
	HOST,
} from "@/utils/constants";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";

export default function MessageContainer() {
	const {
		selectedChatType,
		selectedChatData,
		selectedChatMessages,
		setSelectedChatMessages,
		userInfo,
		setFileDownloadProgress,
		setIsDownloading,
	} = useAppStore();
	const [showImage, setShowImage] = useState<boolean>(false);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const checkImage = (filePath: string) => {
		const imageRegex =
			/\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
		return imageRegex.test(filePath);
	};
	useEffect(() => {
		const getMessages = async () => {
			try {
				const res = await apiClient.post(
					GET_MESSAGES,
					{ id: selectedChatData._id },
					{ withCredentials: true }
				);
				console.log({ res });
				if (res.data.messages) {
					setSelectedChatMessages(res.data.messages);
				}
			} catch (error) {
				console.log(error);
			}
		};
		const getChannelMessages = async () => {
			try {
				const res = await apiClient.get(
					`${GET_CHANNEL_MESSAGES_ROUTE}/${selectedChatData._id}`,
					{ withCredentials: true }
				);
				if (res.data && res.status === 200) {
					setSelectedChatMessages(res.data);
				}
			} catch (error) {
				console.log(error);
			}
		};
		if (selectedChatData._id) {
			if (selectedChatType === "contact") getMessages();
			else if (selectedChatType === "channel") getChannelMessages();
		}
	}, [selectedChatData, selectedChatType, setSelectedChatMessages]);
	useEffect(() => {
		if (scrollRef.current)
			scrollRef.current.scrollIntoView({ behavior: "smooth" });
	}, [selectedChatMessages]);

	const downloadFile = async (fileUrl: string) => {
		setIsDownloading(true);
		setFileDownloadProgress(0);
		const res = await apiClient.get(`${HOST}/${fileUrl}`, {
			responseType: "blob",
			onDownloadProgress: (ProgressEvent) => {
				const { loaded, total } = ProgressEvent;
				const percentCompleted = Math.round((loaded * 100) / total!);
				setFileDownloadProgress(percentCompleted);
			},
		});
		const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
		const link = document.createElement("a");
		link.href = urlBlob;
		link.setAttribute("download", fileUrl.split("/").pop()!);
		document.body.appendChild(link);
		link.click();
		link.remove();
		window.URL.revokeObjectURL(urlBlob);
		setIsDownloading(false);
		setFileDownloadProgress(0);
	};

	const RenderDMMessages = (message: any) => {
		return (
			<div
				className={`${
					message.sender === userInfo.id ? "text-right" : "text-left"
				}`}>
				{message.messageType === "text" && (
					<div
						className={`${
							message.sender === userInfo.id
								? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
								: "bg-[#2a2b33]/5 text-white/80 border-white/20"
						} border inline-block p-4 rounded my-1 max-w-[50%] break-words `}>
						{message.content}
					</div>
				)}
				{message.messageType === "file" && (
					<div
						className={`${
							message.sender === userInfo.id
								? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
								: "bg-[#2a2b33]/5 text-white/80 border-white/20"
						} border inline-block p-4 rounded my-1 max-w-[50%] break-words `}>
						{checkImage(message.fileUrl) ? (
							<div
								onClick={() => {
									setShowImage(true);
									setImageUrl(message.fileUrl);
								}}
								className='cursor-pointer'>
								<img
									src={`${HOST}/${message.fileUrl}`}
									alt=''
									height={300}
									width={300}
								/>
							</div>
						) : (
							<div className='flex items-center justify-center gap-5'>
								<span className='text-white/80 text-3xl bg-black/20 rounded-full p-3 '>
									<MdFolderZip />
								</span>
								<span>{message.fileUrl?.split("/").pop()}</span>
								<span
									onClick={() => downloadFile(message.fileUrl)}
									className='cursor-pointer bg-violet-500/10 hover:bg-white/20 p-2 rounded-full hover:text-white transition-colors duration-300'>
									<IoMdArrowRoundDown />
								</span>
							</div>
						)}
					</div>
				)}
				<div className='text-xs text-gray-600'>
					{moment(message.timestamp).format("LT")}
				</div>
			</div>
		);
	};

	const RenderChannelMessages = (message: any) => {
		return (
			<div
				className={`mt-5 ${
					message.sender._id !== userInfo.id ? "text-left" : "text-right"
				}`}>
				{message.messageType === "text" && (
					<div
						className={`${
							message.sender._id === userInfo.id
								? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
								: "bg-[#2a2b33]/5 text-white/80 border-white/20"
						} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
						{message.content}
					</div>
				)}
				{message.messageType === "file" && (
					<div
						className={`${
							message.sender._id === userInfo.id
								? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
								: "bg-[#2a2b33]/5 text-white/80 border-white/20"
						} border inline-block p-4 rounded my-1 max-w-[50%] break-words `}>
						{checkImage(message.fileUrl) ? (
							<div
								onClick={() => {
									setShowImage(true);
									setImageUrl(message.fileUrl);
								}}
								className='cursor-pointer'>
								<img
									src={`${HOST}/${message.fileUrl}`}
									alt=''
									height={300}
									width={300}
								/>
							</div>
						) : (
							<div className='flex items-center justify-center gap-5'>
								<span className='text-white/80 text-3xl bg-black/20 rounded-full p-3 '>
									<MdFolderZip />
								</span>
								<span>{message.fileUrl?.split("/").pop()}</span>
								<span
									onClick={() => downloadFile(message.fileUrl)}
									className='cursor-pointer bg-violet-500/10 hover:bg-white/20 p-2 rounded-full hover:text-white transition-colors duration-300'>
									<IoMdArrowRoundDown />
								</span>
							</div>
						)}
					</div>
				)}
				{message.sender._id !== userInfo.id ? (
					<div className='flex items-center justify-start gap-3'>
						<Avatar className='h-8 w-8 rounded-full overflow-hidden'>
							<div
								className={`uppercase h-8 w-8 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
									message.sender.color
								)}`}>
								{message.sender.firstName
									? message.sender.firstName.split("")[0]
									: message.sender.email.split()[0]}
							</div>
						</Avatar>
						<span className={`text-white/60 `}>
							{`${message.sender.firstName} ${message.sender.lastName}`}
						</span>
						<span className='text-xs text-white/60 '>
							{moment(message.timestamp).format("LT")}
						</span>
					</div>
				) : (
					<span className='text-xs block text-white/60 mt-1'>
						{moment(message.timestamp).format("LT")}
					</span>
				)}
			</div>
		);
	};
	console.log({ selectedChatMessages });
	const RenderMessages = () => {
		let lastDate: any = null;
		return selectedChatMessages.map((message: any, idx: number) => {
			const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
			const showDate = messageDate !== lastDate;
			lastDate = messageDate;
			return (
				<div key={idx}>
					{showDate && (
						<div className='text-center text-gray-500 my-2 '>
							{moment(message.timestamp).format("LL")}
						</div>
					)}
					{selectedChatType === "contact" && RenderDMMessages(message)}
					{selectedChatType === "channel" && RenderChannelMessages(message)}
				</div>
			);
		});
	};

	return (
		<div className='flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full'>
			<RenderMessages />
			<div ref={scrollRef} />
			{showImage && (
				<div className='fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg transition-all duration-300'>
					<div>
						<img
							src={`${HOST}/${imageUrl}`}
							alt='opened_content'
							className='w-full h-[70vh] bg-cover'
						/>
					</div>
					<div className='flex gap-5 fixed top-5 mt-5'>
						<button
							onClick={() => downloadFile(imageUrl!)}
							className='cursor-pointer bg-black/20 hover:bg-white/20 p-3 rounded-full text-2xl hover:text-white transition-colors duration-300 '>
							<IoMdArrowRoundDown />
						</button>
						<button
							onClick={() => {
								setShowImage(false);
								setImageUrl(null);
							}}
							className='cursor-pointer bg-black/20 hover:bg-white/20 p-3 rounded-full text-2xl hover:text-white transition-colors duration-300 '>
							<IoCloseSharp />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
