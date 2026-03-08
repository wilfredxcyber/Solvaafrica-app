import { AUTH_API_CLIENT } from "../api/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { normalizeUserProfile } from "../helpers/freelancerProfile";

type Role = "user" | "freelancer";

export const fetchUserRole = async (): Promise<Role | null> => {
  try {
    const stored = await AsyncStorage.getItem("User");
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    const userId = parsed?.profile?.userID;
    const tokens = parsed?.tokens;

    if (!userId || !tokens) return null;

    const res = await AUTH_API_CLIENT.get(`/users/${userId}`, {
      params: { _ts: Date.now() },
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        "Cache-Control": "no-store, no-cache, max-age=0",
        Pragma: "no-cache",
      },
    });

    if (res.status === 200) {
      const profileData = res.data.data as any;
      const normalizedProfile = normalizeUserProfile(profileData, parsed.profile);
      const { role } = normalizedProfile as { role: string };

      if (role === "user" || role === "freelancer") {
        parsed.profile = normalizedProfile;
        await AsyncStorage.setItem("User", JSON.stringify(parsed));
        return role;
      }

      return null;
    }

    return null;
  } catch (error) {
    console.log("Error fetching user role", error);
    return null;
  }
};