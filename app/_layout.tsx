import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider  } from "@/context/theme.context";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function _layout() {

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* navigate.navigation use option */}
        <Stack.Screen 
          name="login" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="userDevices" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="sosView" 
          options={{ 
            headerShown: true, 
            title: 'Emergency',
            headerStyle: { backgroundColor: '#B12323' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }} 
        />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

