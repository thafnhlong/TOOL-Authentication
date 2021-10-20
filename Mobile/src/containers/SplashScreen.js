import React from 'react';
import { Text, View } from 'react-native';
import UserContext, { getFromDisk, login, logout } from '../contexts/UserContext';
import Login from './Login';

export default function SplashScreen(props) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    async function init() {
      const data = await getFromDisk();
      if (data) {
        setUser(JSON.parse(data));
      }
      setTimeout(() => setIsLoaded(true), 1500);
    }
    init();
  }, [])

  if (isLoaded) {
    const contextValue = {
      data: user,
      login: async (data) => {
        await login(data);
        setUser(data);
      },
      logout: async () => {
        await logout();
        setUser(null);
      }
    };

    return (
      <UserContext.Provider value={contextValue}>
        {user ? props.children : <Login />}
      </UserContext.Provider>
    );
  }
  return (
    <View style={styles.view}>
      <Text style={styles.text}>Authenticated App</Text>
      <Text style={styles.text}>@NTLUS</Text>
    </View>
  );
}

const styles = {
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green'
  },
  text: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold'
  }
}