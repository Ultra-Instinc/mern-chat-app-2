import ChatBot from "@/assets/chatbot.svg";
export default function EmptyChatContainer() {
	return (
		<div className='flex-1 md:bg-[#1c1d25] hidden md:flex flex-col justify-center items-center  duration-1000 transition-all'>
			<img
				src={ChatBot}
				alt='chat-bot'
			/>
			<div className='text-opacity-80  text-white flex flex-col gap-5 items-center lg:text-4xl text-3xl transition-all duration-300 text-center'>
				<h3 className='poppins-medium'>
					Hi <span className='text-purple-500'>!</span>Welcome to{" "}
					<span className='text-purple-500'>Syncronus</span> Chat App{" "}
					<span className='text-purple-500'>.</span>
				</h3>
			</div>
		</div>
	);
}
