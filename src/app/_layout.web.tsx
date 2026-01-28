import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WebAppContainer from "../components/webAppContainer";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
  
      <QueryClientProvider client={queryClient}>
        <WebAppContainer>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="(auth)"
          options={{ headerShown: false}}
          />
        </Stack>
        </WebAppContainer>
      </QueryClientProvider>
  );
}
