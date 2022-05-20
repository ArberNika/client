import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, Button } from "react-native";

import { Camera } from "expo-camera";

import * as MediaLibrary from "expo-media-library";

import { Props, RootStackParamList } from "../components/Props";

import { styles } from "../components/Styles";

//TODO: Unmount camera when screen (Snap) is unused.

const Snap = ({ navigation }: Props) => {
  const [hasPermission, setHasPermission] = useState(false);

  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef<Camera | any>();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePhoto = async () => {
    //const camera: Camera = cameraRef.current;
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        console.log(photo);

        let { granted } = await MediaLibrary.requestPermissionsAsync();
        console.log("test");
        if (granted) {
          await MediaLibrary.saveToLibraryAsync(photo.uri);
          navigation.popToTop();
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={(camera) => {
          cameraRef.current = camera;
        }}
      >
        <Button
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
          title="flip"
        ></Button>

        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.text}> SNAP </Text>
        </TouchableOpacity>
      </Camera>
    </View>
  );
};

export default Snap;
