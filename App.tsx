import 'react-native-reanimated';
import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import ListsScreen from './src/screens/ListsScreen';
import { useStorage } from './src/hooks/useStorage';
import { ScreenName } from './src/types';

export default function App() {
  const { categories, save, loaded } = useStorage();
  const [screen, setScreen] = useState<ScreenName>('Home');

  if (!loaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0D0D1A', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#7C5CBF" size="large" />
      </View>
    );
  }

  if (screen === 'Lists') {
    return (
      <ListsScreen
        categories={categories}
        onSave={save}
        onBack={() => setScreen('Home')}
      />
    );
  }

  return (
    <HomeScreen
      categories={categories}
      onEditLists={() => setScreen('Lists')}
    />
  );
}
