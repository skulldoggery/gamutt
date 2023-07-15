import type { Component } from 'solid-js';

const App: Component = () => {
	return (

		<main class="max-w-screen flex min-h-screen flex-col justify-center bg-black py-6">
			<h1 class="font-mono text-center text-6xl font-extrabold tracking-widest text-cyan-700 text-opacity-50">GAMUTT</h1>	
			<div class="loader mx-18 my-12">
				<div class="loader-span" />
				<div class="loader-blip" />
			</div>
		</main>
	);
};

export default App;
