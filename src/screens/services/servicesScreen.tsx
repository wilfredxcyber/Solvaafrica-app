import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { hscale, mscale, wscale } from "@/src/helpers/metric";
import { colors } from "@/src/constants/theme";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/src/stores/authStore";

export default function ServicesScreen() {
  const router = useRouter();
  const AuthUser = useAuthStore((state) => state.user);

  // ✅ SAFE: AuthUser can be null on first load / refresh (especially on web)
  const role = AuthUser?.profile?.role;

  const handleNav = () => {
    router.push("/(services)/find-service");
  };

  // ✅ Optional: prevent crashes + show something while user loads
  // If you don't want any loader, you can remove this block.
  if (!AuthUser) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <ImageBackground
        style={{ height: "100%", width: "100%" }}
        resizeMode="cover"
        source={require("@/assets/images/services/serviceBg.png")}
      >
        {/* ✅ Explore button positioned like UI */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleNav}
          activeOpacity={0.9}
        >
          <Text style={styles.ctaText}>Explore our services</Text>
        </TouchableOpacity>

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
            alignItems: "center",
            paddingTop: mscale(10),
            paddingBottom: mscale(18),
          }}
        >
          {/* cards row stays the same */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: mscale(20),
            }}
          >
            <TouchableOpacity
              onPress={() => router.push("/(services)/find-service")}
              style={styles.box}
            >
              <Image
                source={require("@/assets/images/services/search.png")}
                style={{ width: wscale(60), height: hscale(60) }}
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
                I'm looking for talented people to work with
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                router.push("/(services)/services-profile/setup-profile")
              }
              style={styles.box}
            >
              <Image
                source={require("@/assets/images/services/serviceImg.png")}
                style={{ width: wscale(60), height: hscale(60) }}
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
                  color: "#5C5C5C",
                  fontSize: mscale(15),
                  fontFamily: "Inter-Regular",
                  textAlign: "center",
                }}
              >
                I'd like to offer my services
              </Text>
            </TouchableOpacity>
          </View>

          {/* ✅ Bottom text styled like UI */}
          <Text style={styles.title}>
            Find & connect with service{"\n"}providers around you!
          </Text>
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

  // ✅ NEW: absolute position like screenshot
  ctaButton: {
    position: "absolute",
    alignSelf: "center",
    bottom: hscale(220) + mscale(35), // sits right above purple section
    width: wscale(250),
    height: hscale(52),
    borderRadius: mscale(100),
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  ctaText: {
    color: "#fff",
    fontSize: mscale(16),
    fontFamily: "Inter-SemiBold",
  },

  // ✅ NEW: smaller + matching UI
  title: {
    marginTop: mscale(14),
    fontFamily: "Inter-Bold",
    fontSize: mscale(18),
    textAlign: "center",
    color: colors.white,
    lineHeight: mscale(22),
  },
});