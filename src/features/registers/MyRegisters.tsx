import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '../../utils/colors';
import { globalStyles } from '../../styles/global';
import ProviderList from '../../components/ProviderList';
import ClientList from '../../components/ClientList';
import FloatBtn from '../../components/FloatBtn';
import { useTranslation } from 'react-i18next';



const MyRegisters = ({ navigation }: any) => {

  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState('clients');
  const [providers, setProviders] = useState([{
    id: 1,
    name: 'Juma john'
  }]);


  // Fetch and populate 'providers' based on the selected tab

  const toggleTab = () => {

  

    setActiveTab(activeTab === 'clients' ? 'serviceproviders' : 'clients');
  };

  const renderProviderItem = ({ item }) => (
    <View style={styles.itemlistContainer}>
      {
        activeTab === 'clients' ? (<ClientList navigation={navigation} />) : (
          <ProviderList navigation={navigation} />
        )
      }
    </View>
  );

  return (
    <SafeAreaView
      style={globalStyles.scrollBg}
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
          data={providers}
          renderItem={renderProviderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      <FloatBtn
        iconType='add'
        onPress={() => {
          if (activeTab === 'clients') {
            navigation.navigate('Register Client');
          } else {
            navigation.navigate('Register Provider');
          }
        }}
      />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {

    // flex: 1,
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
    // flex: 1,
  },
  itemlistContainer: {
    flexDirection: 'row',
    padding: 10,
    flexWrap: 'wrap',
    justifyContent: 'center'
  }
});
export default MyRegisters;
