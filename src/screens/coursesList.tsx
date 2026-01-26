import { useLocalSearchParams, router } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";
import DownloadIcon from "@expo/vector-icons/Feather";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import PDFIcon from "@expo/vector-icons/FontAwesome6";

import { hscale, mscale, wscale } from "../helpers/metric";
import { getImageSource } from "../helpers/getImageSource";
import EmptyStateView from "../components/emptyStateView";
import LoadingView from "../components/loadingView";
import { AUTH_API_CLIENT } from "../api/apiClient";
import { globalStyles } from "../styles/global";
import { colors } from "../constants/theme";
import ErrorModal from "../components/errorModal";

export default function CoursesList() {
  const params = useLocalSearchParams();
  const [coursesList, setCoursesList] = useState<any[] | []>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // fetch courses based on params
    const { university, department, faculty } = params;

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
        let message = "Something went wrong!";

        setErrorMessage(message);
        setErrorVisible(true);
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
          estimatedItemSize={coursesList.length}
          keyExtractor={(item) => item.question.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={globalStyles.screen}>
              <CoursesListItem
                courseTitle={item.question.title}
                courseCode={item.question.courseCode}
                university={item.question.university}
                previewUrl={item.document[0]?.url}
                courseId={item.question.id}
              />
            </View>
          )}
        />
      )}
      <ErrorModal
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
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
  const handleCourseListItemPressed = () => {
    router.push({
      pathname: '/courses/materials',
      params: { courseId, headerTitle: `${courseTitle} Materials`, courseCode }
    });
  };
  return (
    <Pressable
      onPress={handleCourseListItemPressed}
      style={{
        flexDirection: "row",
        paddingVertical: hscale(12),
        backgroundColor: colors.inputFieldNew,
        paddingHorizontal: wscale(28),
        borderRadius: mscale(12),
        marginBottom: hscale(20),
      }}
    >
      {/* left icon */}
      <PDFIcon name="file-pdf" size={40} color={colors.primary} />

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
          
          {/* course code */}
          <Text
            style={{
              fontFamily: "Inter-Bold",
              color: "#5C5F62",
              fontSize: mscale(16),
            }}
          >
            {courseCode}
          </Text>

          {/* course title */}
          <Text
            style={{
              fontFamily: "Inter-Regular",
              color: colors.primary,
              fontSize: mscale(12),
              marginTop: hscale(4), // Add space between course code and title
            }}
          >
            {courseTitle.length > 30 ? courseTitle.substring(0, 30) + '...' : courseTitle}
          </Text>

          {/* university */}
          <Text
            style={{
              fontFamily: "Inter-Bold",
              color: "#5C5F62",
              fontSize: mscale(14),
              marginTop: hscale(4), // Add space between title and university
            }}
          >
            {university}
          </Text>
        </View>

        {/* far right icon */}
        <DownloadIcon name="download-cloud" size={24} color="#5427D7" />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  noFilesFoundText: {
    fontFamily: "Inter-Bold",
    fontSize: mscale(24),
    color: colors.black,
    textAlign: "center",
  },
});