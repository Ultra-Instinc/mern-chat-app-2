import Background from "@/assets/login2.png";
import Victory from "@/assets/victory.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
//@ts-ignore
import { useAppStore } from "./../../store/index";
export default function Auth() {
	const navigate = useNavigate();
	const { setUserInfo } = useAppStore();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const validateSignup = () => {
		if (!email.length) {
			toast.error("Email is required");
			return false;
		}
		if (!password) {
			toast.error("Password is required");
			return false;
		}
		if (password !== confirmPassword) {
			toast.error("Password and confirm password must be same");
			return false;
		}
		return true;
	};
	const validateLogin = () => {
		if (!email.length) {
			toast.error("Email is required");
			return false;
		}
		if (!password) {
			toast.error("Password is required");
			return false;
		}
		return true;
	};
	const handleLogin = async () => {
		if (validateLogin()) {
			try {
				const res = (
					await apiClient.post(
						LOGIN_ROUTE,
						{ email, password },
						{
							withCredentials: true,
						}
					)
				).data;
				if (res.user.id) {
					setUserInfo(res.user);
					if (res.user.profileSetup) {
						navigate("/chat");
					} else {
						navigate("/profile");
					}
				}
				toast.success("Login successful");
			} catch (error: any) {
				toast.error(error.message);
			}
		}
	};
	const handleSignup = async () => {
		if (validateSignup()) {
			try {
				const res = (
					await apiClient.post(
						SIGNUP_ROUTE,
						{ email, password },
						{
							withCredentials: true,
						}
					)
				).data;
				toast.success("Signup successful");
				setUserInfo(res.user);
				navigate("/profile");
			} catch (error: any) {
				toast.error(error.message);
			}
		}
	};
	return (
		<div className='h-[100vh] w-[100vw] flex items-center justify-center'>
			<div className='h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2'>
				<div className='flex flex-col gap-10 items-center justify-center'>
					<div className='flex items-center justify-center flex-col'>
						<div className='flex items-center justify-center'>
							<h1 className='text-5xl font-bold md:text-6xl'>Welcome</h1>
							<img
								src={Victory}
								alt='Victory Emoji'
								className='h-24'
							/>
						</div>
						<p className='font-medium text-center'>
							{" "}
							Fill in the details to get started with the best chat app!
						</p>
					</div>
					<div className='flex items-center justify-center w-full text-neutral-700'>
						<Tabs
							className='w-3/4'
							defaultValue='login'>
							<TabsList className='flex bg-transparent rounded-none w-full'>
								<TabsTrigger
									value='login'
									className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all'>
									Login
								</TabsTrigger>
								<TabsTrigger
									value='signup'
									className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all'>
									Signup
								</TabsTrigger>
							</TabsList>
							<TabsContent
								value='login'
								className='flex flex-col gap-5 mt-10'>
								<Input
									placeholder='Email'
									type='email'
									className='rounded-full p-4'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
								<Input
									placeholder='Password'
									type='password'
									className='rounded-full p-4'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<Button
									className={"rounded-full p-4"}
									onClick={handleLogin}>
									Login
								</Button>
							</TabsContent>
							<TabsContent
								value='signup'
								className='flex flex-col gap-5'>
								<Input
									placeholder='Email'
									type='email'
									className='rounded-full p-4'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
								<Input
									placeholder='Password'
									type='password'
									className='rounded-full p-4'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<Input
									placeholder='Confirm-Password'
									type='password'
									className='rounded-full p-4'
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
								<Button
									className='rounded-full p-4'
									onClick={handleSignup}>
									Sign Up
								</Button>
							</TabsContent>
						</Tabs>
					</div>
				</div>
				<div className='hidden xl:flex  justify-center items-center'>
					<img
						src={Background}
						alt='Background-Login'
						className=' w-[95%] object-cover'
					/>
				</div>
			</div>
		</div>
	);
}
