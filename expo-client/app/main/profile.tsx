import { View, StyleSheet } from 'react-native';
import Button from '../Button';
import ImageViewer from '../ImageViewer';   

const PlaceholderImage = require ('@/assets/images/android-icon-background.png');

export default function App() {
  return (
    <View style = {Styles.container}>
      <View style = {Styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>
      <View style={Styles.footerContainer}>
        <Button label='Choose a photo' />
        <Button label='Use this photo' />
      </View>
    </View>
  );
}

const Styles = StyleSheet.create ({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1, 
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
  footerContainer: {
    flex: 1/3,
    alignItems: 'center',
  },
});

