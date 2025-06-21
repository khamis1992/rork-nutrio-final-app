import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'expo-router';

export default function MyPlanRedirect() {
  // This is just a redirect to the tab version
  return <Redirect href="/(tabs)/my-plan" />;
}