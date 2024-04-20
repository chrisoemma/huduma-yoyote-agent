import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '../../utils/colors';
import { globalStyles } from '../../styles/global';
import ProviderList from '../../components/ProviderList';
import ClientList from '../../components/ClientList';
import FloatBtn from '../../components/FloatBtn';
import { useTranslation } from 'react-i18next';
import { useSelector, RootStateOrAny } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { getClients, getProviders } from './RegisterSlice';



const MyRegisters = ({ navigation }: any) => {

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const { user } = useSelector(
    (state: RootStateOrAny) => state.user,
  );

  const { loading, clients, providers } = useSelector(
    (state: RootStateOrAny) => state.registers,
  );

  const {isDarkMode} = useSelector(
    (state: RootStateOrAny) => state.theme,
  );

  useEffect(() => {
    dispatch(getClients({agentId:user?.agent?.id}));
    dispatch(getProviders({agentId:user?.agent?.id}));
  }, [dispatch])


  const [activeTab, setActiveTab] = useState('clients');


  // Fetch and populate 'providers' based on the selected tab

  const toggleTab = () => {

    setActiveTab(activeTab === 'clients' ? 'serviceproviders' : 'clients');
  };

  const renderProviderItem = ({ item }:any) => (
    <View style={styles.itemlistContainer}>
      {
        activeTab === 'clients' ? (<ClientList navigation={navigation} client={item} />) : (
          <ProviderList navigation={navigation} provider={item} />
        )
      }
    </View>
  );

  const stylesGlobal=globalStyles();

  return (
    <SafeAreaView
      style={stylesGlobal.scrollBg}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleTab}
        >
          <Text style={[styles.buttonText, activeTab === 'clients' ? styles.activeToggleText : null]}>
            {t('screens:clients')}
          </Text>
          <Text style={[styles.buttonText, activeTab === 'serviceproviders' ? styles.activeToggleText : null]}>
            {t('screens:serviceProviders')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={activeTab === 'clients' ? clients : providers}
          renderItem={renderProviderItem}
          keyExtractor={(item) => item?.id}
          numColumns={2}
        />
      </View>
       {user.agent && user.status=='Active'?(<FloatBtn
        iconType='add'
        onPress={() => {
          if (activeTab === 'clients') {
            navigation.navigate('Register Client');
          } else {
            navigation.navigate('Register Provider');
          }
        }}
      />):(<View />)}
    
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    

  },
  toggleButton: {
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  activeToggleText: {
    color: colors.white,
    backgroundColor: colors.primary,
    borderRadius: 20
    // Active text color
  },
  buttonText: {
    color: colors.primary,
    padding: 10,
    marginRight: 5
    // Default text color
  },
  listContainer: {
alignItems:'center'
  },
  itemlistContainer: {
   // width:'50%',
    flexDirection: 'row',
    padding: 10,
    flexWrap: 'wrap',
    alignContent:'center',
  }
});
export default MyRegisters;
