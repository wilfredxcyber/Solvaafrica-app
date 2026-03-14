import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Modal,
  Alert,
} from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import DropdownIcon from "@expo/vector-icons/Entypo";
import { FlashList } from "@shopify/flash-list";

import { colors, screenHorizontalPadding } from "../constants/theme";
import { universities, faculties } from "../constants/data";
import { hscale, mscale, wscale } from "../helpers/metric";
import PrimaryButton from "../components/primaryButton";
import { globalStyles } from "../styles/global";
import CoursesList from "./coursesList";

export default function CoursesScreen() {
  const params = useLocalSearchParams();
  const [university, setUniversity] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");

  /** ============================
   * MEMOIZED SELECTORS
   * ============================ */

  const allUniversities = useMemo(() => universities, []);

  const facultyList = useMemo(() => faculties, []);

  const departmentList = useMemo(() => {
    const selectedFaculty = facultyList.find((f) => f.name === faculty);
    return selectedFaculty?.departments ?? [];
  }, [facultyList, faculty]);

  /** ============================
   * STATE SYNC
   * ============================ */

  useEffect(() => {
    if (allUniversities.length && !university) {
      setUniversity(allUniversities[0]);
    }
  }, [allUniversities]);

  useEffect(() => {
    const facultyExists = facultyList.some((f) => f.name === faculty);

    if (facultyList.length && !facultyExists) {
      setFaculty(facultyList[0].name);
    } else if (facultyList.length === 0) {
      setFaculty("");
    }
  }, [facultyList, faculty]);

  useEffect(() => {
    const departmentExists = departmentList.includes(department);

    if (departmentList.length && !departmentExists) {
      setDepartment(departmentList[0]);
    } else if (departmentList.length === 0) {
      setDepartment("");
    }
  }, [departmentList, department]);

  /** ============================
   * ACTIONS
   * ============================ */

  const handleSearch = () => {
    if (!university || !faculty || !department) {
      Alert.alert(
        "Missing Information",
        "Please select all fields before searching",
      );
      return;
    }

    router.push({
      pathname: "/courses/courses",
      params: {
        university,
        faculty,
        department,
      },
    });
  };

  const universityParam = Array.isArray(params.university)
    ? params.university[0]
    : params.university;
  const facultyParam = Array.isArray(params.faculty)
    ? params.faculty[0]
    : params.faculty;
  const departmentParam = Array.isArray(params.department)
    ? params.department[0]
    : params.department;

  if (universityParam && facultyParam && departmentParam) {
    return <CoursesList />;
  }

  return (
    <View style={globalStyles.screen}>
      <View style={{ gap: 12 }}>
        <DropDownPicker
          data={allUniversities}
          setSelectedValue={setUniversity}
          defaultValue={university}
        />

        <DropDownPicker
          data={facultyList.map((f) => f.name)}
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
  );
}

/** ============================
 * DROPDOWN
 * ============================ */

interface DropdownPickerProps {
  data: string[];
  setSelectedValue: React.Dispatch<React.SetStateAction<any>>;
  defaultValue: string;
}

function DropDownPicker({
  data,
  setSelectedValue,
  defaultValue,
}: DropdownPickerProps) {
  const [dropdownIsVisibile, setDropdownIsVisibile] = useState(false);

  const dropdownViewRef = useRef<View | null>(null);

  const [dropdownY, setDropdownY] = useState(0);
  const [dropdownX, setDropdownX] = useState(0);
  const [dropdownWidth, setDropdownWidth] = useState(0);

  /** Measure input position and width */
  const measureDropdown = () => {
    dropdownViewRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownX(x);
      setDropdownY(y + height);
      setDropdownWidth(width);
    });
  };

  useEffect(() => {
    measureDropdown();
  }, []);

  const handleSelect = useCallback(
    (item: string) => {
      setSelectedValue(item);
      setDropdownIsVisibile(false);
    },
    [setSelectedValue],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) => (
      <Pressable onPress={() => handleSelect(item)}>
        <Text
          style={[
            styles.dropDownListItem,
            {
              borderBottomWidth:
                index + 1 === data.length ? 0 : StyleSheet.hairlineWidth,
            },
          ]}
        >
          {item}
        </Text>
      </Pressable>
    ),
    [data.length, handleSelect],
  );

  return (
    <View ref={dropdownViewRef}>
      <Pressable
        onPress={() => {
          measureDropdown();
          setDropdownIsVisibile((v) => !v);
        }}
        style={styles.dropdownInputContainer}
      >
        <Text numberOfLines={1} style={styles.dropdownValueText}>
          {defaultValue}
        </Text>

        <DropdownIcon
          name={dropdownIsVisibile ? "chevron-small-up" : "chevron-small-down"}
          size={20}
          color={colors.black}
        />
      </Pressable>

      {dropdownIsVisibile && (
        <Modal transparent>
          <Pressable
            style={styles.overlay}
            onPress={() => setDropdownIsVisibile(false)}
          >
            <View
              style={[
                styles.dropDownContainer,
                {
                  position: "absolute",
                  top: dropdownY,
                  left: dropdownX,
                  width: dropdownWidth,
                  height: hscale(300),
                },
              ]}
            >
              <FlashList
                data={data}
                renderItem={renderItem}
                estimatedItemSize={50}
                keyExtractor={(item, index) => index + item}
              />
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },

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

  dropdownValueText: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: mscale(14),
    color: colors.black,
  },
});
