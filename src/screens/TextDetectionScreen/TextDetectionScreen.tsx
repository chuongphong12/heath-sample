import React, {useRef, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import TextRecognition, {
  TextBlock,
  TextRecognitionScript,
} from '@react-native-ml-kit/text-recognition';
import {
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import NutritionTable from './NutritionTable';
import {Camera} from 'react-native-vision-camera';
import CameraModal from './CameraModal';

export type NutritionItem = {
  name: string;
  amount: string;
  percentage: string | null;
};

const TextDetectionScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const [imageUri, setImageUri] = useState<string>();
  const [nutritionData, setNutritionData] = useState<any[]>([]);
  const cameraRef = useRef<Camera>(null);

  const extractText = async (uri: string) => {
    const result = await TextRecognition.recognize(
      uri,
      TextRecognitionScript.KOREAN,
    );

    if (result && result.blocks && result.blocks.length > 0) {
      const parsedData = parseNutritionData(result.blocks);
      setNutritionData(parsedData);
    }
  };

  const parseNutritionData = (recognizedText: TextBlock[]): NutritionItem[] => {
    const data: NutritionItem[] = [];

    recognizedText.forEach(block => {
      const text = block.text.replace(/\n/g, ' ').trim();

      // Regular expressions to capture nutrient name, amount, unit, and percentage
      const nutrientPattern = /([가-힣a-zA-Z]+)\s*(\d+\.?\d*)\s*(kcal|g|mg)?/g;
      const percentagePattern = /(\d+)\s*%/g;

      let match: RegExpExecArray | null;

      // Check for kcal entries specifically
      if (text.includes('kcal')) {
        const kcalMatch = text.match(/(\d+\.?\d*)\s*kcal/);
        if (kcalMatch) {
          data.push({
            name: 'Calories',
            amount: `${kcalMatch[1]} kcal`,
            percentage: null,
          });
        }
      }

      // Extract nutrients with amounts and units
      const nutrients: {name: string; amount: string; index: number}[] = [];
      while ((match = nutrientPattern.exec(text)) !== null) {
        const [_, name, amount, unit] = match;
        nutrients.push({
          name: name.trim(),
          amount: `${amount}${unit ? ` ${unit}` : ''}`.trim(),
          index: match.index + match[0].length,
        });
      }

      // Extract percentages
      const percentages: {percentage: string; index: number}[] = [];
      let percentageMatch: RegExpExecArray | null;
      while ((percentageMatch = percentagePattern.exec(text)) !== null) {
        percentages.push({
          percentage: `${percentageMatch[1]}%`,
          index: percentageMatch.index,
        });
      }

      console.log(percentages);

      // Pair nutrients with their closest percentages
      nutrients.forEach(nutrient => {
        const closestPercentage = percentages.find(
          p => p.index > nutrient.index,
        );
        data.push({
          name: nutrient.name,
          amount: nutrient.amount,
          percentage: closestPercentage ? closestPercentage.percentage : null,
        });
      });
    });

    // Further filter out any entries that seem to contain only noise or irrelevant data
    return data.filter(entry => {
      const isNameValid = /[a-zA-Z가-힣]/.test(entry.name);
      const isAmountValid = /\d/.test(entry.amount);
      return isNameValid && isAmountValid;
    });
  };

  const detectText = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto();

      try {
        setImageUri(photo.path);
        await extractText(photo.path);
        setModalVisible(!modalVisible);
      } catch (error) {
        console.error('Text recognition failed:', error);
      }
    }
  };

  const pickImage = async () => {
    console.log('working');
    const options: ImageLibraryOptions = {
      selectionLimit: 1,
      mediaType: 'photo',
    };
    const result = await launchImageLibrary(options);
    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorCode) {
      console.log('ImagePicker Error: ', result.errorCode);
    } else if (result && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri!;
      setImageUri(uri);
      await extractText(uri);
    }
  };

  const openCamera = async () => {
    const options: CameraOptions = {
      saveToPhotos: false,
      mediaType: 'photo',
    };

    const result = await launchCamera(options);
    if (result.didCancel) {
      console.log('User cancelled camera');
    } else if (result.errorCode) {
      console.log('ImagePicker Error: ', result.errorCode);
    } else if (result && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri!;
      setImageUri(uri);
      await extractText(uri);
    }
  };

  return (
    <View style={styles.container}>
      <CameraModal
        modalVisible={modalVisible}
        onDetect={detectText}
        onClose={() => setModalVisible(!modalVisible)}
        ref={cameraRef}
      />
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>Start Detect</Text>
      </Pressable>
      {imageUri && (
        <Image source={{uri: imageUri}} style={{width: 200, height: 200}} />
      )}
      <NutritionTable data={nutritionData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 22,
    gap: 10,
    padding: 10,
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
});

export default TextDetectionScreen;
