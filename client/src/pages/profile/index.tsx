//@ts-ignore
import { IoArrowBack } from "react-icons/io5";
// @ts-ignore
import { useAppStore } from "./../../store/index";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
	ADD_PROFILE_IMAGE_ROUTE,
	REMOVE_PROFILE_IMAGE_ROUTE,
	UPDATE_PROFILE_ROUTE,
} from "@/utils/constants";
import { useNavigate } from "react-router-dom";

export default function Profile() {
	const navigate = useNavigate();
	const { userInfo, setUserInfo } = useAppStore();
	const [hover, setHover] = useState(false);
	const [image, setImage] = useState<any>(null);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [selectedColor, setSelectedColor] = useState(0);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const validateProfile = () => {
		if (!firstName) {
			toast.error("First Name is Required");
			return false;
		}
		if (!lastName) {
			toast.error("Last Name is Required");
			return false;
		}
		return true;
	};
	const saveChanges = async () => {
		if (validateProfile()) {
			try {
				const res = await apiClient.post(
					UPDATE_PROFILE_ROUTE,
					{
						firstName,
						lastName,
						color: selectedColor,
					},
					{
						withCredentials: true,
					}
				);
				if (res.status === 200 && res.data) {
					setUserInfo(res.data);
					toast.success("Profile Updated Successfully");
					navigate("/chat");
				}
			} catch (error) {}
		}
	};
	useEffect(() => {
		if (userInfo.profileSetup) {
			setFirstName(userInfo.firstName);
			setLastName(userInfo.lastName);
			setSelectedColor(userInfo.color);
		}
	}, [userInfo]);
	const handleNavigate = () => {
		if (userInfo.profileSetup) {
			navigate("/chat");
		} else {
			toast.error("Please Setup Profile");
		}
	};

	const handleFileInputClick = () => {
		fileInputRef.current?.click();
	};

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const formData = new FormData();
			formData.append("profile-image", file);
			const res = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
				withCredentials: true,
			});
			if (res.status === 200 && res.data.image) {
				setUserInfo({ ...userInfo, image: res.data.image });
				toast.success("Image Updated Successfully");
			}
			const reader = new FileReader();
			reader.onload = () => {
				setImage(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};
	const handleDeleteImage = async () => {
		try {
			const res = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
				withCredentials: true,
			});
			if (res.status === 200) {
				setUserInfo({ ...userInfo, image: null });
				toast.success("Image Deleted Successfully");
				setImage(null);
			}
		} catch (error) {}
	};

	return (
		<div className='bg-[#1b1c24] h-[100vh] flex flex-col justify-center items-center gap-10'>
			<div className='flex flex-col gap-10 w-[80vw] md:w-max'>
				<div onClick={handleNavigate}>
					<IoArrowBack className='text-4xl lg:text-6xl text-white/90 cursor-pointer' />
				</div>
				<div className='grid grid-cols-2 '>
					<div
						onMouseEnter={() => setHover(true)}
						onMouseLeave={() => setHover(false)}
						className='h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center overflow-hidden'>
						<Avatar className='h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden'>
							{image ? (
								<AvatarImage
									src={image}
									alt='profile'
									className='object-cover w-full h-full bg-black'
								/>
							) : (
								<div
									className={`uppercase h-32 w-32 md:h-48 md:w-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
										selectedColor
									)}`}>
									{firstName
										? firstName.split("").shift()
										: userInfo.email.split("").shift()}
								</div>
							)}

							{hover && (
								<div
									onClick={image ? handleDeleteImage : handleFileInputClick}
									className='absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer'>
									{image ? (
										<FaTrash className='text-white text-3xl cursor-pointer' />
									) : (
										<FaPlus className='text-white text-3xl cursor-pointer' />
									)}
								</div>
							)}
						</Avatar>
						<input
							type='file'
							ref={fileInputRef}
							className='hidden'
							onChange={handleImageChange}
							name='profile-image'
							accept='.png, .jpg, .jpeg, .svg, .webp'
						/>
					</div>
					<div className='flex min-w-32 md:min-w-64 flex-col text-white items-center justify-center gap-5'>
						<div className='w-full'>
							<Input
								placeholder='Email'
								type='email'
								disabled
								value={userInfo.email}
								className='rounded-lg p-6 bg-[#2c2e3b] border-none'
							/>
						</div>
						<div className='w-full'>
							<Input
								placeholder='First Name'
								type='text'
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								className='rounded-lg p-6 bg-[#2c2e3b] border-none'
							/>
						</div>
						<div className='w-full'>
							<Input
								placeholder='Last Name'
								type='text'
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								className='rounded-lg p-6 bg-[#2c2e3b] border-none'
							/>
						</div>
						<div className='w-full flex gap-5 '>
							{colors.map((color, index) => (
								<div
									onClick={() => setSelectedColor(index)}
									key={index}
									className={`h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${color}
									${selectedColor === index ? "ring ring-white/50" : ""}
									`}></div>
							))}
						</div>
					</div>
				</div>
				<div className='w-full'>
					<Button
						onClick={saveChanges}
						className='h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300'>
						Save Changes
					</Button>
				</div>
			</div>
		</div>
	);
}
