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
  ActivityIndicator,
  Dimensions,
  StyleSheet,
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
import { transformDataToDropdownOptions, validateNIDANumber, validateTanzanianPhoneNumber } from '../../utils/utilts';
import { createProvider, updateProvider } from './RegisterSlice';
import { colors } from '../../utils/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import { getProfessions } from '../professionsSlice';
import ToastMessage from '../../components/ToastMessage';

const RegisterProvider = ({ route, navigation }: any) => {


  const WIDTH = Dimensions.get("window").width;
  const dispatch = useAppDispatch();
  const { user } = useSelector(
    (state: RootStateOrAny) => state.user,
  );

  const { loading, status } = useSelector(
    (state: RootStateOrAny) => state.registers,
  );

  const { professions, profesionsLoading } = useSelector(
    (state: RootStateOrAny) => state.professions,
  );

  const { t } = useTranslation();
  const { selectedLanguage } = useSelector(
    (state: RootStateOrAny) => state.language,
  );
  useEffect(() => {
    dispatch(getProfessions({ language: selectedLanguage }));

  }, [selectedLanguage])



  const [message, setMessage] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [provider, setProvider] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setDropValue] = useState([]);
  const [designationError, setDesignationError] = useState('')
  const [nidaLoading, setNidaLoading] = useState(false)
  const [nidaError, setNidaError] = useState('');

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
      email: '',
      business_name: '',
    },
  });


  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);


  const toggleToast = () => {
    setShowToast(!showToast);
  };



  // Function to show the toast message
  const showToastMessage = (message) => {
    setToastMessage(message);
    toggleToast(); // Show the toast message
    setTimeout(() => {
      toggleToast(); // Hide the toast message after a delay
    }, 5000); // Adjust duration as per your requirement
  };

  useEffect(() => {
    const provider = route.params?.provider;
    if (provider) {
      const cleanedPhone = provider?.user?.phone?.replace(/\+/g, '');
      setIsEditMode(true);
      setProvider(provider)
      setValue('first_name', provider?.first_name);
      setValue('last_name', provider?.last_name);
      setValue('business_name', provider?.business_name);
      setValue('phone', cleanedPhone);
      setValue('nida', provider?.nida)
      setValue('email', provider?.user.email)
      setDropValue(JSON.stringify(provider?.designation_id))

      navigation.setOptions({
        title: t('auth:editProvider'),
      });
    } else {
      navigation.setOptions({
        title: t('auth:registerProvider'),
      });
    }
  }, [route.params]);

  // useEffect(() => {
  //   if (status !== '') {
  //     setMessage(status);
  //   }
  // }, [status]);



  const setDisappearMessage = (message: any) => {
    setMessage(message);

    setTimeout(() => {
      setMessage('');
    }, 10000);
  };

  const onSubmit = async (data: any) => {
    data.designation_id = value;

    if (isEditMode) {
      data.phone = validateTanzanianPhoneNumber(data.phone);
      
      setNidaLoading(true)
      const nidaValidationResult = await validateNIDANumber(data.nida);
      setNidaLoading(false)

      if (!nidaValidationResult.obj.error || nidaValidationResult.obj.error.trim() === '') {
       
        dispatch(updateProvider({ data: data, providerId: provider?.id }))
          .unwrap()
          .then(result => {
            console.log('resultsss', result);
            if (result.status) {
              console.log('excuted this true block')
              ToastAndroid.show(`${t('screens:updatedSuccessfully')}`, ToastAndroid.SHORT);
              navigation.navigate('MyRegisters');
            } else {
              if (result.error) {
                setDisappearMessage(result.error
                );
              } else {
                setDisappearMessage(result.message);
              }
              setShowToast(true)
              showToastMessage(t('screens:errorOccured'));
            }
          }).catch(rejectedValueOrSerializedError => {
            // handle error here
            setDisappearMessage(
              `${t('screens:requestFail')}`,
            );
            setShowToast(true)
            showToastMessage(t('screens:errorOccured'));
          });

      } else {
        setNidaError(t('auth:nidaDoesNotExist'))
        setShowToast(true)
        showToastMessage(t('screens:errorOccured'));
      }

      //End ofEdit mode
    } else {

      setNidaLoading(true)
      const nidaValidationResult = await validateNIDANumber(data.nida);
      setNidaLoading(false)

      if (!nidaValidationResult.obj.error || nidaValidationResult.obj.error.trim() === '') {


    
        // return 
        if (value.length < 1) {
          setDesignationError(`${t('auth:designationError')}`)
          setShowToast(true)
          showToastMessage(t('screens:errorOccured'));
          return
        } else {
          setDesignationError('');
          setShowToast(false)
        }
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
              if (result.error) {
                setDisappearMessage(result.error
                );
                setShowToast(true)
               showToastMessage(t('screens:errorOccured'));
              } else {
                setDisappearMessage(result.message);
              }
            }

          }).catch(rejectedValueOrSerializedError => {
            // handle error here
            setDisappearMessage(
              `${t('screens:requestFail')}`,
            );
            setShowToast(true)
            showToastMessage(t('screens:errorOccured'));
          ;
          });

      } else {
        setNidaError(t('auth:nidaDoesNotExist'))
        setShowToast(true)
        showToastMessage(t('screens:errorOccured'));
      }
    }


  }

  const stylesGlobal = globalStyles();

  return (

    <SafeAreaView style={{ flex: 1 }}>
     <View style={styles.container}>
     
        {showToast?(
        <View style={{marginBottom:'20%'}}>
        <ToastMessage message={toastMessage} onClose={toggleToast} />
        </View>):(<></>)
        }
        

      <ScrollView contentInsetAdjustmentBehavior="automatic"
        style={[stylesGlobal.scrollBg,{  flexGrow: 1,}]}
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
                placeholderTextColor={colors.alsoGrey}
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
              {t('auth:businessName')}
            </Text>

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputField
                placeholderTextColor={colors.alsoGrey}
                  placeholder={t('auth:enterBusinessName')}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="business_name"
            />

            {errors.business_name && (
              <Text style={stylesGlobal.errorMessage}>
                {t('auth:businessNameRequired')}
              </Text>
            )}
          </BasicView>

          <BasicView>

            <View
              style={{

                marginVertical: 30
              }}
            >
              <Text
                style={[
                  stylesGlobal.inputFieldTitle,
                  stylesGlobal.marginTop20,
                ]}>
                {t('screens:chooseProfessions')}
              </Text>
              {profesionsLoading ? <View style={styles.loading}>
                <ActivityIndicator size='large' color={colors.primary} />
              </View> : <></>}
              <DropDownPicker
                containerStyle={{
                  width: WIDTH / 1.1,
                  marginRight: 10,
                }}
                zIndex={6000}
                placeholder={t(`screens:chooseProfessions`)}
                listMode="SCROLLVIEW"
                searchable={true}
                open={open}
                value={value}
                items={transformDataToDropdownOptions(professions)}
                setOpen={setOpen}
                setValue={setDropValue}

              />

              {designationError && (
                <Text style={stylesGlobal.errorMessage}>
                  {designationError}
                </Text>
              )}
            </View>
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
                placeholderTextColor={colors.alsoGrey}
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
                required:true,
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

          <BasicView style={{marginBottom:'40%'}}>
            <Button loading={nidaLoading || loading} onPress={handleSubmit(onSubmit)}>
              <ButtonText>{isEditMode ? `${t('auth:editProvider')}` : `${t('auth:registerProvider')}`}</ButtonText>
            </Button>
          </BasicView>

          
        </View>

      </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Adjust as needed
  },
  errorMessage: {
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
    marginVertical: 20,
  },
});

export default RegisterProvider;
