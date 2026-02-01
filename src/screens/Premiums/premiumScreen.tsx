import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Icon from "@expo/vector-icons/Feather";
import { useRouter, Href } from "expo-router";

import { globalStyles } from "../../styles/global";
import { mscale } from "../../helpers/metric";
import ProtectPage from "@/src/components/protectPage";

type PremiumItem = {
  id: string;
  title: string;
  route: AppRoute;
};

type AppRoute =
  | "/grants"
  | "/scholarship"
  | "/upload"
  | "/courses-certificate"
  | "/innovation"
  | "/theraphy"
  | "/task";

export default function PremiumScreen() {
  const router = useRouter();

  const data: PremiumItem[] = [ 
    {
      id: "1",
      title: "Upload Past Question/Project(earn money)",
      route: "/upload",
    },
    {
      id: "2",
      title: "Scholarship/Grant Information",
      route: "/scholarship",
    },
    {
      id: "3",
      title: "Get certificate on short courses",
      route: "/courses-certificate",
    },
    {
      id: "4",
      title: "Innovation / Angel investors news",
      route: "/innovation",
    },
    { id: "5", title: "Therapy", route: "/theraphy" },
    { id: "6", title: "Task", route: "/task" },
  ];


const handleItemPress = (item: PremiumItem) => {
  router.push(item.route as Href);
};

  const renderItem = ({ item }: { item: PremiumItem }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.itemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <ProtectPage>
      <View style={globalStyles.screen}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>
    </ProtectPage>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: mscale(20),
    backgroundColor: "#F5F3FF",
    borderRadius: mscale(8),
    marginBottom: mscale(12),
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  itemText: {
    fontSize: mscale(16),
    fontFamily: "Inter-Medium",
  },
});
