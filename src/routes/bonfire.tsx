import { For, batch, createEffect, createMemo, createSignal } from 'solid-js';
import { recurrent } from 'brain.js';
import { clamp } from '@/utilities/data';
import Scorecard from '@/components/Scorecard';

function Bonfire() {
	
	const gamutt = new recurrent.LSTMTimeStep({
		hiddenLayers: [3,4],
		learningRate: 0.2,  
		outputSize: 1,
	});		

	const choiceOptions = { 1: 'Bone', 2: 'Fire', 3: 'Ash' };
	const rules = {
		1: 3, // Bone scatters Ash
		2: 1, // Fire cremates Bone
		3: 2, // Ash smothers Fire
	};
    
	const trainingData = [0, 0.5, 1];
	const initialTrainingSize = trainingData.length;
	const [playerChoices, setPlayerChoices] = createSignal<number[]>([]);
	const [gamuttChoices, setGamuttChoices] = createSignal<number[]>([]);

	const [playerScore, setPlayerScore] = createSignal(0);
	const [gamuttScore, setGamuttScore] = createSignal(0);

	createEffect(() => {
		console.debug('Training with ', trainingData.length, ' inputs');

		
		// Update training data for next round
		performance.mark('training-started');
		gamutt.train([trainingData], {
			errorThresh: 0.002,
			iterations:2000,
		});
		performance.mark('training-ended');
		console.debug('Trained in ', performance.measure('training','training-started', 'training-ended').duration, 'ms');
		performance.clearMeasures('training');

        
		if (playerChoices().length === 0)
			return;
            
		

		// Trim off initial training data as player progresses...
		if (playerChoices().length < initialTrainingSize) {
			// This effect should be called every time the player makes a choice
			// So we can simply pinch off the first element until original training data is gone
			trainingData.shift();
		}
		// normal = (choice – min(possChoices)) / (max(possChoices) – min(possChoices))

		const lastChoice = lastMatch().playerChoice;	
		const normalizedChoice = (lastChoice - 1.0) / 2.0;
        
        
		trainingData.push(normalizedChoice);
		
	});

	const calculateOutcome = (pChoice: number, gChoice: number) => {

	
		if (!pChoice || !gChoice) return;

		if (pChoice == gChoice) {
			console.debug('It\'s a draw.');
			return 'DRAW';
		}

		if (pChoice == rules[gChoice]) {
			console.debug('GAMUTT wins');
			return 'GAMUTT';
		} else {
			console.debug('Player wins');
			return 'PLAYER';
		}
	};
	const lastMatch = createMemo(() => {
		return { 
			playerChoice: playerChoices().at(-1),
			gamuttChoice: gamuttChoices().at(-1),
			outcome: calculateOutcome(playerChoices().at(-1), gamuttChoices().at(-1))
		};
	});
	const startMatch = (playerChoice: number) => {
		console.debug('GAMUTT is thinking...');

		// Even though we're passing in normalized training data, let's avoid weird errors with out-of-range returned predictions
		const gamuttGuessRaw = clamp(gamutt.run(trainingData), 0, 1);
		const gamuttGuessNormalized = Math.round(gamuttGuessRaw*2)/2; // 0, 0.5, 1

		// denormalized = nChoice * (max(possChoices) - min(possChoices)) + min(possChoices)
		const gamuttGuess = gamuttGuessNormalized * 2 + 1;
		console.debug('Denormalized: ', gamuttGuess, ', Predicted: ', gamuttGuessNormalized, ', Raw: ', gamuttGuessRaw);

		const gamuttChoice = Math.round(Number.parseInt(Object.keys(rules).find(k => rules[k] === gamuttGuess)));
	
		console.debug('GAMUTT predicts PLAYER will choose ' + choiceOptions[gamuttGuess] + ' (' + gamuttGuessRaw + '), countering with ' + choiceOptions[gamuttChoice] );
		console.debug('Player\'s actual move: ' + choiceOptions[playerChoice]);

		batch(() => { 
			console.debug('PLAYER: ', choiceOptions[playerChoice], ', GAMUTT: ', choiceOptions[gamuttChoice]);
			const outcome = calculateOutcome(playerChoice, gamuttChoice);
			if (outcome === 'GAMUTT')
				setGamuttScore(gamuttScore()+1);
			else if (outcome === 'PLAYER')
				setPlayerScore(playerScore()+1);

			setGamuttChoices([...gamuttChoices(), gamuttChoice]);		
			setPlayerChoices([...playerChoices(), playerChoice]);
		});
	};

	function PlayerInput() {	
		console.info('Rendering PlayerInput');
		return (
			<>
				<div class='flex flex-row justify-center text-white'>
					<For each={Object.entries(choiceOptions)}>
						{(opt) => 
							<>
							
								<button
									class='mx-4 rounded-md bg-cyan-600 px-4  hover:bg-cyan-900'
									onClick={() => {
										startMatch(opt[0]);
									}}
								>
									{opt[1]}
								</button>
							</>
						}
					</For>
				</div>
			</>
		);
	}
	const Scoreboard = () => {
		console.info('Rendering Scoreboard');
		console.debug('Gamutt\'s current score is ' + gamuttScore());
		console.debug('Player\'s current score is ' + playerScore());
		
		return(
			<div class='flex flex-row justify-center'>
				<Scorecard colorClass='text-cyan-500' name="PLAYER" score={playerScore()} lastAction={choiceOptions[lastMatch().playerChoice]} />
			
				<Scorecard colorClass='text-fuchsia-500' name="GAMUTT" score={gamuttScore()} lastAction={choiceOptions[lastMatch().gamuttChoice]}  />
			</div>
		);
	};

	const History = () => {
		return (
			<div class='mx-4 grid grow grid-flow-row auto-rows-max grid-cols-3 px-4'>		
				<ul class="text-slate-500">
					<For each={gamuttChoices() }>
						{ 
							(gChoice, i) =>{
                            
								console.debug('Rendering Match History');
								return (
									<li class='flex flex-row'>
										<div class=''>{i()}:</div>
										<div>{calculateOutcome(playerChoices()[i()], gChoice)}</div>
									</li>
								);	
							}			
						}
					</For>
				</ul>
				<ul class='text-cyan-500'>
					<For each={playerChoices()}>
						{
							(pChoice) => 
								<li>
									<span>{choiceOptions[pChoice]}</span>
								</li>
						}
					</For>
				</ul>
				<ul class='text-fuchsia-500'>
					<For each={gamuttChoices()}>
						{
							(gChoice) => 
								<li>										
									<span>{choiceOptions[gChoice]}</span>
								</li>
						}
					</For>
				</ul>
			</div>
		);
	};
	return(
		<>	
			<Scoreboard/>
			<PlayerInput/>
			
		</>
	);
}

export default Bonfire;