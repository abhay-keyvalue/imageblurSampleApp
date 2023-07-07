import React, {useState} from 'react';
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
  const [imageSet, setImageSet] = useState<any>({});

  const openImagePicker = async () => {
    ImagePicker.openPicker({
      multiple: true,
    }).then(async images => {
      const tempUrls: any[] = [];
      const tempImageSets: any = {};
      images?.forEach((item)=> {
        tempUrls.push(item.path);
        tempImageSets[item.path] = null;
      })
      setImageSet(tempImageSets);
    });
  };

  const checkImageBlur = () => {
    Object.keys(imageSet)?.forEach((item: string) => {
      imageBlurCheck(item);
    });
  }

  const imageBlurCheck = (imagePath: string) => {
    isImageBlurred(imagePath).then((result: boolean)=>{
      setImageSet((imageSet: any)=> {const tempImageSets: any = {...imageSet}; tempImageSets[imagePath] = result; return tempImageSets});
      console.log('result', result);
    }).catch((error: any)=> {
      console.log('error', error);
    })
  };

  const generatePdf = () => {
    const options = {
      images: Object.keys(imageSet) || [],
    };
    createImagesToPdf(options)
    .then((path: any) => console.log(`PDF created successfully: ${path}`))
    .catch((error: any) => console.log(`Failed to create PDF: ${error}`));
  };

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <TouchableOpacity style={styles.button} onPress={openImagePicker}>
        <Text style={styles.buttonText}>Open Gallery</Text>
      </TouchableOpacity>
      <ScrollView style={styles.scrollView} horizontal >
        {
          Object.keys(imageSet)?.map((item: string)=> {
            return(
              <View key={item} style={styles.imageContainer}>
                <Image style={styles.imageStyle} source={{uri: item}} />     
                {imageSet[item] !== null && <Text style={styles.primaryText}>{`Result Blur: ${imageSet[item]}`}</Text>}
              </View>
              )
          })
        }
       </ScrollView>
       {Object.keys(imageSet)?.length>0 && <View style={styles.details}>
          <Text style={styles.primaryText}>Total images:<Text style={styles.resultText}>{Object.keys(imageSet)?.length}</Text></Text>
          <Text style={styles.primaryText}>Blur images:<Text style={styles.resultText}>{Object.values(imageSet)?.filter(item => item)?.length}</Text></Text>
        </View>}
       <TouchableOpacity style={styles.button} onPress={checkImageBlur}>
        <Text style={styles.buttonText}>Check image Blur</Text>
      </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  resultText: {
    color: 'red',
    fontSize: 18,
    paddingHorizontal: 6,
  }
});

export default App;
