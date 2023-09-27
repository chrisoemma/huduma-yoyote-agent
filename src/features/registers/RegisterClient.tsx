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

const RegisterClient = ({ route, navigation }: any) => {

  const dispatch = useAppDispatch();
  const { user, loading, status } = useSelector(
    (state: RootStateOrAny) => state.user,
  );

  const { t } = useTranslation();


  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  const phoneInput = useRef<PhoneInput>(null);

  const [message, setMessage] = useState('');



  const makeid = (length: any) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  useEffect(() => {
    if (status !== '') {
      setMessage(status);
    }
  }, [status]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: '',
      password: '',
      name: '',
      nida: '',
    },
  });


  const setDisappearMessage = (message: any) => {
    setMessage(message);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const onSubmit = async (data: any) => {
   
    dispatch(data)
    .unwrap()
    .then(result => {
      console.log('resultsss', result);
      if (result.status) {
        console.log('excuted this true block')
        ToastAndroid.show("User created successfuly!", ToastAndroid.SHORT);

        navigation.navigate('Login', {
          screen: 'Login',
          message: message
        });
      } 

   
    })

  }

  return (

    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Container>
         
          <View>
            <BasicView style={globalStyles.centerView}>
              <Text style={globalStyles.errorMessage}>{message}</Text>
            </BasicView>

            <BasicView>
              <Text
                style={[
                  globalStyles.inputFieldTitle,
                  globalStyles.marginTop10,
                ]}>
                {t('auth:phone')}
              </Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <PhoneInput
                    ref={phoneInput}
                    placeholder="672 127 313"
                    defaultValue={value}
                    defaultCode="TZ"
                    countryPickerProps={{
                      countryCodes: ['TZ', 'KE', 'UG', 'RW', 'BI'],
                    }}
                    layout="first"
                    // onChangeText={}
                    onChangeFormattedText={text => {
                      onChange(text);
                    }}
                    withDarkTheme
                    withShadow
                    autoFocus
                    containerStyle={globalStyles.phoneInputContainer}
                    textContainerStyle={globalStyles.phoneInputTextContainer}
                    textInputStyle={globalStyles.phoneInputField}
                    textInputProps={{
                      maxLength: 9,
                    }}
                  />
                )}
                name="phone"
              />
              {errors.phone && (
                <Text style={globalStyles.errorMessage}>
                  {t('auth:phoneRequired')}
                </Text>
              )}
            </BasicView>

            <BasicView>
              <Text
                style={[
                  globalStyles.inputFieldTitle,
                  globalStyles.marginTop20,
                ]}>
               {t('auth:name')}
              </Text>

              <Controller
                control={control}
                rules={{
                  maxLength: 12,
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputField
                    placeholder= {t('auth:enterName')}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="name"
              />

              {errors.name && (
                <Text style={globalStyles.errorMessage}>
                  {t('auth:nameRequired')}
                </Text>
              )}
            </BasicView>

            <BasicView>
              <Text
                style={[
                  globalStyles.inputFieldTitle,
                  globalStyles.marginTop20,
                ]}>
                {t('auth:nida')}
              </Text>

              <Controller
                control={control}
                rules={{
                  maxLength: 12,
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputField
                    placeholder={t('auth:enterNida')}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="nida_number"
              />

            </BasicView>

            <BasicView>
              <Text
                style={[
                  globalStyles.inputFieldTitle,
                  globalStyles.marginTop20,
                ]}>
                {t('auth:password')}
              </Text>

              <View style={globalStyles.passwordInputContainer}>
                <Controller
                  control={control}
                  rules={{
                    maxLength: 12,
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={globalStyles.passwordInputField}
                      secureTextEntry={passwordVisibility}
                      placeholder={t('auth:enterPassword')}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="password"
                />

                <TouchableOpacity onPress={handlePasswordVisibility}>
                  <Icon name={rightIcon} size={20} color={colors.grey} />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={globalStyles.errorMessage}>
                  {t('auth:passwordRequired')}
                </Text>
              )}
            </BasicView>


            <BasicView>
              <Button loading={loading} onPress={handleSubmit(onSubmit)}>
                <ButtonText>{t('auth:register')}</ButtonText>
              </Button>
            </BasicView>

          
          </View>
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterClient;
