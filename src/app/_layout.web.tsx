import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WebAppContainer from "../components/webAppContainer";
import { Head } from "expo-head";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>Solva Africa</title>
        <meta property="og:title" content="Solva Africa" />
        <meta
          property="og:description"
          content="Connect with freelancers and opportunities."
        />
        <meta property="og:url" content="https://www.solvaafrica.com" />
      </Head>

      <WebAppContainer>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </WebAppContainer>
    </QueryClientProvider>
  );
}
