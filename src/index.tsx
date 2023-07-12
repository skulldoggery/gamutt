/* @refresh reload */
import './index.css';
import { render } from 'solid-js/web';

import App from './App';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
	throw new Error(
		'PANIK: Root is missing!',
	);
}

render(() => <App />, root!);
