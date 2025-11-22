// QR Scanner Page - React Native with Expo
// File: app/qr.tsx

import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useRouter } from 'expo-router';
import { ArrowLeft, Flashlight, HelpCircle, Image as ImageIcon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function QRScanner() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [currentStep, setCurrentStep] = useState<number>(2)

  useEffect(() => {
    // Request camera permission on mount
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  // Handle camera lifecycle - activate/deactivate when screen is focused/unfocused
  useFocusEffect(
    React.useCallback(() => {
      // Screen is focused - activate camera
      setIsCameraActive(true);
      setScanned(false);
      
      return () => {
        // Screen is unfocused - deactivate camera
        setIsCameraActive(false);
        setTorch(false);
      };
    }, [])
  );

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    
    // Deactivate camera before navigation
    setIsCameraActive(false);
    
    // Navigate to enter amount page
    router.push('./enterAmount');
  };

  const handleUploadQR = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need permission to access your photos.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        Alert.alert('Image Selected', 'QR code scanning from image is not implemented in this demo.');
        // In a real app, you would use a QR code detection library here
        // to scan the QR code from the selected image
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const toggleTorch = () => {
    setTorch(!torch);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera View - only render when active */}
      {isCameraActive && (
        <CameraView
          style={styles.camera}
          facing="back"
          enableTorch={torch}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          {/* Semi-transparent overlay */}
          <View style={styles.overlay}>
            {/* Top Header */}
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => {
                  setIsCameraActive(false);
                  router.back();
                }}
              >
                <ArrowLeft size={28} color="#fff" />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>Scan any QR</Text>

              <TouchableOpacity style={styles.helpButton}>
                <HelpCircle size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Scanning Frame */}
            <View style={styles.scanningArea}>
              <TouchableOpacity 
                style={styles.scanFrame}
                onPress={() => {
                  setIsCameraActive(false);
                  router.push('./enterAmount');
                }}
              >
                {/* Top Left Corner */}
                <View style={[styles.corner, styles.cornerTopLeft]} />
                {/* Top Right Corner */}
                <View style={[styles.corner, styles.cornerTopRight]} />
                {/* Bottom Left Corner */}
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                {/* Bottom Right Corner */}
                <View style={[styles.corner, styles.cornerBottomRight]} />
              </TouchableOpacity>
            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={handleUploadQR}
              >
                <View style={styles.controlIconCircle}>
                  <ImageIcon size={28} color="#fff" />
                </View>
                <Text style={styles.controlLabel}>Upload QR</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.controlButton}
                onPress={toggleTorch}
              >
                <View style={[
                  styles.controlIconCircle,
                  torch && styles.controlIconCircleActive
                ]}>
                  <Flashlight size={28} color="#fff" />
                </View>
                <Text style={styles.controlLabel}>Torch</Text>
              </TouchableOpacity>
            </View>
            </View>

          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  helpButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7,
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#9c27b0',
    borderWidth: 4,
  },
  cornerTopLeft: {
    top: -2,
    left: -2,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 24,
  },
  cornerTopRight: {
    top: -2,
    right: -2,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 24,
  },
  cornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 24,
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 24,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
    gap: 80,
    marginTop: 40,
  },
  controlButton: {
    alignItems: 'center',
  },
  controlIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  controlIconCircleActive: {
    backgroundColor: '#9c27b0',
  },
  controlLabel: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  loadingText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#fff',
    fontSize: 16,
  },
  permissionText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#fff',
    fontSize: 18,
    paddingBottom: 20,
  },
  permissionButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: '#9c27b0',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});