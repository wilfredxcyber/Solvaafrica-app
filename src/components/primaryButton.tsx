import { Pressable, StyleSheet, Text } from "react-native";
import { useState } from "react";

import { hscale, mscale } from "../helpers/metric";
import { colors } from "../constants/theme";


type TprimaryButtonProps = { text: string, onPress: () => void }


export default function PrimaryButton({ text, onPress }: TprimaryButtonProps) {
    const [pressed, setPressed] = useState(false);

    return (
        <Pressable style={[styles.buttonView, { opacity: pressed ? 0.9 : 1 }]} onPress={onPress} onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)}>
            <Text style={styles.buttonText}>{text}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    buttonView: { backgroundColor: colors.primary, width: '100%', borderRadius: mscale(100) },
    buttonText: { paddingVertical: hscale(20), textAlign: 'center', color: '#ffffff', fontFamily: 'Inter-Medium', fontSize: mscale(16), textTransform: 'capitalize' }
})