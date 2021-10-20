import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Logger } from '../utils/Alert';

const userInit = {
    data: null,
    login: async (data) => { },
    logout: async () => { },
};

export default UserContext = React.createContext(userInit);
export async function logout(){
    try{
        await AsyncStorage.removeItem("user");
    }
    catch (e){
        Logger(e);
    }
}
export async function getFromDisk(){
    try{
        return await AsyncStorage.getItem("user");
    }
    catch (e){
        Logger(e);
    }
    return null;
}
export async function login(data){
    try{
        await AsyncStorage.setItem("user",JSON.stringify(data));
    }
    catch (e){
        Logger(e);
    }
}