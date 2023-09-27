import { View, Text,TouchableOpacity,StyleSheet,Dimensions } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'

const width = Dimensions.get('window').width;

const RequestList = ({navigation}:any) => {
  return (
    <TouchableOpacity style={styles.touchableOpacityStyles}
     onPress={()=>{navigation.navigate('Requested services')}}
    >
      <View>
        <Text style={{color:colors.primary}}>CATEGOTY-SERVICE</Text>
        <Text style={{paddingVertical:10,color:colors.black}}>David Frank</Text>
        <Text>Lorem ipsum for the distribution avaiable in this plate please do not take it serious</Text>
      </View>
      <View style={styles.bottomView}>
         <View style={{marginRight:'35%'}}><Text >20 August, 9:00 pm</Text></View>
         <TouchableOpacity style={styles.status}>
            <Text style={{color:colors.white}}>On-going</Text>
         </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
    touchableOpacityStyles: {
        
        width:width,
        height: 160,
         borderRadius: 18,
         padding:10,
        marginHorizontal:10,
        marginVertical: 8,
        backgroundColor:colors.white
    },
    bottomView:{
        flexDirection:'row',
        paddingTop:10
    },
    status:{
        alignItems:'flex-end',
        alignContent:'flex-end',
        justifyContent:'flex-end',
        backgroundColor:colors.secondary,
        padding:7,
        borderRadius:10
       
    }
})

export default RequestList