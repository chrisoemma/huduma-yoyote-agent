import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/global'
import { Container } from '../../components/Container'
import { colors } from '../../utils/colors'

const Commissions = () => {

    const commissions = [
        {
            id: 1,
            name: 'John Frank',
            amount: '10,000.00',
            date: '20/11/2023',
            status: 'Paid'
        },
        {
            id: 2,
            name: 'James John',
            amount: '20,000.00',
            date: '10/12/2023',
            status: 'Un-paid'
        },
        {
            id: 3,
            name: 'John Frank',
            amount: '15,000.00',
            date: '11/08/2023',
            status: 'paid'
        },

    ]

    const renderRequestItem = ({ item }) => (

        <TouchableOpacity
            style={styles.commissionItem}
        >
            <Text style={{ marginVertical: 10 }}>Name: {item.name}</Text>
            <Text style={{ marginVertical: 10, color: colors.black }}>Amount:{item.amount}</Text>
            <View style={{ flexDirection: 'row' }}>
                <View><Text style={{ marginVertical: 10 }}>Date: {item.date}</Text></View>
                <TouchableOpacity
                    style={{
                        marginVertical: 10,
                        alignItems: 'flex-end',
                        backgroundColor: colors.successGreen,
                        padding: 5,
                        marginLeft: '50%',
                        borderRadius: 10
                    }}
                ><Text style={{ color: colors.white }}>{item.status}</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>

    );

    return (

        <SafeAreaView>
            <View style={globalStyles.scrollBg}>
                <Container>
                    <View style={styles.commisionContainer}>
                        <View>
                            
                        </View>
                        <FlatList
                            data={commissions}
                            renderItem={renderRequestItem}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    </View>
                </Container>

            </View>
        </SafeAreaView>

    )
}


const styles = StyleSheet.create({

    commisionContainer: {
        margin: 15
    },
    commissionItem: {
        width: '100%',
        height: 150,
        borderRadius: 18,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginHorizontal: 5,
        marginVertical: 5,
        backgroundColor: colors.white
    },

})


export default Commissions