import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import { Home, Utensils, Calendar, BarChart2, User } from "lucide-react-native";
import { theme } from "@/constants/theme";
import { useMealsStore } from "@/store/mealsStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useUserStore } from "@/store/userStore";

export default function TabLayout() {
  const { fetchMeals } = useMealsStore();
  const { fetchPlans } = useSubscriptionStore();
  const { initializeUser } = useUserStore();

  useEffect(() => {
    // Initialize app data when tab layout mounts
    const initializeApp = async () => {
      try {
        await initializeUser();
        await fetchMeals();
        await fetchPlans();
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, [fetchMeals, fetchPlans, initializeUser]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textLight,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: theme.colors.white,
        },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: "Meals",
          tabBarIcon: ({ color }) => <Utensils size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-plan"
        options={{
          title: "My Plan",
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color }) => <BarChart2 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}