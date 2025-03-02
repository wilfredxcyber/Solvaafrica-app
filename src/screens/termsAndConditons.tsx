import Markdown from "react-native-markdown-display";
import { ScrollView, View } from "react-native";

import { agreement } from "../constants/TsandCs";
import { globalStyles } from "../styles/global";


export default function TermsAndConditions() {
    return (
        <View style={globalStyles.screen}>
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                showsVerticalScrollIndicator={false}
                style={{ height: '100%' }}
            >
                <Markdown>
                    {agreement}
                </Markdown>
            </ScrollView>
        </View>
    )
}