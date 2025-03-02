import { View, Image, Text, StyleSheet, FlatList, Dimensions } from "react-native";
import { StaticScreenProps, useNavigation, } from "@react-navigation/native";
import { useEffect, useState } from "react";

import { colors, screenHorizontalPadding } from "../constants/theme";
import { getImageSource } from "../helpers/getImageSource";
import LoadingView from "../components/loadingView";
import { hscale, mscale } from "../helpers/metric";
import { AUTH_API_CLIENT } from "../api/apiClient";


type ScreenProps = StaticScreenProps<{ courseId: string, headerTitle: string }>


export default function CourseMaterials({ route }: ScreenProps) {

    const { courseId, headerTitle } = route.params;
    const [courses, setCourses] = useState<any[] | []>([])
    const [fetchingCourseMaterials, setFetchingCourseMaterials] = useState<boolean>(false)
    const navigation = useNavigation()

    useEffect(() => {
        navigation.setOptions({ title: `${headerTitle}` })
        const fetchCourseMaterials = async () => {
            setFetchingCourseMaterials(true)
            try {
                const res = await AUTH_API_CLIENT.get(`/questions/${courseId}`)
                const { data: coursesList } = res.data
                setCourses(coursesList.documents)
            } catch (error) {
                console.log('Error getting course materials', error)
            } finally {
                setFetchingCourseMaterials(false)
            }
        }

        fetchCourseMaterials()
    }, [])

    if (fetchingCourseMaterials) return <LoadingView isLoading={fetchingCourseMaterials} />

    return (
        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
            {!courses.length ? <Text style={styles.noFilesText}>Could not load files.</Text> : <FlatList
                data={courses}
                renderItem={({ item }) => <CourseItemView url={item.url} key={item.id} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                numColumns={3}
                columnWrapperStyle={{ gap: 8 }}
                contentContainerStyle={{ paddingHorizontal: screenHorizontalPadding }}
            />}
        </View>
    )
}


const CourseItemView = ({ url }: { url: string }) => {
    return <Image source={getImageSource(url)} style={{ aspectRatio: 1, width: (Dimensions.get('window').width / 3) - screenHorizontalPadding, resizeMode: 'cover', borderWidth: 2, borderColor: colors.black, marginBottom: hscale(8), borderRadius: mscale(4) }} />
}

const styles = StyleSheet.create({ noFilesText: { fontFamily: 'Inter-Bold', fontSize: mscale(24), color: colors.black, textAlign: 'center' } })