import { ChevronRightIcon } from "@heroicons/react/24/outline";

interface Props {
	children: React.ReactNode;
	name: string;
	setSelectedProject: (val: string | null) => void;
}
export default function ProjectLink({
	children,
	name,
	setSelectedProject,
}: Props) {
	const handleClick = () => {
		setSelectedProject(null);
		setTimeout(() => {
			setSelectedProject(name);
		}, 250);
	};
	return (
		<a
			onClick={handleClick}
			className='flex p-1 rounded cursor-pointer stroke-[0.75] hover:stroke-neutral-100 stroke-neutral-400 text-neutral-400 hover:text-neutral-100 place-items-center gap-3 hover:bg-neutral-700/30 transition-colors duration-100 overflow-hidden '>
			{children}
			<div className='flex  place-items-center justify-between w-full'>
				<p className='text-inherit truncate tracking-wide'>{name}</p>
				<ChevronRightIcon className='stroke-inherit stroke-[0.75] min-w-8 w-8' />
			</div>
		</a>
	);
}
