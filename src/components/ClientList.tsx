import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/colors';
import RatingStars from './RatinsStars';
import { globalStyles } from '../styles/global';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getStatusBackgroundColor } from '../utils/utilts';

const ClientList = ({ navigation, onPress, client }: any) => {

    const stylesGlobal = globalStyles();

    const { isDarkMode } = useSelector(
        (state: RootStateOrAny) => state.theme,
    );


    const { t } = useTranslation();


    const getStatusTranslation = (status: string) => {
        if (status == 'In Active') {
            return t(`screens:InActive`);
        } else if (status == 'Pending approval') {
            return t(`screens:PendingApproval`);
        } else {
            return t(`screens:${status}`);
        }

    };

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("Client Details", {
                client: client
            })}
            style={[styles.touchableOpacityStyles, { backgroundColor: isDarkMode ? colors.darkModeBackground : colors.white }]}
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
                        alignSelf: 'center'
                    }}
                />
            </View>
            <View style={styles.divContent}>
                <Text style={{ color: isDarkMode ? colors.white : colors.black, marginBottom: 10 }}>{client.name}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Ionicons name="call" color={colors.primary} size={17} />
                    <Text style={{ color: isDarkMode ? colors.white : colors.black }}>{client?.user?.phone}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View
                        style={[styles.status, { backgroundColor: getStatusBackgroundColor(client?.status) }]}
                    ><Text style={{ color: colors.white }}>{getStatusTranslation(client.status)}</Text>
                    </View>

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
        elevation: 2
    },
    status: {
        marginVertical: 10,
        padding: 8,
        borderRadius: 10
    },
    divContent: {
        margin: 10,

    }
})

export default ClientList;
