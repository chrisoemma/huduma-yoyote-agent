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
  );
};

export default AppStack