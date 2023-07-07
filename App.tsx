import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {isImageBlurred, createImagesToPdf} from 'image-processing-sdk';

function App(): JSX.Element {
  const [imageSet, setImageSet] = useState<any>({});

  const openImagePicker = () => {
    ImagePicker.openPicker({
      multiple: true,
    }).then(images => {
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
    .then((path: any) => {
      ToastAndroid.show(`PDF created successfully: ${path}`, 2000);
      console.log(`PDF created successfully: ${path}`)})
    .catch((error: any) => {
      ToastAndroid.show(`Failed to create PDF: ${error}`, 2000);
      console.log(`Failed to create PDF: ${error}`)
    });
  };

  const openCamera = () => {
    const tempImageSets: any = {};
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      tempImageSets[image.path] = null;
      setImageSet(tempImageSets);
    });
  }

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.iconContainer} onPress={openImagePicker}>
          <Image style={{width: 40, height: 40}} source={{uri: 'https://cdn.icon-icons.com/icons2/2348/PNG/512/gallery_icon_143014.png'}} />
          <Text style={styles.iconText}>Open Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={openCamera}>
          <Image style={{width: 40, height: 40}} source={{uri: 'https://cdn-icons-png.flaticon.com/512/3178/3178179.png'}} />
          <Text style={styles.iconText}>Open Camera</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} horizontal >
        {
          Object.keys(imageSet)?.map((item: string)=> {
            return(
              <View key={item} style={styles.imageContainer}>
                <Image style={styles.imageStyle} source={{uri: item}} />     
                {imageSet[item] !== null && <Text style={styles.result}>{imageSet[item]? 'Blur': 'Not Blur'}</Text>}
              </View>
              )
          })
        }
       </ScrollView>
       {Object.keys(imageSet)?.length>0 && <View style={styles.details}>
          <Text style={styles.primaryText}>Total images:<Text style={styles.resultText}>{Object.keys(imageSet)?.length}</Text></Text>
          <Text style={styles.primaryText}>Blur images:<Text style={styles.resultText}>{Object.values(imageSet)?.filter(item => item)?.length}</Text></Text>
        </View>}
      { Object.keys(imageSet)?.length>0 && (
      <>
        <TouchableOpacity style={styles.button} onPress={checkImageBlur}>
          <Text style={styles.buttonText}>Check image Blur</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={generatePdf}>
            <Text style={styles.buttonText}>Create pdf</Text>
        </TouchableOpacity>
      </>)}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: '#FFF',
    flex: 1,
    padding: 10,
  },
  button: {
    backgroundColor: '#4681f4',
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
  result: {
    position: 'absolute',
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'red',
    fontSize: 14,
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 4,
    margin: 6,
    borderRadius: 10,
  },
  primaryText: {
    color: '#000',
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
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  iconContainer: {
    backgroundColor: '#4681f4',
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    paddingTop: 5,
  }
});

export default App;
