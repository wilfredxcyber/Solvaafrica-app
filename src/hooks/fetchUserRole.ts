import { AUTH_API_CLIENT } from "../api/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile } from "../types";

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
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });

    if (res.status === 200) {
      const { role } = res.data.data as { role: string };

      if (role === "user" || role === "freelancer") {
        parsed.profile.role = role;
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
