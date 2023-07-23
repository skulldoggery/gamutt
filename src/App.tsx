import type { Component } from 'solid-js';
import Bonfire from '@/routes/bonfire';

const App: Component = () => {
	return (
		<main class='max-w-screen flex min-h-screen flex-col justify-start bg-black py-6'>
			<h1 class='text-center font-mono text-2xl font-extrabold tracking-widest text-cyan-700 text-opacity-50'>
				GAMUTT
			</h1>
			<div class='loader mx-18'>
				<div class='loader-span' />
				<div class='loader-blip' />
			</div>
			<Bonfire />
		</main>
	);
};

export default App;
