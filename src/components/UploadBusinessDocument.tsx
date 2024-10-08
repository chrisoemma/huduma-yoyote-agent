import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, TextInput, ActivityIndicator } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { convertBusinessesToLabelsAndValues, convertRegDoc } from '../utils/utilts';
import { colors } from '../utils/colors';
import { BasicView } from './BasicView';
import { globalStyles } from '../styles/global';;
import Icon from 'react-native-vector-icons/Ionicons';
import DocumentPicker, { types } from 'react-native-document-picker';
import Pdf from 'react-native-pdf';
import ToastMessage from './ToastMessage';
import { mediaPermissions } from '../permissions/MediaPermissions';
import ToastNotification from './ToastNotification/ToastNotification';


const UploadBusinessDocument = ({businesses,setShowToast,
    toggleToast,toastMessage, showToast, regDocs,
     handleDocumentUpload, 
     uploadingDoc,resetModalState,
     uploadedDocuments
    }: any) => {

        // console.log('regDocs',regDocs)
        // console.log('uploadedDocuments',uploadedDocuments)
          
   //  console.log('error message',errorMessage)
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState(convertBusinessesToLabelsAndValues(businesses));
    const [registrationDocs, setRegDocs] = useState(convertRegDoc(regDocs))
    const [uploadedDocument, setUploadedDocument] = useState(null);
    const [doc, setDoc] = useState(null);
    const [text, onChangeText] = React.useState('');
    const [selectedDocType, setSelectedDocType] = useState('');
    const [openType, setOpenType] = useState(false);
    const [valueType, setValueType] = useState(null);
    const [resetModal, setResetModal] = resetModalState;
   

    const { t } = useTranslation();

    const [doctypes, setDocTypes] = useState([
        { label: `${t('screens:registrationLicense')}`, value: 1 },
    ]);


    const stylesGlobal = globalStyles();


    const resetModalFunction = () => {
        // Reset modal logic
        setOpen(false);
        setValue(null);
        setItems(convertBusinessesToLabelsAndValues(businesses));
        setRegDocs(convertRegDoc(regDocs));
        setUploadedDocument(null);
        setDoc(null);
        onChangeText('');
        setSelectedDocType('');
        setOpenType(false);
        setValueType(null);
    };


    useEffect(() => {
        if (resetModal) {
            resetModalFunction();
            setResetModal(false);
        }
    }, [resetModal, setResetModal]);

 

    const selectDoc = async () => {

        const permissionsGranted = await mediaPermissions();
        if (!permissionsGranted) {
           ToastNotification(`${t('screens:mediaPermissionNotGranted')}`, 'default', 'long');
            return;
        }

        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
            });
            setDoc(res);
            setShowToast(false)

        } catch (error) {
            if (DocumentPicker.isCancel(error)) {
                setDoc(null);

            } else {
                // For Unknown Error
                alert("Unknown Error: " + JSON.stringify(error));
                throw error;
            }
        }
    };

    let textData = ''
    if (valueType == 1) {
        textData = 'screens:selectRegistrationDoc'
    } else if (valueType == 2) {
        textData = 'screens:selectBusinesses'
    }
    //
    
    const onChangeValue = ()=>{

        if(value!==null){
       setValue(null) 
        }
    }

   
    return (

        <View style={styles.modalContainer}>

         {showToast &&
            <View style={{marginBottom:40}}>
             <ToastMessage message={toastMessage} onClose={toggleToast} />
            </View>
          } 
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{t('screens:selectDocType')}</Text>
                <View style={styles.marginDropdown}>
                    <DropDownPicker
                        searchable={true}
                        zIndex={7000}
                        placeholder={t('screens:selectDocType')}
                        listMode="MODAL"
                        open={openType}
                        value={valueType}
                        items={doctypes}
                        setOpen={setOpenType}
                        setValue={setValueType}
                        setItems={setDocTypes}
                        onChangeValue={onChangeValue}
                    />
                </View>

                {valueType ? (
                    <>
                        <Text style={styles.modalTitle}> {t(textData)}</Text>
                        <View style={styles.marginDropdown}>
                            <DropDownPicker
                                searchable={true}
                                zIndex={6000}
                                placeholder={t(textData)}
                                listMode="MODAL"
                                open={open}
                                value={value}
                                items={valueType == 1 ? registrationDocs : items}
                                //  onChangeValue={onChangeValue}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                            />
                        </View>
                    </>
                ) : <View />}
                <BasicView style={[stylesGlobal.marginTop20, { marginHorizontal: 10 }]}>
                    <Text
                        style={[stylesGlobal.inputFieldTitle, { color: 'black', fontFamily: 'Prompt-Regular', }]}>
                        {t('screens:documentName')}
                    </Text>

                    <TextInput
                        placeholderTextColor={colors.alsoGrey}
                        style={styles.input}
                        onChangeText={onChangeText}
                        value={text}
                        placeholder={t('screens:enterDocumentName')}
                    />

                    {/* {errors.doc_type && (
                            <Text style={stylesGlobal.errorMessage}>
                                {t('screens:documentNameRequired')}
                            </Text>
                        )} */}
                </BasicView>
                <BasicView style={{ marginVertical: 30 }}>
                <TouchableOpacity
                        style={styles.uploadArea}
                        onPress={selectDoc}
                    >

                        {uploadedDocument ? (
                            <Text style={styles.uploadedFileName}>
                                {uploadedDocument?.name}
                            </Text>
                        ) : (
                            <>
                                <Icon
                                    name="cloud-upload-outline"
                                    size={48}
                                    color="#3238a8"
                                />
                                <Text style={styles.uploadText}>{t('screens:uploadDocument')}</Text>
                            </>
                        )}
                        <View style={styles.dottedLine}></View>
                    </TouchableOpacity>

                </BasicView>
                <BasicView>
                    {doc == null ? (<View></View>) : (
                        <View style={stylesGlobal.displayDoc}>

                            {
                                doc[0]?.type == "application/pdf" ? (
                                    <Pdf
                                        source={{ uri: doc[0]?.uri }}
                                        style={{ marginTop: 40, height: 100, width: 120 }}
                                        maxScale={3}
                                    />
                                ) : (
                                    <Image
                                        source={{ uri: doc[0]?.uri }}
                                        style={{ marginTop: 40, height: 100, width: 120 }}
                                    />
                                )
                            }
                        </View>)}

                </BasicView>

                <View style={{ flexDirection: 'row', marginBottom:'50%', justifyContent: 'space-between' }}>


                    <TouchableOpacity
                     onPress={() => handleDocumentUpload(value, doc, text, valueType)}
                        style={{
                            backgroundColor: colors.secondary,
                            borderRadius: 8,
                            justifyContent: 'center',
                            opacity: uploadingDoc ? 0.5 : 1,
                        }}
                        disabled={uploadingDoc}
                    >
                        {uploadingDoc ? (
                            <>
                             <ActivityIndicator color={colors.white} />
                            <Text style={{ color: colors.white, paddingHorizontal:20,paddingVertical:10,fontSize:16 }}>{t('screens:uploadingWait')}</Text>
                            </>
                           
                        ) : (
                            <Text style={{ color: colors.white, paddingHorizontal:20,paddingVertical:10,fontSize:16 }}>{t('screens:upload')}</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    marginDropdown: { marginBottom: 20 },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        fontFamily: 'Prompt-Regular',
        color:colors.black
    },
    
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '95%',
    },
    modalTitle: {
        fontFamily: 'Prompt-Bold',
        fontSize: 18,
        marginBottom: 10,
    },
    uploadArea: {
        alignSelf: 'center',
        width: '45%',
        height: 150,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#888',
      },
    uploadedFileName: {
        fontSize: 16,
        fontFamily: 'Prompt-Bold',
        color: colors.alsoGrey,
        textAlign: 'center',
        marginBottom: 5,
    },
    uploadText: {
        fontFamily: 'Prompt-Regular',
        fontSize: 16,
        color: colors.alsoGrey,
        textAlign: 'center',
    },
    dottedLine: {
        borderStyle: 'dotted',
        borderWidth: 1,
        borderColor: '#888',
        width: '60%',
        marginTop: 10,
    },
    employeeName: {
        fontFamily: 'Prompt-Regular',
        fontSize: 16,
        marginBottom: 10,
        color: 'blue',
    },
    closeButton: {
        fontSize: 16,
        color: 'red',
        marginTop: 20,
    },
});

export default UploadBusinessDocument;
