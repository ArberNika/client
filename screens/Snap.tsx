import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Button,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";

import { Camera } from "expo-camera";

import * as MediaLibrary from "expo-media-library";

import { Props, RootStackParamList } from "../components/Props";

//TODO: Unmount camera when screen (Snap) is unused.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  parentView: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  layoutContainer: {
    flex: 5,
  },
  camera: {
    flex: 1,
  },
  cameraPreview: {
    flex: 1,
  },
  button: {
    backgroundColor: "violet",
    width: "30%",
    justifyContent: "center",
    height: "40%",
  },
  text: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
  },
  information: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});

const Snap = ({ navigation }: Props) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState<Camera | any>();
  const cameraRef = useRef<Camera | any>();

  // Screen Ratio and image padding
  const [imagePadding, setImagePadding] = useState(0);
  const [ratio, setRatio] = useState("4:3"); // default is 4:3
  const { height, width } = Dimensions.get("window");
  const screenRatio = height / width;
  const [isRatioSet, setIsRatioSet] = useState(false);

  // on screen  load, ask for permission to use the camera
  useEffect(() => {
    async function getCameraStatus() {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status == "granted");
    }
    getCameraStatus();
  }, []);

  const takePhoto = async () => {
    if (!cameraRef) return;
    const camera: Camera = cameraRef.current;
    const photo = await camera.takePictureAsync();
    console.log(photo);
    MediaLibrary.saveToLibraryAsync(photo.uri);
  };

  // the camera must be loaded in order to access the supported ratios
  const setCameraReady = async () => {
    if (!isRatioSet) {
      await prepareRatio();
    }
  };

  // set the camera ratio and padding.
  // this code assumes a portrait mode screen
  const prepareRatio = async () => {
    let desiredRatio = "4:3"; // Start with the system default
    // This issue only affects Android
    if (Platform.OS === "android") {
      if (!camera) {
        return;
      }
      const ratios = await camera.getSupportedRatiosAsync();
      // Calculate the width/height of each of the supported camera ratios
      // These width/height are measured in landscape mode
      // find the ratio that is closest to the screen ratio without going over
      let distances = {} as any;
      let realRatios = {} as any;
      let minDistance = null;
      for (const ratio of ratios) {
        const parts = ratio.split(":");
        console.log(parts);
        const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
        realRatios[ratio] = realRatio;
        // ratio can't be taller than screen, so we don't want an abs()
        const distance = screenRatio - realRatio;
        distances[ratio] = realRatio;
        if (minDistance == null) {
          minDistance = ratio;
        } else {
          if (distance >= 0 && distance < distances[minDistance]) {
            minDistance = ratio;
          }
        }
      }
      // set the best match
      desiredRatio = minDistance;
      //  calculate the difference between the camera width and the screen height
      const remainder = Math.floor(
        (height - realRatios[desiredRatio] * width) / 2
      );
      // set the preview padding and preview ratio
      setImagePadding(remainder);
      console.log(desiredRatio);
      setRatio(desiredRatio);
      // Set a flag so we don't do this
      // calculation each time the screen refreshes
      setIsRatioSet(true);
    }
  };

  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={[
          styles.cameraPreview,
          { marginTop: imagePadding, marginBottom: imagePadding },
        ]}
        onCameraReady={setCameraReady}
        ratio={ratio}
        type={type}
        ref={(ref) => {
          setCamera(ref);
        }}
      >
        <View style={styles.layoutContainer}></View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.text}> SNAP </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

export default Snap;
