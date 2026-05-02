import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WebAppContainer from "../components/webAppContainer";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <WebAppContainer>
        <Stack
          screenOptions={{
            headerShown: false,
            title: "Solva Africa",
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </WebAppContainer>
    </QueryClientProvider>
  );
}
