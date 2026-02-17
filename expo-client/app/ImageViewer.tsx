import { ImageSourcePropType, StyleSheet }   from "react-native";
import { Image } from "expo-image";

type props = {
    imgSource: ImageSourcePropType;
    selectedImage?: string;
};

export default function ImageViewer({imgSource, selectedImage}: props) {
    const imageSource = selectedImage ? { uri: selectedImage } : imgSource;
    return <Image source={imageSource} style={Styles.image} />;
}

const IMAGE_SIZE = 200;

const Styles = StyleSheet.create ({
    image: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        borderRadius: IMAGE_SIZE / 2,
    },
});