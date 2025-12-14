import { StaticScreenProps } from "@react-navigation/native";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
//import Pdf from 'react-native-pdf';
import {useState, useEffect} from "react";

import { hscale } from "../helpers/metric";

let Pdf: any;
let Document: any;
let Page: any;

// Guard native-only module
if(Platform.OS !== 'web') {
    const reactPdf = require('react-pdf');
    Document = reactPdf.Document;
    Page = reactPdf.Page;
    require('pdfjs-dist/build/pdf.worker.mjs');
}else {
    Pdf = require('react-native-pdf').default;
}


export default function PdfViewerPage({ route }: StaticScreenProps<{ pdfUri: string }>) {
   
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }


    //Web-safe fallback
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <Document
          file={route.params.pdfUri}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error: any) => console.log('Error loading PDF', error)}
        >
          <Page pageNumber={pageNumber} />
        </Document>
        {/* Add navigation if needed */}
      </View>
    );
  }
    const pdfSource = { uri: route.params.pdfUri, cache: true };
    return (
        <View style={styles.container}>
            <Pdf
                source={pdfSource}
                onError={(error: any) => console.log('Error viewing pdf', error)}
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