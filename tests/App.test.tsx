import { render } from '@solidjs/testing-library';
import App from '../src/App';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';

describe('App', () => {

	it('should render the main page', () => {
		const { getByText } = render(() => <App />);
		expect(getByText('GAMUTT')).toBeInTheDocument();
	});
});