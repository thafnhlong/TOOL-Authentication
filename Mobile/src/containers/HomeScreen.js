import React from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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

function TextBlock({ children }) {
  return <Text style={styles.TextBlock}>{children}</Text>;
}

function UserInfo() {
  const user = React.useContext(UserContext);

  const [password, setPassword] = React.useState("------");
  const [timeRemain, setTimeRemain] = React.useState(0);

  React.useEffect(() => {
    setPassword(totp(user.data.secretkey));
    const it = setInterval(() => {
      const newtime = 30 - new Date().getSeconds() % 30;
      if (newtime == 30)
        if (user.data && user.data.secretkey)
          setPassword(totp(user.data.secretkey));
      setTimeRemain(newtime);
    }, 1000)
    return () => {
      clearInterval(it);
    }
  }, [])

  return [
    <TextBlock key={1}>Login: {user.data.url}</TextBlock>,
    <TextBlock key={2}>OTP: {password} ({timeRemain} seconds)</TextBlock>
  ]
}

function ScanArea({ state, dispatch }) {
  const { details, password } = state;

  return (
    <View style={styles.scanContainer}>
      <View style={{ marginBottom: 10 }}>
        <Text style={styles.scanTitle}>Tra cứu thông tin</Text>
        <TextInput
          style={styles.scanPassword}
          secureTextEntry={true}
          value={password}
          onChangeText={e => dispatch({ type: "setPassword", payload: e })}
          placeholder="Nhập mật khẩu mã hóa"
        />
      </View>
      <ScrollView style={{ flex: 1 }}>
        {
          details != null && <>
            <TextBlock>Loại: {details["title"]}</TextBlock>
            <TextBlock>Mô tả: {details["description"]}</TextBlock>
            <TextBlock>Giải mã: {details["decoded"]}</TextBlock>
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
    fontSize: 15
  },
  scanPassword: {
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20
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
    padding: 8
  }
})
