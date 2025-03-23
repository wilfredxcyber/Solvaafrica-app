import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { View, FlatList, Dimensions, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { Image } from "expo-image";

import { colors, screenHorizontalPadding } from "../constants/theme";
import { getImageSource } from "../helpers/getImageSource";
import EmptyStateView from "../components/emptyStateView";
import LoadingView from "../components/loadingView";
import { hscale, mscale } from "../helpers/metric";
import { AUTH_API_CLIENT } from "../api/apiClient";


type ScreenProps = StaticScreenProps<{ courseId: string; headerTitle: string; courseCode: string }>;

export default function CourseMaterials({ route }: ScreenProps) {
  const { courseId, headerTitle, courseCode } = route.params;
  const [courses, setCourses] = useState<any[] | []>([]);
  const [fetchingCourseMaterials, setFetchingCourseMaterials] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: `${headerTitle}` });
    const fetchCourseMaterials = async () => {
      setFetchingCourseMaterials(true);
      try {
        const res = await AUTH_API_CLIENT.get(`/questions/${courseId}`);
        const { data: coursesList } = res.data;
        setCourses(coursesList.documents);
      } catch (error) {
        console.log("Error getting course materials", error);
      } finally {
        setFetchingCourseMaterials(false);
      }
    };

    fetchCourseMaterials();
  }, []);

  if (fetchingCourseMaterials) return <LoadingView isLoading={fetchingCourseMaterials} />;

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      {!courses.length ? (
        <EmptyStateView />
      ) : (
        <FlatList
          data={courses}
          renderItem={({ item }) => (
            <CourseItemView
              url={item.url}
              key={item.id}
              title={headerTitle}
              fileName={item.name}
              courseCode={courseCode}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          numColumns={3}
          columnWrapperStyle={{ gap: 8 }}
          contentContainerStyle={{ paddingHorizontal: screenHorizontalPadding }}
        />
      )}
    </View>
  );
}

const CourseItemView = ({
  url,
  title,
  fileName,
  courseCode,
}: {
  url: string;
  title: string;
  fileName: string;
  courseCode: string;
}) => {
  const navigation = useNavigation();
  const handleImagePress = () => {
    navigation.navigate("App", {
      screen: "CourseDownloadMaterial",
      params: { url, screenTitle: title, originalFileName: fileName, fileCode: courseCode },
    });
  };
  return (
    <Pressable onPress={handleImagePress}>
      <Image
        source={getImageSource(url)}
        transition={1000}
        contentFit="cover"
        style={{
          aspectRatio: 1,
          width: Dimensions.get("window").width / 3 - screenHorizontalPadding,
          borderWidth: 2,
          borderColor: colors.black,
          marginBottom: hscale(8),
          borderRadius: mscale(4),
        }}
      />
    </Pressable>
  );
};
