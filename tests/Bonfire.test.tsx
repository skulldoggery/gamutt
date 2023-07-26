import { render } from '@solidjs/testing-library';
import Bonfire from '@/routes/bonfire';
import { describe, test, bench } from 'vitest';
import '@testing-library/jest-dom';

describe('Bonfire', () => {
	test.todo('has default training data');
	test.todo('renders PLAYER score card');
	test.todo('renders GAMUTT score card');
	test.todo('renders PLAYER inputs');
	test.todo('initiates match on PLAYER choice');
	test.todo('updates training data after match');

	bench.todo('initial GAMUTT training');
	bench.todo('5-input GAMUTT training');
	bench.todo('10-input GAMUTT training');
	bench.todo('15-input GAMUTT training');
});