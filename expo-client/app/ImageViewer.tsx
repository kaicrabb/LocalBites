import { ImageSourcePropType, StyleSheet }   from "react-native";
import { Image } from "expo-image";

type props = {
    imgSource: ImageSourcePropType;
};

export default function ImageViewer({imgSource}: props) {
    return <Image source={imgSource} style={Styles.image}/>;
}
const Styles = StyleSheet.create ({
    image: {
        width: 320,
        height: 440,
        borderRadius: 18,
    },
});