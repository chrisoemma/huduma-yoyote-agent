import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/colors';
import { globalStyles } from '../styles/global';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getStatusBackgroundColor } from '../utils/utilts';

const ProviderList = ({ navigation, provider }: any) => {

    const stylesGlobal = globalStyles();

    const { isDarkMode } = useSelector(
        (state: RootStateOrAny) => state.theme,
    );

    const { t } = useTranslation();

    const getStatusTranslation = (status: string) => {
        if (status === 'In Active') {
            return t(`screens:InActive`);
        } else if (status === 'Pending approval') {
            return t(`screens:PendingApproval`);
        } else {
            return t(`screens:${status}`);
        }
    };

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("Provider Details", {
                provider: provider
            })}
            style={[
                styles.touchableOpacityStyles,
                { backgroundColor: isDarkMode ? colors.darkModeBackground : colors.white }
            ]}
            key={provider?.id}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={
                        provider?.profile_img?.startsWith('https://')
                            ? { uri: provider.profile_img }
                            : provider?.user_img?.startsWith('https://')
                                ? { uri: provider.user_img }
                                : require('./../../assets/images/profile.png') // Default static image
                    }
                    style={styles.profileImage}
                />
                <Text style={[styles.providerName, { color: isDarkMode ? colors.white : colors.black }]}>
                    {provider.name}
                </Text>
            </View>
            <View style={styles.divContent}>
                {provider?.user?.reg_number && (
                    <View style={styles.header}>
                        <Text style={[styles.regNumber, { color: isDarkMode ? colors.white : colors.secondary }]}>
                            {`#${provider?.user?.reg_number}`}
                        </Text>
                    </View>
                )}
                <View style={styles.phoneContainer}>
                    <Ionicons name="call" color={colors.primary} size={17} />
                    <Text style={[styles.phoneText, { color: isDarkMode ? colors.white : colors.black }]}>
                        {provider?.user?.phone}
                    </Text>
                </View>
                <View style={styles.statusContainer}>
                    <View
                        style={[styles.status, { backgroundColor: getStatusBackgroundColor(provider?.status) }]}
                    >
                        <Text style={styles.statusText}>
                            {getStatusTranslation(provider.status)}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    touchableOpacityStyles: {
        width: 160,
        borderRadius: 18,
        paddingVertical: 8,
        marginHorizontal: 5,
        elevation: 2,
        alignItems: 'center'  // Center the items vertically
    },
    imageContainer: {
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        resizeMode: "cover",
        width: 60,
        height: 80,
        borderRadius: 20,
        alignSelf: 'center'
    },
    divContent: {
        flex: 1,
        marginVertical: 10,
    },
    providerName: {
        marginBottom: 10,
        fontFamily: 'Prompt-Regular', // Added font family
        fontSize: 16, // Adjusted font size
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    phoneText: {
        marginLeft: 5,
        fontFamily: 'Prompt-Regular', // Added font family
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    status: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    statusText: {
        color: colors.white,
        fontFamily: 'Prompt-Regular', // Added font family
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    regNumber: {
        fontFamily: 'Prompt-SemiBold',
        fontSize: 14,
        marginLeft: 5,
    },
});

export default ProviderList;
