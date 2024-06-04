import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-svg";

const Tag = ({ status, color }) => (
    <View
        style={{
            backgroundColor: color,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 10,
            marginRight: 5
        }}
    >
        <Text style={styles.tagText}>{status}</Text>
    </View>
);

const styles = StyleSheet.create({
  tagText:{ color: '#fff' }
});

export default Tag;