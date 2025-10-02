import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={({ route }) => ({
				tabBarLabel:
					route.name === 'home'
						? 'Home'
						: route.name === 'activity/index'
						? 'Activity'
						: route.name === 'account/index'
						? 'Account'
						: '',

				tabBarIcon: ({ focused, color, size }) => {
					let iconName: keyof typeof Ionicons.glyphMap;

					if (route.name === 'home') {
						iconName = focused ? 'home' : 'home-outline';
					} else if (route.name === 'activity/index') {
						iconName = focused ? 'list' : 'list-outline';
					} else if (route.name === 'account/index') {
						iconName = focused ? 'person' : 'person-outline';
					} else {
						iconName = 'help-outline';
					}

					return <Ionicons name={iconName} size={size} color={color} />;
				},
				tabBarActiveTintColor: '#007AFF',
				tabBarInactiveTintColor: '#8E8E93',
				tabBarStyle: {
					backgroundColor: '#FFFFFF',
					borderTopColor: '#E5E5EA',
					borderTopWidth: 1,
					height: Platform.OS === 'ios' ? 88 : 68,
					paddingBottom: Platform.OS === 'ios' ? 24 : 12,
					paddingTop: 8
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: '500',
					marginTop: 4
				},
				headerShown: false
			})}>
			<Tabs.Screen
				name='home'
				options={{
					title: 'Home'
				}}
			/>
			<Tabs.Screen
				name='activity'
				options={{
					title: 'Activity'
				}}
			/>
			<Tabs.Screen
				name='account'
				options={{
					title: 'Account'
				}}
			/>
		</Tabs>
	);
}
