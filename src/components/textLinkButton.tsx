import { Platform, StyleSheet, Text, TextStyle } from "react-native";
import { useState } from "react";

import { hscale, mscale } from "../helpers/metric";
import { colors } from "../constants/theme";


export default function TextLinkButton({ text, onPress, customStyle }: { text: string, onPress: () => void, customStyle?: TextStyle }) {
    const [pressed, setPressed] = useState(false);
    return <Text onPress={onPress} style={[styles.textBtn, customStyle, { opacity: pressed ? 0.5 : 1 }]} onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)}>{text}</Text>
}

const styles = StyleSheet.create({
    textBtn: { fontFamily: 'Inter-Medium', fontSize: mscale(16), color: colors.black, textAlign: 'center', paddingVertical: hscale(20), 
    ...Platform.select({ web:{
        alignSelf: 'center',
        paddingHorizontal:40,
    }}) }
})