import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="create-account" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="forgot-password-otp" />
      <Stack.Screen name="forgot-password-success" />
      <Stack.Screen name="terms-and-conditions" options={{ headerShown: true }} />
    </Stack>
  );
}
