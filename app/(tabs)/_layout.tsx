import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        headerShown: false,
        // headerStyle: {
        //   backgroundColor: '#090821',
        // },
        // headerTitleAlign: 'center',
        // headerShadowVisible: false,
        // headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#090821',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home/[deviceId]"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="riwayat"
        options={{
          title: 'Riwayat',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'timer-sharp' : 'timer-outline'} color={color} size={24}/>
          ),
        }}
      />
  
    </Tabs>
  );
}

