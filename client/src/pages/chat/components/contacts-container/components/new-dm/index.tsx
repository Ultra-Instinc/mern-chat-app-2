import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ChatBot from "@/assets/chatbot.svg";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { apiClient } from "@/lib/api-client";
import { SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
//@ts-ignore
import { useAppStore } from "./../../../../../../store/index";
type ContactsType = {
	_id: string;
	email: string;
	password: string;
	profileSetup: boolean;
	__v: number;
	color: number;
	firstName: string;
	lastName: string;
	image: string;
};
export default function NewDM() {
	const {
		setSelectedChatData,
		setSelectedChatType,
		selectedChatData,
		selectedChatType,
	} = useAppStore();
	const [openNewContactModel, setOpenNewContactModel] = useState(false);
	const [searchContacts, setSearchContacts] = useState<ContactsType[] | []>([]);
	const handleSearchContacts = async (searchTerm: string) => {
		try {
			const res = await apiClient.post(
				SEARCH_CONTACTS_ROUTE,
				{ searchTerm },
				{ withCredentials: true }
			);
			if (res.status === 200) {
				setSearchContacts(res.data.contacts);
			}
		} catch (error) {
			setSearchContacts([]);
		}
	};
	const selectNewContact = (contact: ContactsType) => {
		setOpenNewContactModel(false);
		setSelectedChatType("contact");
		setSelectedChatData(contact);
		setSearchContacts([]);
	};
	useEffect(() => {
		console.log({ type: selectedChatType, data: selectedChatData });
	}, [selectedChatData, selectedChatType]);
	return (
		<>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<FaPlus
							className='text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300'
							onClick={() => setOpenNewContactModel(true)}
						/>
					</TooltipTrigger>

					<TooltipContent className='bg-[#1c1b1a] border-none mb-2 p-3 text-white'>
						<p>Select New Contact</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<Dialog
				open={openNewContactModel}
				onOpenChange={setOpenNewContactModel}>
				<DialogContent
					aria-describedby='nothing'
					className='bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col'>
					<DialogHeader>
						<DialogTitle>Please Select Contact</DialogTitle>
					</DialogHeader>
					<div>
						<Input
							placeholder='Search Contacts'
							className='rounded-lg p-6 bg-[#2c2e3b] border-none'
							onChange={(e) => handleSearchContacts(e.target.value)}
						/>
					</div>
					{searchContacts.length <= 0 ? (
						<div className='flex-1 md:bg-[#1c1d25] flex flex-col justify-center items-center  duration-1000 transition-all'>
							<img
								src={ChatBot}
								alt='chat-bot'
								className='h-44'
							/>
							<div className='text-opacity-80  text-white flex flex-col gap-5 items-center text-md transition-all duration-300 text-center'>
								<h3 className='poppins-medium'>Search for contant</h3>
							</div>
						</div>
					) : (
						<ScrollArea className='h-[250px]'>
							<div className='flex flex-col gap-5'>
								{searchContacts.map((contact, ix) => (
									<div
										key={ix}
										onClick={() => selectNewContact(contact)}
										className='flex gap-3 items-center cursor-pointer hover:bg-white/10 p-2 rounded-lg'>
										<div className='w-12 h-12 relative'>
											<Avatar className='h-12 w-12 rounded-full overflow-hidden'>
												<div
													className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
														contact.color
													)}`}>
													{contact.firstName
														? contact.firstName.split("").shift()
														: contact.email.split("").shift()}
												</div>
											</Avatar>
										</div>
										<div className='flex flex-col'>
											<span>
												{contact.firstName && contact.lastName
													? `${contact.firstName} ${contact.lastName}`
													: `${contact.email}`}
											</span>
											<span className='text-xs'>{contact.email}</span>
										</div>
									</div>
								))}
							</div>
						</ScrollArea>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
