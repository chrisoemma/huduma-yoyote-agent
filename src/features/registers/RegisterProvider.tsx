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
import { globalStyles } from '../../styles/global';
import { Container } from '../../components/Container';
import { BasicView } from '../../components/BasicView';
import { TextInputField } from '../../components/TextInputField';
import { useAppDispatch } from '../../app/store';
import Button from '../../components/Button';
import { ButtonText } from '../../components/ButtonText';
import { useTranslation } from 'react-i18next';
import { validateTanzanianPhoneNumber } from '../../utils/utilts';
import { createProvider, updateProvider } from './RegisterSlice';

const RegisterProvider = ({ route, navigation }: any) => {

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
  const [provider, setProvider] = useState(null);

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: '',
      first_name: '',
      last_name: '',
      name: '',
      nida: '',
      email: ''
    },
  });


  useEffect(() => {
    if (status !== '') {
      setMessage(status);
    }
  }, [status]);

  useEffect(() => {
    const provider = route.params?.provider;
    if (provider) {
      setIsEditMode(true);
      setProvider(provider)
      setValue('first_name', provider?.first_name);
      setValue('last_name', provider?.last_name);
      setValue('phone', provider?.phone);
      setValue('nida', provider?.nida)
      setValue('email', provider?.user.email)

      navigation.setOptions({
        title: t('auth:editProvider'),
      });
    } else {
      navigation.setOptions({
        title: t('auth:registerProvider'),
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
      data.phone = validateTanzanianPhoneNumber(data.phone);
      dispatch(updateProvider({ data: data, providerId: provider?.id }))
        .unwrap()
        .then(result => {
          console.log('resultsss', result);
          if (result.status) {
            console.log('excuted this true block')
            ToastAndroid.show(`${t('screens:updatedSuccessfully')}`, ToastAndroid.SHORT);
            navigation.navigate('MyRegisters');
          } else {
            setDisappearMessage(
              `${t('screens:requestFail')}`,
            );
            console.log('dont navigate');
          }
        }).catch(rejectedValueOrSerializedError => {
          // handle error here
          setDisappearMessage(
            `${t('screens:requestFail')}`,
          );
          console.log(rejectedValueOrSerializedError);
        });
    } else {
      data.phone = validateTanzanianPhoneNumber(data.phone);
      dispatch(createProvider({ data: data, agentId: user.agent.id }))
        .unwrap()
        .then(result => {
          console.log('resultsss', result);
          if (result.status) {
            console.log('excuted this true block')
            ToastAndroid.show("User created successfuly!", ToastAndroid.SHORT);
            navigation.navigate('MyRegisters');
          } else {
            setDisappearMessage(
              `${t('screens:requestFail')}`,
            );
            console.log('dont navigate');
          }

        }).catch(rejectedValueOrSerializedError => {
          // handle error here
          setDisappearMessage(
            `${t('screens:requestFail')}`,
          );
          console.log(rejectedValueOrSerializedError);
        });

    }

  }

  const stylesGlobal = globalStyles();

  return (

    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic" 
        style={stylesGlobal.scrollBg}
      >
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
              {t('auth:firstName')}
            </Text>

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputField
                  placeholder={t('auth:enterFirstName')}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="first_name"
            />

            {errors.first_name && (
              <Text style={stylesGlobal.errorMessage}>
                {t('auth:firstNameRequired')}
              </Text>
            )}
          </BasicView>

          <BasicView>
            <Text
              style={[
                stylesGlobal.inputFieldTitle,
                stylesGlobal.marginTop20,
              ]}>
              {t('auth:lastName')}
            </Text>

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputField
                  placeholder={t('auth:enterLastName')}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="last_name"
            />

            {errors.last_name && (
              <Text style={stylesGlobal.errorMessage}>
                {t('auth:lastNameRequired')}
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
                    }
                  }}
                  value={value}
                  keyboardType='numeric'
                  maxLength={12}

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
              {t('auth:email')}
            </Text>

            <Controller
              control={control}
              rules={{
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // Regular expression for email validation
                  message: 'Invalid email address',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputField
                  placeholder={t('auth:enterEmail')}
                  onBlur={onBlur}
                  keyboardType='email-address'
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="email"
            />
            {errors.email && (
              <Text style={stylesGlobal.errorMessage}>
                {t('auth:emailRequired')}
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
              rules={{
                required: true,
                minLength: 20, maxLength: 20
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputField
                  placeholder={t('auth:enterNida')}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType='numeric'
                />
              )}
              name="nida"
            />

            {errors.nida && errors.nida.type === 'minLength' && (
              <Text style={{ color: 'red' }}>{t('auth:nida20')}</Text>
            )}

          </BasicView>
          <BasicView>
            <Button loading={loading} onPress={handleSubmit(onSubmit)}>
              <ButtonText>{isEditMode ? `${t('auth:editProvider')}` : `${t('auth:registerProvider')}`}</ButtonText>
            </Button>
          </BasicView>


        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterProvider;
