import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/colors';
import RatingStars from './RatinsStars';
import { globalStyles } from '../styles/global';
import { useSelector,RootStateOrAny } from 'react-redux';

const ProviderList = ({ navigation,onPress, provider }: any) => {

    const stylesGlobal=globalStyles();

    const {isDarkMode} = useSelector(
        (state: RootStateOrAny) => state.theme,
      );

    return (
        <TouchableOpacity
        onPress={()=>navigation.navigate("Provider Details",{
            provider:provider
        })}
            style={[styles.touchableOpacityStyles,{backgroundColor:isDarkMode?colors.darkModeBackground:colors.white}]}
        >
         <View style={stylesGlobal.circle}>
         <Image
             
                source={
                    provider?.profile_img?.startsWith('https://')
                      ? { uri: provider.profile_img }
                      : provider?.user_img?.startsWith('https://')
                      ? { uri: provider.user_img }
                      : require('./../../assets/images/profile.png') // Default static image
                  }
                style={{
                    resizeMode: "cover",
                    width: 60,
                    height: 80,
                    borderRadius: 20,
                    alignSelf:'center'
                }}
            />
         </View>
         <View style={styles.divContent}>
            <Text style={{color:isDarkMode?colors.white:colors.black,marginBottom:10}}>{provider.name}</Text>
            <View style={{flexDirection:'row'}}>
            <Ionicons name="call" color={colors.primary} size={17}  />
            <Text style={{color:isDarkMode?colors.white:colors.black}}>{provider?.user?.phone}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
        
            </View>
           
         </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    touchableOpacityStyles: {
   
        height: 200,
        borderRadius: 18,
        paddingVertical: 8,
        marginHorizontal: 5,
        marginVertical: 5,
        backgroundColor:colors.white,
        elevation:2
    },
    divContent:{
        margin:10,

    }
})

export default ProviderList;
