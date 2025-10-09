  import { View, Text, TextInput, StyleSheet, Pressable, Dimensions, Modal } from "react-native";
  import { useCallback, useEffect, useMemo, useRef, useState } from "react";
  import { useNavigation } from "@react-navigation/native";
  import DropdownIcon from "@expo/vector-icons/Entypo";
  import { FlashList } from "@shopify/flash-list";

  import { colors, screenHorizontalPadding } from "../constants/theme";
  import { faculties, universities } from "../constants/data";
  import { hscale, mscale, wscale } from "../helpers/metric";
  import PrimaryButton from "../components/primaryButton";
  import ProtectPage from "../components/protectPage";
  import { globalStyles } from "../styles/global";


  export default function CoursesScreen() {
    const [university, setUniversity] = useState(universities[0]);
    const [faculty, setFaculty] = useState(faculties[0].name);
    const [department, setDepartment] = useState(faculties[0].departments[0]);
    const [departmentList, setDepartmentList] = useState<string[]>(faculties[0].departments);

    const navigation = useNavigation();

    useEffect(() => {
      const getDepartmentList = () => {
        const res = faculties.find((currItem) => currItem.name === faculty);
        if (res) return res.departments;
      };

      const _departmentList = getDepartmentList();

      if (_departmentList !== undefined) {
        setDepartmentList(_departmentList);
        setDepartment(_departmentList[0]);
      }
    }, [faculty]);

    const facultyList = useMemo(() => faculties.map((currItem) => currItem.name), []);

    const handleSearch = () => {
      navigation.navigate("App", {
        screen: "CoursesList",
        params: { searchListParams: { university, faculty, department } },
      });
    };

    return (
      // <ProtectPage>
        <View style={globalStyles.screen}>
          <View style={{ gap: 12 }}>
            {/* university */}
            <DropDownPicker
              data={universities}
              setSelectedValue={setUniversity}
              defaultValue={university}
            />
            {/* faculties */}
            <DropDownPicker data={facultyList} setSelectedValue={setFaculty} defaultValue={faculty} />
            {/* departments */}
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
      // </ProtectPage>
    );
  }

  interface DropdownPickerProps {
    data: string[];
    setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
    defaultValue: string;
  }

  const DropDownPicker = ({ data, setSelectedValue, defaultValue }: DropdownPickerProps) => {
    const [dropdownIsVisibile, setDropdownIsVisibile] = useState(false);
    const inputRef = useRef(null);
    const [dropdownViewPos, setDropdownViewPos] = useState(0);

    const handleInputBlur = () => {
      console.log("Blurred");
    };

    const handleDropdownInputPressed = () => {
      setDropdownIsVisibile(!dropdownIsVisibile);
    };

    const dropdownViewRef = useRef<View | null>(null);

    const handleListItemPressed = (item: string) => {
      setSelectedValue(item);
      setDropdownIsVisibile(false);
    };

    useEffect(() => {
      // get the view vertical position from the screen
      dropdownViewRef.current?.measureInWindow((x, y, width, height) => {
        setDropdownViewPos(y);
      });
    }, []);

    const renderItem = ({ item, index }: { item: string; index: number }) => {
      return (
        <Text
          onPress={() => handleListItemPressed(item)}
          style={[
            styles.dropDownListItem,
            { borderBottomWidth: index + 1 === data.length ? 0 : StyleSheet.hairlineWidth },
          ]}
        >
          {item}
        </Text>
      );
    };

    const renderItemCallback = useCallback(renderItem, []);

    const dropdownInputHeight = 56;
    const dropdownViewGap = 12;

    const dropdownTopMargin = dropdownViewPos + dropdownInputHeight + dropdownViewGap;

    return (
      <View ref={dropdownViewRef}>
        {/* backdrop */}
        <Pressable onPress={handleDropdownInputPressed} style={styles.dropdownInputContainer}>
          <TextInput
            value={defaultValue}
            onBlur={handleInputBlur}
            ref={inputRef}
            autoCorrect={false}
            editable={false}
            numberOfLines={1}
            style={{ flex: 1, height: "100%" }}
          />
          <DropdownIcon
            name={dropdownIsVisibile ? "chevron-small-up" : "chevron-small-down"}
            size={20}
            color={colors.black}
          />
        </Pressable>

        {/* items list */}
        {dropdownIsVisibile && (
          <Modal transparent={true}>
            <Pressable
              onPress={() => setDropdownIsVisibile(false)}
              style={{
                paddingHorizontal: screenHorizontalPadding,
                height: Dimensions.get("screen").height,
              }}
            >
              <View
                style={[
                  styles.dropDownContainer,
                  { width: "100%", height: hscale(300), marginTop: dropdownTopMargin },
                ]}
              >
                <FlashList
                  data={data}
                  renderItem={renderItemCallback}
                  keyExtractor={(item, index) => index + item}
                  estimatedItemSize={data.length}
                  showsVerticalScrollIndicator={false}
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
      backgroundColor: colors.inputField,
      paddingHorizontal: wscale(20),
      borderRadius: mscale(50),
      position: "relative",
      fontFamily: "Inter-Regular",
    },
  });
