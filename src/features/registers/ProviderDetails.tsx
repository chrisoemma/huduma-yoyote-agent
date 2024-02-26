import { View, Text, SafeAreaView, Image, Alert, ToastAndroid, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useCallback, useState, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next';
import { globalStyles } from '../../styles/global';
import { colors } from '../../utils/colors';
import { makePhoneCall } from '../../utils/utilts';
import Divider from '../../components/Divider';
import Icon from 'react-native-vector-icons/AntDesign';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppDispatch } from '../../app/store';
import { BasicView } from '../../components/BasicView';
import { deleteProvider } from './RegisterSlice';
import { useSelector } from 'react-redux';


const ProviderDetails = ({ route, navigation }: any) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const provider = route.params?.provider;

  const phoneNumber = `${provider.user.phone}`;
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [message, setMessage] = useState("")

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
    Alert.alert(`${t('screens:deleteProvider')}`, `${t('screens:areYouWantToDelete')}`, [
      {
        text: `${t('screens:cancel')}`,
        onPress: () => console.log('Cancel task delete'),
        style: 'cancel',
      },
      {
        text: `${t('screens:ok')}`,
        onPress: () => {

          dispatch(deleteProvider({ providerId: id }))
            .unwrap()
            .then(result => {
              if (result.status) {
                ToastAndroid.show(`${t('screens:deletedSuccessfully')}`, ToastAndroid.SHORT);
                navigation.navigate('MyRegisters');
              } else {
                setDisappearMessage(
                  `${t('screens:requestFail')}`,
                );
                console.log('dont navigate');
              }

              console.log('resultsss', result)
            })
            .catch(rejectedValueOrSerializedError => {
              // handle error here
              console.log('error');
              console.log(rejectedValueOrSerializedError);
            });
        },
      },
    ]);



  const stylesGlobal = globalStyles();

  return (
    <SafeAreaView
      style={stylesGlobal.scrollBg}
    >
      <View style={stylesGlobal.appView}>

        <BasicView style={stylesGlobal.centerView}>
          <Text style={stylesGlobal.errorMessage}>{message}</Text>
        </BasicView>
        {provider?.user?.phone_verified_at == null ? (
          <View style={styles.btnView}>

            <TouchableOpacity style={{ marginRight: 20, alignSelf: 'flex-end' }}
              onPress={() => { deleteFunc(provider.id) }}
            >
              <Icon
                name="delete"
                color={colors.dangerRed}
                size={25}
              />
            </TouchableOpacity>

            <TouchableOpacity style={{ marginRight: 10, alignSelf: 'flex-end' }}
              onPress={() => {
                navigation.navigate('Register Provider', {
                  provider: provider
                })
              }}
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
        <Text style={{ color: colors.secondary, fontWeight: 'bold', alignSelf: 'center' }}>{provider.name}</Text>
        <View>
          <TouchableOpacity style={{ flexDirection: 'row', margin: 10 }}
            onPress={() => makePhoneCall(phoneNumber)}
          >
            <Icon
              name="phone"
              color={isDarkMode ? colors.white : colors.black}
              size={25}
            />
            <Text style={{ paddingHorizontal: 10, color: isDarkMode ? colors.white : colors.black }}>{provider.user.phone}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', margin: 10 }}
          >
            <Icon
              name="mail"
              color={isDarkMode ? colors.white : colors.black}
              size={25}
            />
            <Text style={{ paddingHorizontal: 10, color: isDarkMode ? colors.white : colors.black }}>{provider.user.email}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ flexDirection: 'row', margin: 10 }}
          >
            <Icon
              name="infocirlce"
              color={isDarkMode ? colors.white : colors.black}
              size={25}
            />
            <Text style={{ paddingHorizontal: 10, color: isDarkMode ? colors.white : colors.black }}>{provider?.nida}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginVertical: 20 }}>
          <Divider />

        </View>

      </View>


    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContentContainer: {
    margin: 15,
    backgroundColor: 'white',
    height: '60%',
    padding: 10,
    borderRadius: 10,
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  bottomSheetContainer: {
    // flex: 1,
    margin: 10,
    zIndex: 1000
  },
  bottomSheetContentContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  category: {
    textTransform: 'uppercase',
    color: colors.secondary,
    marginTop: 15,
  },
  service: {
    paddingTop: 5,
    fontWeight: 'bold',
    color: colors.black,
  },
  status: {
    alignSelf: 'flex-end',
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
  },
  descContainer: {
    marginBottom: 8
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});

export default ProviderDetails