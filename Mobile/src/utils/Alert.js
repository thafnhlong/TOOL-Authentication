import { Alert } from "react-native";

export function Logger(msg) {
    Alert.alert("Logger", msg, [{ text: "OK" }]);
}