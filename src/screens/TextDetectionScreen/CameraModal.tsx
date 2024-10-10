import React, {forwardRef, useEffect} from 'react';
import {Alert, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {SAFE_AREA_PADDING} from '../../utils/constant';
import IonIcon from 'react-native-vector-icons/Ionicons';

type CameraModalProps = {
  modalVisible: boolean;
  onDetect: () => void;
  onClose: () => void;
};

const CameraModal = forwardRef<Camera, CameraModalProps>(
  ({modalVisible, onDetect, onClose}, ref) => {
    const device = useCameraDevice('back');
    const {hasPermission} = useCameraPermission();

    useEffect(() => {
      if (!hasPermission) {
        Alert.alert('Camera permission is required to use this feature');
        onClose();
      }
    }, []);

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.container}>
          <Camera
            device={device!}
            isActive={modalVisible}
            ref={ref}
            photo={true}
            style={StyleSheet.absoluteFill}
          />
          <IonIcon
            name="close"
            size={36}
            color="black"
            style={{
              position: 'absolute',
              alignSelf: 'center',
              top: 55,
              right: 15,
            }}
            onPress={onClose}
          />
          <Pressable
            style={[styles.captureButton, styles.button, styles.buttonClose]}
            onPress={onDetect}>
            <Text style={styles.textStyle}>Detect Nutrition Facts</Text>
          </Pressable>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: SAFE_AREA_PADDING.paddingBottom,
  },
});

export default CameraModal;
