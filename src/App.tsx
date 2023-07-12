import type { Component } from 'solid-js';

const App: Component = () => {
	return (

		<main class="min-h-screen bg-black py-6 max-w-screen flex justify-center flex-col">
			<h1 class="text-6xl text-cyan-700 text-center font-mono font-extrabold tracking-widest text-opacity-50">GAMUTT</h1>	
			<div class="loader mx-18 my-12">
				<div class="loader-span" />
				<div class="loader-blip" />
			</div>
		</main>
	);
};

export default App;
