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
    </View>
  );
}

export default HomeScreen;
