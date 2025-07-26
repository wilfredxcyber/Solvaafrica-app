import { StyleSheet, Text, TextStyle } from "react-native";

import { colors } from "../constants/theme";
import { mscale } from "../helpers/metric";


type TscreenHeadingTextProps = { text: string, customStyle?: TextStyle }

export default function ScreenHeadingText({ text, customStyle }: TscreenHeadingTextProps) {
    return <Text style={[styles.default, customStyle]}>{text}</Text>
}


const styles = StyleSheet.create({
    default: { fontFamily: 'Inter-Bold', fontSize: mscale(24), color: colors.black, textTransform: 'capitalize' }
})