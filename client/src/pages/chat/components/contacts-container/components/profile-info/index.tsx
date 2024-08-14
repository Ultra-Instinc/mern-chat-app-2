import { Avatar } from "@/components/ui/avatar";
//@ts-ignore
import { useAppStore } from "./../../../../../../store/index";
import { getColor } from "@/lib/utils";
import { LOGOUR_ROUTE } from "@/utils/constants";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
export default function ProfileInfo() {
	const navigate = useNavigate();
	const { userInfo, setUserInfo } = useAppStore();
	const logout = async () => {
		try {
			const res = await apiClient.post(
				LOGOUR_ROUTE,
				{},
				{ withCredentials: true }
			);
			if (res.status === 200) {
				setUserInfo(null);
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className='absolute bottom-0 h-16 flex items-center justify-between px-10 bg-[#212b33] w-full overflow-hidden'>
			<div className='flex gap-3 items-center justify-center'>
				<div className='w-12 h-12 relative'>
					<Avatar className='h-12 w-12 rounded-full overflow-hidden'>
						<div
							className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
								userInfo.color
							)}`}>
							{userInfo.firstName
								? userInfo.firstName.split("").shift()
								: userInfo.email.split("").shift()}
						</div>
					</Avatar>
				</div>
				<div>
					{userInfo.firstName && userInfo.lastName
						? `${userInfo.firstName} ${userInfo.lastName}`
						: ""}
				</div>
			</div>
			<div className='flex gap-5'>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<FiEdit2
								className='text-purple-500 text-xl font-medium'
								onClick={() => navigate("/profile")}
							/>
						</TooltipTrigger>
						<TooltipContent className='bg-[#1c1b1e] border-none text-white'>
							<p>Edit Profile</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<IoPowerSharp
								className='text-red-500 text-xl font-medium'
								onClick={logout}
							/>
						</TooltipTrigger>
						<TooltipContent className='bg-[#1c1b1e] border-none text-white'>
							<p>Logout</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
}
