import { View, Text, SafeAreaView, Image,Alert,ToastAndroid, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useCallback,useState, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next';
import { globalStyles } from '../../styles/global';
import { colors } from '../../utils/colors';
import { getStatusBackgroundColor, makePhoneCall } from '../../utils/utilts';
import Divider from '../../components/Divider';
import Icon from 'react-native-vector-icons/AntDesign';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppDispatch } from '../../app/store';
import { BasicView } from '../../components/BasicView';
import { deleteClient } from './RegisterSlice';
import { useSelector,RootStateOrAny } from 'react-redux';
import ToastNotification from '../../components/ToastNotification/ToastNotification';


const ClientDetails = ({route,navigation}:any) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

  const client = route.params?.client;


  const stylesGlobal=globalStyles();

  const phoneNumber =`${client.user.phone}`;
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [message,setMessage]=useState("")

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
}, []);

const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
}, []);


const { isDarkMode } = useSelector(
  (state: RootStateOrAny) => state.theme,
);

const setDisappearMessage = (message: any) => {
    setMessage(message);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };


const deleteFunc = (id) =>
Alert.alert(`${t('screens:deleteClient')}`, `${t('screens:areYouWantToDelete')}`, [
  {
    text: `${t('screens:cancel')}`,
    onPress: () => console.log('Cancel client delete'),
    style: 'cancel',
  },
  {
    text: `${t('screens:ok')}`,
    onPress: () => {
        console.log('idddd',id);
      dispatch(deleteClient({clientId:id}))
       .unwrap()
      .then(result => {
        if (result.status) {
          ToastNotification(`${t('screens:deletedSuccessfully')}`, 'success','long');
        } else {
          ToastNotification(`${t('screens:requestFail')}`, 'danger','long');
          console.log('dont navigate');
        }
      })
      .catch(rejectedValueOrSerializedError => {
        // handle error here
        console.log('error');
        console.log(rejectedValueOrSerializedError);
      });
    },
  },
]);



const getStatusTranslation = (status: string) => {
    if (status == 'In Active') {
        return t(`screens:InActive`);
    } else if (status == 'Pending approval') {
        return t(`screens:PendingApproval`);
    } else {
        return t(`screens:${status}`);
    }

};


  return (
          <SafeAreaView
            style={stylesGlobal.scrollBg}
        >
            <View style={stylesGlobal.appView}>

            <BasicView style={stylesGlobal.centerView}>
              <Text style={stylesGlobal.errorMessage}>{message}</Text>
           </BasicView>
           {client?.user?.phone_verified_at == null ? (
              <View style={styles.btnView}>
              <TouchableOpacity style={{marginRight:20,alignSelf:'flex-end'}}
                 onPress={() => {deleteFunc(client.id)}}
                >
                <Icon    
                  name="delete"
                  color={colors.dangerRed}
                  size={25}
                  />
              </TouchableOpacity>
              <TouchableOpacity style={{marginRight:10,alignSelf:'flex-end'}}
                 onPress={() => {navigation.navigate('Register Client',{
                    client:client
                 })}}
                >
                <Icon    
                  name="edit"
                  color={isDarkMode ? colors.white : colors.black}
                  size={25}
                  />
              </TouchableOpacity>
              </View>
               ) : (<></>)}
                <View style={[stylesGlobal.circle, { backgroundColor: colors.white, marginTop: 15, alignContent: 'center', justifyContent: 'center' }]}>
                    <Image
                        source={require('../../../assets/images/profile.png')}
                        style={{
                            resizeMode: "cover",
                            width: 90,
                            height: 95,
                            borderRadius: 90,
                            alignSelf: 'center'
                        }}
                    />
                </View>
                <Text style={{color:colors.secondary,fontFamily: 'Prompt-Bold',alignSelf:'center',fontSize:17}}>{client.name}</Text>
                <View style={{marginLeft:10}}>
                <Text style={{color: isDarkMode ? colors.white : colors.black,fontFamily: 'Prompt-Bold',}}>{t('screens:accountNumber')}</Text>
                <Text style={{color: isDarkMode ? colors.white : colors.black,marginBottom: 10,fontFamily: 'Prompt-Regular',}}>#{client?.user?.reg_number}</Text>
               <Text style={{color: isDarkMode ? colors.white : colors.black,        fontFamily: 'Prompt-Bold',}}>{t('auth:phone')}</Text>
                <TouchableOpacity style={{flexDirection:'row',marginBottom: 10}}
                 onPress={() => makePhoneCall(phoneNumber)}
                >
                <Icon    
                  name="phone"
                  color={isDarkMode ? colors.white : colors.black}
                  size={25}
                  />
                    <Text style={{paddingHorizontal:10,color: isDarkMode ? colors.white : colors.black,fontFamily: 'Prompt-Regular',}}>{client.user.phone}</Text>
                </TouchableOpacity>
         
               </View>
               <View style={{ flexDirection: 'row',marginTop:5 }}>
                    <View
                        style={[styles.status, { backgroundColor: getStatusBackgroundColor(client?.status) }]}
                    ><Text style={{ color: colors.white,fontFamily: 'Prompt-Regular', }}>{getStatusTranslation(client.status)}</Text>
                    </View>

                </View>
              <View style={{marginVertical:20}}>
              <Divider />
           
              </View>
             
            </View>
            

        </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  btnView: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 10,
  },
  iconButton: {
      marginRight: 10,
  },
  profileContainer: {
      marginTop: 15,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.white,
      borderRadius: 90,
      padding: 5,
      elevation: 3,
  },
  profileImage: {
      width: 90,
      height: 95,
      borderRadius: 90,
  },
  clientName: {
      color: colors.secondary,
      fontWeight: 'bold',
      fontSize: 18,
      textAlign: 'center',
      marginVertical: 10,
  },
  contactContainer: {
      marginHorizontal: 20,
      marginVertical: 10,
  },
  label: {
      fontWeight: 'bold',
      color: colors.secondary,
      marginBottom: 5,
  },
  phoneRow: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  phoneNumber: {
      paddingHorizontal: 10,
      color: colors.black,
  },
  statusContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 10,
  },
  status: {
      padding: 10,
      borderRadius: 15,
  },
  statusText: {
      color: colors.white,
  },
  divider: {
      marginVertical: 20,
  },
  notificationContainer: {
      alignItems: 'center',
      marginBottom: 10,
  },
});

export default ClientDetails;
