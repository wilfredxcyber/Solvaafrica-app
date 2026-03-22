import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, Pressable, Alert, Animated, Easing } from "react-native";
import DownloadIcon from "@expo/vector-icons/Feather";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect, useRef, useState } from "react";
import PDFIcon from "@expo/vector-icons/FontAwesome6";
import * as FileSystem from "expo-file-system";

import { hscale, mscale, wscale } from "../helpers/metric";
import EmptyStateView from "../components/emptyStateView";
import LoadingView from "../components/loadingView";
import { AUTH_API_CLIENT } from "../api/apiClient";
import { globalStyles } from "../styles/global";
import { colors } from "../constants/theme";
import ErrorModal from "../components/errorModal";
import { DownloadedFileRef } from "../types";
import { useDownloadFile } from "../hooks/useDownloadFile";
import { normalizeRemoteFileUrl } from "../helpers/normalizeRemoteFileUrl";

const normalizeText = (value?: string | null) =>
  (value ?? "")
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/&/g, " and ")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const extractCoursesFromResponse = (payload: any): any[] => {
  const responseData = payload?.data;

  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.documents)) return responseData.documents;
  if (Array.isArray(payload?.documents)) return payload.documents;
  if (Array.isArray(payload)) return payload;

  return [];
};

const buildUniversityCandidates = (university: string) => {
  const raw = university?.trim();
  if (!raw) return [];

  const candidates = new Set<string>();
  const withoutBracket = raw.replace(/\s*\([^)]*\)\s*/g, "").trim();
  const bracketMatch = raw.match(/\(([^)]+)\)/);

  candidates.add(raw);
  if (withoutBracket) candidates.add(withoutBracket);
  if (bracketMatch?.[1]) candidates.add(bracketMatch[1].trim());

  return Array.from(candidates).map(normalizeText).filter(Boolean);
};

const matchesSelectedValue = (
  actualValue: string | undefined,
  selectedValue: string,
) => {
  const actual = normalizeText(actualValue);
  const selected = normalizeText(selectedValue);

  if (!actual || !selected) return false;
  return (
    actual === selected ||
    actual.includes(selected) ||
    selected.includes(actual)
  );
};

type CourseDocument = { url?: string; name?: string };

const normalizeCourseCode = (value?: string | null) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const normalizeFileName = (value?: string | null) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const getCourseDownloadKey = ({
  courseCode,
  fileName,
  fileUrl,
}: {
  courseCode?: string | null;
  fileName?: string | null;
  fileUrl?: string | null;
}) => {
  const normalizedUrl = normalizeRemoteFileUrl(fileUrl);

  if (normalizedUrl) {
    return `url:${normalizedUrl}`;
  }

  return `legacy:${normalizeCourseCode(courseCode)}:${normalizeFileName(fileName)}`;
};

const getStoredCourseDownloadKey = (item: DownloadedFileRef) =>
  getCourseDownloadKey({
    courseCode: item.fileCode,
    fileName: item.fileName,
    fileUrl:
      item.sourceUrl ||
      (item.filePath.startsWith("http://") ||
      item.filePath.startsWith("https://")
        ? item.filePath
        : undefined),
  });

const getValidCourseDocuments = (courseDocuments: CourseDocument[] = []) =>
  courseDocuments.filter(
    (doc): doc is Required<CourseDocument> => !!doc?.url && !!doc?.name,
  );

