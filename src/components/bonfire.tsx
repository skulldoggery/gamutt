import { For, batch, createSignal } from 'solid-js';
import { recurrent } from 'brain.js';

const choiceOptions = { 1: 'Bone', 2: 'Fire', 3: 'Ash' };
const trainingData = [0, 0.5, 1];
const rules = {
	1: 3, // Bone scatters Ash
	2: 1, // Fire cremates Bone
	3: 2, // Ash smothers Fire
};
const [playerChoices, setPlayerChoices] = createSignal<number[]>([]);
const [gamuttChoices, setGamuttChoices] = createSignal<number[]>([]);
const [playerScore, setPlayerScore] = createSignal(0);
const [gamuttScore, setGamuttScore] = createSignal(0);

function CalculateOutcome(pChoice, gChoice) {

	console.debug('Player: ' + pChoice + ', GAMUTT: ' + gChoice);

	if (!pChoice || !gChoice) return;

	if (pChoice == gChoice) {
		console.debug('It\'s a draw.');
		return 'DRAW';
	}

	if (pChoice == rules[gChoice]) {
		console.log('GAMUTT wins');
		console.debug('Gamutt\'s current score is ' + gamuttScore());
		setGamuttScore(gamuttScore()+1);
		return 'GAMUTT';
	} else {
		console.log('Player wins');
		console.debug('Player\'s current score is ' + playerScore());
		setPlayerScore(playerScore()+1);
		return 'PLAYER';
	}
}
function PlayerInput() {
	/* createEffect(() => {
	
		const pChoice = playerChoices()[playerChoices().length - 1];
		const gChoice = gamuttChoices()[gamuttChoices().length - 1];
		setOutcome(CalculateOutcome(pChoice, gChoice));
	}); */

	const startMatch = (choice) => {
		batch( () => {
			console.debug('GAMUTT is thinking...');
			
			const gamutt = new recurrent.LSTMTimeStep({
				hiddenLayers: [5],
				log: true,
				outputSize: 1,
			});
		
		
			console.debug(
				'Previous player moves are: ' +
				playerChoices().map((v) => {
					return choiceOptions[v];
				})
			);
			console.debug(trainingData);
			gamutt.train([trainingData], {
				errorThresh: 0.02,
				iterations: 200,
				log: true
			});
			
			const gamuttGuessRaw = gamutt.run(trainingData);
			const gamuttGuessNormalized = Math.round(gamuttGuessRaw*2)/2; // 0, 0.5, 1

			// denormalized = nChoice * (max(possChoices) - min(possChoices)) + min(possChoices)
			const gamuttGuess = gamuttGuessNormalized * 2 + 1;
			console.debug('Denormalized: ', gamuttGuess, ', Predicted: ', gamuttGuessNormalized, ', Raw: ', gamuttGuessRaw);

			const gamuttChoice = Number.parseInt(Object.keys(rules).find(k => rules[k] === gamuttGuess));

			console.debug('GAMUTT predicts PLAYER will choose ' + choiceOptions[gamuttGuess] + ' (' + gamuttGuessRaw + '), countering with ' + choiceOptions[gamuttChoice] );
		
			setGamuttChoices([
				...gamuttChoices(), gamuttChoice
			]);

			console.debug('Player\'s actual move: ' + choiceOptions[choice]);
			setPlayerChoices([...playerChoices(), choice]);
			// Update training data for next round
			// Maybe we could move the entire training segment post-move to improve percieved speed? 
			// normal = (choice – min(possChoices)) / (max(possChoices) – min(possChoices))
			const normalizedChoice = (choice - 1.0) / 2.0;
			console.debug('Normalized value for ' + choice + ' is ' + normalizedChoice);
			trainingData.push(normalizedChoice);
			
		}	);

	};
	return (
		<>
			<div class='flex flex-row text-white'>
				<For each={Object.keys(choiceOptions).map(Number)}>
					{(opt) => (
						<button
							class='mx-4 rounded-md bg-cyan-600 px-4  hover:bg-cyan-900'
							onClick={() => {
								startMatch(opt);
							}}
						>
							{choiceOptions[opt]}
						</button>
					)}
				</For>
			</div>
		</>
	);
}
function ScoreCard(props) {
	return (
		<>
			<div class='mx-4 flex aspect-square w-32 shrink  grow-0 flex-col text-center '>		
				<div class='text-2xl text-white'>{props.name}</div>
				<div class='flex h-full w-full items-center justify-center rounded-lg border-2 border-fuchsia-700 text-center text-4xl text-fuchsia-500'>
					<span>{props.score}</span>
				</div>
			</div>
		</>
	);
}
function History() {
	return (
		<div class='mx-4 grid w-full shrink-0 grow grid-cols-3 px-4'>
			<div class='grid-flow-dense text-white'>
				<ul>
					<h2 class='text font-extrabold lg:text-xl'>GAME</h2>
					<For each={playerChoices()}>
						{(pChoice, i) => {
							const message = CalculateOutcome(pChoice, gamuttChoices()[i()]);
							return (
								<li class='flex flex-row'>
									<div class='w-6'>{i()}:</div>
									<div>{message}</div>
								</li>
							);
						}}
					</For>
				</ul>
			</div>
			<div class='text-cyan-500'>
				<h2 class='font-extrabold lg:text-xl'>PLAYER</h2>
				<ul>
					<For each={playerChoices()}>
						{(pChoice) => (
							<li>
								<span>{choiceOptions[pChoice]}</span>
							</li>
						)}
					</For>
				</ul>
			</div>
			<div class='text-fuchsia-500'>
				<h2 class='font-extrabold lg:text-xl'>GAMUTT</h2>
				<ul>
					<For each={gamuttChoices()}>
						{(gChoice) => {
							return (
								<li>
									<span>{choiceOptions[gChoice]}</span>
								</li>
							);
						}}
					</For>
				</ul>
			</div>
		</div>
	);
}

export default () => {
	return (
		<>
			<div class='flex  flex-col items-center justify-center'>
				<PlayerInput/>
				<div class='flex flex-row'>
					<ScoreCard  name='PLAYER' score={playerScore()} />
					<ScoreCard name='GAMUTT' score={gamuttScore()} />
				</div>
				<History />
			</div>
		</>
	);
};
