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
import { BasicView } from '../../components/BasicView';
import { TextInputField } from '../../components/TextInputField';
import { useAppDispatch } from '../../app/store';
import Button from '../../components/Button';
import messaging from '@react-native-firebase/messaging';
import { ButtonText } from '../../components/ButtonText';
import { useTranslation } from 'react-i18next';
import ToastMessage from '../../components/ToastMessage';
import CustomAlert from '../../components/Modals/CustomAlert';
import ToastNotification from '../../components/ToastNotification/ToastNotification';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import PreviewAttachment from '../../components/PreviewAttachment';
import { getTermsDoc } from '../Terms/TermsOfServiceSlice';

const RegisterScreen = ({ route, navigation }: any) => {

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { user, loading, status, isFirstTimeUser } = useSelector(
    (state: RootStateOrAny) => state.user,

  );

  const { terms } = useSelector(
    (state: RootStateOrAny) => state.terms,
  );

  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isPreviewVisible, setPreviewVisible] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const openTermsOfService = () => {

    // terms is the object add type='pdf' to it 

    const updatedTerms = { ...terms, type: 'pdf' };

    setAttachment(updatedTerms);
    setPreviewVisible(true);
  };

  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  const phoneInput = useRef<PhoneInput>(null);

  const [message, setMessage] = useState('');
  const [nidaError, setNidaError] = useState('');
  const [nidaLoading, setNidaLoading] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [confirmError, setConfirmError] = useState('');
  const [deviceToken, setDeviceToken] = useState('');

  useEffect(() => {
    dispatch(getTermsDoc())
  }, [terms?.id]);



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
    const retrieveDeviceToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log('new token', token);
        setDeviceToken(token);
      } catch (error) {
        console.log('Error retrieving device token:', error);
      }
    };

    retrieveDeviceToken();
  }, []);


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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [onConfirmCallback, setOnConfirmCallback] = useState<() => void>(() => () => { });


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

    if (!isTermsChecked) {
      ToastNotification(`${t('screens:checkTermsOfService')}`, 'danger', 'long')
      return
    }

    data.app_type = 'agent';
    data.deviceToken = deviceToken;

    setShowToast(false)

    if (data.password !== data.confirmPassword) {
      setConfirmError(t('auth:passwordMismatch'));
      setShowToast(true)
      showToastMessage(t('screens:errorOccured'));
      return;
    } else {
      setConfirmError('');
    }


    //setNidaLoading(true)
    //const nidaValidationResult = await validateNIDANumber(data.nida);
    // setNidaLoading(false)

    // if (!nidaValidationResult.obj.error || nidaValidationResult.obj.error.trim() === '') {
    setShowToast(false)
    dispatch(userRegiter(data))
      .unwrap()
      .then(result => {
        if (result.status) {
          ToastNotification(`${t('screens:userCreatedSuccessfully')}`, 'success', 'long');
          navigation.navigate('Verify', { nextPage: 'Verify' });
        } else {

          if (result.error) {
            setDisappearMessage(result.error
            );
            setShowToast(true)
            showToastMessage(t('screens:errorOccured'));
          } else {
            if (result?.message) {
              if (result?.existing_user) {
                setModalMessage(result?.message);
                setOnConfirmCallback(() => () => {
                  navigation.navigate('NewAccountPassword', { userData: result?.existing_user });
                });
                setIsModalVisible(true);
              } else {
                setDisappearMessage(result?.message);
              }

            }

            // setShowToast(true)
            // showToastMessage(t('screens:errorOccured'));
          }
        }
      })
    // } else {
    //   setNidaError(t('auth:nidaDoesNotExist'))
    //   setShowToast(true)
    //   showToastMessage(t('screens:errorOccured'));
    // }

  }


  const handleModalConfirm = () => {
    if (onConfirmCallback) onConfirmCallback();
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

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
                <>
                  <TextInputField
                    placeholder={t('auth:enterNida')}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      if (text.length <= 20) {
                        onChange(text);
                        setCharCount(text.length);
                      }
                    }}
                    value={value}
                    maxLength={20}
                    keyboardType="numeric"

                  />

                  <Text
                    style={[
                      styles.charCount,
                      { color: charCount === 20 ? 'green' : 'red' },
                    ]}
                  >
                    {charCount}/20
                  </Text>
                </>
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
            <View style={styles.TermsConditions}>

              <View>
                <BouncyCheckbox
                  size={20}
                  fillColor={colors.secondary}
                  unfillColor="#FFFFFF"
                  //  text={t('screens:termsText')}
                  iconStyle={{ borderColor: colors.secondary, }}
                  innerIconStyle={{ borderWidth: 2, borderRadius: 0, }}
                  onPress={(isChecked) => setIsTermsChecked(isChecked)}
                />
              </View>

              <View style={styles.generalTextContainer}>

                <Text style={stylesGlobal.touchablePlainTextSecondary}>
                  {t('screens:termsText')}.
                </Text>

                <TouchableOpacity onPress={openTermsOfService}
                >
                  <Text style={styles.linkText}> {t('screens:termsLink')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BasicView>


          <BasicView>
            <View style={[styles.buttonWrapper, { opacity: isTermsChecked ? 1 : 0.5 }]}>
              <Button loading={loading} onPress={handleSubmit(onSubmit)}>
                <ButtonText>{t('auth:register')}</ButtonText>
              </Button>
            </View>
          </BasicView>

          <View style={{ marginHorizontal: 20, marginBottom: 80 }}>

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
        </View>

        <CustomAlert
          isVisible={isModalVisible}
          onConfirm={handleModalConfirm}
          onCancel={handleModalCancel}
          title={t('screens:accountExists')}
          message={modalMessage}
        />

        <PreviewAttachment
          item={attachment}
          onClose={() => setPreviewVisible(false)}
        />

      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({

  loading: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 50,
    zIndex: 15000,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  TermsConditions: {
    marginTop: '7%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4%'
  },
  buttonWrapper: {
    marginVertical: 15,
  },
  linkText: {
    color: colors.secondary,
    fontSize: 13,
    textDecorationLine: 'underline',
    fontFamily: 'Prompt-Regular',
    fontWeight: 'bold'
  },
  charCount: {
    fontSize: 13,
    marginTop: 5,
    textAlign: 'right',
  },
});

export default RegisterScreen;
