import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AUTH_API_CLIENT } from "@/src/api/apiClient";
import { mscale, hscale, wscale } from "@/src/helpers/metric";
import { colors } from "@/src/constants/theme";
import { useAuthStore } from "../stores/authStore";
import { socket } from "@/src/lib/socket";

export default function AskChatbotScreen() {
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const AuthUser = useAuthStore((state) => state.user);
  const { userID } = AuthUser.profile;

  useEffect(() => {
    socket.connect();
    socket.emit("join", userID);

    socket.on("chatReply", (data) => {
      if (!data?.prompt || !data?.response) return;
      setChatHistory((prev) => [
        { prompt: data.prompt, response: data.response },
        ...prev,
      ]);
    });

    fetchChat();

    return () => {
      socket.off("chatReply");
      socket.disconnect();
    };
  }, []);

  const fetchChat = async () => {
    try {
      setLoading(true);
      const response = await AUTH_API_CLIENT.get(`/chat/${userID}`);
      if (response.status === 200) {
        setChatHistory(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const tempPrompt = prompt;
    setPrompt("");
    setSending(true);

    try {
      await AUTH_API_CLIENT.post("/chat", {
        prompt: tempPrompt,
        owner: userID,
      });
    } catch (error: any) {
      console.log("Send failed:", error?.response?.data || error.message);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: any }) => (
    <View style={styles.messageBlock}>
      <View style={styles.userMessage}>
        <Text style={styles.label}>You</Text>
        <Text style={styles.messageText}>{item.prompt}</Text>
      </View>
      <View style={styles.botMessage}>
        <Text style={styles.label}>Kemi</Text>
        <Text style={styles.messageText}>{item.response}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Ask Kemi</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={chatHistory}
          renderItem={renderMessage}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            paddingBottom: hscale(100),
            paddingTop: hscale(10),
          }}
          style={styles.chatContainer}
          inverted
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your question..."
          value={prompt}
          onChangeText={setPrompt}
          editable={!sending}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={sending || !prompt.trim()}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wscale(10),
    backgroundColor: "#fff",
  },
  title: {
    fontSize: mscale(22),
    fontFamily: "Inter-Bold",
    marginTop: hscale(20),
    textAlign: "center",
    marginBottom: hscale(10),
  },
  chatContainer: {
    flex: 1,
  },
  messageBlock: {
    marginBottom: hscale(16),
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#e8f0fe",
    padding: mscale(10),
    borderRadius: mscale(10),
    marginBottom: hscale(6),
    maxWidth: "80%",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f1f1",
    padding: mscale(10),
    borderRadius: mscale(10),
    maxWidth: "80%",
  },
  label: {
    fontFamily: "Inter-Bold",
    fontSize: mscale(12),
    color: colors.primary,
    marginBottom: hscale(4),
  },
  messageText: {
    fontFamily: "Inter-Regular",
    fontSize: mscale(14),
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: mscale(10),
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: hscale(42),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: mscale(8),
    paddingHorizontal: mscale(10),
    fontFamily: "Inter-Regular",
  },
  sendButton: {
    backgroundColor: colors.primary,
    padding: mscale(10),
    borderRadius: mscale(8),
    marginLeft: wscale(8),
    justifyContent: "center",
    alignItems: "center",
  },
});
