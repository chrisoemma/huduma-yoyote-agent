import {
  View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView,
  PermissionsAndroid,
  ToastAndroid,
  Alert,
} from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { globalStyles } from '../../styles/global'
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { colors } from '../../utils/colors';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { useAppDispatch } from '../../app/store';
import { useSelector, RootStateOrAny } from 'react-redux';
import { breakTextIntoLines, getStatusBackgroundColor } from '../../utils/utilts';
import PreviewDocumentModel from '../../components/PriewDocumentModel';
import { firebase } from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import UploadBusinessDocument from '../../components/UploadBusinessDocument';
import { createDocument, deleteDocument, getAgentDocumentToRegister, getDocuments } from './AccountSlice';
import ToastNotification from '../../components/ToastNotification/ToastNotification';

const Documents = () => {

  const { t } = useTranslation();

  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [previewType, setPreviewType] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [message, setMessage] = useState('');
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [resetModal, setResetModal] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['25%', '95%'], []);

  const [docId, setDocId] = useState(null);

  const togglePreviewModal = () => {
    if (!isModalVisible) {
      setDocId(null);
    }
    setModalVisible(!isModalVisible);
  };

  const handlePresentModalPress = useCallback(() => {

    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);


  const stylesGlobal = globalStyles();


  const handleDocumentPreview = (docType, docUrl) => {
    setPreviewType(docType);
    setPreviewSource(docUrl);
    setModalVisible(true);
    togglePreviewModal();
  };

  // Function to handle document upload

  const { user } = useSelector(
    (state: RootStateOrAny) => state.user,
  );

  const { isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
  );


  const getStatusTranslation = (status: string) => {
    return t(`screens:${status}`);
  };

  const { documents, documentToRegister } = useSelector(
    (state: RootStateOrAny) => state.account,
  );


  const getPathForFirebaseStorage = async (uri: any) => {

    const destPath = `${RNFS.TemporaryDirectoryPath}/text`;
    await RNFS.copyFile(uri, destPath);

    return (await RNFS.stat(destPath)).path;
  };


  const setDisappearMessage = (message: any) => {
    setMessage(message);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const dispatch = useAppDispatch();
  if (user.agent) {
    useEffect(() => {
      dispatch(getAgentDocumentToRegister(user.agent.id));
      dispatch(getDocuments({ agentId: user.agent.id }));
    }, [dispatch])
  }

  // console.log('documents', documents);

  const makeid = (length: any) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const toggleToast = () => {
    setShowToast(!showToast);
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    toggleToast();
    setTimeout(() => {
      toggleToast();
    }, 5000);
  };


  const data = {
    doc_url: '',
    document_type: '',
    agent_id: '',
    doc_format: '',
    working_document_id: ''
  }

  const handleDocumentUpload = async (value, doc, text, valueType) => {

    data.agent_id = user.agent.id,
      data.doc_format = text;
    if (valueType == 1) {
      data.working_document_id = value
    }
    const existingDocument = documents.find(doc => doc.working_document_id === data.working_document_id);

    if (existingDocument) {
      setShowToast(true)
      showToastMessage(t('screens:documentAlreadyUploaded'))
      return; // Stop the upload process
    }


    if (doc !== null && value !== null) {

      setShowToast(false)
      data.document_type = doc[0].type;

      const fileExtension = doc[0].type.split("/").pop();
      var uuid = makeid(10)
      const fileName = `${uuid}.${fileExtension}`;
      var storageRef = firebase.storage().ref(`businesses/docs/${fileName}`);

      //  console.log('file docs', doc[0].uri);
      const fileUri = await getPathForFirebaseStorage(doc[0].uri);
      try {
        setUploadingDoc(true);
        storageRef.putFile(fileUri).on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot: any) => {
            console.log("snapshost: " + snapshot.state);
            if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
            }
          },
          (error) => {
            unsubscribe();
          },
          () => {
            storageRef.getDownloadURL().then((downloadUrl: any) => {
              data.doc_url = downloadUrl;
              setUploadingDoc(false);
              //    console.log('on submit data', data);
              dispatch(createDocument({ data: data, agentId: user.agent.id }))
                .unwrap()
                .then(result => {
                  console.log('resultsss', result);
                  if (result.status) {
                    ToastNotification(`${t('screens:uploadedDocSuccessfully')}`, 'success','long');
                    toggleBusinessListModal();
                    setResetModal(true)
                    onSuccess();
                  } else {
                    setShowToast(true)
                    showToastMessage(t('screens:unAbletoProcessRequest'))
                    console.log('dont navigate');
                  }
                  console.log('result');
                  console.log(result);
                })
                .catch(rejectedValueOrSerializedError => {
                  // handle error here
                  console.log('error');
                  console.log(rejectedValueOrSerializedError);
                });
            });
          }
        );

      } catch (error) {
        console.warn(error);
        return false;
      }
    } else {
      setShowToast(true)
      showToastMessage(t('screens:documentUploadError'))
    }
  };

  const [isBusinessListVisible, setBusinessListVisible] = useState(false);
  const toggleBusinessListModal = () => {
    if (!isBusinessListVisible) {
      setSelectedBusiness(null);
    }
    setBusinessListVisible(!isBusinessListVisible);
  };

  const onSuccess = () => {
    setBusinessListVisible(false);
    setSelectedBusiness(null);
  };


  const removeDocument = (id, status) => {

    if (status === 'Approved') {
      Alert.alert(t('screens:deleteNotAllowed'), t('screens:approvedDocumentCannotBeDeleted'), [
        { text: t('screens:ok'), onPress: () => console.log('Approved document delete prevented') }
      ]);
      return;
    }



    Alert.alert(`${t('screens:deleteDocument')}`, `${t('screens:areYouWantToDelete')}`, [
      {
        text: `${t('screens:cancel')}`,
        onPress: () => console.log('Cancel task delete'),
        style: 'cancel',
      },
      {
        text: `${t('screens:ok')}`,
        onPress: () => {
          // console.log('document iddd',id);
          dispatch(deleteDocument({ documentId: id }))
            .unwrap()
            .then(result => {
              if (result.status) {
                ToastNotification(`${t('screens:deletedSuccessfully')}`, 'success','long');

              } else {
                ToastNotification(`${t('screens:requestFail')}`, 'danger','long');
              }


            })
            .catch(rejectedValueOrSerializedError => {
              // handle error here
              console.log('error');
              console.log(rejectedValueOrSerializedError);
            });
        },
      },
    ]);

  }



  const filteredDocuments = useMemo(() => {
    return documentToRegister.filter(
      (docToRegister) => !documents.some((doc) => doc.working_document_id === docToRegister.id)
    );
  }, [documents, documentToRegister]);

  const remainingDocumentsCount = filteredDocuments.length;
  const remainingDocumentsNames = filteredDocuments.map(doc => doc.doc_name).join(', ');



  return (

    <>
      <GestureHandlerRootView>
        <SafeAreaView
          style={stylesGlobal.scrollBg}
        >
          <ScrollView style={stylesGlobal.appView}>



            {remainingDocumentsCount > 0 && (
              <View style={{ alignItems: 'center', marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, backgroundColor: '#f9f9f9' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#d9534f' }}>{remainingDocumentsCount} {t('screens:documentsNeedsTobeUploaded')}</Text>
                <Text style={{ fontSize: 16, color: '#5bc0de' }}>Docs: <Text style={{ fontWeight: 'bold' }}>{remainingDocumentsNames}</Text></Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.uploadArea}
              onPress={handlePresentModalPress}
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
            <View style={styles.listView}>
              <Text style={{
                color: isDarkMode ? colors.white : colors.black,
                fontFamily: 'Prompt-Bold',
                textTransform: 'uppercase',
                paddingBottom: 10
              }}>{t('screens:uploadedDocuments')}</Text>
              {
                documents?.map(document => (
                  <View style={styles.documentItem}
                    key={document?.id}
                  >
                    <Icon
                      name="folder"
                      size={25}
                      color={colors.secondary}
                      style={styles.icon}
                    />
                    <View style={styles.textContainer}>
                      <Text style={{ color: isDarkMode ? colors.white : colors.black, fontFamily: 'Prompt-Regular', }}>
                        {breakTextIntoLines(document?.doc_format, 30)}{' '} ({document?.working_document?.doc_name})
                      </Text>
                      <Text style={{ color: getStatusBackgroundColor(document?.status), fontFamily: 'Prompt-Regular', }}>
                        {getStatusTranslation(document?.status)}
                      </Text>
                    </View>
                    <TouchableOpacity>
                      <Menu>
                        <MenuTrigger>
                          <Icon
                            name="ellipsis-horizontal-sharp"
                            size={25}
                            color={isDarkMode ? colors.white : colors.black}
                            style={styles.icon}
                          />
                        </MenuTrigger>
                        <MenuOptions>
                          <MenuOption onSelect={() => handleDocumentPreview(document?.doc_type, document?.doc_url)}>
                            <Text style={{ color: colors.black, fontFamily: 'Prompt-Regular', }}>{t('screens:preview')}</Text>
                          </MenuOption>
                          <MenuOption onSelect={() => removeDocument(document?.id, document?.status)}>
                            <Text style={{ color: 'red', fontFamily: 'Prompt-Regular', }}>{t('screens:delete')}</Text>
                          </MenuOption>
                        </MenuOptions>
                      </Menu>
                    </TouchableOpacity>
                  </View>
                ))
              }
            </View>
            <PreviewDocumentModel
              isVisible={isModalVisible}
              onClose={togglePreviewModal}
              previewType={previewType}
              previewSource={previewSource}
            />
          </ScrollView>
        </SafeAreaView>

        <BottomSheetModalProvider>
          <View style={styles.bottomSheetContainer}>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
            >
              <BottomSheetScrollView style={styles.bottomSheetContentContainer}>
                <UploadBusinessDocument
                  businesses={[]}
                  uploadedDocuments={documents}
                  regDocs={documentToRegister}
                  handleDocumentUpload={handleDocumentUpload}
                  uploadingDoc={uploadingDoc}
                  resetModalState={[resetModal, setResetModal]}
                  onSuccess={toggleBusinessListModal}
                  errorMessage={message}
                  showToast={showToast}
                  showToastMessage={showToastMessage}
                  toastMessage={toastMessage}
                  toggleToast={toggleToast}
                  setShowToast={setShowToast}
                />

              </BottomSheetScrollView>
            </BottomSheetModal>
          </View>
        </BottomSheetModalProvider>

      </GestureHandlerRootView>
    </>

  )
}

const styles = StyleSheet.create({
  noticeContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
     fontFamily: 'Prompt-Regular',
  },
  noticeTitle: {
    fontSize: 18,
     fontFamily: 'Prompt-Regular',
    fontWeight: 'bold',
    color: '#d9534f',
    textAlign: 'center',
  },
  noticeText: {
    fontSize: 16,
     fontFamily: 'Prompt-Regular',
    color: '#5bc0de',
    textAlign: 'center',
  },
  noticeTextBold: {
    fontWeight: 'bold',
  },
  uploadArea: {
    alignSelf: 'center',
    width: '45%',
    height: 150,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#888',
  },
  uploadedFileName: {
    fontSize: 16,
     fontFamily: 'Prompt-Regular',
    color: colors.alsoGrey,
    textAlign: 'center',
    marginBottom: 5,
  },
  uploadText: {
    fontSize: 16,
     fontFamily: 'Prompt-Regular',
    color: colors.alsoGrey,
    textAlign: 'center',
  },
  bottomSheetContainer: {
    zIndex: 1000,
  },
  bottomSheetContentContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  dottedLine: {
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: '#888',
    width: '80%',
    marginTop: 10,
  },
  listView: {
    marginTop: 30,
  },
  documentItem: {
    flexDirection: 'row',
    marginVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#888',
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 12,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  documentText: {
     fontFamily: 'Prompt-Regular',
    color: colors.black,
  },
  statusText: {
     fontFamily: 'Prompt-Regular',
  },
  menuOptionText: {
     fontFamily: 'Prompt-Regular',
    color: colors.black,
  },
  menuOptionTextDelete: {
     fontFamily: 'Prompt-Regular',
    color: 'red',
  },
});

export default Documents