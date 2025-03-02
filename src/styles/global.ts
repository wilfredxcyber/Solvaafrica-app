import { StyleSheet } from "react-native";

import { colors, screenHorizontalPadding } from "../constants/theme";
import { mscale } from "../helpers/metric";


const globalStyles = StyleSheet.create({
    headlineText: { fontFamily: 'Inter-Bold', fontSize: mscale(24), color: colors.black, textTransform: 'capitalize', },
    bodyText: { fontFamily: 'Inter-Regular', fontSize: mscale(16), color: colors.bodyText },
    screen: { flex: 1, backgroundColor: '#ffffff', paddingHorizontal: screenHorizontalPadding, position: 'relative' }
})


export { globalStyles }