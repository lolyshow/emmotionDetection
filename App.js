import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';

export default function App() {
  const [hasPermission, setHasPermission] = React.useState();
  const [faceData, setFaceData] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const {status} = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  function getFaceDataView() {
    if (faceData.length === 0) {
      return (
        <View style={styles.faces}>
          <Text style={styles.faceDesc}>No faces :</Text>
        </View>
      );
    } else {
      return faceData.map((face, index) => {
        console.log("myEyeShotStatusfdfd",face)
        const eyesShut = face.rightEyeOpenProbability < 0.2 && face.leftEyeOpenProbability < 0.2;
        const winking = !eyesShut && (face.rightEyeOpenProbability < 0.6 || face.leftEyeOpenProbability < 0.6);
        const smiling = face.smilingProbability > 0.7;
        const sad = face.smilingProbability <0.7;
        const shocked = face.leftEyeOpenProbability>0.8;

        return (
          <View style={styles.faces} key={index}>
            <Text>{eyesShut?"You Shut your Eye":smiling?"You are Happy!!!":sad?"You Are sad":shocked?"You are Shocked":"Normal Face"
            
            }</Text>
            {/* <Text style={styles.faceDesc}>Eyes Shut: {eyesShut.toString()}</Text>
            <Text style={styles.faceDesc}>Winking: {winking.toString()}</Text>
            <Text style={styles.faceDesc}>Smiling: {smiling.toString()}</Text> */}
          </View>
        );
      });
    }
  }

  const handleFacesDetected = ({ faces }) => {
    setFaceData(faces);
    console.log(faces);
  }

  return (
    <Camera 
      type={Camera.Constants.Type.front}
      style={styles.camera}
      onFacesDetected={handleFacesDetected}
      faceDetectorSettings={{
        mode: FaceDetector.FaceDetectorMode.fast,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
        runClassifications: FaceDetector.FaceDetectorClassifications.none,
        minDetectionInterval: 100,
        tracking: true
      }}>
      {getFaceDataView()}
    </Camera>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faces: {
    backgroundColor: '#ffffff',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16
  },
  faceDesc: {
    fontSize: 20
  }
});
