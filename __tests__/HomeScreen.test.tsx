import { render, waitFor } from '@testing-library/react-native';
import React from 'react';

import HomeScreen from '@/app/(app)/(tabs)/home/index';
import { AuthProvider } from '@/src/core/context/AuthContext';

jest.mock('expo-router', () => ({
	router: {
		push: jest.fn()
	}
}));

describe('<HomeScreen />', () => {
	it('should display the greeting with the user name', async () => {
		const screen = render(
			<AuthProvider>
				<HomeScreen />
			</AuthProvider>
		);

		await waitFor(() => {
			const greetingElement = screen.getByText('Hello, John!');
			expect(greetingElement).toBeDefined();
		});
	});
});
