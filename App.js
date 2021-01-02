import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WeatherComponent from "./components/WeatherProject";

function App() {
  return (
    <View style={styles.container}>
      <Text>Does this auto reload in expo</Text>
      <Text>Yes it does</Text>
      <Text>With this i can create my own dating and insta hookup app</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default WeatherComponent;