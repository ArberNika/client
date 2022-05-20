import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  Snap: undefined;
};

export type Props = NativeStackScreenProps<
  RootStackParamList,
  "Home",
  "Details"
>;
