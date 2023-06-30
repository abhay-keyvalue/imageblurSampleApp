import React, {useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {createPdf} from 'react-native-images-to-pdf';
import ImagePicker from 'react-native-image-crop-picker';
import {isImageBlurred} from 'image-processing-sdk';

function App(): JSX.Element {
  const [imageUrl, setImageUrl] = useState<any>(null);
  const [isBlur, setIsBlur] = useState<any>(null);
  const imageUrls = useRef<any>(null);

  const generatePdf = () => {
    ImagePicker.openPicker({
      multiple: true,
    }).then(async images => {
      imageUrls.current = images?.map(item => item.path);
      console.log('imageUrls.current', imageUrls.current);
      const options = {
        pages: imageUrls.current || [],
        outputDirectory: 'data/user/0/',
        outputFilename: 'output.pdf',
      };
      createPdf(options)
        .then((path: any) => console.log(`PDF created successfully: ${path}`))
        .catch((error: any) => console.log(`Failed to create PDF: ${error}`));
    });
  };

  const openImagePicker = async () => {
    ImagePicker.openPicker({
      multiple: false,
    }).then(async image => {
      console.log('image', image.path);
      setImageUrl(image?.path);
      console.log('url from picker', image?.path);
      await imageBlurCheck(image?.path);
    });
  };
  const imageBlurCheck = async (imagePath: string) => {
    console.log('url inside sdk', imagePath?.slice(8));
    const result = await isImageBlurred(imagePath?.slice(8) || 'sample url');
    setIsBlur(result);
    console.log('result', result, imageUrl);
  };
  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <TouchableOpacity style={styles.button} onPress={openImagePicker}>
        <Text style={styles.buttonText}>imageBlurCheck</Text>
      </TouchableOpacity>
      {imageUrl && <Image style={styles.imageStyle} source={{uri: imageUrl}} />}
      {imageUrl && (
        <Text style={styles.primaryText}>{`Result Blur: ${isBlur}`}</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={generatePdf}>
        <Text style={styles.buttonText}>create pdf</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageStyle: {
    height: 200,
    width: 300,
  },
  primaryText: {
    color: 'blue',
    fontSize: 18,
  },
});

export default App;
