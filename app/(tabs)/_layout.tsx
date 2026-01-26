import Feather from '@expo/vector-icons/Feather';
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {useState} from "react";
import { useTheme } from "@/context/ThemeContext";

export default function TabLayout() {
  // const { darkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const { darkMode } = useTheme();
  return (
 <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: darkMode ? "#166534" : "#166534",
        tabBarInactiveTintColor: darkMode ? "#aaa" : "#888",
        tabBarStyle: {
          backgroundColor: darkMode ? "#374151" : "whitesmoke",
          height: 70 + insets.bottom,
          borderTopWidth: 0,
          paddingBottom: insets.bottom,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        sceneStyle: {
          paddingBottom: 70 + insets.bottom,
        },
      }}
    >
      <Tabs.Screen
        name="Dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) =>  <Ionicons name="home-sharp" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color,size }) => <Ionicons name="notifications" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Feather name="settings" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
