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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)/home/index" options={{ headerShown: false }} />
        <Stack.Screen name="index" />
        {/* navigate.navigation use option */}
        <Stack.Screen name="login" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

