import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Pressable } from "react-native";
import DownloadIcon from "@expo/vector-icons/Feather";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import { Image } from "expo-image";

import { hscale, mscale, wscale } from "../helpers/metric";
import { getImageSource } from "../helpers/getImageSource";
import EmptyStateView from "../components/emptyStateView";
import LoadingView from "../components/loadingView";
import { AUTH_API_CLIENT } from "../api/apiClient";
import { globalStyles } from "../styles/global";
import { colors } from "../constants/theme";


interface ISearchListParams {
  university: string;
  faculty: string;
  department: string;
}

type ScreenProps = StaticScreenProps<{ searchListParams: ISearchListParams }>;

export default function CoursesList({ route }: ScreenProps) {
  const params = route.params;
  const [coursesList, setCoursesList] = useState<any[] | []>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(false);

  useEffect(() => {
    // fetch courses based on params
    const { university, department, faculty } = params.searchListParams;

    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const res = await AUTH_API_CLIENT.get("/questions", {
          params: { university, department, faculty },
        });
        const { data: courses } = res.data;
        setCoursesList(courses);
      } catch (error) {
        console.log("error fetching courses", error);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  if (loadingCourses) return <LoadingView isLoading={loadingCourses} />;
  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      {!coursesList.length ? (
        <EmptyStateView />
      ) : (
        <FlashList
          data={coursesList}
          estimatedItemSize={88}
          keyExtractor={(item) => item.question.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={globalStyles.screen}>
              <CoursesListItem
                courseTitle={item.question.title}
                courseCode={item.question.courseCode}
                university={item.question.university}
                previewUrl={item.document[0].url}
                courseId={item.question.id}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

interface CourseListItemProps {
  courseTitle: string;
  courseCode: string;
  university: string;
  previewUrl: string;
  courseId: string;
}

const CoursesListItem = ({
  courseTitle,
  courseCode,
  university,
  previewUrl,
  courseId,
}: CourseListItemProps) => {
  const navigation = useNavigation();

  const handleCourseListItemPressed = () => {
    navigation.navigate("App", {
      screen: "CourseMaterials",
      params: { courseId, headerTitle: `${courseTitle} Materials` },
    });
  };
  return (
    <Pressable
      onPress={handleCourseListItemPressed}
      style={{
        flexDirection: "row",
        paddingVertical: hscale(12),
        backgroundColor: colors.greyView,
        paddingHorizontal: wscale(12),
        borderRadius: mscale(12),
        marginBottom: hscale(20),
      }}
    >
      {/* left icon */}
      <Image
        source={getImageSource(previewUrl)}
        style={styles.coursesListImage}
        contentFit="cover"
        transition={1000}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 1,
          marginLeft: wscale(8),
          alignItems: "center",
        }}
      >
        <View>
          {/* course title */}
          <Text
            style={{
              fontFamily: "Inter-Regular",
              color: colors.bodyText,
              fontSize: mscale(16),
            }}
          >
            {courseTitle}
          </Text>
          {/* course code */}
          <Text
            style={{
              fontFamily: "Inter-Bold",
              color: colors.bodyText,
              fontSize: mscale(16),
            }}
          >
            {courseCode}
          </Text>
          {/* university */}
          <Text
            style={{
              fontFamily: "Inter-Bold",
              color: colors.primary,
              fontSize: mscale(14),
            }}
          >
            {university}
          </Text>
        </View>

        {/* far right icon */}
        <DownloadIcon name="download-cloud" size={24} color={colors.primary} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  coursesListImage: {
    height: hscale(60),
    width: wscale(60),
    borderRadius: mscale(8),
  },
  noFilesFoundText: {
    fontFamily: "Inter-Bold",
    fontSize: mscale(24),
    color: colors.black,
    textAlign: "center",
  },
});
