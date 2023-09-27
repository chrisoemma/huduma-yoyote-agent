import { View, Text, SafeAreaView, Image,TouchableOpacity } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/global'
import { colors } from '../../utils/colors'
import Icon from 'react-native-vector-icons/AntDesign';
import Divider from '../../components/Divider';
import { makePhoneCall } from '../../utils/utilts';

const Account = () => {

  const phoneNumber = '0672137313';
    return (
        <SafeAreaView
            style={globalStyles.scrollBg}
        >
            <View style={globalStyles.appView}>
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
                <Text style={{color:colors.secondary,fontWeight:'bold',alignSelf:'center'}}>Frank John</Text>
               <View>
                <TouchableOpacity style={{flexDirection:'row',margin:10}}
                 onPress={() => makePhoneCall(phoneNumber)}
                >
                <Icon    
                  name="phone"
                  color={colors.black}
                  size={25}
                  />
                    <Text style={{paddingHorizontal:10}}>+255 672137313</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row',marginHorizontal:10}}>
                <Icon    
                  name="mail"
                  color={colors.black}
                  size={25}
                  />
                    <Text style={{paddingLeft:10}}>Frank@gmail.com</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row',marginHorizontal:10,marginTop:5}}>
                <Icon    
                  name="enviroment"
                  color={colors.black}
                  size={25}
                  />
                    <Text style={{paddingLeft:10}}>Mwenge,kijitonyama</Text>
                </TouchableOpacity>

               
               </View>
              <View style={{marginVertical:20}}>
              <Divider />
              </View>
              <TouchableOpacity style={{flexDirection:'row',marginHorizontal:10,marginTop:5}}>
                <Icon    
                  name="lock1"
                  color={colors.secondary}
                  size={25}
                  />
                    <Text style={{paddingLeft:10,fontWeight:'bold'}}>Change password</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{flexDirection:'row',marginHorizontal:10,marginTop:10}}>
                <Icon    
                  name="logout"
                  color={colors.dangerRed}
                  size={25}
                  />
                    <Text style={{paddingLeft:10,fontWeight:'bold'}}>Sign out</Text>
                </TouchableOpacity>
              
            </View>
        </SafeAreaView>
    )
}

export default Account