import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import UserContext from '../contexts/UserContext';
import { decrypt, DecryptPassword } from '../utils/Password';
import QRScan from './QRScan';

// decode:
// {
//     name: "Long",
//     url: "http://localhost/...",
//     secretkey: "abcxyz"   
// }

export default function Login() {
    const user = React.useContext(UserContext);
    const [isScan, setIsScan] = React.useState(false);

    async function processFunction(data, isBack) {
        if (isBack) {
            setIsScan(false);
        }
        var dec = decrypt(data, DecryptPassword)
        if (dec) {
            try {
                var userData = JSON.parse(dec);
                if (!userData.secretkey){
                    throw new Error()
                }
                await user.login(userData);
            }
            catch { }
        }
    }
    function onPress() {
        setIsScan(true);
    }
    if (isScan) {
        return <QRScan processFunction={processFunction} />;
    }
    return (
        <View style={styles.fullscreen}>
            <View>
                <Text style={styles.title}>Vui lòng quét mã QR cho trước</Text>
            </View>
            <View style={styles.body}>
                <TouchableOpacity style={styles.roundButton} onPress={onPress}>
                    <Text style={styles.title}>Scan QR</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    fullscreen: {
        width: "100%",
        height: "100%"
    },
    title: {
        padding: 15,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: "center"
    },
    body: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    roundButton: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 200,
        backgroundColor: 'orange',
    },
})