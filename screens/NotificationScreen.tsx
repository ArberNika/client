import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Button } from "react-native";
import { Props, RootStackParamList } from "../components/Props";

function sendNotification() {
    //
    //
}

function NotificationScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Notification Test Screen</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
      <Button title="Send Notification" onPress={sendNotification} />
    </View>
  );
}

export default NotificationScreen;
