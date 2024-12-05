import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigator from "./DrawerNavigator";
import RegisterProvider from "../features/registers/RegisterProvider";
import RegisterClient from "../features/registers/RegisterClient";
import Commissions from "../features/commissions/Commissions";
import Settings from "../features/settings/Settings";
import { useTranslation } from "react-i18next";
import EditAccount from "../features/account/EditAccount";
import ClientDetails from "../features/registers/ClientDetails";
import ProviderDetails from "../features/registers/ProviderDetails";
import ChangePassword from "../features/auth/ChangePassword";
import CommissionDetails from "../features/commissions/CommissionDetails";
import Documents from "../features/account/Documents";
import FCMMessageHandler from "../components/FCMMessageHandler";
import { useEffect, useRef, useState } from "react";

import { useAppDispatch } from "../app/store";
import { useSelector } from "react-redux";
import Notifications from "../features/Notifications/Notifications";
import { handleDeviceToken } from "../utils/handeDeviceToken";
import { AppState } from "react-native";
import {getUserData } from "../features/auth/userSlice";



const AppStack = () => {

  const Stack = createNativeStackNavigator();
  const dispatch = useAppDispatch();

  const screenOptions = {
    headerShown: true,
    headerTitleStyle: {
      fontFamily: 'Prompt-Regular', 
      fontSize: 15, 
    },
  };

    const { user} = useSelector((state: RootStateOrAny) => state.user);
  const { t } = useTranslation();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);


  
 
  useEffect(() => {
    const unsubscribe = handleDeviceToken(dispatch, user);
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch, user]);



  useEffect(() => {
    let data={
      isOnline:false
    }
    const handleAppStateChange = (nextAppState) => {
    
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
      if (appState.current === 'active') {
        if (user) {
          dispatch(getUserData(user?.id,'agent'))
          handleDeviceToken(dispatch, user);
        
        }
      }
   
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      appStateSubscription.remove();
    };
  }, [dispatch]);
  

  return (
    <>
    <FCMMessageHandler />
    <Stack.Navigator initialRouteName="Home"  screenOptions={screenOptions}>
      <Stack.Screen name="Home" component={DrawerNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="Register Provider"
        component={RegisterProvider}
        options={{ title: t('auth:registerProvider') }}
      />
      <Stack.Screen name="Register Client"
        component={RegisterClient}
        options={{ title: t('auth:registerClient') }}
      />

      <Stack.Screen name="Client Details"
        component={ClientDetails}
        options={{ title: t('navigate:clientDetails') }}
      />

      <Stack.Screen name="Change Password"
        component={ChangePassword}
        options={{ title: t('navigate:changePassword') }}
      />

      <Stack.Screen name="Provider Details"
        component={ProviderDetails}
        options={{ title: t('navigate:providerDetails') }}
      />

      <Stack.Screen name="Edit Account"
        component={EditAccount}
        options={{ title: t('navigate:editAccount') }}
      />

      <Stack.Screen name="Commissions" component={Commissions}
        options={{ title: t('navigate:commissions') }}

      />
      <Stack.Screen name="Notifications"
         component={Notifications}
         options={{ title: t('screens:notifications') }}
          />

      <Stack.Screen name="Commission Details" component={CommissionDetails}
        options={{ title: t('navigate:commissionDetails') }}

      />

      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{ title: t('navigate:settings') }}
      />

      <Stack.Screen name="My Documents"
        component={Documents}
        options={{ title: t('screens:myDocuments') }}
      />
    </Stack.Navigator>
    </>
  );
};

export default AppStack