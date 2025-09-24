const mockAsyncStorage = (() => {
	let storage = {
		user_data: JSON.stringify({
			id: '1',
			email: 'test@localrides.com',
			firstName: 'John',
			lastName: 'Doe',
			phoneNumber: '+1234567890',
			profilePicture: undefined
		})
	};

	return {
		setItem: jest.fn((key, value) => {
			storage[key] = value;
			return Promise.resolve();
		}),
		getItem: jest.fn((key) => {
			return Promise.resolve(storage[key] || null);
		}),
		removeItem: jest.fn((key) => {
			delete storage[key];
			return Promise.resolve();
		}),
		clear: jest.fn(() => {
			storage = {};
			return Promise.resolve();
		}),
		getAllKeys: jest.fn(() => {
			return Promise.resolve(Object.keys(storage));
		})
	};
})();

export default mockAsyncStorage;
