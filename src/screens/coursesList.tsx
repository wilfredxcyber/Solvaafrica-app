import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import DownloadIcon from "@expo/vector-icons/Feather";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useRef, useState } from "react";
import { Image } from "expo-image";
import PDFIcon from "@expo/vector-icons/FontAwesome6";
import { hscale, mscale, wscale } from "../helpers/metric";
import { getImageSource } from "../helpers/getImageSource";
import EmptyStateView from "../components/emptyStateView";
import LoadingView from "../components/loadingView";
import { AUTH_API_CLIENT } from "../api/apiClient";
import { globalStyles } from "../styles/global";
import { colors } from "../constants/theme";
import ErrorModal from "../components/errorModal";
import LottieView from "lottie-react-native";
import CheckCircleIcon from "@expo/vector-icons/FontAwesome";
import { useDownloadFile } from "../hooks/useDownloadFile";


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
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const { university, department, faculty } = params.searchListParams;

    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const res = await AUTH_API_CLIENT.get("/questions", {
          params: { university, department, faculty },
        });
        const { data: courses } = res.data;
        setCoursesList(courses);
        console.log(res.data.data, "course")
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
}: {
  courseTitle: string;
  courseCode: string;
  university: string;
  previewUrl: string;
  courseId: string;
}) => {
  const [startDownload, setStartDownload] = useState(false);
  const [fileExist, setFileExist] = useState(false);
  const DownloadIconRef = useRef<LottieView>(null);

  const downloadFile = useDownloadFile(startDownload, "CRS");

  useEffect(() => {
    const initiateDownload = async () => {
      try {
        if (!previewUrl || !courseTitle) return;
        const { isExistingFile } = await downloadFile(
          "Courses",
          previewUrl,
          `${courseCode}-${courseTitle}.pdf`
        );

        if (isExistingFile) setFileExist(true);
      } catch (error) {
        Alert.alert("Download Failed", "Please try again later.");
      }
    };

    initiateDownload();
  }, [startDownload]);

  const handleInitiateDownload = () => {
    DownloadIconRef.current?.play();
    setStartDownload(true);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.greyView,
        height: hscale(70),
        paddingVertical: hscale(6),
        borderRadius: mscale(10),
        justifyContent: "space-between",
        marginVertical: hscale(8),
        paddingHorizontal: wscale(10),
      }}
    >
      {/* Left side — image and text */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <PDFIcon name="file-pdf" size={36} color={colors.primary} />
        <View style={{ marginLeft: wscale(10) }}>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: mscale(15),
              color: colors.bodyText,
            }}
          >
            {courseTitle}
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Bold",
              fontSize: mscale(14),
              color: colors.primary,
            }}
          >
            {courseCode}
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: mscale(13),
              color: colors.bodyText,
            }}
          >
            {university}
          </Text>
        </View>
      </View>

      {/* Right side — download/check */}
      {!fileExist ? (
        <Pressable onPress={handleInitiateDownload}>
          <LottieView
            ref={DownloadIconRef}
            style={{ width: wscale(50), height: hscale(50) }}
            source={require("../../assets/animations/download.json")}
          />
        </Pressable>
      ) : (
        <CheckCircleIcon
          name="check-circle"
          size={26}
          color={colors.primary}
          style={{ marginRight: wscale(10) }}
        />
      )}
    </View>
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
