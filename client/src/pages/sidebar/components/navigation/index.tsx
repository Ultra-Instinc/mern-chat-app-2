import { motion, useAnimationControls, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import NavigationLink from "../navigation-link";
import {
	ChartBarIcon,
	ChartPieIcon,
	ClipboardDocumentCheckIcon,
	Square2StackIcon,
	UsersIcon,
} from "@heroicons/react/24/outline";
import ProjectLink from "../project";
import ProjectNavigation from "@/pages/project-navigation";

const containerVariants = {
	close: {
		width: "5rem",
		transition: {
			type: "spring",
			damping: 15,
			duration: 0.5,
		},
	},
	open: {
		width: "16rem",
		transition: {
			type: "spring",
			damping: 15,
			duration: 0.5,
		},
	},
};

const svgVariants = {
	close: {
		rotate: 360,
	},
	open: {
		rotate: 180,
	},
};

const projectList = [
	{
		id: 1,
		name: "Virtual Reality",
		className:
			"min-w-4 mx-2 border-pink-600 border rounded-full aspect-square bg-pink-700",
	},
	{
		id: 2,
		name: "Apple Vision Pro",
		className:
			"min-w-4 mx-2 border-indigo-600 border rounded-full aspect-square bg-indigo-700",
	},
	{
		id: 3,
		name: "Porche",
		className:
			"min-w-4 mx-2 border-cyan-600 border rounded-full aspect-square bg-cyan-700",
	},
	{
		id: 4,
		name: "Secret Project",
		className:
			"min-w-4 mx-2 border-yellow-600 border rounded-full aspect-square bg-yellow-700",
	},
];

const navList = [
	{
		id: 1,
		name: "Dashboard",
		icon: <ChartBarIcon className='stroke-inherit stroke-[0.75] min-w-8 w-8' />,
	},
	{
		id: 2,
		name: "Project",
		icon: <ChartPieIcon className='stroke-inherit stroke-[0.75] min-w-8 w-8' />,
	},
	{
		id: 3,
		name: "Tasks",
		icon: (
			<ClipboardDocumentCheckIcon className='stroke-inherit stroke-[0.75] min-w-8 w-8' />
		),
	},
	{
		id: 4,
		name: "Reporting",
		icon: (
			<Square2StackIcon className='stroke-inherit stroke-[0.75] min-w-8 w-8' />
		),
	},
	{
		id: 5,
		name: "Users",
		icon: <UsersIcon className='stroke-inherit stroke-[0.75] min-w-8 w-8' />,
	},
];

export default function Navigation() {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedProject, setselectedProject] = useState<string | null>(null);
	const containerControls = useAnimationControls();
	const svgControls = useAnimationControls();

	useEffect(() => {
		if (isOpen) {
			containerControls.start("open");
			svgControls.start("open");
		} else {
			containerControls.start("close");
			svgControls.start("close");
		}
	}, [isOpen]);

	const handleOpenClose = () => {
		setIsOpen((p) => !p);
		setselectedProject(null);
	};

	return (
		<>
			<motion.nav
				variants={containerVariants}
				initial='close'
				animate={containerControls}
				className='bg-neutral-900 flex flex-col z-10 gap-20 p-5 absolute top-0 left-0 h-full shadow shadow-neutral-600'>
				<div className='flex flex-row w-full justify-between place-items-center'>
					<div className='w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-700 rounded-full' />
					<button
						className='p-1 rounded-full flex'
						onClick={handleOpenClose}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='size-8 stroke-neutral-300'>
							<motion.path
								variants={svgVariants}
								animate={svgControls}
								transition={{
									duration: 0.5,
									ease: "easeInOut",
								}}
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3'
							/>
						</svg>
					</button>
				</div>
				<div className='flex flex-col gap-3'>
					{navList.map((nav) => (
						<NavigationLink
							key={nav.id}
							name={nav.name}>
							{nav.icon}
						</NavigationLink>
					))}
				</div>
				<div className='flex flex-col gap-3'>
					{projectList.map((project) => (
						<ProjectLink
							key={project.id}
							name={project.name}
							setSelectedProject={setselectedProject}>
							<div className={project.className} />
						</ProjectLink>
					))}
				</div>
			</motion.nav>
			<AnimatePresence>
				{selectedProject && (
					<ProjectNavigation
						isOpen={isOpen}
						selectedProject={selectedProject}
						setSelectedProject={setselectedProject}
					/>
				)}
			</AnimatePresence>
		</>
	);
}
