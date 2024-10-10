import React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StepCounterScreen from './src/screens/StepCounterScreen/StepCounterScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TextDetectionScreen from './src/screens/TextDetectionScreen/TextDetectionScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function App(): JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="StepCounter">
        <Tab.Screen name="StepCounter" component={StepCounterScreen} />
        <Tab.Screen
          name="Nutrition Facts Detection"
          component={TextDetectionScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

export default App;
