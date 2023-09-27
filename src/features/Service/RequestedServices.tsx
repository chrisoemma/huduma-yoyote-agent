import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, SafeAreaView, Image, TouchableOpacity, StyleSheet,Button } from 'react-native'
import { globalStyles } from '../../styles/global'
import { colors } from '../../utils/colors'
import RatingStars from '../../components/RatinsStars';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import ContentServiceList from '../../components/ContentServiceList';
import MapDisplay from '../../components/MapDisplay';
import Icon from 'react-native-vector-icons/AntDesign';
import { makePhoneCall } from '../../utils/utilts';


const RequestedServices = ({ navigation, route }:any) => {

     const PhoneNumber='0672137313';
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [sheetTitle, setSheetTitle] = useState('');


       // variables
  const snapPoints = useMemo(() => ['25%', '100%'], []);

  // callbacks
  const handlePresentModalPress = useCallback((title: any) => {
      setSheetTitle(title);
      bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
      console.log('handleSheetChanges', index);
  }, [])


  const { params } = route;

  const [selectedSubservice, setSelectedSubservice] = useState([]);
  const { t } = useTranslation();


  const toggleSubService = (subService) => {
      if (selectedSubservice.includes(subService)) {
          setSelectedSubservice(selectedSubservice.filter((s) => s !== subService));
      } else {
          setSelectedSubservice([...selectedSubservice, subService]);
      }
  };

  const handleClearAll = () => {
      setSelectedSubservice([]);
  };

  React.useLayoutEffect(() => {
      if (params && params.service) {
          navigation.setOptions({ title: params.service.name });
      }
  }, [navigation, params]);



  let subServices = [
      {
          name: 'Urembo',
          icon: 'dingding'
      },
      {
          name: 'Massage',
          icon: 'aliwangwang-o1'
      },
      {
          name: 'Chakula',
          icon: 'weibo'
      },
      {
          name: 'Dobi',
          icon: ''
      },
      {
          name: 'Upambaji',
          icon: ''
      },
      {
          name: 'Fundi nguo',
          icon: ''
      },
  ]


    return (
        <>
        <SafeAreaView
        style={{flex:1,  height:'100%',margin:10,
        backgroundColor:colors.whiteBackground}}
    >
           <View style={[globalStyles.circle, { backgroundColor: colors.white, marginTop: 15, alignContent: 'center', justifyContent: 'center' }]}>
                    <Image
                        source={require('../../../assets/images/profile.png')}
                        style={{
                            resizeMode: "cover",
                            width: 90,
                            height: 95,
                            borderRadius: 90,
                            alignSelf: 'center'
                        }}
                    />
             </View>
             <View style={{flexDirection:'row'}}>
                    <View>
                    <Text style={{ marginVertical: 5, color: colors.black }}>John Frank</Text>
                    <RatingStars rating={4} />
                    <Text style={{ marginVertical: 5, color: colors.secondary }}>CATEGOTY-SERVICE</Text>
                    </View>
                    <TouchableOpacity style={{flexDirection:'row',
                    marginHorizontal:30,
                    marginVertical:20,
                    alignItems:'flex-end'
                    }}
                    onPress={() => makePhoneCall(PhoneNumber)}
                    >
                <Icon    
                  name="phone"
                  color={colors.black}
                  size={20}
                  />
                    <Text style={{paddingHorizontal:5,fontWeight:'bold'}}>{PhoneNumber}</Text>
                </TouchableOpacity>
            </View>  
                    <Text>Iam the best service provider available and many people like my service due to am very much on time and  I can serve you the way you want to b served.</Text>
           
                    <View style={[globalStyles.chooseServiceBtn,{justifyContent:'space-between'}]}>
                    <TouchableOpacity style={globalStyles.chooseBtn}
                        onPress={() => handlePresentModalPress('Near providers')}
                    >
                        <Text style={{ color: colors.white }}>Requested services</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={globalStyles.otherBtn}>
                        <Text style={{ color: colors.white }}>On-progress</Text>
                    </TouchableOpacity>
                </View>      
                
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.mapContainer}>
                     <MapDisplay />
                </View>
              </SafeAreaView>
             
<SafeAreaView style={{ flex: 1 }}>
               <GestureHandlerRootView  style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                    <View style={styles.container}>
                        <BottomSheetModal
                            ref={bottomSheetModalRef}
                            index={1}
                            snapPoints={snapPoints}
                            onChange={handleSheetChanges}
                           
                        >
                          <BottomSheetScrollView
                            contentContainerStyle={styles.contentContainer}
                        >
                                <Text style={styles.title}>Hello</Text>


                                <View style={globalStyles.subCategory}>
                                    <ContentServiceList
                                        data={subServices}
                                        toggleSubService={toggleSubService} selectedSubServices={selectedSubservice}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    {selectedSubservice.length > 1 && (
                                        <TouchableOpacity
                                            style={[globalStyles.floatingButton, { backgroundColor: colors.dangerRed, right: '70%', }]}
                                            onPress={handleClearAll}
                                        >
                                            <Text style={globalStyles.floatingBtnText}>Clear All</Text>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity
                                        style={[globalStyles.floatingButton, { backgroundColor: selectedSubservice.length > 0 ? colors.secondary : colors.primary }]}
                                    >
                                        <Text style={globalStyles.floatingBtnText}>{`(${selectedSubservice.length}) Request`}</Text>
                                    </TouchableOpacity>
                                </View>

                            </BottomSheetScrollView>
                        </BottomSheetModal>
                    </View>
                </BottomSheetModalProvider>
            </GestureHandlerRootView>
            </SafeAreaView>
    </SafeAreaView>

     
    </>
    )}

    const styles = StyleSheet.create({
        container: {
            // height:300,
            // margin: 10
        },
        contentContainer: {
           // flex:1,
            marginHorizontal: 10
        },
        title: {
            alignSelf: 'center',
            fontSize: 15,
            fontWeight: 'bold'
        },
        mapContainer: {
            flex: 1,
            marginBottom: '10%',
          },
    })
    
    export default RequestedServices