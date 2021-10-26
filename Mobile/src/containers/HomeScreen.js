import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import { Button, Linking, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, View } from 'react-native';
import totp from 'totp-generator';
import UserContext from '../contexts/UserContext';
import { decrypt, DecryptPassword } from '../utils/Password';
import QRScan from './QRScan';

// decode:
// {
//     title: "Paypal account 01",
//     description: "abcxyz\nabcxyz\n....",
//     encoded: "U2FsdGVkX19CNRrQuu3bZSH3laRBdf0r/UovL0PpY3s="   
// }

const initialState = { password: '', details: null, isScan: false };

function scan_processFunction(state, data) {
  var dec = decrypt(data, DecryptPassword)
  var itemData = {}
  if (dec) {
    try {
      itemData = JSON.parse(dec);
    }
    catch { }
  }
  itemData["decoded"] = decrypt(itemData.encoded, state.password);
  return { ...state, details: itemData, isScan: false };
}

function reducer(state, action) {
  switch (action.type) {
    case 'setPassword':
      return { ...state, password: action.payload };
    case 'setIsScan':
      return { ...state, isScan: action.payload };
    case 'setDetails':
      return { ...state, details: action.payload };
    case 'scan_processFunction':
      return scan_processFunction(state, action.payload);
    default:
      throw new Error();
  }
}

export default function HomeScreen() {
  const user = React.useContext(UserContext);

  const [state, dispatch] = React.useReducer(reducer, initialState);

  function onLogout() {
    user.logout();
  }

  function processFunction(data, isback) {
    if (isback) {
      dispatch({ type: "setIsScan", payload: false });
      return;
    }
    dispatch({ type: "scan_processFunction", payload: data });
  }

  return (<View style={styles.container}>
    {state.isScan ? <QRScan processFunction={processFunction} /> :
      <>
        <Text style={styles.title}>Wellcome {user.data.name} !</Text>
        <View>
          <UserInfo />
          <Button color="red" title="Logout" onPress={onLogout} />
        </View>
        <View style={styles.body}>
          <ScanArea state={state} dispatch={dispatch} />
        </View>
      </>
    }
  </View>);
}

function TextBlock({ children, style, onPress, selectable }) {
  let _styles = styles.TextBlock;
  if (style)
    _styles = { ..._styles, ...style };
  return <Text selectable={selectable} style={_styles} onPress={onPress}>{children}</Text>;
}

function UserInfo() {
  const user = React.useContext(UserContext);

  const [password, setPassword] = React.useState("------");
  const [timeRemain, setTimeRemain] = React.useState(0);
  const [timeReset, setTimeReset] = React.useState(0);

  React.useEffect(() => {
    function refreshOTP() {
      setPassword(totp(user.data.secretkey));
      setTimeReset(+new Date() + 30000);
    }
    const it = setInterval(() => {
      const newtime = 30 - new Date().getSeconds() % 30;
      if (newtime == 30 || new Date() > timeReset)
        if (user.data && user.data.secretkey)
          refreshOTP();

      setTimeRemain(newtime);
    }, 1000)
    return () => {
      clearInterval(it);
    }
  }, [])

  return [
    <TextBlock style={{
      color: "blue",
      fontSize: 18,
      fontWeight: "300",
      textAlign: "center",
    }} key={1} onPress={() => {
      Linking.openURL(user.data.url);
    }}
    >{user.data.url}</TextBlock>,

    <TextBlock style={{
      fontSize: 25,
      fontWeight: "500",
      textAlign: "center",
      paddingBottom: 0
    }} key={2} onPress={() => {
      Clipboard.setString(password);
      ToastAndroid.show("OTP đã được sao chép vào bộ nhớ", ToastAndroid.SHORT);
    }}
    >OTP: {password}</TextBlock>,

    <TextBlock style={{
      textAlign: "center",
      color: "green",
      paddingTop: 0
    }} key={3}> ({timeRemain} seconds)</TextBlock>
  ]
}

function ScanArea({ state, dispatch }) {
  const { details, password } = state;

  let hint;
  if (details && details["decoded"])
    hint = "click vào để copy";
  else
    hint = "code giải mã không chính xác";

  return (
    <View style={styles.scanContainer}>
      <View style={{ marginBottom: 10 }}>
        <Text style={styles.scanTitle}>Tra cứu thông tin</Text>
        <TextInput
          style={styles.scanPassword}
          secureTextEntry={true}
          value={password}
          onChangeText={e => dispatch({ type: "setPassword", payload: e })}
          placeholder="Nhập mật khẩu giải mã AES Cipher"
        />
      </View>
      <ScrollView style={{ flex: 1 }}>
        {
          details != null && <>
            <TextBlock
              style={{ fontWeight: "500", color: "cornflowerblue" }}
              selectable={true}
            >Loại: {details["title"]}</TextBlock>
            <TextBlock
              style={{ color: "darksalmon" }}
              selectable={true}
            >Mô tả: {details["description"]}</TextBlock>
            <TextBlock selectable={true}
              style={{ color: "violet" }}
            >Giải mã: ({hint})</TextBlock>
            <TextBlock selectable={true}
              style={{ color: "dimgray", fontWeight: "500" }}
              onPress={() => {
                Clipboard.setString(details["decoded"]);
                ToastAndroid.show("Nội dung đã được sao chép vào bộ nhớ", ToastAndroid.SHORT);
              }}
            >{details["decoded"]}</TextBlock>
          </>
        }
      </ScrollView>
      {details != null &&
        <View style={{ marginTop: 10 }}>
          <Button title="Clear" color="green" onPress={() => dispatch({ type: "setDetails", payload: null })} />
        </View>
      }
      <View style={{ marginTop: 10 }}>
        <Button title="Scan now" onPress={() => dispatch({ type: "setIsScan", payload: true })} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  scanContainer: {
    justifyContent: "space-between",
    flex: 1
  },
  scanTitle: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "800"
  },
  scanPassword: {
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
    textAlign: "center",
    fontSize: 20
  },
  title: {
    fontSize: 25,
    fontWeight: "500",
    textAlign: "center",
    padding: 10
  },
  body: {
    flex: 1,
    padding: 10,
    marginTop: 10,
    borderTopWidth: 1
  },
  TextBlock: {
    padding: 8,
    fontSize: 16,
  }
})
