import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { apiClient } from "@/lib/api-client";
import {
	CREATE_CHANNEL_ROUTE,
	GET_ALL_CONTACTS_ROUTE,
} from "@/utils/constants";
//@ts-ignore
import { useAppStore } from "./../../../../../../store/index";
import { Button } from "@/components/ui/button";
//@ts-ignore
import MultipleSelector from "./../../../../../../components/ui/multiSelect";
// type ContactsType = {
// 	_id: string;
// 	email: string;
// 	password: string;
// 	profileSetup: boolean;
// 	__v: number;
// 	color: number;
// 	firstName: string;
// 	lastName: string;
// 	image: string;
// };
export default function CreateChannel() {
	const { addChannel } = useAppStore();
	const [newChannelModel, setNewChannelModel] = useState(false);
	const [allContacts, setAllContacts] = useState([]);
	const [selectedContacts, setSelectedContacts] = useState([]);
	const [channelName, setChannelName] = useState("");

	useEffect(() => {
		const getData = async () => {
			try {
				const res = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {
					withCredentials: true,
				});
				setAllContacts(res.data.contacts);
			} catch (error) {
				setAllContacts([]);
			}
		};
		getData();
	}, []);

	const handleCreateChannel = async () => {
		console.log({
			name,
			members: selectedContacts.map((cont: any) => cont.value),
		});
		try {
			if (channelName.length >= 0 && selectedContacts.length > 0) {
				const res = await apiClient.post(
					CREATE_CHANNEL_ROUTE,
					{
						name: channelName,
						members: selectedContacts.map((cont: any) => cont.value),
					},
					{ withCredentials: true }
				);
				if (res.status === 201) {
					setChannelName("");
					setSelectedContacts([]);
					setNewChannelModel(false);
					addChannel(res.data.channel);
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<FaPlus
							className='text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300'
							onClick={() => setNewChannelModel(true)}
						/>
					</TooltipTrigger>

					<TooltipContent className='bg-[#1c1b1a] border-none mb-2 p-3 text-white'>
						<p>Create new channel</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<Dialog
				open={newChannelModel}
				onOpenChange={setNewChannelModel}>
				<DialogContent
					aria-describedby='nothing'
					className='bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col'>
					<DialogHeader>
						<DialogTitle>
							Please fill up the details for new channel
						</DialogTitle>
					</DialogHeader>
					<div>
						<Input
							placeholder='Channel name'
							className='rounded-lg p-6 bg-[#2c2e3b] border-none'
							onChange={(e) => setChannelName(e.target.value)}
							value={channelName}
						/>
					</div>
					<div>
						<MultipleSelector
							className='rounded-lg bg-[#2c2e3b] border-none py-2 text-white flex-wrap'
							defaultOptions={allContacts}
							placeholder='Search Contacts'
							value={selectedContacts}
							onChange={setSelectedContacts}
							emptyIndicator={
								<p className='text-center text-lg leading-10 text-gray-600'>
									No results found
								</p>
							}
						/>
					</div>
					<div>
						<Button
							className='w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300'
							onClick={handleCreateChannel}>
							Create Channel
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
