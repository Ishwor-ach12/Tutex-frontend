// QR Scanner Page - React Native with Expo
// File: app/qr.tsx

import { AgentState } from "@/app/customComponents/AIAgentIcon";
import { langMap, VoiceAgent } from "@/app/customComponents/VoiceAgent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import * as Speak from "expo-speech";
import {
  ArrowLeft,
  Flashlight,
  HelpCircle,
  Image as ImageIcon,
} from "lucide-react-native";
import { default as React, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";



const { width, height } = Dimensions.get("window");

const WALKTHROUGH_STEPS = [
  {
    id: 1,
    title: "qr_tutorial.qr_scanning1_title",
    description: "qr_tutorial.qr_scanning1_description",
    top: "20%",
  },
  {
    id: 2,
    title: "qr_tutorial.qr_scanning2_title",
    description:
      "qr_tutorial.qr_scanning2_description",
    top: "30%",
  },
  {
    id: 3,
    title: "qr_tutorial.qr_scanning3_title",
    description:
      "qr_tutorial.qr_scanning3_description",
    top: "65%",
  },
  {
    id: 4,
    title: "qr_tutorial.qr_scanning4_title",
    description:
      "qr_tutorial.qr_scanning4_description",
    top: "60%",
  },
];

export default function QRScanner() {
  const { t } = useTranslation();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const currentStepRef = useRef<number>(currentStep);
  const uploadQRRef = React.useRef(null);
  const isFocused = useIsFocused();
  const [highlightBox, setHighlightBox] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false,
  });
  const languageRef = useRef<string|null>(null);
  const [aiOn, setAiOn] = useState(false);


  useEffect(() => {
    currentStepRef.current = currentStep;
    Speak.stop();
    speakInstruction(currentStep);
    if (currentStep === 1) {
      // Give layout a moment
      setTimeout(() => {
        if (uploadQRRef.current != null) {
          uploadQRRef.current.measureInWindow((x, y, w, h) => {
            setHighlightBox({
              x,
              y,
              width: w,
              height: h,
              visible: true,
            });
          });
        }
      }, 200);
    } else {
      setHighlightBox((prev) => ({ ...prev, visible: false }));
    }
  }, [currentStep]);

  useEffect(() => {
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

  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    if (scanned) return;

    setScanned(true);

    // Deactivate camera before navigation
    setIsCameraActive(false);

    // Navigate to enter amount page
    router.push("./enterAmount");
  };

  const speakInstruction = async(step:number)=>{
    if(languageRef.current == null){
      languageRef.current = (await AsyncStorage.getItem(
        "user-language"
      )) as string;
    }
    Speak.speak(t(WALKTHROUGH_STEPS[step].description), {
      language: langMap[languageRef.current][0],
      rate: 1
    });
  }

  // Handle next step

  const handleNextStep = () => {
    if (currentStep < WALKTHROUGH_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
    if (currentStep == WALKTHROUGH_STEPS.length - 1) {
      setScanned(true);

      // Deactivate camera before navigation
      setIsCameraActive(false);

      // Navigate to enter amount page
      router.push("./enterAmount");
    }
  };
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleUploadQR = async () => {
    try {
      // Request media library permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need permission to access your photos."
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        Alert.alert(
          "Image Selected",
          "QR code scanning from image is not implemented in this demo."
        );
        // In a real app, you would use a QR code detection library here
        // to scan the QR code from the selected image
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
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
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }


  return (
    <View style={styles.container} >
      {isFocused && <TouchableOpacity
        style={{
          position: "absolute",
          top: 50,
          right: 20,
          zIndex: 500,
        }}

      >
        <VoiceAgent
          tutorialName="UPI_MB_2"
          size={35}
          uiHandlerFunction={(num: string) => {
            const step = parseInt(num);
            if (!isNaN(step)) {

              setCurrentStep(step);
            }
          }}
          introduce={false}
          currentStepRef={currentStepRef}
          onStateChange={(state:AgentState) => {if(state === "idle") setAiOn(false); else setAiOn(true)}}
        />
      </TouchableOpacity>}
      <View
        style={[
          {
            position: "absolute",
            width: width,
            height: height + 100,
            backgroundColor: "#0000008f",
            zIndex: 10,
          },
          currentStep > 1 && { backgroundColor: "#00000007" },
        ]}
      />
      <View
        style={{
          position: "absolute",
          backgroundColor: "#fff",
          width: width / 1.2,
          padding: 24,
          zIndex: 10,
          top: WALKTHROUGH_STEPS[currentStep].top,
          left: "50%",
          transform: [{ translateX: -(width / 1.2 / 2) }],
          elevation: 100,
          borderRadius: 10,
        }}
      >
        <Text style={styles.tooltipTitle}>
          {t(WALKTHROUGH_STEPS[currentStep].title)}
        </Text>
        <Text style={styles.tooltipDescription}>
          {t(WALKTHROUGH_STEPS[currentStep].description)}
        </Text>

        <View style={styles.tooltipButtons}>
          {currentStep > 0 && !aiOn ? (
            <TouchableOpacity onPress={handlePreviousStep}>
              <Text style={styles.prevButton}>Prev</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <Text></Text>
            </TouchableOpacity>
          )}
          {!aiOn && <TouchableOpacity onPress={handleNextStep}>
            <Text style={styles.nextButton}>Next</Text>
          </TouchableOpacity>}
        </View>
      </View>
      {currentStep == 0 && (
        <View
          style={{
            zIndex: 20,
            position: "absolute",
            left: "50%",
            top: "45%",
            transform: [{ translateX: -(width / 1.2 / 2) }],
            elevation: 100,
          }}
        >
          <Image
            source={require("@/assets/images/phonepeTutorial/qrSample.png")}
            style={{ width: width / 1.2, height: width / 1.2 }}
          />
        </View>
      )}
      {/* Highlighted Upload QR button (absolute, above camera) */}
      {highlightBox.visible && (
        <TouchableOpacity
          style={[
            styles.highlightUploadQR,
            {
              left: highlightBox.x,
              top: highlightBox.y+10,
              width: highlightBox.width,
              height: highlightBox.height,
            },
          ]}
          onPress={handleUploadQR}
        >
          <View style={styles.controlIconCircle}>
            <ImageIcon size={28} color="#fff" />
          </View>
          <Text style={styles.controlLabel}>Upload QR</Text>
        </TouchableOpacity>
      )}

      {/* Camera View - only render when active */}
      {isCameraActive && (
        <CameraView
          style={styles.camera}
          facing="back"
          enableTorch={torch}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
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
                  router.push("./enterAmount");
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
                  ref={uploadQRRef}
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
                  <View
                    style={[
                      styles.controlIconCircle,
                      torch && styles.controlIconCircleActive,
                    ]}
                  >
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
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  helpButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  scanningArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7,
    position: "relative",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 24,
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#9c27b0",
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
    gap: 80,
    marginTop: 40,
  },
  controlButton: {
    alignItems: "center",
  },
  controlIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  controlIconCircleActive: {
    backgroundColor: "#9c27b0",
  },
  controlLabel: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
    width: 100
  },
  loadingText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    color: "#fff",
    fontSize: 16,
  },
  permissionText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    color: "#fff",
    fontSize: 18,
    paddingBottom: 20,
  },
  permissionButton: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: "#9c27b0",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  tooltipTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  tooltipDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 12,
  },
  tooltipButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  prevButton: {
    fontWeight: "bold",
    paddingVertical: 6,
    paddingHorizontal: 32,
    fontSize: 18,
    borderRadius: 5,
    color: "#5f259f",
    borderWidth: 2,
    borderColor: "#5f259f",
  },
  nextButton: {
    backgroundColor: "#5f259f",
    fontWeight: "bold",
    color: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 32,
    fontSize: 18,
    borderRadius: 5,
  },
  highlightUploadQR: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    elevation: 50,
    marginTop: 32,
    // white glow
    shadowColor: "#ffffff",
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 40,
  },
});
