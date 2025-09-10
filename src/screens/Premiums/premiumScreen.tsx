import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "../../styles/global";
import Icon from "@expo/vector-icons/Feather";
import { mscale } from "../../helpers/metric";
import { useNavigation } from "@react-navigation/native";
import ProtectPage from "@/src/components/protectPage";

export default function PremiumScreen() {
  const data = [
    { id: "2", title: "Upload Past Question/Project (earn money)", route: "Upload" },
    // { id: "3", title: "Upload  (earn money)", route: "Upload" },
    { id: "1", title: "Grant/Scholarship Information ", route: "Grants" },
    // { id: "2", title: "Scholarship Information", route: "Scholarship" },
    {
      id: "4",
      title: "Get certificate on short courses",
      route: "CourseCertificate",
    },
    {
      id: "5",
      title: "Innovation / Angel investors news",
      route: "Innovation",
    },
    { id: "6", title: "Therapy", route: "Theraphy" },
  ];

  const navigation = useNavigation();

  const handleItemPress = (item: any) => {
    
    navigation.navigate("App", { screen: item.route });
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleItemPress(item)}>
      <Text style={styles.itemText}>{item.title}</Text>
      <Icon name="chevron-right" size={20} />
    </TouchableOpacity>
  );

  return (
    <ProtectPage>
      <View style={globalStyles.screen}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          // contentContainerStyle={styles.listContainer}
        />
      </View>
    </ProtectPage>
  );
}

const styles = StyleSheet.create({
  // listContainer: {
  //   padding: 16,
  // },
  item: {
    padding: mscale(20),
    backgroundColor: "#f2f2f2",
    borderRadius: mscale(8),
    marginBottom: mscale(12),
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontSize: mscale(16),
    fontFamily: "Inter-Medium",
  },
});
