import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Button } from "react-native";

import { Props, RootStackParamList } from "../components/Props";

function HomeScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("Details")}
      />
      <Button title="Go to Snap" onPress={() => navigation.navigate("Snap")} />
      <Button title="Go to Notification" onPress={() => navigation.navigate("Notification")} />
    </View>
  );
}

export default HomeScreen;
