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
import Notification from '../../components/Notification'


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
                                    <TouchableOpacity style={[styles.bottomView, { borderBottomColor: isDarkMode ? colors.white : colors.alsoGrey }]}
                                        onPress={() => {
                                            navigation.navigate('Provider Details', {
                                                provider: item
                                            })
                                        }}
                                    >
                                        <Text style={{ color: isDarkMode ? colors.black : colors.primary, fontWeight: 'bold', fontSize: 16 }}>{item?.name}</Text>
                                        <Text style={{ paddingVertical: 10, color: isDarkMode ? colors.white : colors.black }}>{item?.user?.phone}</Text>

                                    </TouchableOpacity>
                                ))

                            ) : (
                                clients?.map(item => (
                                    <TouchableOpacity style={[styles.bottomView, { borderBottomColor: isDarkMode ? colors.white : colors.alsoGrey }]}
                                        onPress={() => navigation.navigate('Client Details', {
                                            client: item
                                        })}
                                    >
                                        <Text style={{ color: isDarkMode ? colors.black : colors.primary, fontWeight: 'bold', fontSize: 16 }}>{item?.name}</Text>
                                        <Text style={{ paddingVertical: 10, color: isDarkMode ? colors.white : colors.black }}>{item?.user.phone}</Text>
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
        margin: 10
    },
    contentContainer: {
        marginHorizontal: 10
    },
    chart: {
        alignItems: 'center',
        marginVertical: 8,
        borderRadius: 20,
        backgroundColor: colors.white
    },
    title: {
        alignSelf: 'center',
        fontSize: 15,
        fontWeight: 'bold',

    },
    listView: {
        marginHorizontal: 5,
        marginVertical: 15
    },
    firstList: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    productList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    secondList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5
    },
    badge: {
        backgroundColor: colors.successGreen,
        padding: 3,
        borderRadius: 5
    },
    badgeText: {
        color: colors.white
    },
    textContainer: {
        paddingVertical: 5,
        margin: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.alsoGrey
    },
    categoryService: {
        textTransform: 'uppercase',
        color: colors.secondary
    },
    service: {
        paddingTop: 5
    },
    subservice: {
        paddingTop: 5,
        fontWeight: 'bold',
        color: colors.black
    },

    bottomView: {
        paddingVertical: 5,
        margin: 5,
        borderBottomWidth: 0.5

    },
})

export default Home