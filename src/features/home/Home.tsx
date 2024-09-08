import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BasicView } from '../../components/BasicView'
import Databoard from '../../components/Databoard'
import { colors } from '../../utils/colors'
import {
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { globalStyles } from '../../styles/global'
import { useAppDispatch } from '../../app/store'
import { useTranslation } from 'react-i18next';
import { useSelector, RootStateOrAny } from 'react-redux'
import { getClients, getProviders } from '../registers/RegisterSlice'
import { getCommisionMonthly } from './ChartSlice'
//import { LineChart } from 'react-native-chart-kit'
import CustomBackground from '../../components/CustomBgBottomSheet'
import { getStatusBackgroundColor } from '../../utils/utilts'
import Icon from 'react-native-vector-icons/MaterialIcons';


const Home = ({ navigation }: any) => {


    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    const { t } = useTranslation();

    const stylesGlobal = globalStyles();

    const dispatch = useAppDispatch();
    const [refreshing, setRefreshing] = useState(false);


    const { isDarkMode } = useSelector(
        (state: RootStateOrAny) => state.theme,
    );


    const getStatusTranslation = (status: string) => {
        if (status == 'In Active') {
            return t(`screens:InActive`);
        } else if (status == 'Pending approval') {
            return t(`screens:PendingApproval`);
        } else {
            return t(`screens:${status}`);
        }

    };

    const { user } = useSelector(
        (state: RootStateOrAny) => state.user,
    );

    const { loading, clients, providers } = useSelector(
        (state: RootStateOrAny) => state.registers,
    );

    // const { commissionChart } = useSelector(
    //     (state: RootStateOrAny) => state.charts,
    // );

    useEffect(() => {
        dispatch(getClients({ agentId: user?.agent?.id }));
        //  dispatch(getCommisionMonthly({ agentId: user?.agent?.id }));
        dispatch(getProviders({ agentId: user?.agent?.id }));
    }, [dispatch])


    const callGetDashboard = React.useCallback(() => {

        setRefreshing(true);
        dispatch(getClients({ agentId: user?.agent?.id }));
        // dispatch(getCommisionMonthly({ agentId: user?.agent?.id }));
        dispatch(getProviders({ agentId: user?.agent?.id }))
            .unwrap()
            .then(result => {
                setRefreshing(false);
            })
    }, []);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [sheetTitle, setSheetTitle] = useState('');

    // variables
    const snapPoints = useMemo(() => ['25%', '70%'], []);

    // callbacks
    const handlePresentModalPress = (title: any) => useCallback(() => {
        setSheetTitle(title)
        console.log('shittitle', title);
        bottomSheetModalRef.current?.present();
    }, []);
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, [])


    // const labels = commissionChart?.map(entry => entry.month_name);
    // const dataset = commissionChart?.map(entry => entry.total_commission);

    // const chartConfig = {
    //     backgroundGradientFrom: '#fff',
    //     backgroundGradientTo: '#fff',
    //     color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
    // };

    return (
        <>
            <SafeAreaView>
                <ScrollView
                    horizontal={false}
                    contentInsetAdjustmentBehavior="automatic"
                    keyboardShouldPersistTaps={'handled'}
                    style={stylesGlobal.scrollBg}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={callGetDashboard} />
                    }
                >
                    <BasicView>
                        <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 50
                        }}>
                            <Databoard
                                mainTitle={t('screens:serviceProviders')}
                                number={providers?.length || 0}
                                onPress={handlePresentModalPress(`${t('screens:serviceProviders')}`)}
                                color={colors.secondary}
                            />
                            <Databoard
                                mainTitle={t('screens:clients')}
                                number={clients?.length || 0}
                                onPress={handlePresentModalPress(`${t('screens:clients')}`)}
                                color={colors.secondary}
                            />

                        </View>
                    </BasicView>
                    {/* <View style={styles.chart}>
                        
                     {commissionChart?
                        ( 
                            <>
                        <Text style={{fontSize:18,color:colors.alsoGrey}}>{t('screens:commisionVsMonths')}</Text>
                        <LineChart
                            data={{
                                labels,
                                datasets: [
                                    {
                                        data: dataset,
                                    },
                                ],
                            }}
                            width={screenWidth}
                            height={screenHeight * 0.3}
                            chartConfig={chartConfig}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                            }}
                      />
                      </>
                      ):
                       <Text>{t('screens:noDataAvailable')}</Text>}
                    </View> */}

                </ScrollView>
            </SafeAreaView>
            <BottomSheetModalProvider>
                <View style={styles.container}>
                    <BottomSheetModal
                        backgroundComponent={CustomBackground}
                        ref={bottomSheetModalRef}
                        index={1}
                        snapPoints={snapPoints}
                        onChange={handleSheetChanges}
                    >
                        <BottomSheetScrollView
                            contentContainerStyle={styles.contentContainer}
                        >
                            <Text style={[styles.title, { color: isDarkMode ? colors.white : colors.black }]}>{sheetTitle}</Text>

                            {sheetTitle === 'Service providers' || sheetTitle === 'Watoa Huduma' ? (
                                providers?.map(item => (
                                    <TouchableOpacity
                                        style={[styles.bottomView, { backgroundColor: isDarkMode ? colors.darkModeBottomSheet : colors.whiteBackground }]}
                                        onPress={() => {
                                            navigation.navigate('Provider Details', {
                                                provider: item
                                            })
                                        }}
                                    >
                                        <View>
                                            {item?.user?.reg_number && (
                                                <View style={styles.header}>
                                                    <Text style={[styles.regNumber, { color: isDarkMode ? colors.white : colors.secondary }]}>
                                                        {`#${item?.user?.reg_number}`}
                                                    </Text>
                                                </View>
                                            )}
                                            <Text style={[styles.nameText, { color: isDarkMode ? colors.white : colors.secondary }]}>
                                                <Icon name="person" size={20} color={isDarkMode ? colors.white : colors.darkGrey} />
                                                {' '}{item?.name}
                                            </Text>
                                            <Text style={{ paddingVertical: 10, color: isDarkMode ? colors.white : colors.black }}>{item?.user?.phone}</Text>
                                        </View>
                                        <View
                                            style={[styles.status, { backgroundColor: getStatusBackgroundColor(item?.status) }]}
                                        ><Text style={{ color: colors.white,fontFamily: 'Prompt-Regular' }}>{getStatusTranslation(item.status)}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                clients?.map(item => (
                                    <TouchableOpacity
                                        style={[styles.bottomView, { backgroundColor: isDarkMode ? colors.darkModeBottomSheet : colors.whiteBackground }]}
                                        onPress={() => navigation.navigate('Client Details', {
                                            client: item
                                        })}
                                    >

                                        <View>
                                            {item?.user?.reg_number && (
                                                <View style={styles.header}>
                                                    <Text style={[styles.regNumber, { color: isDarkMode ? colors.white : colors.secondary }]}>
                                                        {`#${item?.user?.reg_number}`}
                                                    </Text>
                                                </View>
                                            )}
                                            <Text style={[styles.nameText, { color: isDarkMode ? colors.white : colors.secondary }]}>
                                                <Icon name="person" size={20} color={isDarkMode ? colors.white : colors.darkGrey} />
                                                {' '}{item?.name}
                                            </Text>
                                            <Text style={{ paddingVertical: 10, color: isDarkMode ? colors.white : colors.black }}>{item?.user.phone}</Text>
                                        </View>

                                        <View
                                            style={[styles.status, { backgroundColor: getStatusBackgroundColor(item?.status) }]}
                                        ><Text style={{ color: colors.white,fontFamily: 'Prompt-Regular' }}>{getStatusTranslation(item.status)}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            )}
                        </BottomSheetScrollView>
                    </BottomSheetModal>
                </View>
            </BottomSheetModalProvider>
        </>
    )


}

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
    status: {
        marginVertical: 10,
        padding: 8,
        borderRadius: 10,
        elevation: 2, // Added elevation
    },
    statusText: {
        color: colors.white,
        fontFamily: 'Prompt-Regular',
    },
    contentContainer: {
        marginHorizontal: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    regNumber: {
        fontFamily: 'Prompt-Bold',
        fontSize: 15,
        marginLeft: 5,
    },
    title: {
        alignSelf: 'center',
        fontSize: 16,
        fontFamily: 'Prompt-Bold',
        marginVertical: 10,
    },
    nameText: {
        fontSize: 16,
        fontFamily: 'Prompt-SemiBold',
    },
    phoneText: {
        paddingVertical: 10,
        fontFamily: 'Prompt-Regular',
    },
    bottomView: {
        paddingVertical: 10,
        margin: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
        elevation: 2,
        paddingRight: 10
    },
    dataBoardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
});

export default Home