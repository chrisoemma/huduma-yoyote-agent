import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { useTranslation } from 'react-i18next';
import { colors } from '../../utils/colors';

const CustomAlert = ({ isVisible, onConfirm, onCancel, title, message,footer }) => {

  const { t } = useTranslation();

  return (
    <Modal 
    backdropOpacity={0.3} 
    isVisible={isVisible}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>{title}</Text>
        {typeof message === 'string' ? (
          <Text style={styles.message}>{message}</Text>
        ) : (
          message
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onCancel}>
            <Text style={[styles.buttonText,{color:'red'}]}>{t('screens:cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onConfirm}>
            <Text style={[styles.buttonText,{color:colors.secondary}]}>{t('screens:confirm')}</Text>
          </TouchableOpacity>
          <View>
         
          </View>
          
        </View>
        {typeof footer === 'string' ? (
          <Text style={styles.message}>{footer}</Text>
        ) : (
          footer
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    color:colors.black,
    fontSize: 16,
    fontFamily: 'Prompt-Regular',
    marginBottom: 10,
  },
  message: {
    color:colors.black,
    fontSize: 16,
    fontFamily: 'Prompt-Regular',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: 'Prompt-Regular',
    fontSize: 16,
  },
});

export default CustomAlert;
