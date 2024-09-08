import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  ToastAndroid,
} from 'react-native';


import { useForm, Controller } from 'react-hook-form';
import { RootStateOrAny, useSelector } from 'react-redux';
import { globalStyles } from '../../styles/global';
import PhoneInput from 'react-native-phone-number-input';
import { colors } from '../../utils/colors';
import { BasicView } from '../../components/BasicView';
import { TextInputField } from '../../components/TextInputField';
import { useAppDispatch } from '../../app/store';
import Button from '../../components/Button';
import { ButtonText } from '../../components/ButtonText';
import { useTranslation } from 'react-i18next';
import { updateUserInfo} from '../auth/userSlice';
import { validateTanzanianPhoneNumber } from '../../utils/utilts';
import ToastMessage from '../../components/ToastMessage';
import Location from '../../components/Location';
import ToastNotification from '../../components/ToastNotification/ToastNotification';

const EditAccount = ({ route, navigation }: any) => {


  const dispatch = useAppDispatch();
  const { user, loading,residence,  status } = useSelector(
    (state: RootStateOrAny) => state.user,
  );

  const phoneInput = useRef<PhoneInput>(null);

  const [location, setLocation] = useState({} as any);

  const [message, setMessage] = useState('');
  const [gLocation, setGLocation] = useState({})

  const { t } = useTranslation();

  const [regionValue, setRegionValue] = useState(null);
  const [districtValue, setDistrictValue] = useState(null);
  const [wardValue, setWardValue] = useState(null);
  const [streetValue, setStreetValue] = useState(null);
  const [nidaLoading, setNidaLoading] = useState(false)

  useEffect(() => {
    const cleanedPhone = user?.phone?.replace(/\+/g, '');
    setValue('name', user?.agent.name);
    setValue('first_name', user?.agent.first_name);
    setValue('last_name', user?.agent.last_name);
    setValue('phone', cleanedPhone);
    setValue('email', user?.email);
    setValue('nida', user?.nida);
    setGLocation({ latitude: user?.agent?.latitude, longitude: user?.agent?.longitude })

  }, [route.params]);

  const lastNidaStatus = user?.agent?.nida_statuses?.[user?.agent?.nida_statuses.length - 1]?.status;

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: '',
      email: '',
      name: '',
      first_name: '',
      last_name: '',
      nida: ''
    },
  });

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
    }, 10000);
  };

  // const selectLocation = (locationSelected: any) => {
  //   console.log('Location selected ::');
  //   console.log(locationSelected);
  //   setLocation(locationSelected);
  // };

  const setDisappearMessage = (message: any) => {
    setMessage(message);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const onSubmit = async (data: any) => {


    data.latitude = location?.lat
    data.longitude = location?.lng
    data.location_id = streetValue
    //data.status = 'S.Valid'
    data.phone = validateTanzanianPhoneNumber(data.phone);

    setShowToast(false)
    dispatch(updateUserInfo({ data: data, userType: 'agent', userId: user?.id }))
      .unwrap()
      .then(result => {
        console.log('resultsss', result);
        if (result.status) {         
          ToastNotification(`${t('screens:userUpatedSuccessfully')}`, 'success','long');
          navigation.navigate('Account', {
            screen: 'Account',
            message: message
          });
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
      })

  }

  const stylesGlobal = globalStyles();


  const finalRegionValue = (value) => {
    setRegionValue(value)
  }

  const finalDistrictValue = (value) => {
    setDistrictValue(value)
  }

  const finalWardValue = (value) => {
    setWardValue(value)
  }

  const finalStreetValue = (value) => {
    setStreetValue(value)
  }
  const getRegionValue = (regionValue) => {
    if (regionValue !== null) {
      finalRegionValue(regionValue)
    }
  }

  const getDistrictValue = (districtValue) => {
    finalDistrictValue(districtValue)
  }

  const getWardValue = (wardValue) => {
    finalWardValue(wardValue)
  }
  const getStreetValue = (streetValue) => {
    finalStreetValue(streetValue || '')
  }

  return (

    <SafeAreaView style={stylesGlobal.scrollBg}>
      {showToast ? (
        <View style={{ marginBottom: '20%' }}>
          <ToastMessage message={toastMessage} onClose={toggleToast} />
        </View>) : (<></>)
      }
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
                  keyboardType="phone-pad"
                  maxLength={12}
                  editable={!user?.phone_verified_at}
                />
              )}
              name="phone"
            />
            {/* {user?.phone_verified_at && (
              <Text style={{ color: colors.successGreen }}>
                {t('screens:phoneVerified')}
              </Text>
            )} */}

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
              {t('auth:email')}
            </Text>

            <Controller
              control={control}
              rules={{
                required: true,
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

                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputField
                  placeholderTextColor={colors.alsoGrey}
                  placeholder={t('auth:enterNida')}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType='numeric'
                  editable={lastNidaStatus=='A.Valid'?false:true}
                />
              )}
              name="nida"
            />
          </BasicView>
{/*           
          <BasicView style={stylesGlobal.marginTop20}>

            <BasicView style={stylesGlobal.marginTop20}>
              <Text style={stylesGlobal.inputFieldTitle}>{t('screens:location')}:</Text>
              <GooglePlacesInput
                setLocation={selectLocation}
                placeholder={t('screens:whatsYourLocation')}
                defaultValue={gLocation}
              />
            </BasicView>

          </BasicView> */}

         <BasicView style={stylesGlobal.marginTop20}>
            <Text style={{
              color: colors.primary, fontSize: 20
            }}>{t('screens:location')}:</Text>
            <Location
              getRegionValue={getRegionValue}
              getDistrictValue={getDistrictValue}
              getWardValue={getWardValue}
              getStreetValue={getStreetValue}
              initialRegion={residence?.region?.region_code}
              initialDistrict={residence?.district?.district_code}
              initialWard={residence?.ward?.ward_code}
              initialStreet={residence?.area?.id}
            />

          </BasicView>

          <BasicView>
            <Button loading={loading} onPress={handleSubmit(onSubmit)}>
              <ButtonText>{t('navigate:editAccount')}</ButtonText>
            </Button>
          </BasicView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditAccount;
