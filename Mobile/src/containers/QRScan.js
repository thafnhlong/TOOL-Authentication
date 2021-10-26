import React from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { launchImageLibrary } from 'react-native-image-picker';
import QRCodeScanner from "react-native-qrcode-scanner";
import RNQRGenerator from 'rn-qr-generator';
import { Logger } from '../utils/Alert';

export default function QRScan({ processFunction }) {
    const [cameraType, setCameraType] = React.useState("back");
    function changeCameraType() {
        if (cameraType == "back") {
            setCameraType("front");
        }
        else {
            setCameraType("back");
        }
    }
    function onSuccess(e) {
        processFunction(e.data)
    }
    function onPick() {
        launchImageLibrary({ mediaType: "photo" }, (response) => {
            if (response.didCancel === true) return;
            RNQRGenerator.detect({ uri: response.assets[0].uri })
                .then((res) => {
                    if (res.values.length > 0) {
                        processFunction(res.values[0])
                    }
                })
                .catch((err) => {
                    Logger('Cannot detect', err);
                });
        });
    }
    function onBack() {
        processFunction(null, true)
    }
    return (
        <View style={styles.fullscreen}>
            <TouchableOpacity style={styles.buttonTouchable} onPress={changeCameraType}>
                <Text style={styles.buttonText}>Đổi camera</Text>
            </TouchableOpacity>
            <QRCodeScanner
                reactivate={true}
                reactivateTimeout={500}
                cameraType={cameraType}
                flashMode={RNCamera.Constants.FlashMode.auto}
                onRead={onSuccess}
            />
            <View style={styles.footer}>
                <Button title="Thư viện" onPress={onPick} />
                <Button color="green" title="Quay lại" onPress={onBack} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    fullscreen: {
        width: "100%",
        height: "100%"
    },
    buttonText: {
        textAlign: "center",
        fontSize: 20
    },
    buttonTouchable: {
        backgroundColor: "orange",
        padding: 10
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        marginLeft:10,
        marginRight:10
    }
});