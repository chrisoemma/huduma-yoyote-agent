import { View, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/global'
import { colors } from '../../utils/colors';
import { useSelector, RootStateOrAny } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { formatAmountWithCommas, formatDate, getRandomColorWithOpacity, getStatusBackgroundColor } from '../../utils/utilts';

const CommissionDetails = ({ route }: any) => {

    const { isDarkMode } = useSelector(
        (state: RootStateOrAny) => state.theme,
    );

    const { t } = useTranslation();
    const { commission } = route.params
    const stylesGlobal = globalStyles();

    const getStatusTranslation = (status: string) => {
        const formattedStatus = status.replace(/-/g, '');
        return t(`screens:${formattedStatus}`);
    };


    const sum = commission?.payments.reduce((total, payment) => total + payment.amount, 0);

    return (
        <ScrollView style={stylesGlobal.scrollBg}>

            <SafeAreaView>
                <View style={[styles.container, { backgroundColor: isDarkMode ? colors.darkModeBackground : colors.white }]}>
                    <View style={styles.firstBlock}>
                        <Text style={{ color: isDarkMode ? colors.white : colors.black,   fontFamily: 'Prompt-Bold', }}>{commission?.provider ? t('screens:provider') : t('screens:client')}: {commission.user_type=='Provider' ?commission?.provider?.name  : commission?.client?.name}</Text>
                        <Text style={{ color: isDarkMode ? colors.white : colors.black, fontSize: 15,    fontFamily: 'Prompt-SemiBold',}}>{t('screens:amount')}: {formatAmountWithCommas(commission?.amount)}</Text>
                    </View>

                    <View style={styles.secondBlock}>
                        <View>
                            
                            <Text style={{ color: isDarkMode ? colors.white : colors.black,   fontFamily: 'Prompt-Regular', }}>{t('screens:date')}: {formatDate(commission?.created_at)}</Text>
                            <Text style={{ marginVertical: 10, color: isDarkMode ? colors.white : colors.black, fontFamily: 'Prompt-Regular', }}>{t('screens:payment_for')}: {getStatusTranslation(commission?.payment_for)}</Text>
                            
                        </View>
                        <TouchableOpacity
                            style={[styles.status, { backgroundColor: getStatusBackgroundColor(commission?.status) }]}
                        ><Text style={{ color: colors.white,   fontFamily: 'Prompt-Regular', }}>{getStatusTranslation(commission.status)}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.divider, { borderColor: isDarkMode ? colors.white : colors.grey }]} />
                    <Text style={{ alignSelf: 'center', fontSize: 15, margin: 5, color: isDarkMode ? colors.white : colors.black,    fontFamily: 'Prompt-SemiBold', }}>{t('screens:commissionPayments')}</Text>

                    {commission?.payments?.map((payment, index) => (
                        <View>
                            <View style={[styles.circle, { backgroundColor: getRandomColorWithOpacity() }]}><Text
                                style={{ color: colors.white }}>{index + 1}</Text></View>
                            <View style={styles.firstPaymentDiv}>
                                <Text style={{ color: isDarkMode ? colors.white : colors.black, fontSize: 15,    fontFamily: 'Prompt-regular', }}>{t('screens:amount')}: {formatAmountWithCommas(payment?.amount)}</Text>
                                <View style={[styles.Verticalline,{  backgroundColor:isDarkMode?colors.white:colors.black }]} />
                                <Text style={{ color: isDarkMode ? colors.white : colors.black,   fontFamily: 'Prompt-Regular', }}>{t('screens:date')}: {formatDate(payment?.payment_date)}</Text>
                            </View>
                            <View style={styles.firstPaymentDiv}>
                                <TouchableOpacity
                                    style={[styles.status, { backgroundColor: getStatusBackgroundColor(payment?.status) }]}
                                ><Text style={{ color: colors.white,   fontFamily: 'Prompt-Regular', }}>{getStatusTranslation(payment.status)}</Text>
                                </TouchableOpacity>
                            </View>
                            <View  style={[styles.dottedLine]}/>
                        </View>

                    ))}
                        <Text style={{color: isDarkMode ? colors.white : colors.black, fontSize: 15,    fontFamily: 'Prompt-Regular',marginVertical:10}}>{t('screens:totalPaidAmount')}: { commission?.payments ?formatAmountWithCommas(sum):'0.00'}</Text>
                        <Text style={{color: isDarkMode ? colors.white : colors.black, fontSize: 15,    fontFamily: 'Prompt-Regular',}}>{t('screens:remainingAmount')}: {commission?.payments ?formatAmountWithCommas(commission?.amount-sum):''}</Text>
                   
                </View>
            </SafeAreaView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({

    container: {
        margin: 10,
        padding: 15,
        borderRadius: 20,
        elevation: 2
    },
    firstBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    status: {
        marginVertical: 10,
        padding: 8,
        borderRadius: 10
    },
    secondBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15
    },
    divider: {
        borderWidth: 0.4,
    },
    firstPaymentDiv: {
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:10
    },
    dottedLine: {
        borderWidth: 1,
        borderRadius: 1,
        margin:1,
        borderColor: 'black',
        borderStyle: 'dotted',
        width: '100%',
      },
      Verticalline:{
        width: 1, 
        height: '100%',
      
      },
      total:{
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
      }
})

export default CommissionDetails