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
  StyleSheet,
  Linking,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import { useForm, Controller } from 'react-hook-form';
import { RootStateOrAny, useSelector } from 'react-redux';
import { setFirstTime, userRegiter } from './userSlice';
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
import ToastMessage from '../../components/ToastMessage';
import { formatErrorMessages, showErrorWithLineBreaks, validateNIDANumber } from '../../utils/utilts';

const RegisterScreen = ({ route, navigation }: any) => {

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { user, loading, status, isFirstTimeUser } = useSelector(
    (state: RootStateOrAny) => state.user,
  );

  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  const phoneInput = useRef<PhoneInput>(null);

  const [message, setMessage] = useState('');
  const [nidaError, setNidaError] = useState('');
  const [nidaLoading, setNidaLoading] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState('');



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

  // useEffect(() => {
  //   if (status !== '') {
  //     setMessage(status);
  //   }
  // }, [status]);


  useEffect(() => {
    if (isFirstTimeUser) {
      dispatch(setFirstTime(false))
    }
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: '',
      password: '',
      first_name: '',
      last_name: '',
      nida: '',
      confirmPassword: '',
    },
  });


  const setDisappearMessage = (message: any) => {
    setMessage(message);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const [toastMessage, setToastMessage] = useState(''); 
  const [showToast, setShowToast] = useState(false);

  
  const toggleToast = () => {
    setShowToast(!showToast);
  };
  const showToastMessage = (message) => {
    setToastMessage(message);
    toggleToast();
    setTimeout(() => {
      toggleToast(); 
    }, 5000); 
  };

  const onSubmit = async (data: any) => {
    data.app_type = 'agent';

    setShowToast(false)

    if (data.password !== data.confirmPassword) {
      setConfirmError(t('auth:passwordMismatch'));
      setShowToast(true)
      showToastMessage(t('screens:errorOccured'));
      return;
    } else {
      setConfirmError('');
    }


    setNidaLoading(true)
    const nidaValidationResult = await validateNIDANumber(data.nida);
    setNidaLoading(false)

    if (!nidaValidationResult.obj.error || nidaValidationResult.obj.error.trim() === '') {
      setShowToast(false)
      dispatch(userRegiter(data))
        .unwrap()
        .then(result => {
          console.log('resultsss', result);
          if (result.status) {

            ToastAndroid.show(`${t('auth:userCreatedSuccessfully')}`, ToastAndroid.LONG);
            navigation.navigate('Verify', { nextPage: 'Verify' });
          } else {
         
            if (result.error) {
              setDisappearMessage(result.error
              );
              setShowToast(true)
              showToastMessage(t('screens:errorOccured'));
            } else {
              if(result.message){
                setDisappearMessage(result.message);
              }
              setDisappearMessage("Something is not right please contact administartor");
              setShowToast(true)
              showToastMessage(t('screens:errorOccured'));
            }
          }
        })
    } else {
      setNidaError(t('auth:nidaDoesNotExist'))
      setShowToast(true)
      showToastMessage(t('screens:errorOccured'));
    }

  }

  const { isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
  );


  const stylesGlobal = globalStyles();

  return (

    <SafeAreaView style={stylesGlobal.scrollBg}>
        {showToast && <ToastMessage message={toastMessage} onClose={toggleToast} />}
      <ScrollView contentInsetAdjustmentBehavior="automatic">

        <View style={stylesGlobal.centerView}>
          <Image
            source={isDarkMode ? require('./../../../assets/images/white.png') : require('./../../../assets/images/logo.png')}
            style={[stylesGlobal.verticalLogo, { height: 100, marginTop: 30 }]}
          />
        </View>

        <View>
          <BasicView style={stylesGlobal.centerView}>
            <Text style={stylesGlobal.errorMessage}>{message}</Text>
          </BasicView>

          <BasicView>
            <Text
              style={[
                stylesGlobal.inputFieldTitle,
                stylesGlobal.marginTop10,
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
                  placeholder="714 055 666"
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
                  containerStyle={stylesGlobal.phoneInputContainer}
                  textContainerStyle={stylesGlobal.phoneInputTextContainer}
                  textInputStyle={stylesGlobal.phoneInputField}
                  textInputProps={{
                    maxLength: 9,
                  }}
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
              {t('auth:firstName')}
            </Text>

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputField
                placeholderTextColor={colors.alsoGrey}
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
                placeholderTextColor={colors.alsoGrey}
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
              {t('auth:nida')}
            </Text>


            <Controller
              control={control}
              rules={{
                required: true,
                validate: (value) => {
                  if (value.length !== 20) {
                    setNidaError(t('auth:nida20numbers'));
                    return false;
                  }
                  setNidaError('');
                  return true;
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputField
                placeholderTextColor={colors.alsoGrey}
                  placeholder={t('auth:enterNida')}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType='numeric'
                />
              )}
              name="nida"
            />
             {errors.nida && (
              <Text style={stylesGlobal.errorMessage}>
                {t('auth:nidaEmptyError')}
              </Text>
            )}
            {nidaError && (
              <Text style={stylesGlobal.errorMessage}>
                {nidaError}
              </Text>
            )}
          </BasicView>

          <BasicView>
            <Text
              style={[
                stylesGlobal.inputFieldTitle,
                stylesGlobal.marginTop20,
              ]}>
              {t('auth:password')}
            </Text>

            <View style={stylesGlobal.passwordInputContainer}>
              <Controller
                control={control}
                rules={{

                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[stylesGlobal.passwordInputField,
                    { backgroundColor: colors.white, color: colors.black }
                    ]}
                    secureTextEntry={passwordVisibility}
                    placeholder="Enter Password"
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
              <Text style={stylesGlobal.errorMessage}>
                {t('auth:passwordRequired')}
              </Text>
            )}
          </BasicView>

          <BasicView>
            <Text
              style={[
                stylesGlobal.inputFieldTitle,
                stylesGlobal.marginTop20,
              ]}>
              {t('auth:confirmPassword')}
            </Text>

            <View style={stylesGlobal.passwordInputContainer}>
              <Controller
                control={control}
                rules={{
                  required: true,
                  validate: (value) => value === confirmPassword,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[stylesGlobal.passwordInputField,
                    { backgroundColor: colors.white, color: colors.black }
                    ]}
                    secureTextEntry={passwordVisibility}
                    placeholder={t('auth:confirmPassword')}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      onChange(text);
                    }}
                    value={value}
                  />
                )}
                name="confirmPassword"
              />
              <TouchableOpacity onPress={handlePasswordVisibility}>
                <Icon name={rightIcon} size={20} color={colors.grey} />
              </TouchableOpacity>
            </View>
            {confirmError && (
              <Text style={stylesGlobal.errorMessage}>
                {t('auth:passwordMismatch')}
              </Text>
            )}
          </BasicView>


          <BasicView>
            <Button loading={loading || nidaLoading} onPress={handleSubmit(onSubmit)}>
              <ButtonText>{t('auth:register')}</ButtonText>
            </Button>
          </BasicView>

          <View style={{marginHorizontal: 20, marginBottom: 80 }}>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Login');
            }}
            style={[stylesGlobal.marginTop20, stylesGlobal.centerView]}>
            <Text style={stylesGlobal.touchablePlainTextSecondary}>
              {t('auth:alreadyHaveAccount')}
            </Text>
          </TouchableOpacity>
          </View>


          <View style={internalstyles.TermsConditions}>
            <Text style={stylesGlobal.touchablePlainTextSecondary}>
              {t('screens:termsText')}{' '}
              <TouchableOpacity onPress={() => Linking.openURL('https://your-terms-url.com')}>
                <Text style={internalstyles.linkText}>{t('screens:termsLink')}</Text>
              </TouchableOpacity>
              {` ${t('screens:termsContinueText')} `}
              <TouchableOpacity onPress={() => Linking.openURL('https://your-privacy-policy-url.com')}>
                <Text style={internalstyles.linkText}>{t('screens:privacyPolicyLink')}</Text>
              </TouchableOpacity>
              {` ${t('screens:continuePrivacyPolicy')} `}
            </Text>
          </View>


        </View>

      </ScrollView>
    </SafeAreaView>
  );
};


const internalstyles = StyleSheet.create({
  TermsConditions: {
    marginTop: '10%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom:'3%'
  },
  linkText: {
    color: colors.secondary,
    textDecorationLine: 'underline',
    fontWeight:'bold'
  },
});

export default RegisterScreen;
