import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, PanResponder } from 'react-native';
import { colors } from '../../utils/colors';

const SwipeableModal = ({ children, isVisible, onClose }) => {
  const [modalVisible, setModalVisible] = useState(isVisible);
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setModalVisible(isVisible);
  }, [isVisible]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderMove: Animated.event([null, { dy: translateY }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        const { dy } = gestureState;
        if (dy > 100) {
          Animated.timing(translateY, {
            toValue: 300,
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            setModalVisible(false);
            onClose();
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: false,
            friction: 7, 
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[styles.modalContent, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          <View style={styles.header}>
            <View style={styles.handle} />
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          {children}
          <View style={styles.divider} />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingBottom: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'relative',
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignSelf: 'center',
    marginTop: 8,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 5,
    padding: 2,
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.dangerRed,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
});

export default SwipeableModal;
