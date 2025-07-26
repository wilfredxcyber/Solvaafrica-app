import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { hscale, mscale, wscale } from "@/src/helpers/metric";
import { colors } from "@/src/constants/theme";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "@/src/stores/authStore";
import EditProfile from "./serviceProfile/setUpProfile";

export default function ServicesScreen() {
  const navigation = useNavigation();
  const AuthUser = useAuthStore((state) => state.user);
  const { role } = AuthUser.profile;
  return (
    <View
      style={{
        flex: 1,
        position: "relative",
      }}
    >
      <ImageBackground
        style={{
          height: "100%",
          width: "100%",
        }}
        resizeMode="cover"
        source={require("@/assets/images/services/serviceBg.png")}
      >
        <View
          style={{
            backgroundColor: colors.primary,
            height: hscale(170),
            borderTopLeftRadius: mscale(16),
            borderTopRightRadius: mscale(16),
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: "row",
            // alignItems: "center",
            justifyContent: "center",
            gap: mscale(20),
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("App", { screen: "Categories" })}
            style={styles.box}
          >
            <Image
              source={require("@/assets/images/services/search.png")}
              style={{
                width: wscale(60),
                height: hscale(60),
              }}
            />
            <Text
              style={{
                fontFamily: "Inter-Bold",
                color: "black",
                fontSize: mscale(22),
              }}
            >
              Find a service
            </Text>
            <Text
              style={{
                color: "#5C5F62",
                fontSize: mscale(15),
                fontFamily: "Inter-Regular",
                textAlign: "center",
              }}
            >
              I’m looking for talented people to work with
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("App", {
                screen: role != "user" ? "ServiceSetUpProfile" : "ServiceProfile",
              })
            }
            style={styles.box}
          >
            <Image
              source={require("@/assets/images/services/serviceImg.png")}
              style={{
                width: wscale(60),
                height: hscale(60),
              }}
            />
            <Text
              style={{
                fontFamily: "Inter-Bold",
                color: "black",
                fontSize: mscale(22),
              }}
            >
              Sell a service
            </Text>
            <Text
              style={{
                color: "#5C5F62",
                fontSize: mscale(15),
                fontFamily: "Inter-Regular",
                textAlign: "center",
              }}
            >
              I’d like to offer my services
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "43%",
    height: hscale(154),
    borderWidth: 1,
    borderColor: "#E8DEF8",
    borderRadius: 8,
    backgroundColor: "white",
    marginTop: mscale(-70),
    padding: mscale(3.5),
    flexDirection: "column",
    alignItems: "center",
    gap: mscale(1.5),
  },
});
