import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Feather';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../features/home/Home';
import { colors } from '../utils/colors';
import { useTranslation } from 'react-i18next';
import Account from '../features/account/Account';
import MyRegisters from '../features/registers/MyRegisters';
import { useSelector,RootStateOrAny } from 'react-redux';


const Tab = createBottomTabNavigator();

const screenOptions = {
  headerShown: false,
};

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};




export default function BottomHomeTabNavigator() {

  const { loading, user } = useSelector(
    (state: RootStateOrAny) => state.user,
  );

  const { isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
);
  
  const { t } = useTranslation();

  const tabNavScreenOptions = ({ route }: any) => ({
    headerShown: false,
    tabBarIcon: ({ focused, color, size }: any) => {
      let iconName;
  
      if (route.name === 'Home') {
        iconName = 'home';
        return <Icon name={iconName as string} size={size} color={color} />;
      } else if (route.name === 'MyRegisters') {
        iconName = 'rotate-3d-variant';
      } else if (route.name === 'Account') {
        iconName = 'account-circle';
      } 
      // You can return any component that you like here!
      return <FontAwesome5 name={iconName as string} size={size} color={color} />;
    },
    tabBarActiveTintColor: colors.secondary,
    tabBarInactiveTintColor:isDarkMode?colors.white:colors.blackBg,
  });


  function getNavigatorScreens(user) {
    const screens = [
      {
        name: 'Home',
        component: HomeStack,
        options: { tabBarLabel: t('navigate:home') },
      },
      {
        name: 'MyRegisters',
        component: MyRegisters,
        options: { tabBarLabel: t('navigate:myRegisters') },
      },
      {
        name: 'Account',
        component: Account,
        options: { tabBarLabel: t('navigate:account') },
      },
    ];
  
    if (user.agent && user?.agent?.status !== 'Active') {
      return screens.filter(screen => screen.name !== 'Home' && screen.name !== 'MyRegisters');
    }
  
    return screens;
  }

  const screens = getNavigatorScreens(user);
  
  return (
    <Tab.Navigator screenOptions={tabNavScreenOptions}>
      {screens.map(screen => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.options}
        />
      ))}
    </Tab.Navigator>
  );

}
