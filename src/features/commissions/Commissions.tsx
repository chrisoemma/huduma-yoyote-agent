import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../../styles/global'
import { colors } from '../../utils/colors'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../../app/store'
import { useSelector, RootStateOrAny } from 'react-redux'
import { formatDate, getStatusBackgroundColor,formatAmountWithCommas } from '../../utils/utilts'
import { getActiveCommissions, getPaidCommissions } from './CommissionSlice'
import Tag from '../../components/Tag'

const Commissions = ({navigation}:any) => {


    
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const { isDarkMode } = useSelector(
        (state: RootStateOrAny) => state.theme,
    );

    const { user } = useSelector(
        (state: RootStateOrAny) => state.user,
    );

    const { loading, activeCommissions, paidCommissions } = useSelector(
        (state: RootStateOrAny) => state.commissions,
    );
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(getActiveCommissions(user?.agent?.id ));
        dispatch(getPaidCommissions(user?.agent?.id));
    }, [dispatch])

 
  
    const callGetCommissions = React.useCallback(() => {    
            console.log('call on refresh',refreshing)
        setRefreshing(true);
        dispatch(getActiveCommissions(user?.agent?.id ));
        dispatch(getPaidCommissions(user?.agent?.id )).unwrap()
            .then(result => {
                setRefreshing(false);
            })

    }, [dispatch,refreshing]);

 


    const [activeTab, setActiveTab] = useState('active');

    const toggleTab = () => {
        setActiveTab(activeTab === 'active' ? 'paid' : 'active');
    };

    const getStatusTranslation = (status: string) => {
        return t(`screens:${status}`);
    };


    const stylesGlobal = globalStyles();

    const renderRequestItem = ({ item }:any) => (

        <TouchableOpacity
            style={[styles.commissionItem, { backgroundColor: isDarkMode ? colors.darkModeBackground : colors.white }]}
            onPress={()=>navigation.navigate('Commission Details',{
                 commission:item
            })}
        >
            <Text style={{ marginVertical: 10, color: colors.black }}>{t('screens:name')}: { item.user_type=='Provider'?item?.provider.name: item?.client.name} ({item.user_type})</Text>
            <Text style={{ marginVertical: 10, color: isDarkMode ? colors.white : colors.black }}>{t('screens:amount')}:{formatAmountWithCommas(item?.amount)}</Text>
            <Text style={{ marginVertical: 10, color: isDarkMode ? colors.white : colors.black }}>{t('screens:payment_for')}: {getStatusTranslation(item?.payment_for)}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            
                <View><Text style={{ marginVertical: 10, color: isDarkMode ? colors.white : colors.black }}>{t('screens:date')}: {formatDate(item?.created_at)}</Text></View>
                <View
                    style={{
                        marginVertical: 10,
                        backgroundColor: getStatusBackgroundColor(item?.status),
                        padding: 8,
                        borderRadius: 10
                    }}
                >
                    
                    <Text style={{ color: colors.white }}>{getStatusTranslation(item.status)}</Text>
                </View>
            </View>
        </TouchableOpacity>
   
    );

    return (

        <SafeAreaView>
            <View style={stylesGlobal.scrollBg}
            >

                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.toggleButton}
                        onPress={toggleTab}
                    >
                        <Text style={[styles.buttonText, activeTab === 'active' ? styles.activeToggleText : null]}>
                            {t('screens:activeCommissions')}
                        </Text>
                        <Text style={[styles.buttonText, activeTab === 'paid' ? styles.activeToggleText : null]}>
                            {t('screens:paidCommissions')}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.commisionContainer}>
                    <View>
                    </View>
                    <FlatList
                        data={activeTab === 'active' ? activeCommissions : paidCommissions}
                        renderItem={renderRequestItem}
                        keyExtractor={(item) => item?.id}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={callGetCommissions} />
                        }
                    />
                </View>
            </View>
        </SafeAreaView>

    )
}


const styles = StyleSheet.create({

    container: {
        paddingTop: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    toggleButton: {
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
    },
    activeToggleText: {
        color: colors.white,
        backgroundColor: colors.primary,
        borderRadius: 20
    },
    buttonText: {
        color: colors.primary,
        padding: 10,
        marginRight: 5
    },

    commisionContainer: {
        margin: 15,
        marginBottom:120
    },
    commissionItem: {
       
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginHorizontal: 8,
        marginVertical: 5,
        elevation:2

    },

})


export default Commissions