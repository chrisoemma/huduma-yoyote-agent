import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';


export const authHeader = async (selectedLanguage) => {
  const token = await AsyncStorage.getItem('token');
  return {
    Authorization: 'Bearer ' + token,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Accept-Language': selectedLanguage, 
  };
};
