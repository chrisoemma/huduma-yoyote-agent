import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/colors';
import RatingStars from './RatinsStars';
import { globalStyles } from '../styles/global';
import { useSelector } from 'react-redux';

const ClientList = ({ navigation,onPress, client }: any) => {

    const stylesGlobal=globalStyles();

    const {isDarkMode} = useSelector(
        (state: RootStateOrAny) => state.theme,
      );

    return (
        <TouchableOpacity
            onPress={()=>navigation.navigate("Client Details",{
                client:client
            })}
            style={[styles.touchableOpacityStyles,{backgroundColor:isDarkMode?colors.darkModeBackground:colors.white}]}
          key={client?.id}
       >
         <View style={stylesGlobal.circle}>
         <Image
                  source={
                    client?.profile_img?.startsWith('https://')
                      ? { uri: client.profile_img }
                      : client?.user_img?.startsWith('https://')
                      ? { uri: client.user_img }
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
            <Text style={{color:isDarkMode?colors.white:colors.black,marginBottom:10}}>{client.name}</Text>
            <View style={{flexDirection:'row'}}>
            <Ionicons name="call" color={colors.primary} size={17}  />
            <Text style={{color:isDarkMode?colors.white:colors.black}}>{client?.user?.phone}</Text>
            </View>
         </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    touchableOpacityStyles: {
        width: 160,
        borderRadius: 18,
        paddingVertical: 8,
        marginHorizontal: 5,
        elevation:2
    },
    divContent:{
        margin:10,

    }
})

export default ClientList;
