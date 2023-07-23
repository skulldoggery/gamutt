import { getAllByText, render } from '@solidjs/testing-library';
import App from '../src/App';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';

describe('App', () => {

	it('should render the main page', () => {
		const { getAllByText } = render(() => <App />);
		expect(getAllByText('GAMUTT').length > 0);
	});
});