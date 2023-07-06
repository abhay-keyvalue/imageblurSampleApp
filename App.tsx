import React, {useRef, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {isImageBlurred, createImagesToPdf} from 'image-processing-sdk';

function App(): JSX.Element {
  const [imageUrlArray, setImageUrls] = useState<string[]>([]);
  const [isBlur, setIsBlur] = useState<boolean[]>([]);
  const imageUrls = useRef<any>(null);

  const generatePdf = () => {
    ImagePicker.openPicker({
      multiple: true,
    }).then(async images => {
      imageUrls.current = images?.map(item => item.path);
      const options = {
        images: imageUrls.current || [],
      };
      createImagesToPdf(options)
        .then((path: any) => console.log(`PDF created successfully: ${path}`))
        .catch((error: any) => console.log(`Failed to create PDF: ${error}`));
    });
  };

  const openImagePicker = async () => {
    ImagePicker.openPicker({
      multiple: true,
    }).then(async images => {
      const tempUrls = images?.map(item => item.path);
      setImageUrls(tempUrls);
      setIsBlur([]);
      tempUrls?.forEach((item: string) => {
        imageBlurCheck(item);
      });
    });
  };
  const imageBlurCheck = (imagePath: string) => {
    isImageBlurred(imagePath).then((result: boolean)=>{
      setIsBlur((isBlur)=>[...isBlur, result]);
      console.log('result', result);
    }).catch((error: any)=> {
      console.log('error', error);
    })
  };
  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <TouchableOpacity style={styles.button} onPress={openImagePicker}>
        <Text style={styles.buttonText}>imageBlurCheck</Text>
      </TouchableOpacity>
      <ScrollView style={styles.scrollView} horizontal >
        <View style={styles.details}>
          <Text style={styles.primaryText}>Total images</Text>
          <Text style={styles.resultText}>{imageUrlArray?.length}</Text>
          <Text style={styles.primaryText}>Blur images</Text>
          <Text style={styles.resultText}>{isBlur?.filter(item => item)?.length}</Text>
        </View>
        {imageUrlArray?.map((item: string, index) => {
          return(
            <View key={item} style={styles.imageContainer}>
              <Image style={styles.imageStyle} source={{uri: item}} />     
              <Text style={styles.primaryText}>{`Result Blur: ${isBlur[index]}`}</Text>
            </View>
            )
          })
        }
       </ScrollView>
      <TouchableOpacity style={styles.button} onPress={generatePdf}>
        <Text style={styles.buttonText}>create pdf</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
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
  scrollView: {
    paddingVertical: 10,
  },
  imageContainer: {
    margin: 10,
  },
  details: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  resultText: {
    color: 'red',
    fontSize: 20,
    paddingBottom: 6,
  }
});

export default App;
