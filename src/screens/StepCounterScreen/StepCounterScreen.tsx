import React, {useEffect, useState} from 'react';
import {Button, Platform, ScrollView, StyleSheet, View} from 'react-native';
import {
  isSensorWorking,
  isStepCountingSupported,
  ParsedStepCountData,
  parseStepData,
  startStepCounterUpdate,
  stopStepCounterUpdate,
} from '@dongminyu/react-native-step-counter';
import {
  getBodySensorPermission,
  getStepCounterPermission,
} from '../../utils/permission';
import RingProgress from './RingProgress';
import Value from './Value';
import LogCat from './LogCat';

type SensorType<T = typeof Platform.OS> = T extends 'ios'
  ? 'CMPedometer'
  : T extends 'android'
  ? 'Step Counter' | 'Accelerometer'
  : 'NONE';

type SensorName = SensorType<Platform['OS']>;

/* Setting the initial state of the additionalInfo object. */
const initState = {
  dailyGoal: '0/10000 steps',
  stepsString: '0 steps',
  calories: '0.0 kCal',
  distance: '0.0 m',
};

const STEPS_GOAL = 10000;

type AdditionalInfo = Partial<ParsedStepCountData>;

function StepCounterScreen() {
  const [loaded, setLoaded] = useState(false);
  const [supported, setSupported] = useState(false);
  const [granted, setGranted] = useState(false);
  const [sensorType, setSensorType] = useState<SensorName>('NONE');
  const [stepCount, setStepCount] = useState(0);
  const [additionalInfo, setAdditionalInfo] =
    useState<AdditionalInfo>(initState);

  const isPedometerSupported = () => {
    isStepCountingSupported().then(result => {
      setGranted(result.granted);
      setSupported(result.supported);
    });
  };

  const startStepCounter = () => {
    startStepCounterUpdate(new Date(), data => {
      setSensorType(data.counterType as SensorName);
      const parsedData = parseStepData(data);
      setStepCount(parsedData.steps);
      setAdditionalInfo({
        ...parsedData,
      });
    });
    setLoaded(true);
  };

  const stopStepCounter = () => {
    setAdditionalInfo(initState);
    stopStepCounterUpdate();
    setLoaded(false);
  };

  const forceUseAnotherSensor = () => {
    if (isSensorWorking) {
      stopStepCounter();
    } else {
      if (sensorType === 'Step Counter') {
        getBodySensorPermission().then(setGranted);
      } else {
        getStepCounterPermission().then(setGranted);
      }
    }
    startStepCounter();
  };

  useEffect(() => {
    isPedometerSupported();
    return () => {
      stopStepCounter();
    };
  }, []);

  useEffect(() => {
    console.debug(`🚀 stepCounter ${supported ? '' : 'not'} supported`);
    console.debug(`🚀 user ${granted ? 'granted' : 'denied'} stepCounter`);
    startStepCounter();
  }, [granted, supported]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.datePicker}>
          {/*<CircularProgress*/}
          {/*  value={stepCount}*/}
          {/*  maxValue={10000}*/}
          {/*  valueSuffix="steps"*/}
          {/*  progressValueFontSize={42}*/}
          {/*  radius={165}*/}
          {/*  activeStrokeColor="#cdd27e"*/}
          {/*  inActiveStrokeColor="#4c6394"*/}
          {/*  inActiveStrokeOpacity={0.5}*/}
          {/*  inActiveStrokeWidth={40}*/}
          {/*  subtitle={*/}
          {/*    additionalInfo.calories === '0 kCal'*/}
          {/*      ? ''*/}
          {/*      : additionalInfo.calories*/}
          {/*  }*/}
          {/*  activeStrokeWidth={40}*/}
          {/*  title="Step Count"*/}
          {/*  titleColor="#555"*/}
          {/*  titleFontSize={30}*/}
          {/*  titleStyle={{fontWeight: 'bold'}}*/}
          {/*/>*/}
          <RingProgress
            radius={150}
            strokeWidth={50}
            progress={stepCount / STEPS_GOAL}
          />
          <View style={styles.values}>
            <Value label="Steps" value={stepCount.toString()} />
            {additionalInfo.distance && (
              <Value label="Distance" value={`${additionalInfo.distance}`} />
            )}
            {additionalInfo.calories && (
              <Value label="Calories" value={additionalInfo.calories} />
            )}
          </View>
        </View>
        <View style={styles.bGroup}>
          <Button title="START" onPress={startStepCounter} />
          <Button title="RESTART" onPress={forceUseAnotherSensor} />
          <Button title="STOP" onPress={stopStepCounter} />
        </View>
        <LogCat triggered={loaded} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  /** Styling the container. */
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    padding: 12,
  },
  /** Styling the circular indicator. */
  indicator: {
    marginTop: 10,
    marginBottom: 20,
  },
  /** Styling the button group. */
  bGroup: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    display: 'flex',
    marginVertical: 8,
  },
  values: {
    flexDirection: 'row',
    gap: 25,
    flexWrap: 'wrap',
    marginTop: 100,
  },
  datePicker: {
    alignItems: 'center',
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export default StepCounterScreen;
