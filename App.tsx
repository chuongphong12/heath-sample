import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StepCounterScreen from './src/screens/StepCounterScreen/StepCounterScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TextDetectionScreen from './src/screens/TextDetectionScreen/TextDetectionScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

function App() {
  // const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator initialRouteName="StepCounter">
          <Tab.Screen name="StepCounter" component={StepCounterScreen} />
          <Tab.Screen
            name="Nutrition Facts Detection"
            component={TextDetectionScreen}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
