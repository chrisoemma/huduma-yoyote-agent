import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigator from "./DrawerNavigator";
import RegisterProvider from "../features/registers/RegisterProvider";
import RegisterClient from "../features/registers/RegisterClient";
import Commissions from "../features/commissions/Commissions";
import Settings from "../features/settings/Settings";
import { useTranslation } from "react-i18next";

  
  const AppStack = () => {
    
    const Stack = createNativeStackNavigator();
    const screenOptions = {
        headerShown: false,
      };

      const { t } = useTranslation();

    return (
      <Stack.Navigator initialRouteName="Home" >
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
        <Stack.Screen name="Commissions" component={Commissions}
         options={{ title: t('navigate:commision') }}
         
         />
        <Stack.Screen
         name="Settings" 
        component={Settings} 
        options={{ title: t('navigate:settings') }}
        />
      </Stack.Navigator>
    );
  };

  export default AppStack