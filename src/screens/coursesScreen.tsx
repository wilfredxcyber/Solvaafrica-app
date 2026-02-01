import { View, Text, TextInput, StyleSheet, Pressable, Dimensions, Modal, Alert } from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import DropdownIcon from "@expo/vector-icons/Entypo";
import { FlashList } from "@shopify/flash-list";

import { colors, screenHorizontalPadding } from "../constants/theme";
import { universities, UniversityType } from "../constants/data";
import { hscale, mscale, wscale } from "../helpers/metric";
import PrimaryButton from "../components/primaryButton";
import ProtectPage from "../components/protectPage";
import { globalStyles } from "../styles/global";
import { CoursesList } from "./index";

export default function CoursesScreen() {
  const params = useLocalSearchParams();
  const [university, setUniversity] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");

  /** ============================
   * MEMOIZED SELECTORS
   * ============================ */

  // Get all universities (no type filtering)
  const allUniversities = useMemo(
    () => universities,
    []
  );

  const selectedUniversity = useMemo(
    () => allUniversities.find(u => u.name === university),
    [allUniversities, university]
  );

  const facultyList = useMemo(
    () => selectedUniversity?.faculties ?? [],
    [selectedUniversity]
  );

  const departmentList = useMemo(() => {
    const selectedFaculty = facultyList.find(f => f.name === faculty);
    return selectedFaculty?.departments ?? [];
  }, [facultyList, faculty]);

  /** ============================
   * STATE SYNC
   * ============================ */

  // Initialize with first university if none selected
  useEffect(() => {
    if (allUniversities.length && !university) {
      setUniversity(allUniversities[0].name);
    }
  }, [allUniversities]);

  useEffect(() => {
    if (facultyList.length && !faculty) {
      setFaculty(facultyList[0].name);
    } else if (facultyList.length === 0) {
      setFaculty("");
    }
  }, [facultyList, university]);

  useEffect(() => {
    if (departmentList.length && !department) {
      setDepartment(departmentList[0]);
    } else if (departmentList.length === 0) {
      setDepartment("");
    }
  }, [departmentList, faculty]);

  /** ============================
   * ACTIONS
   * ============================ */

  const handleSearch = () => {
    if (!university || !faculty || !department) {
      Alert.alert("Missing Information", "Please select all fields before searching");
      return;
    }

    router.push({
      pathname: "/courses",
      params: {
        university,
        faculty,
        department,
      },
    });
  };

  const universityParam = Array.isArray(params.university) ? params.university[0] : params.university;
  const facultyParam = Array.isArray(params.faculty) ? params.faculty[0] : params.faculty;
  const departmentParam = Array.isArray(params.department) ? params.department[0] : params.department;

  if (universityParam && facultyParam && departmentParam) {
    return <CoursesList />;
  }

  return (
    <ProtectPage>
      <View style={globalStyles.screen}>
        <View style={{ gap: 12 }}>
          <DropDownPicker
            data={allUniversities.map(u => u.name)}
            setSelectedValue={setUniversity}
            defaultValue={university}
          />

          <DropDownPicker
            data={facultyList.map(f => f.name)}
            setSelectedValue={setFaculty}
            defaultValue={faculty}
          />

          <DropDownPicker
            data={departmentList}
            setSelectedValue={setDepartment}
            defaultValue={department}
          />

          <View style={{ marginTop: hscale(40) }}>
            <PrimaryButton text="Search" onPress={handleSearch} />
          </View>
        </View>
      </View>
    </ProtectPage>
  );
}

/** ============================
 * DROPDOWN (UNCHANGED STYLING)
 * ============================ */

interface DropdownPickerProps {
  data: string[];
  setSelectedValue: React.Dispatch<React.SetStateAction<any>>;
  defaultValue: string;
}

function DropDownPicker({ data, setSelectedValue, defaultValue }: DropdownPickerProps) {
  const [dropdownIsVisibile, setDropdownIsVisibile] = useState(false);
  const dropdownViewRef = useRef<View | null>(null);
  const [dropdownViewPos, setDropdownViewPos] = useState(0);

  useEffect(() => {
    dropdownViewRef.current?.measureInWindow((_, y) => setDropdownViewPos(y));
  }, []);

  const handleSelect = useCallback(
    (item: string) => {
      setSelectedValue(item);
      setDropdownIsVisibile(false);
    },
    [setSelectedValue]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) => (
      <Pressable onPress={() => handleSelect(item)}>
        <Text
          style={[
            styles.dropDownListItem,
            { borderBottomWidth: index + 1 === data.length ? 0 : StyleSheet.hairlineWidth },
          ]}
        >
          {item}
        </Text>
      </Pressable>
    ),
    [data.length, handleSelect]
  );

  return (
    <View ref={dropdownViewRef}>
      <Pressable onPress={() => setDropdownIsVisibile(v => !v)} style={styles.dropdownInputContainer}>
        <TextInput editable={false} value={defaultValue} style={{ flex: 1 }} />
        <DropdownIcon
          name={dropdownIsVisibile ? "chevron-small-up" : "chevron-small-down"}
          size={20}
          color={colors.black}
        />
      </Pressable>

      {dropdownIsVisibile && (
        <Modal transparent>
          <Pressable
            onPress={() => setDropdownIsVisibile(false)}
            style={{ paddingHorizontal: screenHorizontalPadding, height: Dimensions.get("screen").height }}
          >
            <View
              style={[
                styles.dropDownContainer,
                { width: "100%", height: hscale(300), marginTop: dropdownViewPos + hscale(68) },
              ]}
            >
              <FlashList
                data={data}
                renderItem={renderItem}
                estimatedItemSize={data.length}
                keyExtractor={(item, index) => index + item}
              />
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropDownListItem: {
    fontFamily: "Inter-Medium",
    fontSize: mscale(14),
    paddingVertical: 12,
    borderBottomColor: "#eee",
    padding: wscale(20),
    color: colors.bodyText,
  },
  dropDownContainer: {
    elevation: 5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
    backgroundColor: "#ffffff",
    paddingVertical: hscale(20),
    borderRadius: mscale(8),
  },
  dropdownInputContainer: {
    height: hscale(56),
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputFieldNew,
    paddingHorizontal: wscale(20),
    borderRadius: mscale(50),
  },
});
