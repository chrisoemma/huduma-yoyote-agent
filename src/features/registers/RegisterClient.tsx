import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import { useForm, Controller } from 'react-hook-form';
import { RootStateOrAny, useSelector } from 'react-redux';
//import { userRegiter } from '../';
import { globalStyles } from '../../styles/global';
import { useTogglePasswordVisibility } from '../../hooks/useTogglePasswordVisibility';
import PhoneInput from 'react-native-phone-number-input';
import { colors } from '../../utils/colors';
import { Container } from '../../components/Container';
import { BasicView } from '../../components/BasicView';
import { TextInputField } from '../../components/TextInputField';
import { useAppDispatch } from '../../app/store';
import Button from '../../components/Button';
import { ButtonText } from '../../components/ButtonText';
import { useTranslation } from 'react-i18next';
import { createClient, updateClient } from './RegisterSlice';
import { validateTanzanianPhoneNumber } from '../../utils/utilts';

const RegisterClient = ({ route, navigation }: any) => {

  const dispatch = useAppDispatch();
  const { user } = useSelector(
    (state: RootStateOrAny) => state.user,
  );

  const { loading, status } = useSelector(
    (state: RootStateOrAny) => state.registers,
  );

  const { t } = useTranslation();



  const [message, setMessage] = useState('');


  const [isEditMode, setIsEditMode] = useState(false);

  const [client, setClient] = useState(null);

  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: '',
      name: '',
      nida: '',
    },
  });



  useEffect(() => {
    const client = route.params?.client;
    if (client) {
      setIsEditMode(true);
      setClient(client)
      setValue('name', client?.name);
      setValue('phone', client?.user.phone);
      setValue('nida', client.nida)

      navigation.setOptions({
        title: t('auth:editClient'),
      });
    } else {
      navigation.setOptions({
        title: t('auth:registerClient'),
      });
    }
  }, [route.params]);

  useEffect(() => {
    if (status !== '') {
      setMessage(status);
    }
  }, [status]);




  const setDisappearMessage = (message: any) => {
    setMessage(message);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const onSubmit = async (data: any) => {


    if (isEditMode) {
       
      const phone = validateTanzanianPhoneNumber(data.phone);

        data.phone = phone;

      dispatch(updateClient({ data: data, clientId: client?.id }))
        .unwrap()
        .then(result => {
          console.log('resultsss', result);
          if (result.status) {
            console.log('excuted this true block')
            ToastAndroid.show(`${t('screens:updatedSuccessfully')}`, ToastAndroid.LONG);
            navigation.navigate('MyRegisters');
          }
        })

    } else {
      data.phone = validateTanzanianPhoneNumber(data?.phone);
      dispatch(createClient({ data: data, agentId: user?.agent?.id }))
        .unwrap()
        .then(result => {
          console.log('resultsss', result);
          if (result.status) {
            console.log('excuted this true block')
            ToastAndroid.show(`${t('screens:createdSuccessfully')}`, ToastAndroid.SHORT);
            navigation.navigate('MyRegisters');
          }
        })

    }

  }
  const stylesGlobal = globalStyles();

  return (

    <SafeAreaView style={stylesGlobal.scrollBg}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          <BasicView style={stylesGlobal.centerView}>
            <Text style={stylesGlobal.errorMessage}>{message}</Text>
          </BasicView>



          <BasicView>
            <Text
              style={[
                stylesGlobal.inputFieldTitle,
                stylesGlobal.marginTop20,
              ]}>
              {t('auth:name')}
            </Text>

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputField
                  placeholder={t('auth:enterName')}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="name"
            />

            {errors.name && (
              <Text style={stylesGlobal.errorMessage}>
                {t('auth:nameRequired')}
              </Text>
            )}
          </BasicView>

          <BasicView>
            <Text
              style={[
                stylesGlobal.inputFieldTitle,
                stylesGlobal.marginTop20,
              ]}>
              {t('auth:phone')}
            </Text>

            <Controller
              control={control}
              rules={{
                minLength: 10,
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputField
                  placeholder={t('screens:enterPhone')}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    // Remove any non-numeric characters
                    const cleanedText = text.replace(/\D/g, '');

                    // Check if it starts with '0' or '+255'/'255'
                    if (cleanedText.startsWith('0') && cleanedText.length <= 10) {
                      onChange(cleanedText);
                    } else if (
                      (cleanedText.startsWith('255') ||
                        cleanedText.startsWith('+255')) &&
                      cleanedText.length <= 12
                    ) {
                      onChange(cleanedText);
                      console.log('this block is doen')
                      setError('phone', { type: 'manual', message: 'Please enter a valid phone number' });
                    }
                  }}
                  value={value}
                  keyboardType='numeric'
                  

                />
              )}
              name="phone"
            />
            {errors.phone && (
              <Text style={stylesGlobal.errorMessage}>
                {t('auth:phoneRequired')}
              </Text>
            )}
          </BasicView>

          <BasicView>
            <Text
              style={[
                stylesGlobal.inputFieldTitle,
                stylesGlobal.marginTop20,
              ]}>
              {t('auth:nida')}
            </Text>

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputField
                  placeholder={t('auth:enterNida')}
                  onBlur={onBlur}
                  keyboardType='numeric'
                  onChangeText={onChange}
                  value={value}
                  maxLength={20}
                />
              )}
              name="nida"
            />

          </BasicView>

          <BasicView>
            <Button loading={loading} onPress={handleSubmit(onSubmit)}>
              <ButtonText>{isEditMode ? `${t('auth:editClient')}` : `${t('auth:registerClient')}`}</ButtonText>
            </Button>
          </BasicView>


        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterClient;
