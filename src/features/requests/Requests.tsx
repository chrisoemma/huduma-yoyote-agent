import { View, Text, SafeAreaView, FlatList,TouchableOpacity,StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { globalStyles } from '../../styles/global'
import { colors } from '../../utils/colors';
import RequestList from '../../components/RequestList';

const Requests = ({navigation}) => {

    const [activeTab, setActiveTab] = useState('current');
    const [providers, setProviders] = useState([{
       id:1,
       name:'Juma john'
    }]);
  
    // Fetch and populate 'providers' based on the selected tab
  
    const toggleTab = () => {
      setActiveTab(activeTab === 'current' ? 'previous' : 'current');
    };
  
    const renderRequestItem = ({ item }) => (
      <View style={styles.itemlistContainer}>
      <RequestList navigation={navigation} />
      <RequestList navigation={navigation} />
      </View>
    );

  return (
    <SafeAreaView
    style={globalStyles.scrollBg}
    >
    <View style={{}}>
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={toggleTab}
      >
        <Text style={[styles.buttonText, activeTab === 'current' ? styles.activeToggleText : null]}>
          Current
        </Text>
        <Text style={[styles.buttonText, activeTab === 'previous' ? styles.activeToggleText : null]}>
          Previous
        </Text>
      </TouchableOpacity>
    </View>
    <View style={styles.listContainer}>
        <FlatList
          data={providers}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
    </SafeAreaView>
  )
}

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
      backgroundColor:colors.white,
    },
    activeToggleText: {
      color:colors.white,
      backgroundColor:colors.primary,
      borderRadius:20
       // Active text color
    },
    buttonText: {
      color:colors.primary,
      padding:10,
       marginRight:5
       // Default text color
    },
    listContainer: {
      marginHorizontal:5
     // flex: 1,
    },
    itemlistContainer:{ 
        marginTop:20,
      marginBottom:150,
    
    }
  });

export default Requests