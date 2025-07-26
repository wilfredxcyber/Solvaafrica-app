import { StaticScreenProps } from "@react-navigation/native";
import { Dimensions, StyleSheet, View } from "react-native";
import Pdf from 'react-native-pdf';

import { hscale } from "../helpers/metric";


export default function PdfViewerPage({ route }: StaticScreenProps<{ pdfUri: string }>) {
    const pdfSource = { uri: route.params.pdfUri, cache: true };
    return (
        <View style={styles.container}>
            <Pdf
                source={pdfSource}
                onError={(error) => console.log('Error viewing pdf', error)}
                style={styles.pdf}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: hscale(25),
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
})