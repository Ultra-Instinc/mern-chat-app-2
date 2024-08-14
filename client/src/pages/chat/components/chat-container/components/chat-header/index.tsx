import { RiCloseFill } from "react-icons/ri";
//@ts-ignore
import { useAppStore } from "./../../../../../../store/index";
import { Avatar } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";

export default function ChatHeader() {
	const { closeChat, selectedChatData, selectedChatType } = useAppStore();
	return (
		<div className='h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20'>
			<div className='flex gap-5 items-center justify-start w-full'>
				<div className='flex gap-3 items-center justify-center '>
					{selectedChatType === "contact" && (
						<Avatar className='h-12 w-12 rounded-full overflow-hidden'>
							<div
								className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
									selectedChatData?.color
								)}`}>
								{selectedChatData?.firstName
									? selectedChatData?.firstName.split("").shift()
									: selectedChatData?.email.split("").shift()}
							</div>
						</Avatar>
					)}
					{selectedChatType === "channel" && (
						<Avatar className='h-12 w-12 rounded-full overflow-hidden'>
							<div
								className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full `}>
								#
							</div>
						</Avatar>
					)}
				</div>
				{selectedChatType === "contact" &&
					(selectedChatData.firstName && selectedChatData.lastName
						? `${selectedChatData.firstName} ${selectedChatData.lastName}`
						: `${selectedChatData.email}`)}
				{selectedChatType === "channel" && selectedChatData.name}
			</div>
			<div className='flex items-center justify-center gap-5'>
				<button
					onClick={closeChat}
					className='text-neutral-500 focus:border-none focus:outline-none focus:text-white transition-all duration-300'>
					<RiCloseFill className='text-3xl' />
				</button>
			</div>
		</div>
	);
}
