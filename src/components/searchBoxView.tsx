import { StyleSheet, TextInput, View } from "react-native";
import SearchIcon from "@expo/vector-icons/Feather";

import { hscale, mscale, wscale } from "../helpers/metric";
import { colors } from "../constants/theme";

export const SearchBoxView = ({
  handleSearchInputTextChange,
}: {
  handleSearchInputTextChange: (text: string) => void;
}) => {
  return (
    <View style={styles.searchBoxView}>
      <TextInput
        style={{ flex: 1 }}
        onChangeText={handleSearchInputTextChange}
        cursorColor={colors.primary}
        placeholder="Search by name"
      />
      <SearchIcon name="search" size={20} color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBoxView: {
    backgroundColor: colors.inputField,
    flexDirection: "row",
    height: hscale(60),
    paddingHorizontal: wscale(20),
    borderRadius: mscale(30),
    alignItems: "center",
    marginTop: hscale(40),
  },
});
