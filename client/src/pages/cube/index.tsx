export default function Cube() {
	return (
		<div className='h-screen w-screen bg-slate-700 text-white cube-parent grid place-content-center '>
			<div className='cube'>
				<div className='side front'></div>
				<div className='side back'></div>
				<div className='side top'></div>
				<div className='side bottom'></div>
				<div className='side left'></div>
				<div className='side right'></div>
			</div>
		</div>
	);
}
