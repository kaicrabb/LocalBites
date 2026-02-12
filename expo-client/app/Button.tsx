import { StyleSheet, View, Pressable, Text } from "react-native";

type Props = {
    label: string;
};

export default function Button({label}: Props) {
    return (
        <View style={Styles.buttonContainer}>
            <Pressable style={Styles.button} onPress={() => alert('You pressed a button.')}>
                <Text style={Styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    );
}

const Styles = StyleSheet.create ({
    buttonContainer: {
        width: 320,
        height: 68,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },
    button: {
        borderRadius: 10,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',

    },
    buttonLabel: {
        color: '#fff',
        fontSize: 16,
    },

});