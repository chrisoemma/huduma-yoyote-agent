import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import { RootStateOrAny, useSelector } from 'react-redux';
//import AuthStack from './AuthNavigator';
import AppStack from './AppStack';
import ServiceProviders from '../features/registers/MyRegisters';


const Stack = createNativeStackNavigator();

const Navigation = () => {

 // const { user, loading } = useSelector((state: RootStateOrAny) => state.user);

  // useEffect(() => {
  // }, [user]);

  return (<AppStack />);
};

export default Navigation;
