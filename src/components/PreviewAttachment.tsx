import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImageViewer from 'react-native-image-zoom-viewer';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import SwipeableModal from './Modals/SwipeableModal';


const PreviewAttachment = ({ item, onClose }:any) => {
    const [isPreviewVisible, setPreviewVisible] = useState(false);
    
    const [pdfPath, setPdfPath] = useState(null);
    const attachmentUri = item?.url || item?.uri;



    useEffect(() => {
        if (item) {
            setPreviewVisible(true); 
        }
    }, [item]);

    const togglePreview = () => {
        setPreviewVisible(prevState => {
            if (prevState) onClose();  
            return !prevState; 
        });
    };

    useEffect(() => {
        if (item?.uri && item?.type.includes('pdf') && isPreviewVisible) {
            const fetchPdfPath = async () => {
                try {
                    const path = await getPath(attachmentUri);
                    setPdfPath(path);
                } catch (error) {
                    console.error('Error fetching PDF path:', error);
                    setPdfPath(null);
                }
            };
            fetchPdfPath();
        } else {
            setPdfPath(item?.url);
        }
    }, [isPreviewVisible, attachmentUri, item?.type]);

    const getPath = async (uri) => {
        try {
            const destPath = `${RNFS.TemporaryDirectoryPath}/temp.pdf`;
            await RNFS.copyFile(uri, destPath);
            const fileStat = await RNFS.stat(destPath);
            return fileStat.path;
        } catch (error) {
            console.error('Error in getPath function:', error);
            return null;
        }
    };

    const renderPreviewContent = () => {
        if (item?.type?.includes('image')) {
            return (
                <ImageViewer
                    imageUrls={[{ url: attachmentUri }]}
                    enableSwipeDown
                    onSwipeDown={togglePreview}
                    renderHeader={() => (
                        <TouchableOpacity style={styles.modalCloseButton} onPress={togglePreview}>
                            <AntDesign name="close" size={30} color="#fff" />
                        </TouchableOpacity>
                    )}
                />
            );
        } else if (item?.type?.includes('pdf')) {
            return (
                <Pdf
                    source={{ uri: pdfPath, cache: true }}
                    style={styles.previewPdf}
                    trustAllCerts={Platform.OS === 'android' ? false : true}
                />
            );
        }else {
            return (
                <View style={styles.unpreviewableContent}>
                    <Text style={styles.unpreviewableText}>Preview not available for this file type</Text>
                </View>
            );
        }
    };

    return (
        <View>
            {item?.type?.includes('image') ? (
                <Modal visible={isPreviewVisible} transparent={true}>
                    {renderPreviewContent()}
                </Modal>
            ) : (
                <SwipeableModal isVisible={isPreviewVisible} onClose={togglePreview}>
                    {renderPreviewContent()}
                </SwipeableModal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 5,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconAndName: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    name: {
        marginLeft: 10,
        fontSize: 16,
    },
    previewVideo: {
        width: '100%',
        height: '100%',
      },
    previewPdf: {
        width: '100%',
        height: '100%',
    },
    unpreviewableContent: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    unpreviewableText: {
        color: '#777',
        fontSize: 16,
    },
    modalCloseButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 100,
    },
});

export default PreviewAttachment;