export default function CoursesList() {
  const params = useLocalSearchParams();
  const universityParam = Array.isArray(params.university)
    ? params.university[0]
    : params.university;
  const departmentParam = Array.isArray(params.department)
    ? params.department[0]
    : params.department;
  const facultyParam = Array.isArray(params.faculty)
    ? params.faculty[0]
    : params.faculty;
  const [coursesList, setCoursesList] = useState<any[] | []>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(false);
  const [downloadedCourseKeys, setDownloadedCourseKeys] = useState<Set<string>>(
    new Set(),
  );
  const [downloadingCourseKeys, setDownloadingCourseKeys] = useState<
    Set<string>
  >(new Set());
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const downloadCourseFile = useDownloadFile(true);
  console.log(coursesList);

  useFocusEffect(
    useCallback(() => {
      const fetchDownloadedCourses = async () => {
        try {
          const raw = await AsyncStorage.getItem("DownloadRefs");
          const downloads: DownloadedFileRef[] = raw ? JSON.parse(raw) : [];

          const courseKeys = new Set(
            downloads
              .filter((item) => item.parentDirectory === "Courses")
              .map(getStoredCourseDownloadKey),
          );

          setDownloadedCourseKeys(courseKeys);
        } catch (error) {
          console.log("error fetching downloaded courses", error);
          setDownloadedCourseKeys(new Set());
        }
      };

      fetchDownloadedCourses();
    }, []),
  );

  const handleDownloadIconPress = async (
    courseCode: string,
    courseDocuments: CourseDocument[],
  ) => {
    const validDocuments = getValidCourseDocuments(courseDocuments);

    if (!validDocuments.length) {
      Alert.alert("No files", "This course has no downloadable files yet.");
      return;
    }

    const courseDocumentKeys = validDocuments.map((doc) =>
      getCourseDownloadKey({
        courseCode,
        fileName: doc.name,
        fileUrl: doc.url,
      }),
    );

    try {
      const raw = await AsyncStorage.getItem("DownloadRefs");
      const downloads: DownloadedFileRef[] = raw ? JSON.parse(raw) : [];

      const matchingCourseDownloads = downloads.filter(
        (item) =>
          item.parentDirectory === "Courses" &&
          courseDocumentKeys.includes(getStoredCourseDownloadKey(item)),
      );

      const existingCourseDownloadKeys = new Set(
        matchingCourseDownloads.map(getStoredCourseDownloadKey),
      );

      const nextDocumentToDownload = validDocuments.find(
        (doc) =>
          !existingCourseDownloadKeys.has(
            getCourseDownloadKey({
              courseCode,
              fileName: doc.name,
              fileUrl: doc.url,
            }),
          ),
      );

      if (nextDocumentToDownload) {
        const nextDocumentKey = getCourseDownloadKey({
          courseCode,
          fileName: nextDocumentToDownload.name,
          fileUrl: nextDocumentToDownload.url,
        });

        setDownloadingCourseKeys((prev) => new Set(prev).add(nextDocumentKey));

        try {
          const result = await downloadCourseFile(
            "Courses",
            nextDocumentToDownload.url,
            nextDocumentToDownload.name,
            courseCode,
          );

          if (result?.success) {
            setDownloadedCourseKeys((prev) =>
              new Set(prev).add(nextDocumentKey),
            );
          }
        } finally {
          setDownloadingCourseKeys((prev) => {
            const next = new Set(prev);
            next.delete(nextDocumentKey);
            return next;
          });
        }

        return;
      }

      Alert.alert(
        "Delete downloaded files?",
        `Remove ${matchingCourseDownloads.length} downloaded file(s) for ${courseCode}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              for (const item of matchingCourseDownloads) {
                const isRemotePath =
                  item.platform === "web" ||
                  item.filePath.startsWith("http://") ||
                  item.filePath.startsWith("https://");

                if (isRemotePath) continue;

                try {
                  await FileSystem.deleteAsync(item.filePath, {
                    idempotent: true,
                  });
                } catch (deleteError) {
                  console.log("error deleting local file", deleteError);
                }
              }

              const filteredDownloads = downloads.filter(
                (item) =>
                  !(
                    item.parentDirectory === "Courses" &&
                    courseDocumentKeys.includes(
                      getStoredCourseDownloadKey(item),
                    )
                  ),
              );

              await AsyncStorage.setItem(
                "DownloadRefs",
                JSON.stringify(filteredDownloads),
              );
              setDownloadedCourseKeys((prev) => {
                const next = new Set(prev);
                courseDocumentKeys.forEach((courseDocumentKey) =>
                  next.delete(courseDocumentKey),
                );
                return next;
              });
            },
          },
        ],
      );
    } catch (error) {
      console.log("error deleting downloaded course files", error);
    }
  };

  useEffect(() => {
    // fetch courses based on params
    if (!universityParam || !departmentParam || !facultyParam) {
      setCoursesList([]);
      return;
    }

    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const res = await AUTH_API_CLIENT.get("/questions", {
          params: {
            university: universityParam,
            department: departmentParam,
            faculty: facultyParam,
          },
        });
        let courses = extractCoursesFromResponse(res.data);

        // Fallback: some backend rows may not exactly match the labels in data.ts
        // (e.g. abbreviations, punctuation, or slightly different naming).
        if (!courses.length) {
          const fallbackRes = await AUTH_API_CLIENT.get("/questions");
          const allCourses = extractCoursesFromResponse(fallbackRes.data);
          const universityCandidates =
            buildUniversityCandidates(universityParam);

          courses = allCourses.filter((item: any) => {
            const question = item?.question ?? {};
            const universityOk =
              universityCandidates.length === 0
                ? true
                : universityCandidates.some((candidate) =>
                    matchesSelectedValue(question.university, candidate),
                  );

            const facultyOk = matchesSelectedValue(
              question.faculty,
              facultyParam,
            );
            const departmentOk = matchesSelectedValue(
              question.department,
              departmentParam,
            );

            return universityOk && facultyOk && departmentOk;
          });
        }

        setCoursesList(courses);
      } catch (error) {
        console.log("error fetching courses", error);
        const message = "Something went wrong!";

        setErrorMessage(message);
        setErrorVisible(true);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [universityParam, departmentParam, facultyParam]);

  if (loadingCourses) return <LoadingView isLoading={loadingCourses} />;
  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      {!coursesList.length ? (
        <EmptyStateView />
      ) : (
        <FlashList
          data={coursesList}
          extraData={{
            downloadedCourseKeys,
            downloadingCourseKeys,
          }}
          estimatedItemSize={coursesList.length}
          keyExtractor={(item) => String(item.question.id)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const courseCode = String(item.question.courseCode ?? "");
            const courseDocuments = getValidCourseDocuments(
              Array.isArray(item.document) ? item.document : [],
            );
            const courseDocumentKeys = courseDocuments.map((doc) =>
              getCourseDownloadKey({
                courseCode,
                fileName: doc.name,
                fileUrl: doc.url,
              }),
            );
            const isDownloaded =
              courseDocumentKeys.length > 0 &&
              courseDocumentKeys.every((courseDocumentKey) =>
                downloadedCourseKeys.has(courseDocumentKey),
              );
            const isDownloading = courseDocumentKeys.some((courseDocumentKey) =>
              downloadingCourseKeys.has(courseDocumentKey),
            );

            return (
              <View style={globalStyles.screen}>
                <CoursesListItem
                  courseTitle={item.question.title}
                  courseCode={courseCode}
                  university={item.question.university}
                  courseId={String(item.question.id)}
                  hasDownloadableFiles={courseDocuments.length > 0}
                  isDownloaded={isDownloaded}
                  isDownloading={isDownloading}
                  onDownloadIconPress={() =>
                    handleDownloadIconPress(courseCode, courseDocuments)
                  }
                />
              </View>
            );
          }}
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
  courseId: string;
  hasDownloadableFiles: boolean;
  isDownloaded: boolean;
  isDownloading: boolean;
  onDownloadIconPress: () => void;
}

const CoursesListItem = ({
  courseTitle,
  courseCode,
  university,
  courseId,
  hasDownloadableFiles,
  isDownloaded,
  isDownloading,
  onDownloadIconPress,
}: CourseListItemProps) => {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isDownloading) {
      spinAnim.stopAnimation();
      spinAnim.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    loop.start();

    return () => {
      loop.stop();
      spinAnim.stopAnimation();
      spinAnim.setValue(0);
    };
  }, [isDownloading, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleCourseListItemPressed = () => {
    router.push({
      pathname: "/courses/materials",
      params: { courseId, headerTitle: `${courseTitle} Materials`, courseCode },
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
          <Text
            style={{
              fontFamily: "Inter-Bold",
              color: "#5C5F62",
              fontSize: mscale(16),
            }}
          >
            {courseCode}
          </Text>

          <Text
            style={{
              fontFamily: "Inter-Regular",
              color: colors.primary,
              fontSize: mscale(12),
              marginTop: hscale(4),
            }}
          >
            {courseTitle.length > 30
              ? courseTitle.substring(0, 30) + "..."
              : courseTitle}
          </Text>

          <Text
            style={{
              fontFamily: "Inter-Bold",
              color: "#5C5F62",
              fontSize: mscale(14),
              marginTop: hscale(4),
            }}
          >
            {university}
          </Text>
        </View>

        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            onDownloadIconPress();
          }}
          disabled={isDownloading || !hasDownloadableFiles}
          hitSlop={8}
        >
          <Animated.View
            style={[
              isDownloading ? { transform: [{ rotate: spin }] } : undefined,
              !hasDownloadableFiles ? { opacity: 0.4 } : undefined,
            ]}
          >
            <DownloadIcon
              name={
                isDownloading
                  ? "loader"
                  : isDownloaded
                    ? "check-circle"
                    : "download-cloud"
              }
              size={24}
              color={colors.primary}
            />
          </Animated.View>
        </Pressable>
      </View>
    </Pressable>
  );
};
