interface IScorecardProps {
    name: string,
    score: number,
    lastAction: string,
	colorClass: string,
}

function Scorecard(props: IScorecardProps) {
	return (
		<>
			<div class={`flex aspect-square w-32 flex-col px-4 text-center md:w-48 md:px-8 ${props.colorClass}`}>		
				<div class='shrink-0 text-lg uppercase md:text-2xl'>{props.name}</div>
				<div class='w-full items-center justify-center rounded-lg border-2 border-current text-center text-4xl'>
					<span>{props.score.toString()}</span>
				</div>
				<div class='shrink-0 px-4 uppercase'>{props.lastAction}</div>
			</div>
		</>
	);
}

export default Scorecard;