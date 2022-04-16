import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { Camera } from 'expo-camera';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {NativeStackScreenProps} from '@react-navigation/native-stack'


import * as MediaLibrary from 'expo-media-library';

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  Snap: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home', 'Details'>; 

function HomeScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
      <Button
        title="Go to Snap"
        onPress={() => navigation.navigate('Snap')}
      />
    </View>
  );
}

function DetailsScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to Details... again"
        onPress={() => navigation.push('Details')}
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();


// TODO: Unmount camera when screen (Snap) is unused.  
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Snap" component={Snap} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const Snap = ({navigation}: Props) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef<Camera | any>();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

    })();
  }, []);


  const takePhoto = async () => {
    if (!cameraRef) return;
    const camera: Camera = cameraRef.current;
    const photo = await camera.takePictureAsync();
    console.log(photo);
    MediaLibrary.saveToLibraryAsync(photo.uri);
}

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={(camera) => {
          cameraRef.current = camera;
        }} >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.snapButton}
              onPress={() => navigation.navigate('Home')}>
              <Text style={styles.text}> Go to Home </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.snapButton}
              onPress={takePhoto}>
              <Text style={styles.text}> SNAP </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'green' 
  },
  snapButton: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'blue' 

  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
