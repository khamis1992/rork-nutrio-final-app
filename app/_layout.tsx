import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";
import { useUserStore } from "@/store/userStore";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function RootLayoutNav() {
  const { initializeUser } = useUserStore();

  useEffect(() => {
    initializeUser();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="meal/[id]" 
          options={{ 
            title: "Meal Details",
            headerBackTitle: "Back",
          }} 
        />
        <Stack.Screen 
          name="subscription" 
          options={{ 
            title: "Choose a Plan",
            headerBackTitle: "Back",
          }} 
        />
        <Stack.Screen 
          name="gyms" 
          options={{ 
            title: "Gym Access",
            headerBackTitle: "Back",
          }} 
        />
        <Stack.Screen 
          name="my-plan" 
          options={{ 
            title: "My Plan",
            headerBackTitle: "Back",
          }} 
        />
        <Stack.Screen 
          name="login" 
          options={{ 
            title: "Login",
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="signup" 
          options={{ 
            title: "Sign Up",
            headerShown: false,
          }} 
        />
      </Stack>
    </>
  );
}